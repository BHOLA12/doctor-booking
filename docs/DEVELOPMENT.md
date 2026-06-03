# 🚀 Onboarding Guide & Knowledge Transfer Report

Welcome to the CliniKBook team! This onboarding guide is designed to get you up to speed with the backend codebase, architectural decisions, and key development patterns quickly.

---

## 📋 Knowledge Transfer (KT) Report
If we were handing over this project today, these are the **most critical** things you must understand first:

1. **Next.js as a Full-Stack Framework**: The project is built using Next.js 16.2.6 (App Router). API routes are located under `src/app/api/` and act as serverless functions.
2. **Controller-Service-Repository Pattern**: The backend logic is structured cleanly. API routes do authentication and validation, then delegate to Controllers (in `src/server/controllers/`), which orchestrate Services (in `src/server/services/`), which interact with the DB via Prisma client (`src/lib/prisma.ts`).
3. **Dual Database Client Strategy**: The codebase uses **Prisma** with the **Neon Serverless Postgres** adapter (`@prisma/adapter-neon`) for production, but has reference configurations for pg and SQLite.
4. **AI Features & Fallbacks**: The platform features AI-driven symptom checking (`src/server/services/openai-service.ts`) using Gemini (`GEMINI_API_KEY`) or Groq (`GROQ_API_KEY`) as first choices, falling back to OpenAI (`OPENAI_API_KEY`), and if no API keys exist, falling back to a rule-based engine in `src/server/services/symptom-checker-local.ts`.
5. **Ephemereal File Storage Risk**: Uploaded files (reports, PDFs) are saved in the `public/` folder (`src/server/services/storage-service.ts`). Since Next.js API routes run serverless in Vercel, this filesystem is read-only and ephemeral. Do not deploy to serverless without configuring S3/Cloudinary.
6. **Queue & Scheduling Logic**: The appointment booking system has a priority scheduling engine (`src/server/services/queue-service.ts`) that positions bookings in a queue based on consultation severity (e.g. EMERGENCY gets Rank 1 and slides to the front).

---

## 🎯 "Start Here" Roadmap

Follow this step-by-step roadmap to set up your environment and make your first contribution:

### Step 1: Environment Configuration
1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in the credentials in `.env.local` using the instructions below:

   #### **Database Connection (Neon PostgreSQL)**
   1. Go to your Neon console (https://console.neon.tech).
   2. Copy the "Connection string".
   3. Set `DATABASE_URL` and `DIRECT_URL` in `.env.local` to this connection string.

   #### **OpenAI/Gemini API Key**
   1. Go to https://platform.openai.com/api-keys.
   2. Create or copy your key and set `OPENAI_API_KEY` in `.env.local`.
   3. Note: The system also supports `GEMINI_API_KEY` and `GROQ_API_KEY` as alternative fallback endpoints.

   #### **JWT Secret Generation**
   Generate a strong random JWT secret:
   * **Node.js**: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   * **PowerShell**: `[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))`
   * Set `JWT_SECRET` in `.env.local` to the generated string.

### Step 2: Database Initialization
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Generate Prisma Client bindings:
   ```bash
   npx prisma generate
   ```
3. Push the schema to your database (for local dev setup, or run migrations):
   ```bash
   npx prisma db push
   ```
4. Run the seed script to populate mock doctors, clinics, and pharmacies:
   ```bash
   npm run db:seed
   ```

### Step 3: Run the Development Server
1. Start the server:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000).
3. Try registering as a Patient or logging in with one of the seeded users.

### Step 4: Verify the Setup
1. Verify database content by running Prisma Studio:
   ```bash
   npm run db:studio
   ```
2. Run lint check to ensure code consistency:
   ```bash
   npm run lint
   ```

---

## 📂 Critical Files Priority List

Here are the files you should read first to understand the backend:

| Priority | File Path | Complexity | Description |
| :--- | :--- | :--- | :--- |
| **1** | [prisma/schema.prisma](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/prisma/schema.prisma) | High | The database schema. Defines the system data models and relationships. |
| **2** | [src/lib/auth.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/auth.ts) | Medium | JWT signing, verification, and cookie configurations. |
| **3** | [src/server/services/queue-service.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/services/queue-service.ts) | High | Booking algorithm, estimated wait calculations, priority ranks. |
| **4** | [src/server/services/openai-service.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/services/openai-service.ts) | Medium | AI LLM routing logic, prompt templates, fallback behaviors. |
| **5** | [src/server/controllers/appointments-controller.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/controllers/appointments-controller.ts) | Medium | Handlers for listing, creating, and updating appointments. |
| **6** | [src/server/services/session-service.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/services/session-service.ts) | Low | Database session management, rotation, and revocation. |
