export const SPECIALIZATIONS = [
  { value: "general-physician", label: "General Physician", icon: "🩺" },
  { value: "cardiologist", label: "Cardiologist", icon: "❤️" },
  { value: "dentist", label: "Dentist", icon: "🦷" },
  { value: "dermatologist", label: "Dermatologist", icon: "🧴" },
  { value: "orthopedic", label: "Orthopedic", icon: "🦴" },
  { value: "pediatrician", label: "Pediatrician", icon: "👶" },
  { value: "gynecologist", label: "Gynecologist", icon: "🤰" },
  { value: "ent", label: "ENT Specialist", icon: "👂" },
  { value: "neurologist", label: "Neurologist", icon: "🧠" },
  { value: "ophthalmologist", label: "Ophthalmologist", icon: "👁️" },
  { value: "psychiatrist", label: "Psychiatrist", icon: "🧘" },
  { value: "urologist", label: "Urologist", icon: "🏥" },
];

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const TIME_SLOTS = Array.from({ length: 24 }, (_, hour) => {
  return ["00", "30"].map((min) => {
    const time = `${hour.toString().padStart(2, "0")}:${min}`;
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? "AM" : "PM";
    const display = `${displayHour}:${min} ${ampm}`;
    return { value: time, label: display };
  });
}).flat();

export const APPOINTMENT_STATUSES = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "Confirmed", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  COMPLETED: { label: "Completed", color: "bg-blue-100 text-blue-800" },
};

export const APPOINTMENT_TYPES = {
  EMERGENCY: { label: "Emergency", rank: 1, color: "bg-red-100 text-red-800" },
  FOLLOW_UP: { label: "Follow-up", rank: 2, color: "bg-amber-100 text-amber-800" },
  NORMAL: { label: "Normal", rank: 3, color: "bg-slate-100 text-slate-800" },
};

export const REPORT_TYPES = [
  "Blood Test",
  "X-Ray",
  "MRI",
  "CT Scan",
  "Prescription",
  "Discharge Summary",
  "Ultrasound",
  "ECG",
];

export const NOTIFICATION_TYPES = {
  APPOINTMENT_BOOKED: "APPOINTMENT_BOOKED",
  UPCOMING_APPOINTMENT: "UPCOMING_APPOINTMENT",
  PRESCRIPTION_READY: "PRESCRIPTION_READY",
  REPORT_UPLOADED: "REPORT_UPLOADED",
} as const;

export const DEFAULT_APPOINTMENT_DURATION_MINUTES = 20;

export const CITIES = [
  { value: "New Delhi", label: "New Delhi, India" },
  { value: "Mumbai", label: "Mumbai, India" },
  { value: "Bangalore", label: "Bangalore, India" },
  { value: "Chennai", label: "Chennai, India" },
  { value: "Hyderabad", label: "Hyderabad, India" },
  { value: "Kolkata", label: "Kolkata, India" },
  { value: "Pune", label: "Pune, India" },
  { value: "Ahmedabad", label: "Ahmedabad, India" },
  { value: "Jaipur", label: "Jaipur, India" },
  { value: "Lucknow", label: "Lucknow, India" },
  { value: "Patna", label: "Patna, India" },
  { value: "Chandigarh", label: "Chandigarh, India" },
  { value: "London", label: "London, UK" },
  { value: "New York", label: "New York, USA" },
  { value: "Dubai", label: "Dubai, UAE" },
  { value: "Singapore", label: "Singapore" },
  { value: "Sydney", label: "Sydney, Australia" },
  { value: "Toronto", label: "Toronto, Canada" },
];
