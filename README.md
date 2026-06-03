# 🩺 ClinikBook — Premium Full-Stack Doctor Booking & AI Healthcare Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-black?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-Upstash-red?style=for-the-badge&logo=redis)](https://upstash.com/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-Storage-orange?style=for-the-badge&logo=amazon-s3)](https://aws.amazon.com/s3/)

Welcome to **ClinikBook**, an enterprise-grade, high-concurrency healthcare platform designed to streamline doctor appointment booking, patient queue management, pharmacy logistics, and AI-assisted clinical triage. 

This platform has been engineered to industry standards, incorporating advanced performance optimizations and comprehensive security hardening to mitigate OWASP Top 10 vulnerabilities.

---

## 🚀 Key Architectural Pillars

### 1. 🧠 Multi-Engine AI Diagnostics & Triage
* **Conversational Symptom Checker**: Integrated Gemini 2.5 Flash, Groq (Llama-3.3-70b), and OpenAI GPT-4o-mini engines to perform dynamic symptom triage with a local, rule-based diagnostic engine as a fallback.
* **Prescription OCR Scanner**: Leveraged Tesseract.js on Next.js API routes to extract text from handwritten or typed prescriptions, automatically querying matching database medicines.

### 2. ⚡ High-Concurrency Booking & Queue Engine
* **Atomic Booking Transactions**: Built real-time slot availability validation utilizing PostgreSQL serializable transactions via Prisma to prevent double-booking.
* **Dynamic Wait-Time Algorithms**: Computes queue positions, priority rankings, snapshots, and estimated patient wait-times dynamically based on doctor scheduling and queue lengths.

### 3. 🔒 Enterprise Security Hardening
* **Role-Based Access Control (RBAC)**: Secure multi-dashboard (Patient, Doctor, Admin, Chemist) routing utilizing HTTP-Only cookies, JWT sessions, and database-backed refresh token rotation with an 8-hour absolute expiry window.
* **Vulnerability Mitigation**: Remediated IDOR (Insecure Direct Object Reference) vulnerabilities with ownership assertion guards, implemented sliding-window rate limiting per IP using Upstash, and added magic-byte signature verification (`file-type` buffer checks) to prevent malicious upload executions.

### 4. 📈 Performance Optimization
* **N+1 Query Remediation**: Refactored database queries using in-memory bulk indices, reducing complex nested lookups into flat queries.
* **Distributed Caching**: Configured Upstash Redis for doctor list indexing and search queries, lowering PostgreSQL response latency.

---

## 📚 Technical Documentation

Explore the detailed architecture and codebase layout:

* 📂 **[Development Guide](./docs/DEVELOPMENT.md)**: Setup instructions, seeding scripts, and directory guides.
* 🏛️ **[System Architecture](./docs/ARCHITECTURE.md)**: Deep dive into the data flows, structures, and service lifecycles.
* 🔌 **[API Reference](./docs/API_REFERENCE.md)**: Full REST routes reference, validation payloads, and sample outputs.
* 🗄️ **[Database Design](./docs/DATABASE.md)**: Conceptual Postgres models, indexing priorities, and relationships.
* 🔍 **[Security & Audit logs](./docs/SECURITY.md)**: OWASP remediations, XSS checks, and performance log patterns.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Next.js 16 (App Router), Tailwind CSS, Shadcn UI, Framer Motion |
| **Backend** | Next.js API Routes, Node.js, Prisma ORM, PostgreSQL (Neon Serverless) |
| **Caching & Security** | Upstash Redis, Upstash Rate Limiter, Jose JWT, bcryptjs |
| **Cloud Services** | AWS SDK (S3 Buckets & Signed Urls), Vercel |
| **Utility / Libraries** | Zod (Validation), Tesseract.js (OCR), PDFKit (Prescription PDFs), Fuse.js (Fuzzy Search) |

---

## 🔧 Dev Environment Setup

Follow these steps to spin up the project locally:

```bash
# 1. Clone the repository and install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local
# (Edit .env.local and add your DATABASE_URL, JWT_SECRET, AWS credentials, and Gemini/OpenAI API keys)

# 3. Generate the Prisma Client and push the schema to PostgreSQL
npx prisma generate
npx prisma db push

# 4. Seed the database with sample doctors, clinics, and appointment slots
npm run db:seed

# 5. Run the hot-reloading development server
npm run dev
```

* Open [http://localhost:3000](http://localhost:3000) to view the app.
* To inspect database tables and run queries, use `npm run db:studio`.

