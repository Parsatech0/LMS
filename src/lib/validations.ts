import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  price: z.number().min(0, 'Price cannot be negative'),
  thumbnail: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const lessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'TEXT', 'QUIZ', 'ASSIGNMENT']),
  content: z.string().optional(),
  videoUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  duration: z.number().min(0).default(0),
  order: z.number().min(0).default(0),
  isFree: z.boolean().default(false),
})

export const quizSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  passingScore: z.number().min(0).max(100).default(70),
  timeLimit: z.number().min(1).optional(),
  questions: z.array(z.object({
    question: z.string().min(1, 'Question is required'),
    type: z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER']),
    options: z.array(z.string()).default([]),
    correctAnswer: z.string().min(1, 'Correct answer is required'),
    explanation: z.string().optional(),
    points: z.number().min(1).default(1),
    order: z.number().min(0).default(0),
  })).min(1, 'At least one question is required'),
})

export const enrollmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CourseInput = z.infer<typeof courseSchema>
export type LessonInput = z.infer<typeof lessonSchema>
export type QuizInput = z.infer<typeof quizSchema>
export type EnrollmentInput = z.infer<typeof enrollmentSchema>