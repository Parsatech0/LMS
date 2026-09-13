import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { CourseDetail } from '@/components/courses/course-detail'
import { Header } from '@/components/layout/header'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

async function getCourse(slug: string) {
  return prisma.course.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      instructor: { select: { id: true, name: true, image: true, email: true } },
      lessons: {
        where: { type: { not: 'QUIZ' } }, // quizzes handled separately
        orderBy: { order: 'asc' },
      },
      categories: true,
      _count: { select: { lessons: true, enrollments: true } },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) return { title: 'Course Not Found' }
  return {
    title: `${course.title} - LMS Platform`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: course.thumbnail ? [course.thumbnail] : [],
    },
  }
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const course = await getCourse(slug)

  if (!course) notFound()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <CourseDetail course={course} />
      </main>
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LMS Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}