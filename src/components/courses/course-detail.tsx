'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { formatPrice, formatDuration } from '@/lib/utils'
import { Clock, Users, Star, BookOpen, Play, CheckCircle, Lock, ChevronDown, ChevronRight, User, Calendar, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

interface CourseDetailProps {
  course: {
    id: string
    title: string
    slug: string
    description: string
    thumbnail: string | null
    price: number
    level: string | null
    duration: number | null
    publishedAt: Date | null
    instructor: { id: string; name: string | null; image: string | null; email: string }
    lessons: { id: string; title: string; slug: string; type: string; duration: number; order: number; isFree: boolean }[]
    categories: { name: string }[]
    _count: { lessons: number; enrollments: number }
  }
}

export function CourseDetail({ course }: CourseDetailProps) {
  const { data: session } = useSession()
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]))
  const isEnrolled = false // TODO: check enrollment

  const toggleModule = (index: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div className="container">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full">
                <BookOpen className="h-16 w-16 text-muted-foreground/50" />
              </div>
            )}
            {course.price === 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="success" className="text-lg px-3 py-1">Free</Badge>
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {course.level && (
                <Badge variant="outline" className="capitalize">{course.level.toLowerCase()}</Badge>
              )}
              <Badge variant="outline">
                {course._count.lessons} lessons
              </Badge>
              <Badge variant="outline">
                {course._count.enrollments.toLocaleString()} students
              </Badge>
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground mb-6">{course.description}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {course.instructor.name || 'Unknown Instructor'}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {course.publishedAt ? new Date(course.publishedAt).toLocaleDateString() : 'Not published'}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {course.duration ? formatDuration(course.duration) : 'Self-paced'}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {course.categories.map((cat) => (
                <Badge key={cat.name} variant="secondary">
                  <Tag className="h-3 w-3 mr-1" />
                  {cat.name}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <Button size="lg" className="gap-2 flex-1 sm:flex-none" disabled={isEnrolled}>
                {isEnrolled ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Continue Learning
                  </>
                ) : course.price === 0 ? (
                  <>
                    <BookOpen className="h-4 w-4" />
                    Enroll for Free
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Buy for {formatPrice(course.price)}
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg">
                <Star className="h-4 w-4 mr-2" />
                4.8 (120 reviews)
              </Button>
            </div>
          </div>

          <Separator />

          <Tabs defaultValue="curriculum" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="curriculum">Curriculum ({course.lessons.length})</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (120)</TabsTrigger>
            </TabsList>

            <TabsContent value="curriculum" className="mt-6">
              <div className="space-y-4">
                {course.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={cn(
                      'rounded-lg border p-4 transition-colors',
                      isEnrolled || lesson.isFree ? 'hover:bg-accent' : 'opacity-60'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
                        lesson.type === 'VIDEO' ? 'bg-red-100 text-red-600' :
                        lesson.type === 'QUIZ' ? 'bg-yellow-100 text-yellow-600' :
                        lesson.type === 'ASSIGNMENT' ? 'bg-blue-100 text-blue-600' :
                        'bg-green-100 text-green-600'
                      )}>
                        {lesson.type === 'VIDEO' && <Play className="h-5 w-5 ml-1" />}
                        {lesson.type === 'TEXT' && <BookOpen className="h-5 w-5" />}
                        {lesson.type === 'QUIZ' && <Star className="h-5 w-5" />}
                        {lesson.type === 'ASSIGNMENT' && <BookOpen className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{lesson.title}</span>
                          {lesson.isFree && <Badge variant="outline" className="text-xs">Free Preview</Badge>}
                          {!isEnrolled && !lesson.isFree && <Lock className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(lesson.duration)}
                          </span>
                        </p>
                      </div>
                      {isEnrolled || lesson.isFree ? (
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/courses/${course.slug}/lessons/${lesson.slug}`}>
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="instructor" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-6">
                    <div className="relative h-24 w-24 rounded-full bg-muted shrink-0 overflow-hidden">
                      {course.instructor.image ? (
                        <Image src={course.instructor.image} alt={course.instructor.name || 'Instructor'} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-3xl font-bold text-primary">
                          {course.instructor.name?.charAt(0) || 'I'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{course.instructor.name || 'Unknown Instructor'}</h3>
                      <p className="text-muted-foreground">Course Instructor</p>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Experienced instructor with expertise in modern web development and software engineering.
                        Passionate about teaching and helping students achieve their learning goals.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {[
                      { user: 'Alice Student', rating: 5, date: '2 weeks ago', text: 'Excellent course! Very comprehensive and well-structured.' },
                      { user: 'Bob Student', rating: 4, date: '1 month ago', text: 'Great content, but some sections could use more examples.' },
                      { user: 'Charlie Student', rating: 5, date: '2 months ago', text: 'Best course I\'ve taken on this platform. Highly recommended!' },
                    ].map((review, i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {review.user.charAt(0)}
                            </div>
                            <span className="font-medium">{review.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star key={i} className={cn('h-4 w-4', i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
                        <p className="mt-2">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl">What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Build modern, responsive websites with HTML, CSS, and JavaScript',
                  'Master React and build interactive user interfaces',
                  'Learn backend development with Node.js and databases',
                  'Deploy applications to production environments',
                  'Follow industry best practices and design patterns',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-4 sticky top-24" style={{ top: '320px' }}>
            <CardHeader>
              <CardTitle className="text-xl">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  'Basic computer skills',
                  'A computer with internet access',
                  'No prior programming experience required',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-4 sticky top-24" style={{ top: '500px' }}>
            <CardHeader>
              <CardTitle className="text-xl">This course includes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { icon: Clock, text: `${course.duration ? formatDuration(course.duration) : '20+ hours'} video content` },
                  { icon: BookOpen, text: `${course._count.lessons} lessons` },
                  { icon: Users, text: 'Certificate of completion' },
                  { icon: Star, text: 'Lifetime access' },
                  { icon: BookOpen, text: 'Mobile and TV access' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <item.icon className="h-5 w-5 text-primary shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}