import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const [courses, enrollments, users] = await Promise.all([
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.user.count(),
  ])

  const stats = [
    { name: 'Total courses', value: courses },
    { name: 'Total enrollments', value: enrollments },
    { name: 'Total users', value: users },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.name}>
            <CardHeader><CardTitle className="text-sm font-medium">{s.name}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
