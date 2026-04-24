export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface DoctorProfile {
  id: string;
  userId: string;
  user: UserProfile;
  specialization: string;
  experience: number;
  licenseNumber?: string;
  fees: number;
  bio?: string;
  clinicName?: string;
  clinicAddress?: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isApproved: boolean;
  rating: number;
  totalReviews: number;
  consultationType: string;
  slots?: SlotInfo[];
  reviews?: ReviewInfo[];
}

export interface SlotInfo {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface AppointmentInfo {
  id: string;
  patientId: string;
  patient?: UserProfile;
  doctorId: string;
  doctor?: DoctorProfile;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  consultationType: string;
  appointmentType?: "EMERGENCY" | "FOLLOW_UP" | "NORMAL";
  priorityRank?: number;
  notes?: string;
  symptoms?: string;
  isEmergency?: boolean;
  paymentStatus?: string;
  queueNumber?: number;
  estimatedWaitMinutes?: number;
  createdAt: string;
}

export interface ReviewInfo {
  id: string;
  rating: number;
  comment?: string;
  patientId: string;
  patient?: UserProfile;
  doctorId: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MedicalReportInfo {
  id: string;
  patientId: string;
  fileUrl: string;
  fileName: string;
  type: string;
  date: string;
  uploadedAt: string;
  summary?: string;
}

export interface NotificationInfo {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface PrescriptionInfo {
  id: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  symptoms: string;
  diagnosis: string;
  precautions?: string;
  medicines: PrescriptionMedicine[];
  pdfUrl?: string;
  createdAt: string;
  patient?: UserProfile;
}

export interface SymptomCheckerResult {
  possibleDiseases: Array<{
    name: string;
    probability: number;
    reason: string;
  }>;
  suggestedTests: string[];
  precautions: string[];
  disclaimer: string;
}

export interface ReportAnalysisResult {
  keyFindings: string[];
  abnormalValues: string[];
  healthRiskSummary: string;
  disclaimer: string;
}
