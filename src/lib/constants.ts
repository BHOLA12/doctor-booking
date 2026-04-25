export const SPECIALIZATIONS = [
  {
    value: "general-physician",
    label: "General Physician",
    iconKey: "stethoscope",
    emoji: "🩺",
    description: "Primary care for everyday health concerns.",
    accent: "from-blue-100 to-sky-50 text-blue-600",
  },
  {
    value: "cardiologist",
    label: "Cardiologist",
    iconKey: "heart-pulse",
    emoji: "❤️",
    description: "Advanced heart and circulation care.",
    accent: "from-rose-100 to-pink-50 text-rose-600",
  },
  {
    value: "dentist",
    label: "Dentist",
    iconKey: "pill",
    emoji: "🦷",
    description: "Comfortable dental and oral treatments.",
    accent: "from-cyan-100 to-sky-50 text-cyan-600",
  },
  {
    value: "dermatologist",
    label: "Dermatologist",
    iconKey: "sparkles",
    emoji: "✨",
    description: "Skin, hair, and cosmetic care experts.",
    accent: "from-violet-100 to-fuchsia-50 text-violet-600",
  },
  {
    value: "orthopedic",
    label: "Orthopedic",
    iconKey: "bone",
    emoji: "🦴",
    description: "Bone, joint, and mobility specialists.",
    accent: "from-amber-100 to-orange-50 text-amber-600",
  },
  {
    value: "pediatrician",
    label: "Pediatrician",
    iconKey: "baby",
    emoji: "👶",
    description: "Gentle care tailored for children.",
    accent: "from-emerald-100 to-green-50 text-emerald-600",
  },
  {
    value: "gynecologist",
    label: "Gynecologist",
    iconKey: "shield-plus",
    emoji: "🛡️",
    description: "Dedicated women’s wellness support.",
    accent: "from-pink-100 to-rose-50 text-pink-600",
  },
  {
    value: "ent",
    label: "ENT Specialist",
    iconKey: "ear",
    emoji: "👂",
    description: "Focused ear, nose, and throat care.",
    accent: "from-indigo-100 to-blue-50 text-indigo-600",
  },
  {
    value: "neurologist",
    label: "Neurologist",
    iconKey: "brain",
    emoji: "🧠",
    description: "Expert diagnosis for brain and nerves.",
    accent: "from-purple-100 to-indigo-50 text-purple-600",
  },
  {
    value: "ophthalmologist",
    label: "Ophthalmologist",
    iconKey: "eye",
    emoji: "👁️",
    description: "Clear vision and eye health guidance.",
    accent: "from-sky-100 to-cyan-50 text-sky-600",
  },
  {
    value: "psychiatrist",
    label: "Psychiatrist",
    iconKey: "brain-circuit",
    emoji: "🧘",
    description: "Thoughtful support for mental wellness.",
    accent: "from-teal-100 to-emerald-50 text-teal-600",
  },
  {
    value: "urologist",
    label: "Urologist",
    iconKey: "activity",
    emoji: "📋",
    description: "Trusted care for urinary health needs.",
    accent: "from-lime-100 to-green-50 text-lime-700",
  },
  {
    value: "sexologist",
    label: "Sexologist",
    iconKey: "user-round",
    emoji: "👤",
    description: "Expert care for sexual health and wellness.",
    accent: "from-rose-100 to-red-50 text-rose-500",
  },
  {
    value: "nutritionist",
    label: "Nutritionist / Dietitian",
    iconKey: "activity",
    emoji: "🥗",
    description: "Personalised diet plans & nutritional guidance.",
    accent: "from-green-100 to-emerald-50 text-green-600",
    featured: true,
  },
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
