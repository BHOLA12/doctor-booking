# 🏛️ Architecture & System Design Document

This document outlines the high-level architecture, directory layout, request lifecycle, and component interactions of the CliniKBook backend.

---

## 1. High-Level Architecture Diagram
The system is built on a modern full-stack architecture using Next.js, serving both front-end pages and back-end API routes in a consolidated repository.

```
       ┌─────────────────────────────────────────────────────────┐
       │                   Client (Next.js UI)                   │
       └────────────────────────────┬────────────────────────────┘
                                    │ HTTP Requests
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                Next.js API Router (App)                 │
       │           (src/app/api/.../route.ts endpoints)          │
       └────────────────────────────┬────────────────────────────┘
                                    │
                                    ├─► [Authentication Check] (src/lib/auth.ts)
                                    ├─► [Payload Validation]   (src/lib/validations.ts)
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │                       Controllers                       │
       │                 (src/server/controllers/*)              │
       └────────────────────────────┬────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
 ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
 │       Services      │ │     AI Services     │ │   Storage Service   │
 │ (queue, prescription│ │ (openai, local      │ │ (local disk public/ │
 │ notification, audit)│ │ symptom checker)    │ │  uploads folder)    │
 └──────────┬──────────┘ └──────────┬──────────┘ └──────────┬──────────┘
            │                       │                       │
            │                       ├─► OpenAI API          └─► [Public Folder]
            │                       ├─► Gemini API              (ephemeral)
            │                       └─► Groq API
            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                    Prisma ORM Client                        │
 └──────────────────────────┬──────────────────────────────────┘
                            ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                 Neon Serverless PostgreSQL                  │
 └─────────────────────────────────────────────────────────────┘
```

---

## 2. Request Lifecycle & Flow

Every incoming API request follows a strict pathway:
1. **Routing**: The request enters via Next.js App Router (e.g. `POST /api/appointments`).
2. **Authentication**: The route checks for credentials using `getSession()` in [src/lib/auth.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/auth.ts), checking the HTTP-only cookie `clinikbook_access_token`.
3. **Validation**: The route passes request data to the controller, which validates the payload layout using Zod schemas defined in [src/lib/validations.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/validations.ts).
4. **Business Logic Execution**: The controller invokes specialized services (e.g. [src/server/services/queue-service.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/services/queue-service.ts)) to calculate state modifications.
5. **Database Transaction**: Services make database calls using the central Prisma client [src/lib/prisma.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/prisma.ts).
6. **Side Effects**: Services trigger actions like PDF creation, file storage, or creating notification entries in the database.
7. **Response Formatter**: The controller formats results using standard helpers `ok()` or `fail()` in [src/server/utils/api.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/utils/api.ts) and returns a `NextResponse` object to the client.

---

## 3. Directory Layout Breakdown

The project layout follows clean separation of concerns:

```
doctor-booking/
├── prisma/                          # Database configuration folder
│   ├── dev.db                       # Local SQLite dev database file (fallback)
│   ├── schema.prisma                # Prisma DB models, fields, and index configurations
│   └── seed.ts                      # DB seed script for mocking doctors, clinics, and reviews
├── public/                          # Static asset folder served directly
│   └── uploads/                     # File uploads folder (reports, prescriptions)
└── src/
    ├── app/                         # Next.js App Router folders
    │   ├── api/                     # Backend API Routes (GET/POST/PUT/DELETE handlers)
    │   │   ├── admin/               # Admin routes (approvals, users, stats)
    │   │   ├── ai/                  # AI helper endpoints (prescription suggestions, report analysis)
    │   │   ├── appointments/        # Appointment booking and retrieval endpoints
    │   │   ├── auth/                # Auth routes (register, login, refresh, logout)
    │   │   └── ...                  # Other entity-specific API endpoints
    │   └── ...                      # Frontend Pages, components, page layouts
    ├── lib/                         # Global helpers, constants, and database configurations
    │   ├── auth.ts                  # Password hashing & JWT generation/verification functions
    │   ├── prisma.ts                # Prisma Client constructor using Neon PG driver adapter
    │   ├── search-cache.ts          # In-memory LRU search cache for optimization
    │   └── validations.ts           # Zod schema definitions for API inputs
    └── server/                      # Dedicated Server-Side Domain Layer
        ├── controllers/             # Request payload handlers and routing controllers
        ├── services/                # Business logic, third-party routing, and file generation
        └── utils/                   # Standardized response format utilities (ok, fail)
```

---

## 4. Service Interactions

* **Appointments & Queue Systems**:
  * `appointments-controller` calls `queue-service` to determine queue number and estimated wait times before writing the booking to the DB.
  * It then calls `notification-service` to write matching database notifications for both the patient and the doctor.
* **Prescription Writing & PDF Generation**:
  * `prescription-controller` receives diagnostic fields from the doctor, validates it, and passes it to `prescription-service`.
  * The service calls `prescription-pdf-service` to compile and write a physical PDF to `public/uploads/prescriptions/` using raw PDF-1.4 stream formatting.
  * It returns the relative path URL, stores it in the `Prescription` database record, and notifies the patient.
* **Reports & OCR Analysis**:
  * Frontend extracts document text using client-side `tesseract.js` during file upload.
  * The document is saved locally by `storage-service` called from `report-service`.
  * The extracted text (or report ID) is sent to `ai-controller` which checks IDOR permissions and calls `openai-service` (leveraging Gemini/Groq) to get key findings.
