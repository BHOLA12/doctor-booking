# 🩺 CliniKBook - Doctor Booking Platform (Backend Audit & Onboarding)

Welcome to the **CliniKBook** repository. This project is a full-stack Next.js application that provides doctor appointment booking, patient queue management, pharmacy ordering, and AI-assisted symptom diagnosis.

This README serves as your entry point for onboarding. Detailed documentation of the backend components can be found in the following documents.

---

## 📚 Onboarding Documentation Links

Please read these documents (in your local build workspace or artifacts folder) to understand the project architecture and codebase:

1. 📂 **[Onboarding Guide & KT Roadmap](file:///C:/Users/kashy/.gemini/antigravity/brain/8439d1c6-3445-4a7a-81a4-3a9e062f9058/onboarding_guide.md)**
   * Outlines critical files, the 4-step local environment setup roadmap, and the high-level Knowledge Transfer report.
2. 🏛️ **[System Architecture & Design Document](file:///C:/Users/kashy/.gemini/antigravity/brain/8439d1c6-3445-4a7a-81a4-3a9e062f9058/architecture_document.md)**
   * Describes overall layout, request lifecycle, data flow, folder structure, and service interactions.
3. 🔌 **[API Endpoint Reference](file:///C:/Users/kashy/.gemini/antigravity/brain/8439d1c6-3445-4a7a-81a4-3a9e062f9058/api_documentation.md)**
   * Detailed listing of all REST/API routes, schemas, headers, response types, and authentication roles.
4. 🗄️ **[Database Architecture & Schema Reference](file:///C:/Users/kashy/.gemini/antigravity/brain/8439d1c6-3445-4a7a-81a4-3a9e062f9058/database_documentation.md)**
   * Model breakdowns, relationships, key indexes (sorting & filtering), and session data lifecycles.
5. 🔍 **[Security & Performance Code Audit](file:///C:/Users/kashy/.gemini/antigravity/brain/8439d1c6-3445-4a7a-81a4-3a9e062f9058/security_performance_audit.md)**
   * Vulnerabilities (file leak risk, rate limit weaknesses), N+1 SQL bottlenecks, and technical debt/refactoring paths.

---

## 🛠️ Key Technology Stack

* **Framework**: Next.js 16.2.6 (App Router)
* **Language**: TypeScript
* **Database Layer**: Prisma ORM with Neon Serverless Postgres Client
* **Authentication**: JWT Cookie Sessions with Refresh Token rotation (stored hashed in Database)
* **Validation**: Zod (Zod Schema parsing)
* **AI Model Engine**: Gemini-2.5-Flash (Primary), Groq (Llama-3.3-70b), OpenAI (gpt-4.1-mini) + Local Rule-Based Symptom Fallback
* **Utility Libraries**: `bcryptjs` (password hashing), `tesseract.js` (OCR text extraction), `fuse.js` (fuzzy search indexes)

---

## 🚀 Quick Setup (Dev Environment)

```bash
# 1. Install dependencies
npm install

# 2. Setup your local environment file
cp .env.example .env.local
# (Fill in DATABASE_URL, DIRECT_URL, JWT_SECRET, and GEMINI_API_KEY / OPENAI_API_KEY in .env.local)

# 3. Generate Prisma database clients and push schema
npx prisma generate
npx prisma db push

# 4. Populate development seeds (doctors, clinics, slots)
npm run db:seed

# 5. Launch the development hot-reloading server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
To view and manage the database contents, run `npm run db:studio`.
