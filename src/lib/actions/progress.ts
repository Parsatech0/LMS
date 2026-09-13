'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function markLessonComplete(lessonId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  })

  if (!lesson) throw new Error('Lesson not found')

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: lesson.courseId,
      },
    },
  })

  if (!enrollment || enrollment.status !== 'ACTIVE') {
    throw new Error('Not enrolled in this course')
  }

  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    update: { completed: true, watchedAt: new Date() },
    create: {
      userId: session.user.id,
      lessonId,
      completed: true,
      watchedAt: new Date(),
    },
  })

  const completedLessons = await prisma.lessonProgress.count({
    where: { userId: session.user.id, completed: true, lesson: { courseId: lesson.courseId } },
  })

  const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } })
  const progressPercent = Math.round((completedLessons / totalLessons) * 100)

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: {
      progress: progressPercent,
      status: progressPercent >= 100 ? 'COMPLETED' : 'ACTIVE',
      completedAt: progressPercent >= 100 ? new Date() : null,
    },
  })

  revalidatePath(`/courses/${lesson.course.slug}`)
  revalidatePath('/dashboard/courses')
  return progress
}

export async function markLessonIncomplete(lessonId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  })

  if (!lesson) throw new Error('Lesson not found')

  await prisma.lessonProgress.update({
    where: {
      userId_lessonId: {
        userId: session.user.id,
        lessonId,
      },
    },
    data: { completed: false, watchedAt: null },
  })

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: lesson.courseId,
      },
    },
  })

  if (enrollment) {
    const completedLessons = await prisma.lessonProgress.count({
      where: { userId: session.user.id, completed: true, lesson: { courseId: lesson.courseId } },
    })
    const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } })
    const progressPercent = Math.round((completedLessons / totalLessons) * 100)

    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress: progressPercent, status: 'ACTIVE', completedAt: null },
    })
  }

  revalidatePath(`/courses/${lesson.course.slug}`)
  revalidatePath('/dashboard/courses')
  return { success: true }
}

export async function getLessonProgress(courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId: session.user.id,
      lesson: { courseId },
    },
    select: { lessonId: true, completed: true },
  })

  return progress.reduce((acc, p) => {
    acc[p.lessonId] = p.completed
    return acc
  }, {} as Record<string, boolean>)
}

export async function getCourseProgress(courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  })

  return enrollment
}