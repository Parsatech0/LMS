import type { UserRole, CourseStatus, EnrollmentStatus, LessonType } from '@prisma/client'

export type { UserRole, CourseStatus, EnrollmentStatus, LessonType }

export interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: UserRole
}

export interface CourseWithCounts {
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

export interface DashboardStats {
  totalCourses: number
  totalStudents: number
  totalEnrollments: number
  completionRate: number
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}
