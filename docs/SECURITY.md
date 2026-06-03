# 🔍 Security, Performance & Technical Debt Audit

This document compiles the code audits performed on the CliniKBook backend. It lists critical risks, vulnerabilities, bottlenecks, duplicate implementations, and architectural debt along with concrete recommendations.

---

## 1. Security Audit (Vulnerabilities & OWASP Risks)

### Risk 1.1: Sensitive File Exposure (Broken Object Level Authorization / Data Leakage)
* **Location**: [src/server/services/storage-service.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/services/storage-service.ts#L20-L33) & [src/server/services/prescription-pdf-service.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/services/prescription-pdf-service.ts#L62-L68)
* **Finding**: Medical reports and prescription PDFs are written to the `public/uploads` directory. Files in the Next.js `public` directory are served statically to the open internet without any authentication check. Anyone who guesses or scrapes the UUID of the PDF (e.g. `/uploads/prescriptions/a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6.pdf`) can access a patient's private medical data.
* **Impact**: Critical HIPAA/DISHA data privacy violation.
* **Recommendation**: Store reports and prescriptions in a private bucket (like AWS S3 or Cloudflare R2). Access them via signed URLs with short expirations (e.g., 15 minutes) or stream them through an authenticated API endpoint (`GET /api/reports/[id]/download`) that checks user roles before serving bytes.

### Risk 1.2: Rate Limiting & Denial of Service (DoS) Weakness
* **Location**: Platform-wide. No middleware or rate limiter.
* **Finding**: There is no rate limiting layer on auth endpoints (`/api/auth/login`, `/api/auth/register`) or search endpoints. Attackers can brute-force user passwords, register thousands of fake accounts, or spam search queries.
* **Impact**: High vulnerability to credentials stuffing and server overloading.
* **Recommendation**: Add a rate-limiting layer. For Vercel deployments, employ Vercel Edge Middleware Rate Limiting or use an external package like `upstash-ratelimit` (Redis-backed) to prevent abuse.

---

## 2. Performance Audit (Bottlenecks & Scalability)

### Risk 2.1: N+1 Database Queries in Appointment Listings
* **Location**: [src/server/controllers/appointments-controller.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/controllers/appointments-controller.ts#L61) calls `enrichAppointmentsWithQueue` in [src/server/services/queue-service.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/services/queue-service.ts#L59-L83)
* **Finding**: For each appointment returned by `findMany`, the code runs `getQueueMetricsForAppointment`, which executes an individual database query (`findMany` of all active doctor appointments for that day). Listing 20 appointments triggers 20 separate database requests.
* **Impact**: Database latency spikes under moderate load, saturating connection pools.
* **Recommendation**: Retrieve all appointments for the affected doctors and dates in a single bulk query (`findMany` with `in` filters), perform the queue sorting in-memory in Javascript, and map the results back to the appointments list.

### Risk 2.2: Redundant DB Checks in Notification Fetching
* **Location**: [src/server/controllers/notification-controller.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/controllers/notification-controller.ts#L6)
* **Finding**: Calling `GET /api/notifications` triggers `syncUpcomingAppointmentNotifications` which runs a query to list today/tomorrow's appointments, and then for *each* appointment executes a separate query checking if a notification exists. This is executed on *every page load* of the notification panel.
* **Impact**: Extreme database overhead for active users.
* **Recommendation**: Decouple notification synchronization from the GET list endpoint. Run this sync via a background cron schedule (e.g. every hour) or trigger it once at login, storing a "lastSyncTime" in session state to avoid running it continuously.

### Risk 2.3: In-Memory LRU Cache Isolation in Serverless Hosts
* **Location**: [src/lib/search-cache.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/search-cache.ts#L63-L70)
* **Finding**: The search cache is stored in a local variable (`globalThis.__searchCache`). In serverless runtimes (like Vercel), each function execution context is isolated and ephemeral. The cache is fragmented across instances, yielding low cache hit rates and making Cache Invalidation nearly impossible when doctor metadata updates.
* **Impact**: Wasteful database query loads and inconsistent search results.
* **Recommendation**: Swap the local in-memory LRU cache for a shared Redis cache (e.g., Upstash Redis) in production.

---

## 3. Technical Debt & Code Smells

### Debt 3.1: Manual PDF Stream Generation
* **Location**: [src/server/services/prescription-pdf-service.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/services/prescription-pdf-service.ts#L34-L60)
* **Finding**: The service manually writes raw PDF specification bytes line-by-line (streams, catalogs, fonts, trailers, xref offset mappings).
* **Impact**: High maintenance risk. Any line-wrap or inclusion of UTF-8 characters (e.g. Indian language names or medical signs) will throw off the byte offset calculation in the cross-reference (`xref`) table, generating corrupt files that cannot open in PDF readers.
* **Recommendation**: Refactor to use standard libraries like `pdfkit` or `jspdf` to compile PDF files robustly.

### Debt 3.2: Duplicate Admin Action Logic
* **Location**: [src/app/api/admin/stats/route.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/app/api/admin/stats/route.ts#L67-L100) vs [src/app/api/admin/doctors/[id]/approve/route.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/app/api/admin/doctors/%5Bid%5D/approve/route.ts#L7-L50)
* **Finding**: The logic to approve or reject a doctor profile is implemented identically in both routes. Furthermore, placing administrative doctor modifications under `/stats` is a REST design violation.
* **Impact**: Bloated code, confusing routes, and high chance of diverging behaviors during updates.
* **Recommendation**: Delete the `PUT` handler in `/api/admin/stats` and instruct client dashboards to query `PUT /api/admin/doctors/[id]/approve`.

### Debt 3.3: Missing DB Transaction Controls
* **Location**: Availability slot saving in [src/app/api/doctors/[id]/slots/route.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/app/api/doctors/%5Bid%5D/slots/route.ts#L58-L69)
* **Finding**: The slot update endpoint wipes a doctor's entire availability schema (`deleteMany`) and then writes new ones (`createMany`). If the database connection drops or creation fails due to constraint validations, the deletion is committed but creation is aborted. The doctor is left with zero active slots.
* **Impact**: Data loss and appointment scheduling issues.
* **Recommendation**: Wrap database calls inside a Prisma Transaction:
  ```typescript
  await prisma.$transaction([
    prisma.slot.deleteMany({ where: { doctorId: id } }),
    prisma.slot.createMany({ data: newSlots })
  ]);
  ```
