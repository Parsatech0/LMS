import { loginSchema, registerSchema, courseSchema, lessonSchema } from '@/lib/validations'

describe('Validation schemas', () => {
  describe('loginSchema', () => {
    it('validates correct input', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('validates correct input', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('rejects short name', () => {
      const result = registerSchema.safeParse({
        name: 'J',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
      expect(result.success).toBe(false)
    })

    it('rejects mismatched passwords', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'different',
      })
      expect(result.success).toBe(false)
    })

    it('rejects short password', () => {
      const result = registerSchema.safeParse({
        name: 'John Doe',
        email: 'test@example.com',
        password: 'short',
        confirmPassword: 'short',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('courseSchema', () => {
    it('validates correct input', () => {
      const result = courseSchema.safeParse({
        title: 'Test Course',
        description: 'This is a test course description',
        category: 'Web Development',
        level: 'BEGINNER',
        price: 99.99,
      })
      expect(result.success).toBe(true)
    })

    it('rejects short title', () => {
      const result = courseSchema.safeParse({
        title: 'AB',
        description: 'This is a test course description',
        category: 'Web Development',
        level: 'BEGINNER',
        price: 99.99,
      })
      expect(result.success).toBe(false)
    })

    it('rejects negative price', () => {
      const result = courseSchema.safeParse({
        title: 'Test Course',
        description: 'This is a test course description',
        category: 'Web Development',
        level: 'BEGINNER',
        price: -10,
      })
      expect(result.success).toBe(false)
    })
  })

  describe('lessonSchema', () => {
    it('validates correct input', () => {
      const result = lessonSchema.safeParse({
        title: 'Test Lesson',
        type: 'VIDEO',
        duration: 30,
        order: 1,
      })
      expect(result.success).toBe(true)
    })

    it('rejects invalid type', () => {
      const result = lessonSchema.safeParse({
        title: 'Test Lesson',
        type: 'INVALID',
        duration: 30,
        order: 1,
      })
      expect(result.success).toBe(false)
    })
  })
})