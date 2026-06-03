import { SymptomCheckerResult, ReportAnalysisResult } from "@/types";

interface ConditionRule {
  name: string;
  keywords: string[];
  probability: number;
  reason: string;
  suggestedTests: string[];
  precautions: string[];
  suggestedMedicines: string[];
  suggestedSpecialists: string[];
}

const CONDITION_RULES: ConditionRule[] = [
  {
    name: "Common Cold",
    keywords: ["cough", "sneezing", "runny nose", "sore throat", "mild fever"],
    probability: 0.85,
    reason: "Symptoms are characteristic of a viral upper respiratory infection.",
    suggestedTests: ["Physical examination"],
    precautions: ["Stay hydrated", "Get plenty of rest", "Use saline nasal drops"],
    suggestedMedicines: ["Dolo 650", "Allegra 120"],
    suggestedSpecialists: ["General Physician"],
  },
  {
    name: "Influenza (Flu)",
    keywords: ["fever", "body ache", "chills", "fatigue", "dry cough"],
    probability: 0.75,
    reason: "High fever and systemic symptoms like muscle pain often indicate influenza.",
    suggestedTests: ["Rapid influenza diagnostic test", "Complete blood count"],
    precautions: ["Isolation to prevent spread", "Rest and hydration", "Monitor temperature"],
    suggestedMedicines: ["Dolo 650", "Allegra 120"],
    suggestedSpecialists: ["General Physician", "Pulmonologist"],
  },
  {
    name: "Migraine",
    keywords: ["headache", "nausea", "sensitivity to light", "sensitivity to sound", "throbbing"],
    probability: 0.7,
    reason: "Unilateral throbbing pain with sensory sensitivity is typical for migraines.",
    suggestedTests: ["Neurological exam", "MRI if recurring or severe"],
    precautions: ["Rest in a dark, quiet room", "Identify and avoid triggers", "Stay hydrated"],
    suggestedMedicines: ["Vasograin", "Gabapin NT"],
    suggestedSpecialists: ["Neurologist", "General Physician"],
  },
  {
    name: "Gastritis / Food Poisoning",
    keywords: ["stomach pain", "nausea", "vomiting", "diarrhea", "bloating"],
    probability: 0.65,
    reason: "Abdominal discomfort and gastrointestinal distress point to digestive issues.",
    suggestedTests: ["Stool culture", "Breath test for H. pylori", "Endoscopy if chronic"],
    precautions: ["Drink ORS to stay hydrated", "Eat bland foods (BRAT diet)", "Avoid spicy food"],
    suggestedMedicines: ["Pantop 40", "Mucaine Gel"],
    suggestedSpecialists: ["Gastroenterologist", "General Physician"],
  },
  {
    name: "Seasonal Allergies",
    keywords: ["itchy eyes", "sneezing", "congestion", "watery eyes"],
    probability: 0.8,
    reason: "Itchy, watery eyes and sneezing without fever often indicate allergies.",
    suggestedTests: ["Skin prick test", "IgE blood test"],
    precautions: ["Avoid known allergens", "Keep windows closed during high pollen", "Use air purifiers"],
    suggestedMedicines: ["Allegra 120", "Cetrizine 10mg"],
    suggestedSpecialists: ["Allergist", "Dermatologist"],
  },
  {
    name: "Diabetes (Screening)",
    keywords: ["excessive thirst", "frequent urination", "unexplained weight loss", "blurred vision"],
    probability: 0.5,
    reason: "Classic symptoms of hyperglycaemia require immediate diagnostic verification.",
    suggestedTests: ["HbA1c test", "Fasting blood sugar", "Oral glucose tolerance test"],
    precautions: ["Monitor sugar intake", "Regular exercise", "Seek medical consultation"],
    suggestedMedicines: ["Metformin 500", "Glycomet GP1"],
    suggestedSpecialists: ["Diabetologist", "Endocrinologist", "General Physician"],
  },
  {
    name: "Dermatitis / Eczema",
    keywords: ["skin rash", "itching", "redness", "dry skin", "scaling"],
    probability: 0.75,
    reason: "Localized skin irritation and itching suggest a dermatological condition.",
    suggestedTests: ["Skin biopsy", "Patch testing"],
    precautions: ["Moisturize regularly", "Avoid harsh soaps", "Use mild cleansers"],
    suggestedMedicines: ["Calamine Lotion"],
    suggestedSpecialists: ["Dermatologist"],
  },
];

