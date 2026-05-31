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
    suggestedMedicines: ["Calpol 650", "Ascoril LS Syrup", "Allegra 120"],
    suggestedSpecialists: ["General Physician"],
  },
  {
    name: "Influenza (Flu)",
    keywords: ["fever", "body ache", "chills", "fatigue", "dry cough"],
    probability: 0.75,
    reason: "High fever and systemic symptoms like muscle pain often indicate influenza.",
    suggestedTests: ["Rapid influenza diagnostic test", "Complete blood count"],
    precautions: ["Isolation to prevent spread", "Rest and hydration", "Monitor temperature"],
    suggestedMedicines: ["Calpol 650", "Allegra 120", "Asthalin Inhaler"],
    suggestedSpecialists: ["General Physician", "Pulmonologist"],
  },
  {
    name: "Migraine",
    keywords: ["headache", "nausea", "sensitivity to light", "sensitivity to sound", "throbbing"],
    probability: 0.7,
    reason: "Unilateral throbbing pain with sensory sensitivity is typical for migraines.",
    suggestedTests: ["Neurological exam", "MRI if recurring or severe"],
    precautions: ["Rest in a dark, quiet room", "Identify and avoid triggers", "Stay hydrated"],
    suggestedMedicines: ["Vasograin", "Gabapin NT", "Shelcal 500"],
    suggestedSpecialists: ["Neurologist", "General Physician"],
  },
  {
    name: "Gastritis / Food Poisoning",
    keywords: ["stomach pain", "nausea", "vomiting", "diarrhea", "bloating"],
    probability: 0.65,
    reason: "Abdominal discomfort and gastrointestinal distress point to digestive issues.",
    suggestedTests: ["Stool culture", "Breath test for H. pylori", "Endoscopy if chronic"],
    precautions: ["Drink ORS to stay hydrated", "Eat bland foods (BRAT diet)", "Avoid spicy food"],
    suggestedMedicines: ["Pan 40", "Omez 20", "Digene Syrup"],
    suggestedSpecialists: ["Gastroenterologist", "General Physician"],
  },
  {
    name: "Seasonal Allergies",
    keywords: ["itchy eyes", "sneezing", "congestion", "watery eyes"],
    probability: 0.8,
    reason: "Itchy, watery eyes and sneezing without fever often indicate allergies.",
    suggestedTests: ["Skin prick test", "IgE blood test"],
    precautions: ["Avoid known allergens", "Keep windows closed during high pollen", "Use air purifiers"],
    suggestedMedicines: ["Allegra 120", "Refresh Tears Drops", "Betnovate N"],
    suggestedSpecialists: ["Allergist", "Dermatologist"],
  },
  {
    name: "Diabetes (Screening)",
    keywords: ["excessive thirst", "frequent urination", "unexplained weight loss", "blurred vision"],
    probability: 0.5,
    reason: "Classic symptoms of hyperglycaemia require immediate diagnostic verification.",
    suggestedTests: ["HbA1c test", "Fasting blood sugar", "Oral glucose tolerance test"],
    precautions: ["Monitor sugar intake", "Regular exercise", "Seek medical consultation"],
    suggestedMedicines: ["Metformin 500", "Glycomet GP1", "Janumet 50/500"],
    suggestedSpecialists: ["Diabetologist", "Endocrinologist", "General Physician"],
  },
  {
    name: "Dermatitis / Eczema",
    keywords: ["skin rash", "itching", "redness", "dry skin", "scaling"],
    probability: 0.75,
    reason: "Localized skin irritation and itching suggest a dermatological condition.",
    suggestedTests: ["Skin biopsy", "Patch testing"],
    precautions: ["Moisturize regularly", "Avoid harsh soaps", "Use mild cleansers"],
    suggestedMedicines: ["Betnovate N", "Clingard Gel"],
    suggestedSpecialists: ["Dermatologist"],
  },
];

export function getLocalSymptomAnalysis(symptomsText: string): SymptomCheckerResult {
  const normalizedText = symptomsText.toLowerCase();
  const results: { rule: ConditionRule; score: number }[] = [];

  CONDITION_RULES.forEach((rule) => {
    let matchCount = 0;
    rule.keywords.forEach((keyword) => {
      if (normalizedText.includes(keyword)) {
        matchCount++;
      }
    });

    if (matchCount > 0) {
      // Calculate score based on percentage of keywords matched
      const score = (matchCount / rule.keywords.length) * rule.probability;
      results.push({ rule, score });
    }
  });

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  if (results.length === 0) {
    return {
      possibleDiseases: [
        { 
          name: "General Viral Syndrome", 
          probability: 0.3, 
          reason: "Symptoms are non-specific and may relate to various mild viral infections." 
        }
      ],
      suggestedTests: ["Complete Blood Count (CBC)", "General Physician Consultation"],
      precautions: ["Monitor symptoms for 48 hours", "Rest and adequate hydration"],
      suggestedMedicines: ["Calpol 650"],
      suggestedSpecialists: ["General Physician"],
      disclaimer: "No specific matches found. Please consult a doctor for an accurate diagnosis.",
    };
  }

  // Take top 3
  const topResults = results.slice(0, 3);
  
  return {
    possibleDiseases: topResults.map((r) => ({
      name: r.rule.name,
      probability: Math.min(0.95, r.score + 0.1), // Add a bit of base probability
      reason: r.rule.reason,
    })),
    suggestedTests: Array.from(new Set(topResults.flatMap((r) => r.rule.suggestedTests))).slice(0, 4),
    precautions: Array.from(new Set(topResults.flatMap((r) => r.rule.precautions))).slice(0, 4),
    suggestedMedicines: Array.from(new Set(topResults.flatMap((r) => r.rule.suggestedMedicines))).slice(0, 4),
    suggestedSpecialists: Array.from(new Set(topResults.flatMap((r) => r.rule.suggestedSpecialists))).slice(0, 3),
    disclaimer: "This is a local keyword-based screening and should not be taken as a medical diagnosis.",
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
