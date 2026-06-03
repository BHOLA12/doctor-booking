import { z } from "zod";

/**
 * Standard HTML Escaping function to mitigate XSS (Cross-Site Scripting) vectors.
 * Converts key HTML characters into safe HTML entity equivalents.
 */
export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Recursively scans and sanitizes all string properties in a payload.
 * Ensures any deeply nested JSON payloads are clean before database persistence.
 */
export function sanitizePayload<T>(data: T): T {
  if (typeof data === "string") {
    return sanitizeHtml(data) as unknown as T;
  }
  if (Array.isArray(data)) {
    return data.map(sanitizePayload) as unknown as T;
  }
  if (data !== null && typeof data === "object") {
    const sanitized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitized[key] = sanitizePayload(data[key]);
      }
    }
    return sanitized as T;
  }
  return data;
}

// ────────────────────────────────────────────────────────────────────────
// ZOD VALIDATION SCHEMAS FOR ALL CORE ENTITIES
// ────────────────────────────────────────────────────────────────────────

// Patient Profile and Registration Validation
export const patientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[\d+\-\s()]{7,20}$/, "Phone number looks invalid")
    .optional()
    .or(z.literal("")),
  avatar: z.string().url("Avatar must be a valid URL").optional().or(z.literal("")),
  addressLine1: z.string().min(3, "Physical address must be at least 3 characters").max(200),
  landmark: z.string().max(100).optional().or(z.literal("")),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
});

// Appointment Booking Validation
export const appointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
  consultationType: z.enum(["ONLINE", "OFFLINE"]),
  appointmentType: z.enum(["EMERGENCY", "FOLLOW_UP", "NORMAL"]).default("NORMAL"),
  notes: z.string().max(1000).optional().or(z.literal("")),
  symptoms: z.string().max(1000).optional().or(z.literal("")),
  isEmergency: z.boolean().optional().default(false),
});

// Doctor Availability Slot Validation
export const slotSchema = z.object({
  dayOfWeek: z.number().int().min(0, "Day must be >= 0 (Sunday)").max(6, "Day must be <= 6 (Saturday)"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "End time must be HH:MM"),
  isActive: z.boolean().default(true),
});

// Array wrapper for Slots bulk creation
export const bulkSlotsSchema = z.object({
  slots: z.array(slotSchema).min(1, "At least one slot is required"),
});

// Doctor Profile Update Validation
export const doctorSchema = z.object({
  specialization: z.string().min(1, "Specialization is required").max(100),
  experience: z.number().int().min(0, "Experience cannot be negative").max(60, "Invalid experience value"),
  licenseNumber: z.string().min(6, "License number must be at least 6 characters").max(50),
  fees: z.number().min(0, "Fees must be positive"),
  bio: z.string().max(2000).optional().or(z.literal("")),
  clinicName: z.string().max(100).optional().or(z.literal("")),
  clinicAddress: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  country: z.string().min(1, "Country is required").max(100),
  consultationType: z.enum(["ONLINE", "OFFLINE", "BOTH"]).default("BOTH"),
  degree: z.string().max(100).optional().or(z.literal("")),
  college: z.string().max(100).optional().or(z.literal("")),
  experienceHospitals: z.string().max(500).optional().or(z.literal("")),
  currentHospitalName: z.string().max(100).optional().or(z.literal("")),
});

// Prescription Save Validation
export const prescriptionSchema = z.object({
  appointmentId: z.string().optional().or(z.literal("")),
  patientId: z.string().min(1, "Patient ID is required"),
  symptoms: z.string().min(5, "Symptoms description must be at least 5 characters").max(2000),
  diagnosis: z.string().min(3, "Diagnosis must be at least 3 characters").max(2000),
  precautions: z.string().max(2000).optional().or(z.literal("")),
  medicines: z.array(
    z.object({
      name: z.string().min(1, "Medicine name is required").max(100),
      dosage: z.string().min(1, "Dosage is required").max(100),
      frequency: z.string().min(1, "Frequency is required").max(100),
      duration: z.string().min(1, "Duration is required").max(100),
      instructions: z.string().max(500).optional().or(z.literal("")),
    })
  ).min(1, "At least one medicine is required"),
});