export function getLocalSymptomAnalysis(symptomsText: string): SymptomCheckerResult {
  const normalizedText = symptomsText.toLowerCase();
  
  // Emergency checks matching system guidelines
  const isEmergency = 
    normalizedText.includes("chest pain") ||
    normalizedText.includes("chest pressure") ||
    normalizedText.includes("breathlessness") ||
    normalizedText.includes("difficulty breathing") ||
    normalizedText.includes("slurred speech") ||
    normalizedText.includes("drooping") ||
    normalizedText.includes("severe bleeding") ||
    normalizedText.includes("unconscious") ||
    normalizedText.includes("poison") ||
    normalizedText.includes("overdose") ||
    normalizedText.includes("head injury");

  let severity: "critical" | "high" | "medium" | "low" = "medium";
  let actionRequired = "";
  let bookingPriority = "Medium";
  let consultationMode = "OPD Consultation";
  let emergencyMessage = "";

  if (isEmergency) {
    severity = "critical";
    actionRequired = "instant_doctor_connect";
    bookingPriority = "Critical";
    consultationMode = "Emergency Video Consultation";
    emergencyMessage = "Potentially critical emergency detected! Seek immediate medical attention.";
  } else if (
    normalizedText.includes("blood") || 
    normalizedText.includes("high fever") || 
    normalizedText.includes("severe abdominal")
  ) {
    severity = "high";
    bookingPriority = "High";
    consultationMode = "Earliest Available Appointment";
  } else if (
    normalizedText.includes("fatigue") ||
    normalizedText.includes("mild") ||
    normalizedText.includes("scratch")
  ) {
    severity = "low";
    bookingPriority = "Low";
    consultationMode = "Next Available Slot";
  }

  // Specialty mapping
  const specialties: string[] = [];
  const searchKeywords: string[] = [];
  let doctorType = "General Physician";

  if (normalizedText.includes("chest") || normalizedText.includes("heart") || normalizedText.includes("bp") || normalizedText.includes("blood pressure")) {
    specialties.push("Cardiologist");
    doctorType = "Cardiologist";
    searchKeywords.push("heart", "bp", "cardio");
  }
  if (normalizedText.includes("stomach") || normalizedText.includes("vomit") || normalizedText.includes("acidity") || normalizedText.includes("digestion")) {
    specialties.push("Gastroenterologist");
    doctorType = "Gastroenterologist";
    searchKeywords.push("gastric", "stomach", "acidity");
  }
  if (normalizedText.includes("child") || normalizedText.includes("baby") || normalizedText.includes("infant") || normalizedText.includes("pediatric")) {
    specialties.push("Pediatrician");
    doctorType = "Pediatrician";
    searchKeywords.push("child", "pediatrician", "baby");
  }
  if (normalizedText.includes("eye") || normalizedText.includes("vision") || normalizedText.includes("blind")) {
    specialties.push("Ophthalmologist");
    doctorType = "Ophthalmologist";
    searchKeywords.push("eye", "vision");
  }
  if (normalizedText.includes("skin") || normalizedText.includes("rash") || normalizedText.includes("itching") || normalizedText.includes("eczema")) {
    specialties.push("Dermatologist");
    doctorType = "Dermatologist";
    searchKeywords.push("skin", "dermatologist", "rash");
  }
  if (normalizedText.includes("bone") || normalizedText.includes("joint") || normalizedText.includes("fracture") || normalizedText.includes("ortho")) {
    specialties.push("Orthopedic");
    doctorType = "Orthopedic Specialist";
    searchKeywords.push("bone", "joint", "ortho");
  }
  if (normalizedText.includes("pregnant") || normalizedText.includes("periods") || normalizedText.includes("gynec")) {
    specialties.push("Gynecologist");
    doctorType = "Gynecologist";
    searchKeywords.push("women health", "pregnancy", "gynecologist");
  }
  if (normalizedText.includes("diabetes") || normalizedText.includes("sugar") || normalizedText.includes("thyroid")) {
    specialties.push("Endocrinologist");
    doctorType = "Endocrinologist";
    searchKeywords.push("diabetes", "thyroid");
  }
  if (normalizedText.includes("ear") || normalizedText.includes("nose") || normalizedText.includes("throat") || normalizedText.includes("ent")) {
    specialties.push("ENT Specialist");
    doctorType = "ENT Specialist";
    searchKeywords.push("ent", "ear", "nose", "throat");
  }

  if (specialties.length === 0) {
    specialties.push("General Physician");
    searchKeywords.push("general physician", "fever", "cough");
  }

  // Local first aid advice in simple Hindi matching prompt rules
  let firstAidAdvice = "Filhaal aaram kariye aur paani peete rahiye. Agar pareshani badhe toh turant doctor se sampark/appointment book karein.";
  if (isEmergency) {
    firstAidAdvice = "Bina kisi deri ke let jayein, body movement na karein aur turant emergency contact number par call karein.";
  } else if (normalizedText.includes("burn")) {
    firstAidAdvice = "Jale hue hisse par thanda paani dalein, koi tel ya cream turant na lagayein, aur doctor se contact karein.";
  } else if (normalizedText.includes("stomach") || normalizedText.includes("vomit")) {
    firstAidAdvice = "ORS ka ghol peete rahein taaki dehydration na ho. Halka khana hi khayein.";
  }

  return {
    understood_problem: `Symptoms analyzed locally: ${symptomsText}`,
    specialty_needed: specialties,
    doctor_type: doctorType,
    consultation_mode: consultationMode,
    booking_priority: bookingPriority,
    is_emergency: isEmergency,
    emergency_message: emergencyMessage,
    action_required: actionRequired,
    first_aid_advice: firstAidAdvice,
    doctor_search_keywords: searchKeywords,
    language_detected: normalizedText.match(/[\u0900-\u097F]/) ? "Hindi" : "English/Hinglish",
    severity: severity,
    confidence_score: 0.65
  };
}

