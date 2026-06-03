# 🗄️ Database Schema & Lifecycle Documentation

This document explains CliniKBook's database model, entity relationships, index setups, and lifecycle management.

---

## 1. Database Technology
CliniKBook uses **PostgreSQL** in production (hosted on **Neon Serverless Database**). In local development, the Prisma ORM generates code matching standard PostgreSQL data types.

The database client is constructed in [src/lib/prisma.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/prisma.ts) utilizing `@prisma/adapter-neon` and `@neondatabase/serverless` to enable high-performance connection pooling over WebSockets in serverless runtimes.

---

## 2. Entity Relationship Diagram (Text-based)

```
  ┌──────────────┐
  │   Hospital   │ 1 ─── * ┐
  └──────────────┘         │
  ┌──────────────┐ 1       │
  │     User     │ ◄───────┼───────┐
  └──────┬───────┘         │       │
         │ 1               │       │
         ├─────────────────┼───────┼──────────────────────┐
         ▼ 1               ▼ 1     ▼ *                    ▼ *
  ┌──────────────┐   ┌───────────┐ ┌─────────────┐  ┌─────────────┐
  │    Doctor    │───│  Session  │ │  AuditLog   │  │Notification │
  └──────┬───────┘   └───────────┘ └─────────────┘  └─────────────┘
         │ 1
         ├─────────────────┬──────────────────────┐
         ▼ *               ▼ *                    ▼ *
  ┌──────────────┐   ┌───────────┐          ┌─────────────┐
  │     Slot     │   │Appointment│ ◄─── 1 ──│Review       │
  └──────────────┘   └─────┬─────┘          └─────────────┘
                           │ 1 (optional)
                           ▼ 1
                     ┌───────────┐
                     │Prescription│
                     └───────────┘
```

---

## 3. Database Models & Schema Breakdown

For the exact implementation, see [prisma/schema.prisma](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/prisma/schema.prisma). Below is the logical breakdown:

### User & Provider Profiles
* **User**: The root authentication model. Holds hashed passwords, emails, names, geolocation points, and status flags. The `role` column uses a DB enum (`PATIENT`, `DOCTOR`, `PATHOLOGIST`, `PHARMACY`, `ADMIN`, `HOSPITAL`).
* **Doctor**: Extends the `User` model 1:1 for doctors. Contains clinical experience, specialization type, license numbers, medical fees, and review aggregates (`rating`, `totalReviews`).
* **Hospital**: Profile for clinics or hospitals. Doctors link to a hospital via `hospitalId` (Many-to-One).
* **Pharmacy**: Store profile containing drug license registrations (`dl20`, `dl21`) and business GSTIN fields.

### Consultation System
* **Slot**: Doctor availability time slots. Each entry specifies a weekday number (`0` = Sunday to `6` = Saturday) and a time range (`startTime` and `endTime` as strings like `"09:30"`).
* **Appointment**: Holds bookings. Connects a patient and doctor for a specific date and time slot. Includes consultation category (enum: `ONLINE`, `OFFLINE`), queue position, wait estimates, symptoms, notes, and payment status.
* **Review**: Stores client ratings (integer 1-5) and text descriptions. A unique constraint on `[patientId, doctorId]` prevents duplicates.
* **Prescription**: Tied to an appointment. Holds diagnosis text, symptoms, precautions, a PDF location url, and list of medicines (stored as a JSON list of objects).

### Session & Operational Logs
* **Session**: Tracks active user sessions. Contains hashed refresh tokens, client user-agents, IP addresses, and validity flags.
* **AuditLog**: Stores records of user activity (`LOGIN`, `REGISTER`, `REFRESH_TOKEN_ROTATED`) for security audits.
* **Notification**: Log of app notifications sent to users. Has an `isRead` flag.

---

## 4. Important Indexes & Optimizations

Several explicit database indexes are defined in `schema.prisma` to optimize search and retrieval speeds:

### Doctor Table Indexes (Fast search, sorting, and filtering)
* `@@index([isApproved, specialization])`: Optimizes searches filtering doctors by specific specializations.
* `@@index([isApproved, city])`: Speeds up geographical filters on doctor cards.
* `@@index([isApproved, rating(sort: Desc)])`: Direct support for listing top-rated providers.
* `@@index([isApproved, experience(sort: Desc)])`: Support for sorting by experience.
* `@@index([isApproved, fees])`: Support for ordering fees (low to high or high to low).
* `@@index([isApproved, experience(sort: Desc), totalReviews(sort: Desc), rating(sort: Desc)])`: The default sorting compound index used by the platform.

### Appointment Table Indexes (Fast queue sorting)
* `@@index([doctorId, date, status])`: Speeds up loading a doctor's active scheduler.
* `@@index([doctorId, date, priorityRank, createdAt])`: The key query path for sorting the patient queue according to priority.

### Operational Table Indexes (Fast retrieval)
* `@@index([userId, expiresAt])` on **Session**: Optimizes stale session pruning.
* `@@index([userId, createdAt(sort: Desc)])` on **Notification**: Speeds up notification drawers.
* `@@index([patientId, date(sort: Desc)])` on **MedicalReport**: Optimizes loading patient records in reverse chronological order.

---

## 5. Data Lifecycle

* **Session Expiry**: Sessions are created with a 30-day expiration window (`expiresAt`). During refresh cycles (`/api/auth/refresh`), the old token is rotated, and the session's expiration is reset for another 30 days. When logging out, `isValid` is set to `false`.
* **Pruning and Deletions**:
  * Users can delete their accounts via `DELETE /api/user/delete`.
  * Cascade deletions are configured for profiles (`Doctor`, `Pharmacy`, `Hospital`, `Session`, `AuditLog`, `VerificationRequest`, `Appointment`, `MedicalReport`, `Prescription`, `Notification`, `MedicineOrder`). Deleting a `User` automatically wipes all their records.
  * Prescriptions are preserved: If an appointment is cancelled or deleted, the associated prescription's foreign key resets to null (`onDelete: SetNull` on `Prescription.appointmentId`) so patients do not lose their medical records.
