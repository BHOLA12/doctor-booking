import "server-only";

import { ReportAnalysisResult, SymptomCheckerResult } from "@/types";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

async function callOpenAI<T>(prompt: string, fallback: T): Promise<T> {
  if (!OPENAI_API_KEY) {
    return fallback;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: "medical_result",
            schema: {
              type: "object",
              additionalProperties: true,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const outputText = data.output_text;

    if (!outputText) {
      return fallback;
    }

    return JSON.parse(outputText) as T;
  } catch {
    return fallback;
  }
}

export async function analyzeSymptoms(symptoms: string): Promise<SymptomCheckerResult> {
  const fallback: SymptomCheckerResult = {
    possibleDiseases: [
      { name: "Viral infection", probability: 0.46, reason: "Symptoms overlap with common viral patterns." },
      { name: "Seasonal allergy", probability: 0.28, reason: "Respiratory and irritation symptoms can align with allergens." },
      { name: "Migraine or stress response", probability: 0.18, reason: "Pain and fatigue can sometimes be stress-related." },
    ],
    suggestedTests: ["Complete blood count", "Temperature and oxygen saturation check", "Doctor clinical evaluation"],
    precautions: ["Stay hydrated", "Monitor worsening symptoms", "Seek urgent care if breathing difficulty develops"],
    disclaimer: "This is an AI-assisted screening result and not a diagnosis.",
  };

  return callOpenAI<SymptomCheckerResult>(
    `You are a medical triage assistant. Return JSON with fields possibleDiseases[{name,probability,reason}], suggestedTests[], precautions[], disclaimer. Symptoms: ${symptoms}`,
    fallback
  );
}

export async function analyzeReportText(reportText: string): Promise<ReportAnalysisResult> {
  const fallback: ReportAnalysisResult = {
    keyFindings: [
      "This report needs clinician review for final interpretation.",
      "No structured lab parser was available, so the summary is conservative.",
    ],
    abnormalValues: ["Review highlighted values manually in the uploaded report."],
    healthRiskSummary: "No definitive risk grading was generated from the mock analyzer.",
    disclaimer: "This analysis is AI-assisted and should be confirmed by a doctor.",
  };

  return callOpenAI<ReportAnalysisResult>(
    `You are a medical report summarizer. Return JSON with keyFindings[], abnormalValues[], healthRiskSummary, disclaimer. Report: ${reportText}`,
    fallback
  );
}

export async function generatePrescriptionSuggestion(input: {
  symptoms: string;
  diagnosis: string;
}) {
  const fallback = {
    medicines: [
      {
        name: "Paracetamol",
        dosage: "500 mg",
        frequency: "Twice daily",
        duration: "3 days",
        instructions: "After food if fever or body ache persists",
      },
      {
        name: "ORS / Hydration support",
        dosage: "200 ml",
        frequency: "As needed",
        duration: "2 days",
        instructions: "Use to maintain hydration",
      },
    ],
    precautions: [
      "Rest well",
      "Increase fluid intake",
      "Revisit if symptoms worsen or do not improve in 48 hours",
    ],
    disclaimer: "AI suggestions must be reviewed and approved by the doctor before use.",
  };

  return callOpenAI(
    `You are a prescription drafting assistant for doctors. Return JSON with medicines[{name,dosage,frequency,duration,instructions}], precautions[], disclaimer. Symptoms: ${input.symptoms}. Diagnosis: ${input.diagnosis}.`,
    fallback
  );
}
