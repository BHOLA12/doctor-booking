# Doctor Appointment Booking Platform — Implementation Plan

A scalable, Practo-like doctor appointment booking platform optimized for small cities (default: Jehanabad, Bihar), built as a modern full-stack Next.js application.

---

## User Review Required

> [!IMPORTANT]
> **Database Choice**: I'll use **SQLite via Prisma** for instant local development (zero setup). The schema is fully portable to **PostgreSQL** — just change the datasource provider in `schema.prisma` and the `DATABASE_URL` env var. Is this acceptable, or do you want PostgreSQL from the start (requires a running PostgreSQL instance)?

> [!IMPORTANT]
> **Authentication**: I'll implement custom **JWT + bcrypt** authentication with HTTP-only cookies (not NextAuth.js) for full control over the role-based auth flow. This gives us Patient/Doctor/Admin roles with a clean, custom implementation. Agreed?

> [!WARNING]
> **Scope Management**: This is a very large project. I'll build it in phases, delivering a fully functional MVP first, then layering on advanced features. The MVP will include all core pages, auth, booking flow, and dashboards — but will use **mock/seed data** rather than real external integrations (Razorpay, Google Maps, SMS). These can be added as follow-up work.

---

## Open Questions

1. **Payment Integration**: Should I stub Razorpay/Stripe payment flow with a mock, or skip it entirely for MVP?
2. **Maps**: Should I add a static Google Maps embed for clinic locations, or skip for MVP?
3. **Notifications**: Email/SMS will be logged to console for MVP. Want me to integrate a real email service (e.g., Resend)?

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 + ShadCN UI |
| Database | Prisma ORM + SQLite (swappable to PostgreSQL) |
| Auth | Custom JWT + bcrypt + HTTP-only cookies |
| State | React Context + Server Components |
| Deployment | Vercel (frontend) + Railway/Render (DB) ready |

---

## Database Schema

```prisma
// Core Models

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  phone         String?   @unique
  password      String    // bcrypt hashed
  role          Role      @default(PATIENT)
  avatar        String?
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  doctor        Doctor?
  appointments  Appointment[]   // as patient
  reviews       Review[]
}

model Doctor {
  id              String    @id @default(cuid())
  userId          String    @unique
  user            User      @relation(fields: [userId], references: [id])
  specialization  String
  experience      Int       // years
  fees            Int       // in INR
  bio             String?
  clinicName      String?
  clinicAddress   String?
  city            String    @default("Jehanabad")
  state           String    @default("Bihar")
  latitude        Float?
  longitude       Float?
  isApproved      Boolean   @default(false)
  rating          Float     @default(0)
  totalReviews    Int       @default(0)
  consultationType ConsultationType @default(BOTH)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  slots           Slot[]
  appointments    Appointment[]
  reviews         Review[]
}

model Slot {
  id          String    @id @default(cuid())
  doctorId    String
  doctor      Doctor    @relation(fields: [doctorId], references: [id])
  dayOfWeek   Int       // 0=Sunday, 6=Saturday
  startTime   String    // "09:00"
  endTime     String    // "09:30"
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())

  @@unique([doctorId, dayOfWeek, startTime])
}

model Appointment {
  id              String    @id @default(cuid())
  patientId       String
  patient         User      @relation(fields: [patientId], references: [id])
  doctorId        String
  doctor          Doctor    @relation(fields: [doctorId], references: [id])
  date            DateTime
  startTime       String
  endTime         String
  status          AppointmentStatus @default(PENDING)
  consultationType ConsultationType
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model Review {
  id        String   @id @default(cuid())
  rating    Int      // 1-5
  comment   String?
  patientId String
  patient   User     @relation(fields: [patientId], references: [id])
  doctorId  String
  doctor    Doctor   @relation(fields: [doctorId], references: [id])
  createdAt DateTime @default(now())

  @@unique([patientId, doctorId])
}

// Enums
enum Role {
  PATIENT
  DOCTOR
  ADMIN
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

enum ConsultationType {
  ONLINE
  OFFLINE
  BOTH
}
```

---

## Folder Structure

