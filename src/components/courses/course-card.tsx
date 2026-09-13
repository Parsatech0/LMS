'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDuration } from '@/lib/utils'
import { Clock, Users, Star, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: {
    id: string
    title: string
    slug: string
    description: string
    thumbnail: string | null
    price: number
    level: string | null
    duration: number | null
    instructor: { id: string; name: string | null; image: string | null }
    _count: { lessons: number; enrollments: number }
    categories: { name: string }[]
  }
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`} className="block">
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {course.thumbnail ? (
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <BookOpen className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-1">
            {course.level && <Badge variant="outline" className="capitalize">{course.level.toLowerCase()}</Badge>}
            {course.price === 0 && <Badge variant="success">Free</Badge>}
          </div>
        </div>

        <CardContent className="flex-1 flex flex-col p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {course._count.enrollments.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.duration ? formatDuration(course.duration) : 'Self-paced'}
            </span>
          </div>

          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{course.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-3">{course.description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <img
              src={course.instructor.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name || 'Instructor')}`}
              alt={course.instructor.name || 'Instructor'}
              className="h-5 w-5 rounded-full"
            />
            <span className="truncate">{course.instructor.name || 'Unknown Instructor'}</span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t p-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatPrice(course.price)}</span>
            {course.price > 0 && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(course.price * 1.5)}</span>
            )}
          </div>
          <Button variant="outline" size="sm" className="mt-0">
            View Course
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}