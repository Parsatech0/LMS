# LMS Platform - Learning Management System

A modern, full-stack Learning Management System built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication & Authorization**: NextAuth.js with credentials, Google, and GitHub OAuth
- **Role-Based Access Control**: OWNER, ADMIN, INSTRUCTOR, STUDENT roles
- **Course Management**: Create, publish, and manage courses with lessons
- **Student Dashboard**: Track progress, enroll in courses, view certificates
- **Instructor Dashboard**: Course analytics, student management, content creation
- **Admin Panel**: User management, platform settings, analytics
- **Responsive UI**: Built with Tailwind CSS and Radix UI components
- **Type Safety**: Full TypeScript with strict mode
- **Testing**: Jest + React Testing Library
- **Database**: Prisma ORM with PostgreSQL

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## 🛠️ Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd lms-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

Generate a secure NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 4. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👤 Default Accounts

After seeding, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@lms.local | owner123 |
| Admin | admin@lms.local | admin123 |
| Instructor | instructor@lms.local | instructor123 |
| Student | student1@lms.local | student123 |
| Student | student2@lms.local | student123 |

**Important**: Change these passwords immediately in production!

## 🏗️ Project Structure

```
lms-project/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/        # Auth pages (login, register)
│   │   ├── (dashboard)/   # Protected dashboard pages
│   │   ├── api/           # API routes
│   │   ├── courses/       # Public course pages
│   │   └── layout.tsx     # Root layout
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   ├── layout/        # Layout components (Header, Sidebar)
│   │   └── courses/       # Course-specific components
│   ├── lib/
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── prisma.ts      # Prisma client
│   │   ├── rbac.ts        # Role-based access control
│   │   ├── utils.ts       # Utility functions
│   │   ├── validations.ts # Zod schemas
│   │   └── actions/       # Server actions
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript types
│   └── styles/            # Global styles
├── tests/                 # Test files
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── .eslintrc.json
├── jest.config.js
├── .gitignore
└── .env.example
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔍 Code Quality

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format code (if prettier configured)
npm run format
```

## 🚀 Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard
4. Deploy!

### 3. Database Setup for Production

Use a managed PostgreSQL provider:
- [Neon](https://neon.tech) (Free tier available)
- [Supabase](https://supabase.com) (Free tier available)
- [Railway](https://railway.app)
- [PlanetScale](https://planetscale.com)

Run migrations in production:
```bash
npx prisma migrate deploy
```

### 4. Environment Variables for Production

Set these in your deployment platform:

```env
DATABASE_URL="your-production-postgres-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 🔄 Deployment Workflow

1. **Local Development**: Make changes locally
2. **Test**: Run `npm test` and `npm run build`
3. **Commit**: `git add . && git commit -m "Your message"`
4. **Push**: `git push origin main`
5. **Auto Deploy**: Vercel automatically builds and deploys
6. **Verify**: Check production URL

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Course Endpoints

- `GET /api/courses` - List published courses
- `POST /api/courses` - Create course (instructor+)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (owner/instructor)
- `DELETE /api/courses/:id` - Delete course (owner/admin)

### Enrollment Endpoints

- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments` - Get user enrollments
- `PUT /api/enrollments/:id` - Update progress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Check the [documentation](#) for common issues
- Open an [issue](https://github.com/your-repo/issues) for bugs
- Join our [Discord community](#) for discussions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)