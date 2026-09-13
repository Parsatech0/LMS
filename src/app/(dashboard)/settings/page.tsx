import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Platform</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Configure environment variables in your hosting provider (see README):</p>
          <ul className="list-disc pl-5">
            <li><code>DATABASE_URL</code> — PostgreSQL connection string</li>
            <li><code>NEXTAUTH_URL</code> — public app URL</li>
            <li><code>NEXTAUTH_SECRET</code> — random 32+ character secret</li>
          </ul>
          <p>Run database migrations with <code>npx prisma migrate deploy</code> and seed with <code>npm run db:seed</code>.</p>
        </CardContent>
      </Card>
    </div>
  )
}
