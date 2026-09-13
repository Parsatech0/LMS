import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Award, TrendingUp, Play, ArrowRight } from 'lucide-react'
import { Header } from '@/components/layout/header'

const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive Courses',
    description: 'Access a wide range of courses from beginner to advanced levels across multiple disciplines.',
  },
  {
    icon: Users,
    title: 'Expert Instructors',
    description: 'Learn from industry professionals with real-world experience and proven track records.',
  },
  {
    icon: Award,
    title: 'Certificates',
    description: 'Earn verified certificates upon course completion to showcase your skills.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and progress reports.',
  },
]

const stats = [
  { value: '500+', label: 'Courses' },
  { value: '50k+', label: 'Students' },
  { value: '100+', label: 'Instructors' },
  { value: '98%', label: 'Satisfaction' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Learn <span className="text-primary">Without Limits</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Master new skills with expert-led courses. Join thousands of learners advancing their careers.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/courses">
                  <Button size="lg" className="gap-2">
                    Browse Courses
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline">
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold">Why Choose Our Platform</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Everything you need to succeed in your learning journey
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="h-full">
                  <CardHeader>
                    <feature.icon className="h-10 w-10 text-primary" aria-hidden="true" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
            <p className="mt-4 text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of students already learning on our platform. Free to get started.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="bg-transparent">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="font-bold">LMS Platform</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Empowering learners worldwide with quality education.
              </p>
            </div>
            <nav>
              <h4 className="font-semibold">Platform</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/courses" className="hover:text-foreground">Courses</Link></li>
                <li><Link href="/instructors" className="hover:text-foreground">Instructors</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </nav>
            <nav>
              <h4 className="font-semibold">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </nav>
            <nav>
              <h4 className="font-semibold">Legal</h4>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground">Cookies</Link></li>
              </ul>
            </nav>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} LMS Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}