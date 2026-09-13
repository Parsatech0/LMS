import { cn, formatPrice, formatDuration, slugify, truncate, getInitials, calculateProgress } from '@/lib/utils'

describe('Utility functions', () => {
  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('handles conditional classes', () => {
      expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar')
    })
  })

  describe('formatPrice', () => {
    it('formats price correctly', () => {
      expect(formatPrice(99.99)).toBe('$99.99')
      expect(formatPrice(0)).toBe('$0.00')
      expect(formatPrice(100)).toBe('$100.00')
    })
  })

  describe('formatDuration', () => {
    it('formats minutes to hours and minutes', () => {
      expect(formatDuration(0)).toBe('0m')
      expect(formatDuration(45)).toBe('45m')
      expect(formatDuration(60)).toBe('1h 0m')
      expect(formatDuration(90)).toBe('1h 30m')
      expect(formatDuration(120)).toBe('2h 0m')
    })
  })

  describe('slugify', () => {
    it('creates valid slugs', () => {
      expect(slugify('Hello World')).toBe('hello-world')
      expect(slugify('Test_Case!')).toBe('test-case')
      expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    })
  })

  describe('truncate', () => {
    it('truncates long strings', () => {
      expect(truncate('Hello World', 8)).toBe('Hello Wo...')
      expect(truncate('Short', 10)).toBe('Short')
    })
  })

  describe('getInitials', () => {
    it('gets initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Alice')).toBe('A')
      expect(getInitials('A B C D')).toBe('AB')
    })
  })

  describe('calculateProgress', () => {
    it('calculates progress percentage', () => {
      expect(calculateProgress(0, 10)).toBe(0)
      expect(calculateProgress(5, 10)).toBe(50)
      expect(calculateProgress(10, 10)).toBe(100)
      expect(calculateProgress(3, 7)).toBe(43)
    })
  })
})