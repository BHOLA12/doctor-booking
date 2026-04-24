import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z
    .string()
    .regex(/^[\d+\-\s()]{7,20}$/, "Phone number looks invalid")
    .optional()
    .or(z.literal("")),
  role: z.enum(["PATIENT", "DOCTOR", "ADMIN"]).default("PATIENT"),
  avatar: z.string().optional(),
  specialization: z.string().optional(),
  experience: z.number().int().min(0).max(60).optional(),
  licenseNumber: z.string().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.role === "DOCTOR") {
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
  }
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const doctorProfileSchema = z.object({
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.number().min(0, "Experience must be positive"),
  licenseNumber: z.string().min(6, "License number is required"),
  fees: z.number().min(0, "Fees must be positive"),
  bio: z.string().optional(),
  clinicName: z.string().optional(),
  clinicAddress: z.string().optional(),
  city: z.string().default(""),
  state: z.string().default(""),
  country: z.string().default(""),
  consultationType: z.enum(["ONLINE", "OFFLINE", "BOTH"]).default("BOTH"),
});

export const appointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  consultationType: z.enum(["ONLINE", "OFFLINE"]),
  appointmentType: z.enum(["EMERGENCY", "FOLLOW_UP", "NORMAL"]).default("NORMAL"),
  notes: z.string().optional(),
  symptoms: z.string().optional(),
  isEmergency: z.boolean().optional().default(false),
});

export const reviewSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export const slotSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const medicalReportSchema = z.object({
  type: z.string().min(2, "Report type is required"),
  date: z.string().min(1, "Report date is required"),
});

export const symptomCheckerSchema = z.object({
  symptoms: z.string().min(10, "Please describe the symptoms in more detail"),
});

export const reportAnalysisSchema = z.object({
  reportText: z.string().optional(),
  reportId: z.string().optional(),
}).refine((data) => Boolean(data.reportText || data.reportId), {
  message: "Report text or a report reference is required",
});

export const prescriptionSuggestionSchema = z.object({
  symptoms: z.string().min(5, "Symptoms are required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
});

export const prescriptionSaveSchema = z.object({
  appointmentId: z.string().optional(),
  patientId: z.string().min(1, "Patient is required"),
  symptoms: z.string().min(5, "Symptoms are required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  precautions: z.string().optional(),
  medicines: z.array(
    z.object({
      name: z.string().min(1, "Medicine name is required"),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
      duration: z.string().min(1, "Duration is required"),
      instructions: z.string().optional(),
    })
  ).min(1, "At least one medicine is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DoctorProfileInput = z.infer<typeof doctorProfileSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SlotInput = z.infer<typeof slotSchema>;
export type MedicalReportInput = z.infer<typeof medicalReportSchema>;
export type SymptomCheckerInput = z.infer<typeof symptomCheckerSchema>;
export type ReportAnalysisInput = z.infer<typeof reportAnalysisSchema>;
export type PrescriptionSuggestionInput = z.infer<typeof prescriptionSuggestionSchema>;
export type PrescriptionSaveInput = z.infer<typeof prescriptionSaveSchema>;