// Complete Registration Validator with role-specific super refinements
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  phone: z
    .string()
    .regex(/^[\d+\-\s()]{7,20}$/, "Phone number looks invalid")
    .optional()
    .or(z.literal("")),
  role: z.enum(["PATIENT", "DOCTOR", "PATHOLOGIST", "ADMIN", "PHARMACY", "HOSPITAL"]).default("PATIENT"),
  avatar: z.string().optional().or(z.literal("")),
  specialization: z.string().optional().or(z.literal("")),
  experience: z.number().int().min(0).max(60).optional(),
  licenseNumber: z.string().optional().or(z.literal("")),
  degree: z.string().optional().or(z.literal("")),
  college: z.string().optional().or(z.literal("")),
  experienceHospitals: z.string().optional().or(z.literal("")),
  currentHospitalName: z.string().optional().or(z.literal("")),
  ownerName: z.string().optional().or(z.literal("")),
  pharmacistName: z.string().optional().or(z.literal("")),
  pharmacistRegNo: z.string().optional().or(z.literal("")),
  dl20: z.string().optional().or(z.literal("")),
  dl21: z.string().optional().or(z.literal("")),
  gstin: z.string().optional().or(z.literal("")),
  addressLine1: z.string().min(3, "Physical address must be at least 3 characters").max(200),
  landmark: z.string().optional().or(z.literal("")),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.role === "DOCTOR" || data.role === "PATHOLOGIST") {
    if (!data.specialization) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["specialization"],
        message: "Specialization is required for doctors",
      });
    }
    if (typeof data.experience !== "number") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["experience"],
        message: "Experience is required for doctors",
      });
    }
    if (!data.licenseNumber || data.licenseNumber.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["licenseNumber"],
        message: "License number must be at least 6 characters",
      });
    }
  } else if (data.role === "PHARMACY") {
    if (!data.gstin || data.gstin.length !== 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["gstin"],
        message: "GSTIN is required and must be exactly 15 characters",
      });
    }
    if (!data.dl20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dl20"],
        message: "Drug License Form 20 is required",
      });
    }
    if (!data.dl21) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dl21"],
        message: "Drug License Form 21 is required",
      });
    }
    if (!data.pharmacistRegNo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pharmacistRegNo"],
        message: "Pharmacist Registration Number is required",
      });
    }
  }
});

// Login Validator
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Review Validator
export const reviewSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  rating: z.number().int().min(1, "Rating must be >= 1").max(5, "Rating must be <= 5"),
  comment: z.string().max(1000).optional().or(z.literal("")),
});

// Prescription Save Alias
export const prescriptionSaveSchema = prescriptionSchema;

// Medical Report Metadata Validator
export const medicalReportSchema = z.object({
  type: z.string().min(2, "Report type is required").max(100),
  date: z.string().min(1, "Report date is required"),
});

// AI Symptom Checker Input Validator
export const symptomCheckerSchema = z.object({
  symptoms: z.string().min(1, "Please describe the symptoms").max(5000),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      text: z.string()
    })
  ).optional()
});

// AI Medical Report Summary Validator
export const reportAnalysisSchema = z.object({
  reportText: z.string().max(20000).optional().or(z.literal("")),
  reportId: z.string().optional().or(z.literal("")),
}).refine((data) => Boolean(data.reportText || data.reportId), {
  message: "Report text or a report reference is required",
});

// AI Prescription Draft Suggestions Validator
export const prescriptionSuggestionSchema = z.object({
  symptoms: z.string().min(5, "Symptoms are required").max(2000),
  diagnosis: z.string().min(3, "Diagnosis is required").max(2000),
});