export function getLocalReportAnalysis(reportText: string): ReportAnalysisResult {
  const normalizedText = reportText.toLowerCase();
  const findings: string[] = [];
  const abnormal: string[] = [];
  let risk = "Low";

  if (normalizedText.includes("high") || normalizedText.includes("elevated")) {
    findings.push("Some values appear higher than the reference range.");
    risk = "Moderate";
  }
  
  if (normalizedText.includes("sugar") || normalizedText.includes("glucose")) {
    findings.push("Blood glucose levels are mentioned in the report.");
    if (normalizedText.includes("high") || normalizedText.includes("140") || normalizedText.includes("200")) {
      abnormal.push("Hyperglycemia (High Blood Sugar)");
      risk = "High";
    }
  }

  if (normalizedText.includes("cholesterol") || normalizedText.includes("ldl")) {
    findings.push("Lipid profile analysis found in the report.");
    if (normalizedText.includes("high") || normalizedText.includes("240")) {
      abnormal.push("High Cholesterol");
      risk = "Moderate";
    }
  }

  if (findings.length === 0) {
    findings.push("The report appears to contain general health data.");
    findings.push("No critical abnormalities were automatically detected.");
  }

  return {
    keyFindings: findings,
    abnormalValues: abnormal,
    healthRiskSummary: `Based on the keywords detected, your health risk appears to be ${risk}. Please confirm with a clinician.`,
    disclaimer: "This analysis is performed locally and is for informational purposes only.",
  };
}

export function getLocalPrescriptionSuggestion(input: { symptoms: string; diagnosis: string }) {
  const symptoms = input.symptoms.toLowerCase();
  const diagnosis = input.diagnosis.toLowerCase();
  
  const result = {
    medicines: [
      {
        name: "Paracetamol",
        dosage: "500 mg",
        frequency: "Twice daily",
        duration: "3 days",
        instructions: "After food",
      },
    ],
    precautions: ["Rest well", "Stay hydrated"],
    disclaimer: "AI suggestions must be reviewed by a doctor before use.",
  };

  if (diagnosis.includes("cold") || symptoms.includes("cough")) {
    result.medicines.push({
      name: "Cough Syrup",
      dosage: "10 ml",
      frequency: "Three times a daily",
      duration: "5 days",
      instructions: "Before sleep",
    });
  }

  if (diagnosis.includes("migraine") || symptoms.includes("headache")) {
    result.medicines = [
      {
        name: "Ibuprofen",
        dosage: "400 mg",
        frequency: "As needed",
        duration: "3 days",
        instructions: "With food",
      },
    ];
  }

  return result;
}
