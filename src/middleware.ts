import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (path.startsWith('/dashboard/students') || path.startsWith('/dashboard/settings')) {
      if (!['OWNER', 'ADMIN'].includes(token?.role as string)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    if (path.startsWith('/dashboard/courses/new') || path.startsWith('/dashboard/courses/')) {
      if (!['OWNER', 'ADMIN', 'INSTRUCTOR'].includes(token?.role as string)) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/courses/:path*',
    '/api/lessons/:path*',
    '/api/enrollments/:path*',
  ],
}