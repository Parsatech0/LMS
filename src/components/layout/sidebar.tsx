'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  Crown,
  GraduationCap,
  BarChart2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { hasRole } from '@/lib/rbac'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen, roles: ['INSTRUCTOR', 'ADMIN', 'OWNER'] },
  { name: 'My Learning', href: '/dashboard/learning', icon: GraduationCap, roles: ['STUDENT', 'INSTRUCTOR', 'ADMIN', 'OWNER'] },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart2, roles: ['INSTRUCTOR', 'ADMIN', 'OWNER'] },
  { name: 'Students', href: '/dashboard/students', icon: Users, roles: ['ADMIN', 'OWNER'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['ADMIN', 'OWNER'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const filteredNav = navigation.filter((item) => {
    if (!item.roles) return true
    return session?.user && hasRole(session.user.role, item.roles[0] as any)
  })

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-background">
      <div className="flex h-16 items-center px-6 border-b">
        <span className="text-xl font-bold">Dashboard</span>
      </div>
      <nav className="flex-1 space-y-1 p-4" aria-label="Dashboard navigation">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4">
        <p className="text-xs text-muted-foreground">
          Need help?{' '}
          <a href="/help" className="text-primary hover:underline">
            Visit our help center
          </a>
        </p>
      </div>
    </aside>
  )
}