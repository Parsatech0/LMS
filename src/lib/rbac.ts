import { UserRole } from '@prisma/client'

export const roleHierarchy: Record<UserRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  INSTRUCTOR: 2,
  STUDENT: 1,
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function canManageUsers(userRole: UserRole): boolean {
  return hasRole(userRole, 'ADMIN')
}

export function canManageCourses(userRole: UserRole): boolean {
  return hasRole(userRole, 'INSTRUCTOR')
}

export function canViewAnalytics(userRole: UserRole): boolean {
  return hasRole(userRole, 'INSTRUCTOR')
}

export function canCreateCourse(userRole: UserRole): boolean {
  return hasRole(userRole, 'INSTRUCTOR')
}

export function canEditCourse(userRole: UserRole, courseInstructorId: string, userId: string): boolean {
  if (hasRole(userRole, 'ADMIN')) return true
  if (userRole === 'INSTRUCTOR' && courseInstructorId === userId) return true
  return false
}

export function canDeleteCourse(userRole: UserRole, courseInstructorId: string, userId: string): boolean {
  if (hasRole(userRole, 'ADMIN')) return true
  if (userRole === 'OWNER') return true
  if (userRole === 'INSTRUCTOR' && courseInstructorId === userId) return true
  return false
}

export function canEnrollInCourse(userRole: UserRole): boolean {
  return hasRole(userRole, 'STUDENT')
}

export function canAccessLesson(userRole: UserRole, isEnrolled: boolean, isFree: boolean): boolean {
  if (hasRole(userRole, 'ADMIN')) return true
  if (userRole === 'INSTRUCTOR') return true
  if (isFree) return true
  return isEnrolled
}

export const PERMISSIONS = {
  USER: {
    CREATE: ['OWNER', 'ADMIN'] as UserRole[],
    READ: ['OWNER', 'ADMIN', 'INSTRUCTOR'] as UserRole[],
    UPDATE: ['OWNER', 'ADMIN'] as UserRole[],
    DELETE: ['OWNER', 'ADMIN'] as UserRole[],
  },
  COURSE: {
    CREATE: ['OWNER', 'ADMIN', 'INSTRUCTOR'] as UserRole[],
    READ: ['OWNER', 'ADMIN', 'INSTRUCTOR', 'STUDENT'] as UserRole[],
    UPDATE: ['OWNER', 'ADMIN', 'INSTRUCTOR'] as UserRole[],
    DELETE: ['OWNER', 'ADMIN'] as UserRole[],
    PUBLISH: ['OWNER', 'ADMIN', 'INSTRUCTOR'] as UserRole[],
  },
  LESSON: {
    CREATE: ['OWNER', 'ADMIN', 'INSTRUCTOR'] as UserRole[],
    READ: ['OWNER', 'ADMIN', 'INSTRUCTOR', 'STUDENT'] as UserRole[],
    UPDATE: ['OWNER', 'ADMIN', 'INSTRUCTOR'] as UserRole[],
    DELETE: ['OWNER', 'ADMIN', 'INSTRUCTOR'] as UserRole[],
  },
  ENROLLMENT: {
    CREATE: ['OWNER', 'ADMIN', 'STUDENT'] as UserRole[],
    READ: ['OWNER', 'ADMIN', 'INSTRUCTOR', 'STUDENT'] as UserRole[],
    UPDATE: ['OWNER', 'ADMIN', 'INSTRUCTOR'] as UserRole[],
    DELETE: ['OWNER', 'ADMIN'] as UserRole[],
  },
  ANALYTICS: {
    VIEW: ['OWNER', 'ADMIN', 'INSTRUCTOR'] as UserRole[],
  },
} as const

export function hasPermission(
  userRole: UserRole,
  resource: keyof typeof PERMISSIONS,
  action: keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]
): boolean {
  const allowedRoles = PERMISSIONS[resource]?.[action] as UserRole[] | undefined
  return allowedRoles?.includes(userRole) ?? false
}