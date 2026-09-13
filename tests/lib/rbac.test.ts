import { hasRole, canManageUsers, canManageCourses, canCreateCourse, canEditCourse, canDeleteCourse, hasPermission, PERMISSIONS } from '@/lib/rbac'
import { UserRole } from '@prisma/client'

describe('RBAC utilities', () => {
  const roles: UserRole[] = ['OWNER', 'ADMIN', 'INSTRUCTOR', 'STUDENT']

  describe('hasRole', () => {
    it('returns true when user role meets required role', () => {
      expect(hasRole('OWNER', 'ADMIN')).toBe(true)
      expect(hasRole('ADMIN', 'INSTRUCTOR')).toBe(true)
      expect(hasRole('INSTRUCTOR', 'STUDENT')).toBe(true)
      expect(hasRole('STUDENT', 'STUDENT')).toBe(true)
    })

    it('returns false when user role is lower than required', () => {
      expect(hasRole('STUDENT', 'INSTRUCTOR')).toBe(false)
      expect(hasRole('INSTRUCTOR', 'ADMIN')).toBe(false)
      expect(hasRole('ADMIN', 'OWNER')).toBe(false)
    })
  })

  describe('canManageUsers', () => {
    it('returns true for OWNER and ADMIN', () => {
      expect(canManageUsers('OWNER')).toBe(true)
      expect(canManageUsers('ADMIN')).toBe(true)
    })

    it('returns false for INSTRUCTOR and STUDENT', () => {
      expect(canManageUsers('INSTRUCTOR')).toBe(false)
      expect(canManageUsers('STUDENT')).toBe(false)
    })
  })

  describe('canManageCourses', () => {
    it('returns true for OWNER, ADMIN, INSTRUCTOR', () => {
      expect(canManageCourses('OWNER')).toBe(true)
      expect(canManageCourses('ADMIN')).toBe(true)
      expect(canManageCourses('INSTRUCTOR')).toBe(true)
    })

    it('returns false for STUDENT', () => {
      expect(canManageCourses('STUDENT')).toBe(false)
    })
  })

  describe('canCreateCourse', () => {
    it('returns true for OWNER, ADMIN, INSTRUCTOR', () => {
      expect(canCreateCourse('OWNER')).toBe(true)
      expect(canCreateCourse('ADMIN')).toBe(true)
      expect(canCreateCourse('INSTRUCTOR')).toBe(true)
    })

    it('returns false for STUDENT', () => {
      expect(canCreateCourse('STUDENT')).toBe(false)
    })
  })

  describe('canEditCourse', () => {
    it('returns true for ADMIN regardless of ownership', () => {
      expect(canEditCourse('ADMIN', 'other-user', 'current-user')).toBe(true)
    })

    it('returns true for INSTRUCTOR when they own the course', () => {
      expect(canEditCourse('INSTRUCTOR', 'current-user', 'current-user')).toBe(true)
    })

    it('returns false for INSTRUCTOR when they do not own the course', () => {
      expect(canEditCourse('INSTRUCTOR', 'other-user', 'current-user')).toBe(false)
    })

    it('returns false for STUDENT', () => {
      expect(canEditCourse('STUDENT', 'current-user', 'current-user')).toBe(false)
    })
  })

  describe('canDeleteCourse', () => {
    it('returns true for OWNER and ADMIN', () => {
      expect(canDeleteCourse('OWNER', 'other-user', 'current-user')).toBe(true)
      expect(canDeleteCourse('ADMIN', 'other-user', 'current-user')).toBe(true)
    })

    it('returns true for INSTRUCTOR when they own the course', () => {
      expect(canDeleteCourse('INSTRUCTOR', 'current-user', 'current-user')).toBe(true)
    })

    it('returns false for INSTRUCTOR when they do not own the course', () => {
      expect(canDeleteCourse('INSTRUCTOR', 'other-user', 'current-user')).toBe(false)
    })

    it('returns false for STUDENT', () => {
      expect(canDeleteCourse('STUDENT', 'current-user', 'current-user')).toBe(false)
    })
  })

  describe('hasPermission', () => {
    it('checks USER permissions', () => {
      expect(hasPermission('OWNER' as UserRole, 'USER', 'CREATE')).toBe(true)
      expect(hasPermission('ADMIN' as UserRole, 'USER', 'CREATE')).toBe(true)
      expect(hasPermission('INSTRUCTOR' as UserRole, 'USER', 'CREATE')).toBe(false)
      expect(hasPermission('STUDENT' as UserRole, 'USER', 'CREATE')).toBe(false)
    })

    it('checks COURSE permissions', () => {
      expect(hasPermission('OWNER' as UserRole, 'COURSE', 'DELETE')).toBe(true)
      expect(hasPermission('ADMIN' as UserRole, 'COURSE', 'DELETE')).toBe(true)
      expect(hasPermission('INSTRUCTOR' as UserRole, 'COURSE', 'DELETE')).toBe(false)
      expect(hasPermission('STUDENT' as UserRole, 'COURSE', 'DELETE')).toBe(false)
    })

    it('checks ANALYTICS permissions', () => {
      expect(hasPermission('OWNER' as UserRole, 'ANALYTICS', 'VIEW')).toBe(true)
      expect(hasPermission('ADMIN' as UserRole, 'ANALYTICS', 'VIEW')).toBe(true)
      expect(hasPermission('INSTRUCTOR' as UserRole, 'ANALYTICS', 'VIEW')).toBe(true)
      expect(hasPermission('STUDENT' as UserRole, 'ANALYTICS', 'VIEW')).toBe(false)
    })
  })
})