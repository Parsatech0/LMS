import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { courseSchema } from '@/lib/validations'
import { canCreateCourse } from '@/lib/rbac'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        instructor: { select: { id: true, name: true, image: true } },
        _count: { select: { lessons: true, enrollments: true } },
        categories: true,
      },
      orderBy: { publishedAt: 'desc' },
    })
    return NextResponse.json(courses)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!canCreateCourse(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const validated = courseSchema.parse(body)

    const course = await prisma.course.create({
      data: {
        ...validated,
        instructorId: session.user.id,
        slug: validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        categories: {
          create: validated.category ? [{ name: validated.category }] : [],
        },
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}