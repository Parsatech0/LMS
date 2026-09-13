import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const courseId = request.nextUrl.searchParams.get('courseId')
    if (!courseId) return NextResponse.json({ error: 'courseId is required' }, { status: 400 })
    const lessons = await prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(lessons)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}
