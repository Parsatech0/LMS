import { PrismaClient, UserRole, CourseStatus, LessonType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Note: CourseCategory requires a course relation, so we don't create global categories
  // Categories are created per-course in the course creation
  console.log('✅ Categories will be created with courses')

  // Create owner user
  const ownerPassword = await bcrypt.hash('owner123', 12)
  const owner = await prisma.user.upsert({
    where: { email: 'owner@lms.local' },
    update: {},
    create: {
      email: 'owner@lms.local',
      name: 'Platform Owner',
      password: ownerPassword,
      role: UserRole.OWNER,
      emailVerified: new Date(),
      phone: '+989123456789',
    },
  })
  console.log('✅ Owner user created:', owner.email)

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.local' },
    update: {},
    create: {
      email: 'admin@lms.local',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      phone: '+989123456788',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create instructor user
  const instructorPassword = await bcrypt.hash('instructor123', 12)
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@lms.local' },
    update: {},
    create: {
      email: 'instructor@lms.local',
      name: 'John Instructor',
      password: instructorPassword,
      role: UserRole.INSTRUCTOR,
      emailVerified: new Date(),
      phone: '+989123456787',
    },
  })
  console.log('✅ Instructor user created:', instructor.email)

  // Create student users
  const studentPassword = await bcrypt.hash('student123', 12)
  const students = await Promise.all([
    prisma.user.upsert({
      where: { email: 'student1@lms.local' },
      update: {},
      create: {
        email: 'student1@lms.local',
        name: 'Alice Student',
        password: studentPassword,
        role: UserRole.STUDENT,
        emailVerified: new Date(),
        phone: '+989123456786',
      },
    }),
    prisma.user.upsert({
      where: { email: 'student2@lms.local' },
      update: {},
      create: {
        email: 'student2@lms.local',
        name: 'Bob Student',
        password: studentPassword,
        role: UserRole.STUDENT,
        emailVerified: new Date(),
        phone: '+989123456785',
      },
    }),
  ])
  console.log('✅ Student users created')

  // Create sample courses
  const course1 = await prisma.course.upsert({
    where: { slug: 'complete-web-development-bootcamp' },
    update: {},
    create: {
      title: 'Complete Web Development Bootcamp',
      slug: 'complete-web-development-bootcamp',
      description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects and become a full-stack developer.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      status: CourseStatus.PUBLISHED,
      price: 99.99,
      instructorId: instructor.id,
      category: 'Web Development',
      level: 'BEGINNER',
      duration: 1200,
      publishedAt: new Date(),
      categories: {
        create: [{ name: 'Web Development' }, { name: 'Full Stack' }],
      },
      lessons: {
        create: [
          {
            title: 'Introduction to Web Development',
            slug: 'introduction-to-web-development',
            description: 'Overview of web development concepts and tools',
            type: LessonType.VIDEO,
            content: 'Welcome to the course! In this lesson, we will cover the basics of web development...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 15,
            order: 1,
            isFree: true,
          },
          {
            title: 'HTML Fundamentals',
            slug: 'html-fundamentals',
            description: 'Learn the building blocks of web pages',
            type: LessonType.VIDEO,
            content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 45,
            order: 2,
            isFree: true,
          },
          {
            title: 'CSS Basics',
            slug: 'css-basics',
            description: 'Style your web pages with CSS',
            type: LessonType.VIDEO,
            content: 'CSS (Cascading Style Sheets) is used to style and layout web pages...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 60,
            order: 3,
          },
          {
            title: 'JavaScript Essentials',
            slug: 'javascript-essentials',
            description: 'Add interactivity to your web pages',
            type: LessonType.VIDEO,
            content: 'JavaScript is the programming language of the web...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 90,
            order: 4,
          },
          {
            title: 'React Introduction',
            slug: 'react-introduction',
            description: 'Build modern UIs with React',
            type: LessonType.VIDEO,
            content: 'React is a JavaScript library for building user interfaces...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 120,
            order: 5,
          },
        ],
      },
    },
    include: { lessons: true },
  })
  console.log('✅ Course 1 created:', course1.title)

  const course2 = await prisma.course.upsert({
    where: { slug: 'advanced-typescript-patterns' },
    update: {},
    create: {
      title: 'Advanced TypeScript Patterns',
      slug: 'advanced-typescript-patterns',
      description: 'Master advanced TypeScript concepts including generics, conditional types, template literals, and more.',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
      status: CourseStatus.PUBLISHED,
      price: 79.99,
      instructorId: instructor.id,
      category: 'Web Development',
      level: 'ADVANCED',
      duration: 600,
      publishedAt: new Date(),
      categories: {
        create: [{ name: 'TypeScript' }, { name: 'Advanced' }],
      },
      lessons: {
        create: [
          {
            title: 'TypeScript Type System Deep Dive',
            slug: 'typescript-type-system-deep-dive',
            description: 'Understanding the TypeScript type system',
            type: LessonType.VIDEO,
            content: 'TypeScript has a powerful type system...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 60,
            order: 1,
            isFree: true,
          },
          {
            title: 'Generics and Constraints',
            slug: 'generics-and-constraints',
            description: 'Write reusable type-safe code',
            type: LessonType.VIDEO,
            content: 'Generics allow you to write flexible, reusable code...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 45,
            order: 2,
          },
          {
            title: 'Conditional Types',
            slug: 'conditional-types',
            description: 'Type-level logic with conditional types',
            type: LessonType.VIDEO,
            content: 'Conditional types let you express non-uniform type mappings...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 50,
            order: 3,
          },
        ],
      },
    },
    include: { lessons: true },
  })
  console.log('✅ Course 2 created:', course2.title)

  const course3 = await prisma.course.upsert({
    where: { slug: 'machine-learning-fundamentals' },
    update: {},
    create: {
      title: 'Machine Learning Fundamentals',
      slug: 'machine-learning-fundamentals',
      description: 'Learn the core concepts of machine learning including supervised and unsupervised learning, neural networks, and practical applications.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
      status: CourseStatus.PUBLISHED,
      price: 129.99,
      instructorId: instructor.id,
      category: 'Data Science',
      level: 'INTERMEDIATE',
      duration: 1800,
      publishedAt: new Date(),
      categories: {
        create: [{ name: 'Machine Learning' }, { name: 'Data Science' }],
      },
      lessons: {
        create: [
          {
            title: 'Introduction to Machine Learning',
            slug: 'introduction-to-machine-learning',
            description: 'What is ML and why does it matter?',
            type: LessonType.VIDEO,
            content: 'Machine learning is a subset of artificial intelligence...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 30,
            order: 1,
            isFree: true,
          },
          {
            title: 'Supervised Learning',
            slug: 'supervised-learning',
            description: 'Classification and regression',
            type: LessonType.VIDEO,
            content: 'Supervised learning uses labeled data to train models...',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 90,
            order: 2,
          },
        ],
      },
    },
    include: { lessons: true },
  })
  console.log('✅ Course 3 created:', course3.title)

  // Create draft course
  await prisma.course.upsert({
    where: { slug: 'draft-course-example' },
    update: {},
    create: {
      title: 'Draft Course Example',
      slug: 'draft-course-example',
      description: 'This is a draft course for demonstration',
      status: CourseStatus.DRAFT,
      price: 49.99,
      instructorId: instructor.id,
      category: 'Web Development',
      level: 'BEGINNER',
      duration: 300,
      lessons: {
        create: [
          {
            title: 'Draft Lesson 1',
            slug: 'draft-lesson-1',
            type: LessonType.TEXT,
            content: 'This is draft content...',
            order: 1,
          },
        ],
      },
    },
  })
  console.log('✅ Draft course created')

  // Create enrollments for students
  for (const student of students) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course1.id,
        },
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course1.id,
        status: 'ACTIVE',
        progress: 40,
      },
    })

    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: student.id,
          courseId: course2.id,
        },
      },
      update: {},
      create: {
        userId: student.id,
        courseId: course2.id,
        status: 'ACTIVE',
        progress: 20,
      },
    })
  }
  console.log('✅ Enrollments created')

  // Create lesson progress for first student
  const student1 = students[0]
  const course1Lessons = course1.lessons
  for (let i = 0; i < Math.min(2, course1Lessons.length); i++) {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: student1.id,
          lessonId: course1Lessons[i].id,
        },
      },
      update: {},
      create: {
        userId: student1.id,
        lessonId: course1Lessons[i].id,
        completed: true,
        watchedAt: new Date(),
      },
    })
  }
  console.log('✅ Lesson progress created')

  console.log('🎉 Database seed completed successfully!')
  console.log('')
  console.log('📋 Default accounts:')
  console.log('   Owner:     owner@lms.local / owner123')
  console.log('   Admin:     admin@lms.local / admin123')
  console.log('   Instructor: instructor@lms.local / instructor123')
  console.log('   Student:   student1@lms.local / student123')
  console.log('   Student:   student2@lms.local / student123')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })