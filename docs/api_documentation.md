# 🔌 API Endpoint Documentation

This document lists all backend API endpoints available on the CliniKBook platform, including authentication scopes, request parameters, and return schemas.

---

## Middlewares & Global Headers

* **Authentication Middleware**: There is no global Next.js middleware file. Authentication is checked inside individual API route files using the `getSession()` utility which parses the `clinikbook_access_token` HTTP-only cookie.
* **Response Wrapper**: Responses are structured using standardized helpers in [src/server/utils/api.ts](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/server/utils/api.ts):
  * **Success**: `{ success: true, data: T, message?: string }`
  * **Failure**: `{ success: false, error: string }`

---

## 🔐 Authentication & Session Endpoints

### 1. `POST /api/auth/register`
* **Access**: Public
* **Request Body**: [RegisterInput](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/validations.ts#L3-L88)
* **Response (201)**: User data and sets `clinikbook_access_token` and `clinikbook_refresh_token` cookies.
* **Details**: Creates profile data for matching role (User, Doctor, Pharmacy, Hospital).

### 2. `POST /api/auth/login`
* **Access**: Public
* **Request Body**: `{ email, password }`
* **Response (200)**: User profile metadata and sets session cookies.

### 3. `POST /api/auth/logout`
* **Access**: Public
* **Response (200)**: `{ success: true, message: "Logged out" }` (clears cookies).

### 4. `POST /api/auth/refresh`
* **Access**: Public (Requires `clinikbook_refresh_token` cookie)
* **Response (200)**: Rotates session token in DB and issues fresh cookies.

### 5. `GET /api/auth/me`
* **Access**: Authenticated (Any role)
* **Response (200)**: Current logged-in user profile detail object.

---

## 📅 Appointment Endpoints

### 1. `GET /api/appointments`
* **Access**: Authenticated (`PATIENT`, `DOCTOR`, `PATHOLOGIST`, `ADMIN`)
* **Query Params**: `status` (optional), `page` (default 1), `limit` (default 20)
* **Response (200)**: Array of appointment objects, enriched with dynamic queue numbers and estimated wait times.

### 2. `POST /api/appointments`
* **Access**: Authenticated (`PATIENT`)
* **Request Body**: [AppointmentInput](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/validations.ts#L113-L123)
* **Response (201)**: Created appointment details and its assigned queue slot.

### 3. `PUT /api/appointments/[id]`
* **Access**: Authenticated (`PATIENT` - cancel only; `DOCTOR`, `ADMIN` - confirm/complete/cancel)
* **Request Body**: `{ status: "CONFIRMED" | "CANCELLED" | "COMPLETED" }`
* **Response (200)**: Updated appointment object.

---

## 🩺 Doctor & Clinic Management

### 1. `GET /api/doctors`
* **Access**: Public
* **Query Params**: `city`, `specialization`, `search`, `sortBy` (e.g. `rating`, `fees_low`, `experience`), `page`, `limit`
* **Response (200)**: Paginated array of approved doctors. Cached for 30s-90s.

### 2. `GET /api/doctors/[id]`
* **Access**: Public
* **Response (200)**: Doctor detail schema including clinic address, rating aggregates, and qualifications.

### 3. `PUT /api/doctors/[id]`
* **Access**: Authenticated (`DOCTOR` owner)
* **Request Body**: [DoctorProfileInput](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/validations.ts#L95-L111)
* **Response (200)**: Updated doctor profile record.

### 4. `GET /api/doctors/[id]/slots`
* **Access**: Public
* **Response (200)**: Active slots of the doctor.

### 5. `POST /api/doctors/[id]/slots`
* **Access**: Authenticated (`DOCTOR` owner)
* **Request Body**: Array of `{ dayOfWeek, startTime, endTime, isActive }`
* **Response (200)**: Replaces and writes new availability table.

---

## 📝 Prescriptions & Medical Reports

### 1. `GET /api/prescriptions`
* **Access**: Authenticated (`PATIENT` or `DOCTOR` / `PATHOLOGIST`)
* **Response (200)**: Array of prescriptions linked to the requesting user.

### 2. `POST /api/prescriptions`
* **Access**: Authenticated (`DOCTOR` or `PATHOLOGIST`)
* **Request Body**: [PrescriptionSaveInput](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/lib/validations.ts#L165-L180)
* **Response (201)**: Created prescription object, compiles PDF URL (`/uploads/prescriptions/*.pdf`), and alerts user.

### 3. `GET /api/reports`
* **Access**: Authenticated (`PATIENT`)
* **Response (200)**: List of uploaded medical reports.

### 4. `POST /api/reports`
* **Access**: Authenticated (`PATIENT`)
* **Request Body**: Multipart FormData containing `file` (binary), `type` (string), and `date` (string)
* **Response (201)**: Created medical report record, saves file locally on disk.

---

## 🤖 AI Diagnosis Assistants

### 1. `POST /api/ai/symptoms`
* **Access**: Public
* **Request Body**: `{ symptoms, history? }`
* **Response (200)**: [SymptomCheckerResult](file:///c:/Users/kashy/OneDrive/Desktop/doctor-booking/src/types/index.ts#L148-L162) JSON block (severity, target specialist, first aid).

### 2. `POST /api/ai/report-analysis`
* **Access**: Authenticated (Any role)
* **Request Body**: `{ reportText, reportId }` (If reportId is given, includes IDOR check on report ownership)
* **Response (200)**: Key findings and abnormal values summary.

### 3. `POST /api/ai/prescription`
* **Access**: Authenticated (`DOCTOR` or `PATHOLOGIST`)
* **Request Body**: `{ symptoms, diagnosis }`
* **Response (200)**: List of suggested medicines, dosages, and precautions.

---

## 🛒 Pharmacy & Medicine Ordering

### 1. `POST /api/orders/medicine`
* **Access**: Authenticated (`PATIENT`)
* **Request Body**: `{ items: [{ medicineId, name, price, quantity }], totalAmount, address, phone, notes?, pharmacyId? }`
* **Response (201)**: Created order. Auto-assigns to the first registered pharmacy if no `pharmacyId` is provided.

### 2. `GET /api/orders/medicine`
* **Access**: Authenticated (`PATIENT`)
* **Response (200)**: List of patient's active and previous medicine orders.

### 3. `PATCH /api/orders/medicine/[id]`
* **Access**: Authenticated (`ADMIN`, `PHARMACY` assigned, or order Owner - cancel only)
* **Request Body**: `{ status: "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" }`
* **Response (200)**: Updated order model.

---

## 👑 Administrative Routes

### 1. `GET /api/admin/users`
* **Access**: Authenticated (`ADMIN`)
* **Query Params**: `q` (search string), `role`, `page`, `limit`
* **Response (200)**: Paginated user profiles.

### 2. `PUT /api/admin/doctors/[id]/approve`
* **Access**: Authenticated (`ADMIN`)
* **Request Body**: `{ isApproved: boolean }`
* **Response (200)**: Approved status confirmation.

### 3. `GET /api/admin/stats`
* **Access**: Authenticated (`ADMIN`)
* **Response (200)**: System-wide platform status metrics.
