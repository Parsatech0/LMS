import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function LearningPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: { course: true },
    orderBy: { enrolledAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Learning</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {enrollments.map((e) => (
          <Card key={e.id}>
            <CardHeader><CardTitle className="truncate">{e.course.title}</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Progress value={e.progress} />
              <p className="text-sm text-muted-foreground">{Math.round(e.progress)}% complete — {e.status}</p>
              <Link href={`/courses/${e.course.slug}`} className="text-sm text-primary hover:underline">Continue</Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {enrollments.length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground">You are not enrolled in any course yet.</CardContent></Card>
      )}
    </div>
  )
}
