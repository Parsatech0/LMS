import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function LessonPage({ params }: { params: { slug: string; lessonSlug: string } }) {
  const lesson = await prisma.lesson.findFirst({
    where: { slug: params.lessonSlug, course: { slug: params.slug } },
    include: { course: { select: { title: true, slug: true } } },
  })
  if (!lesson) notFound()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Link href={`/courses/${lesson.course.slug}`}>
          <Button variant="ghost" size="sm" className="mb-4 gap-2">
            <ChevronLeft className="h-4 w-4" />
            {lesson.course.title}
          </Button>
        </Link>
        <h1 className="mb-6 text-3xl font-bold">{lesson.title}</h1>
        <Card>
          <CardContent className="prose max-w-none pt-6">
            <p className="whitespace-pre-wrap">{lesson.content || 'Lesson content coming soon.'}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
