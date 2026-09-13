import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function StudentsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user || !['OWNER', 'ADMIN'].includes(session.user.role)) {
    return <p className="text-muted-foreground">Insufficient permissions.</p>
  }
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { _count: { select: { enrollments: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Students ({students.length})</h1>
      <Card>
        <CardHeader><CardTitle>All students</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {students.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">{s.name || 'Unnamed'}</p>
                <p className="text-sm text-muted-foreground">{s.email}</p>
              </div>
              <Badge variant="outline">{s._count.enrollments} enrollments</Badge>
            </div>
          ))}
          {students.length === 0 && <p className="text-muted-foreground">No students yet.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
