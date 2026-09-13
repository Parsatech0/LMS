'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { BookOpen, Users, TrendingUp, Clock, ArrowRight, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hasRole } from '@/lib/rbac'

const statCards = [
  { name: 'Total Courses', value: '12', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Students', value: '1,234', icon: Users, color: 'text-green-500', bg: 'bg-green-500/10' },
  { name: 'Revenue', value: '$12,450', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { name: 'Completion Rate', value: '87%', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-500/10' },
]

export default function DashboardPage() {
  const { data: session } = useSession()
  const isInstructor = hasRole(session?.user?.role || 'STUDENT', 'INSTRUCTOR')
  const isAdmin = hasRole(session?.user?.role || 'STUDENT', 'ADMIN')

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || 'User'}! Here&apos;s what&apos;s happening.
          </p>
        </div>
        {isInstructor && (
          <Link href="/dashboard/courses/new">
            <Button className="gap-2">
              <BookOpen className="h-4 w-4" />
              Create Course
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className={cn('h-4 w-4', stat.color)} aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isInstructor && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { title: 'Complete Web Development Bootcamp', students: 1245, rating: 4.8, status: 'PUBLISHED', progress: 85 },
                  { title: 'Advanced TypeScript Patterns', students: 567, rating: 4.9, status: 'PUBLISHED', progress: 92 },
                  { title: 'Draft Course Example', students: 0, rating: 0, status: 'DRAFT', progress: 10 },
                ].map((course) => (
                  <Link
                    key={course.title}
                    href={`/dashboard/courses/${course.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{course.title}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.students}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {course.rating}
                        </span>
                        <Badge variant={course.status === 'PUBLISHED' ? 'success' : 'outline'}>
                          {course.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="w-32">
                      <Progress value={course.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1 text-right">{course.progress}% complete</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center pt-4">
                <Link href="/dashboard/courses">
                  <Button variant="outline" className="w-full sm:w-auto">
                    View All Courses
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { action: 'New enrollment', course: 'Complete Web Development Bootcamp', user: 'Alice Student', time: '2 hours ago' },
                { action: 'Lesson completed', course: 'Advanced TypeScript Patterns', user: 'Bob Student', time: '5 hours ago' },
                { action: 'New review', course: 'Complete Web Development Bootcamp', user: 'Charlie Student', time: '1 day ago', rating: 5 },
                { action: 'Course published', course: 'Machine Learning Fundamentals', time: '2 days ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.course} {activity.user ? `by ${activity.user}` : ''}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {!isInstructor && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Complete Web Development Bootcamp', progress: 40, lessons: '8 of 20', nextLesson: 'CSS Basics' },
                { title: 'Advanced TypeScript Patterns', progress: 20, lessons: '2 of 10', nextLesson: 'Generics and Constraints' },
              ].map((course) => (
                <Link
                  key={course.title}
                  href={`/courses/${course.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{course.title}</p>
                    <p className="text-sm text-muted-foreground">{course.lessons} completed</p>
                    <Progress value={course.progress} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">Next: {course.nextLesson}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Machine Learning Fundamentals', instructor: 'John Instructor', price: '$129.99', rating: 4.7 },
                { title: 'React Advanced Patterns', instructor: 'Jane Developer', price: '$89.99', rating: 4.8 },
              ].map((course) => (
                <Link
                  key={course.title}
                  href={`/courses/${course.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-medium">{course.price}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Trophy className="h-3 w-3" />
                        {course.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}