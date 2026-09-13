'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canCreateCourse, canEditCourse, canDeleteCourse } from '@/lib/rbac'
import { courseSchema, lessonSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function createCourse(data: unknown) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  if (!canCreateCourse(session.user.role)) {
    throw new Error('Insufficient permissions')
  }

  const validated = courseSchema.parse(data)
  const slug = slugify(validated.title)

  const existingSlug = await prisma.course.findUnique({ where: { slug } })
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug

  const course = await prisma.course.create({
    data: {
      ...validated,
      slug: finalSlug,
      instructorId: session.user.id,
      categories: {
        create: validated.category ? [{ name: validated.category }] : [],
      },
    },
  })

  revalidatePath('/dashboard/courses')
  return course
}

export async function updateCourse(courseId: string, data: unknown) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw new Error('Course not found')

  if (!canEditCourse(session.user.role, course.instructorId, session.user.id)) {
    throw new Error('Insufficient permissions')
  }

  const validated = courseSchema.partial().parse(data)
  const updateData: any = { ...validated }

  if (validated.title && validated.title !== course.title) {
    const newSlug = slugify(validated.title)
    const existingSlug = await prisma.course.findUnique({ where: { slug: newSlug } })
    updateData.slug = existingSlug ? `${newSlug}-${Date.now()}` : newSlug
  }

  if (validated.category) {
    updateData.categories = {
      deleteMany: {},
      create: [{ name: validated.category }],
    }
  }

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: updateData,
  })

  revalidatePath('/dashboard/courses')
  revalidatePath(`/dashboard/courses/${courseId}`)
  return updated
}

export async function deleteCourse(courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw new Error('Course not found')

  if (!canDeleteCourse(session.user.role, course.instructorId, session.user.id)) {
    throw new Error('Insufficient permissions')
  }

  await prisma.course.delete({ where: { id: courseId } })

  revalidatePath('/dashboard/courses')
  return { success: true }
}

export async function publishCourse(courseId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw new Error('Course not found')

  if (!canEditCourse(session.user.role, course.instructorId, session.user.id)) {
    throw new Error('Insufficient permissions')
  }

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  })

  revalidatePath('/dashboard/courses')
  revalidatePath(`/dashboard/courses/${courseId}`)
  return updated
}

export async function createLesson(courseId: string, data: unknown) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw new Error('Course not found')

  if (!canEditCourse(session.user.role, course.instructorId, session.user.id)) {
    throw new Error('Insufficient permissions')
  }

  const validated = lessonSchema.parse(data)
  const slug = slugify(validated.title)

  const existingSlug = await prisma.lesson.findUnique({
    where: { courseId_slug: { courseId, slug } },
  })
  const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug

  const maxOrder = await prisma.lesson.aggregate({
    where: { courseId },
    _max: { order: true },
  })

  const lesson = await prisma.lesson.create({
    data: {
      ...validated,
      slug: finalSlug,
      courseId,
      order: (maxOrder._max.order ?? 0) + 1,
    },
  })

  revalidatePath(`/dashboard/courses/${courseId}`)
  return lesson
}

export async function updateLesson(lessonId: string, data: unknown) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  })
  if (!lesson) throw new Error('Lesson not found')

  if (!canEditCourse(session.user.role, lesson.course.instructorId, session.user.id)) {
    throw new Error('Insufficient permissions')
  }

  const validated = lessonSchema.partial().parse(data)
  const updateData: any = { ...validated }

  if (validated.title && validated.title !== lesson.title) {
    const newSlug = slugify(validated.title)
    const existingSlug = await prisma.lesson.findUnique({
      where: { courseId_slug: { courseId: lesson.courseId, slug: newSlug } },
    })
    updateData.slug = existingSlug ? `${newSlug}-${Date.now()}` : newSlug
  }

  const updated = await prisma.lesson.update({
    where: { id: lessonId },
    data: updateData,
  })

  revalidatePath(`/dashboard/courses/${lesson.courseId}`)
  return updated
}

export async function deleteLesson(lessonId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  })
  if (!lesson) throw new Error('Lesson not found')

  if (!canEditCourse(session.user.role, lesson.course.instructorId, session.user.id)) {
    throw new Error('Insufficient permissions')
  }

  const courseId = lesson.courseId
  await prisma.lesson.delete({ where: { id: lessonId } })

  revalidatePath(`/dashboard/courses/${courseId}`)
  return { success: true }
}

export async function reorderLessons(courseId: string, lessonIds: string[]) {
  const session = await getServerSession(authOptions)
  if (!session?.user) throw new Error('Unauthorized')

  const course = await prisma.course.findUnique({ where: { id: courseId } })
  if (!course) throw new Error('Course not found')

  if (!canEditCourse(session.user.role, course.instructorId, session.user.id)) {
    throw new Error('Insufficient permissions')
  }

  await prisma.$transaction(
    lessonIds.map((id, index) =>
      prisma.lesson.update({
        where: { id },
        data: { order: index + 1 },
      })
    )
  )

  revalidatePath(`/dashboard/courses/${courseId}`)
  return { success: true }
}