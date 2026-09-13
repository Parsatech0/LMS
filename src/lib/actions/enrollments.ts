'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canEnrollInCourse } from '@/lib/rbac'
import { enrollmentSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function enrollInCourse(data: unknown) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  if (!canEnrollInCourse(session.user.role)) {
    throw new Error('Insufficient permissions')
  }

  const validated = enrollmentSchema.parse(data)

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: validated.courseId,
      },
    },
  })

  if (existing) {
    throw new Error('Already enrolled in this course')
  }

  const course = await prisma.course.findUnique({
    where: { id: validated.courseId },
  })

  if (!course) throw new Error('Course not found')
  if (course.status !== 'PUBLISHED') throw new Error('Course is not published')

  const enrollment = await prisma.enrollment.create({
    data: {
      userId: session.user.id,
      courseId: validated.courseId,
      status: 'ACTIVE',
    },
  })

  revalidatePath('/dashboard/courses')
  revalidatePath(`/courses/${course.slug}`)
  return enrollment
}

export async function dropCourse(courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId,
      },
    },
  })

  if (!enrollment) throw new Error('Not enrolled in this course')

  await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: { status: 'DROPPED' },
  })

  revalidatePath('/dashboard/courses')
  revalidatePath(`/courses/${courseId}`)
  return { success: true }
}

export async function updateEnrollmentProgress(enrollmentId: string, progress: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: { course: true },
  })

  if (!enrollment) throw new Error('Enrollment not found')

  if (enrollment.userId !== session.user.id && !['OWNER', 'ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
    throw new Error('Unauthorized')
  }

  const updated = await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: {
      progress: Math.min(100, Math.max(0, progress)),
      completedAt: progress >= 100 ? new Date() : null,
      status: progress >= 100 ? 'COMPLETED' : 'ACTIVE',
    },
  })

  revalidatePath('/dashboard/courses')
  return updated
}

export async function getUserEnrollments(userId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  if (session.user.id !== userId && !['OWNER', 'ADMIN'].includes(session.user.role)) {
    throw new Error('Unauthorized')
  }

  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: { select: { id: true, name: true, image: true } },
          _count: { select: { lessons: true } },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  })
}

export async function getCourseEnrollments(courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw new Error('Course not found')

  if (!['OWNER', 'ADMIN', 'INSTRUCTOR'].includes(session.user.role) && course.instructorId !== session.user.id) {
    throw new Error('Unauthorized')
  }

  return prisma.enrollment.findMany({
    where: { courseId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { enrolledAt: 'desc' },
  })
}