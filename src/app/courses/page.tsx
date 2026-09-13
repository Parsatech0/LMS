import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { CourseCard } from '@/components/courses/course-card'
import { Header } from '@/components/layout/header'

export const metadata: Metadata = {
  title: 'Courses - LMS Platform',
  description: 'Browse our catalog of courses',
}

export const dynamic = 'force-dynamic'

async function getCourses() {
  return prisma.course.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      instructor: { select: { id: true, name: true, image: true } },
      _count: { select: { lessons: true, enrollments: true } },
      categories: true,
    },
    orderBy: { publishedAt: 'desc' },
  })
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12">
        <div className="container">
          <div className="mb-12">
            <h1 className="text-4xl font-bold">Explore Courses</h1>
            <p className="mt-2 text-muted-foreground">
              Find the perfect course to advance your skills and career
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No courses available yet.</p>
            </div>
          )}
        </div>
      </main>
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LMS Platform. All rights reserved.
        </div>
      </footer>
    </div>
  )
}