```
doctor-booking/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts              # Seed data (doctors, patients, slots)
│   └── migrations/
├── public/
│   └── images/              # Generated doctor/clinic images
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Home page (hero + search + featured doctors)
│   │   ├── globals.css      # Tailwind + custom styles
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── doctors/
│   │   │   ├── page.tsx     # Doctor listing with filters
│   │   │   └── [id]/
│   │   │       └── page.tsx # Doctor profile + booking
│   │   ├── booking/
│   │   │   └── [id]/page.tsx # Booking confirmation
│   │   ├── dashboard/
│   │   │   ├── layout.tsx   # Dashboard shell (sidebar + nav)
│   │   │   ├── page.tsx     # Redirect based on role
│   │   │   ├── patient/
│   │   │   │   ├── page.tsx           # Patient overview
│   │   │   │   └── appointments/page.tsx
│   │   │   ├── doctor/
│   │   │   │   ├── page.tsx           # Doctor overview
│   │   │   │   ├── appointments/page.tsx
│   │   │   │   ├── slots/page.tsx
│   │   │   │   └── profile/page.tsx
│   │   │   └── admin/
│   │   │       ├── page.tsx           # Admin overview + analytics
│   │   │       ├── doctors/page.tsx   # Approve/manage doctors
│   │   │       ├── users/page.tsx     # Manage users
│   │   │       └── bookings/page.tsx  # Monitor bookings
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── register/route.ts
│   │       │   ├── login/route.ts
│   │       │   ├── logout/route.ts
│   │       │   └── me/route.ts
│   │       ├── doctors/
│   │       │   ├── route.ts           # GET (list), POST (create)
│   │       │   ├── [id]/route.ts      # GET, PUT, DELETE
│   │       │   └── [id]/slots/route.ts
│   │       ├── appointments/
│   │       │   ├── route.ts           # GET, POST
│   │       │   └── [id]/route.ts      # PUT (status change)
│   │       ├── reviews/
│   │       │   └── route.ts           # GET, POST
│   │       └── admin/
│   │           ├── doctors/route.ts   # Approve doctors
│   │           ├── stats/route.ts     # Analytics
│   │           └── users/route.ts     # Manage users
│   ├── components/
│   │   ├── ui/               # ShadCN UI components (auto-generated)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FeaturedDoctors.tsx
│   │   │   ├── Specializations.tsx
│   │   │   └── Stats.tsx
│   │   ├── doctors/
│   │   │   ├── DoctorCard.tsx
│   │   │   ├── DoctorFilters.tsx
│   │   │   ├── DoctorProfile.tsx
│   │   │   └── SlotPicker.tsx
│   │   ├── booking/
│   │   │   ├── BookingForm.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── AppointmentTable.tsx
│   │   │   ├── SlotManager.tsx
│   │   │   └── AnalyticsChart.tsx
│   │   └── shared/
│   │       ├── Rating.tsx
│   │       ├── Avatar.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   ├── auth.ts           # JWT helpers (sign, verify, middleware)
│   │   ├── utils.ts          # General utilities
│   │   └── validations.ts    # Zod schemas for API validation
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useDebounce.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   └── types/
│       └── index.ts
├── .env
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register patient/doctor |
| POST | `/api/auth/login` | Public | Login, returns JWT cookie |
| POST | `/api/auth/logout` | Any | Clear JWT cookie |
| GET | `/api/auth/me` | Any | Get current user |
| GET | `/api/doctors` | Public | List doctors (with filters) |
| GET | `/api/doctors/[id]` | Public | Get doctor profile |
| PUT | `/api/doctors/[id]` | Doctor | Update own profile |
| GET | `/api/doctors/[id]/slots` | Public | Get doctor's slots |
| POST | `/api/doctors/[id]/slots` | Doctor | Add/update slots |
| GET | `/api/appointments` | Auth | List user's appointments |
| POST | `/api/appointments` | Patient | Book appointment |
| PUT | `/api/appointments/[id]` | Auth | Update status (confirm/cancel) |
| POST | `/api/reviews` | Patient | Submit review |
| GET | `/api/reviews?doctorId=x` | Public | Get doctor reviews |
| PUT | `/api/admin/doctors` | Admin | Approve/reject doctor |
| GET | `/api/admin/stats` | Admin | Dashboard analytics |
| GET | `/api/admin/users` | Admin | List all users |

---

## Proposed Changes — Phased Build

### Phase 1: Project Setup & Foundation
- Initialize Next.js project with TypeScript + Tailwind CSS
- Install and configure ShadCN UI
- Set up Prisma with SQLite
- Create database schema and run migrations
- Seed database with realistic data (15+ doctors, specializations, slots)
- Set up project structure

### Phase 2: Authentication System
- JWT utilities (sign, verify, decode)
- Auth API routes (register, login, logout, me)
- Auth context and hook
- Login and Register pages with form validation
- Middleware for protected routes
- Role-based access control

### Phase 3: Public Pages
- **Home Page**: Hero section with animated search, specialization cards, featured doctors, platform stats
- **Doctor Listing Page**: Filterable grid with search, specialization filter, availability filter, sort options
- **Doctor Profile Page**: Full profile with reviews, ratings, slot picker, booking CTA
- **Navbar & Footer**: Responsive navigation with auth state

### Phase 4: Booking Flow
- Slot selection (date picker + time slots)
- Booking form (consultation type, notes)
- Booking confirmation page
- Real-time slot availability check

### Phase 5: Dashboards
- **Patient Dashboard**: Upcoming appointments, appointment history, profile management
- **Doctor Dashboard**: Today's appointments, manage slots, view bookings, accept/reject, profile settings
- **Admin Dashboard**: Analytics (total users, doctors, bookings), approve doctors, manage users, monitor bookings

### Phase 6: Polish & Advanced Features
- Reviews & Ratings system
- Responsive mobile design refinements
- Loading states and error handling
- Toast notifications
- Animations and micro-interactions

---

## Seed Data Plan

I'll create rich seed data including:
- **15+ Doctors** across specializations (Cardiologist, Dentist, Orthopedic, Pediatrician, Dermatologist, ENT, Gynecologist, General Physician)
- **5 Patient accounts** for testing
- **1 Admin account** (admin@docbook.com / admin123)
- **Slot configurations** for each doctor
- **Sample appointments** in various states
- **Sample reviews** with ratings

---

## UI Design Direction

- **Color Palette**: Deep teal/emerald primary (`#0D9488`), warm white backgrounds, subtle gray tones
- **Typography**: Inter font family (clean, modern, medical-professional feel)
- **Cards**: Rounded corners with subtle shadows and hover effects
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Dark Mode**: ShadCN's built-in dark mode support
- **Mobile-first**: All pages optimized for mobile screens

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify no build errors
- Run `npx prisma migrate dev` to verify schema
- Test all API routes manually via browser

### Manual Verification (Browser)
- Test complete user flows:
  1. Register as patient → search doctors → book appointment
  2. Register as doctor → set up profile → manage slots → view appointments
  3. Login as admin → approve doctor → view analytics
- Verify responsive design at mobile/tablet/desktop breakpoints
- Test auth flow (login, logout, protected routes)
- Verify role-based access (patient can't access admin, etc.)

---

## Default Credentials (Seed Data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@docbook.com | admin123 |
| Doctor | dr.sharma@docbook.com | doctor123 |
| Patient | patient@docbook.com | patient123 |
