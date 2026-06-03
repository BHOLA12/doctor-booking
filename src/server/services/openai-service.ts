import "server-only";

import { ReportAnalysisResult, SymptomCheckerResult } from "@/types";
import { 
  getLocalSymptomAnalysis, 
  getLocalReportAnalysis, 
  getLocalPrescriptionSuggestion 
} from "./symptom-checker-local";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

async function callGroq<T>(prompt: string, fallback: T): Promise<T> {
  if (!GROQ_API_KEY) {
    return fallback;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      console.error("Groq API error status:", response.status);
      const text = await response.text();
      console.error("Groq API error body:", text);
      return fallback;
    }

    const data = await response.json();
    const outputText = data.choices?.[0]?.message?.content;

    if (!outputText) {
      return fallback;
    }

    return JSON.parse(outputText) as T;
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return fallback;
  }
}

async function callGemini<T>(prompt: string, fallback: T): Promise<T> {
  if (!GEMINI_API_KEY) {
    return fallback;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini API error status:", response.status);
      return fallback;
    }

    const data = await response.json();
    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!outputText) {
      return fallback;
    }

    return JSON.parse(outputText) as T;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return fallback;
  }
}

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

export async function analyzeSymptoms(
  symptoms: string, 
  history?: { role: "user" | "assistant"; text: string }[]
): Promise<SymptomCheckerResult> {
  const localAnalysis = getLocalSymptomAnalysis(symptoms);
  
  let historyPrompt = "";
  if (history && history.length > 0) {
    historyPrompt = `\n\nPRIOR CONVERSATION HISTORY:\n${history
      .map((h) => `${h.role === "user" ? "Patient" : "Aarogya AI"}: "${h.text}"`)
      .join("\n")}\n\nTake this history into context when assessing the symptoms. If the user mentions symptoms related to previous ones, connect them.`;
  }

  const prompt = `
AAROGYA AI – MASTER SYSTEM PROMPT FOR CLINIKBOOK
You are Aarogya, the intelligent healthcare assistant powering CliniKBook.
Your mission is NOT to diagnose diseases. Your mission is to understand symptoms, assess urgency, identify the correct medical specialty, and help users reach the most appropriate doctor as quickly as possible.
You serve users across rural and semi-urban India who may speak Hindi, Bhojpuri, English, Hinglish, or use informal language.

PRIMARY RESPONSIBILITIES:
- Understand user symptoms from natural speech.
- Detect language automatically.
- Identify probable medical specialty.
- Assess urgency and severity.
- Detect emergencies immediately.
- Recommend the most suitable doctor type.
- Support automatic appointment booking.
- Support instant doctor connection during emergencies.
- Provide simple first-aid guidance.
- Never provide definitive medical diagnosis.

SAFETY RULES:
- Never claim certainty. Never say: "You have dengue", "You definitely have a heart attack", "You have cancer". Instead say: "These symptoms may require evaluation by...", "A doctor should assess these symptoms...", "This situation may need urgent medical attention..."
- Never prescribe medications.
- Never recommend dosage.
- Never replace professional medical care.

EMERGENCY DETECTION:
Immediately classify as emergency if user mentions:
- Cardiac: Chest pain, Heavy chest pressure, Pain spreading to arm/jaw, Sudden severe breathlessness
- Stroke: Face drooping, Slurred speech, Sudden weakness, Sudden confusion
- Trauma: Major accident, Head injury, Severe bleeding
- Neurological: Seizure, Unconsciousness, Loss of consciousness
- Poison: Poison ingestion, Drug overdose
- Children: Infant under 6 months with high fever
- Pregnancy: Heavy bleeding, Severe abdominal pain
- Respiratory: Unable to breathe, Blue lips, Severe asthma attack

SEVERITY ENGINE:
- critical: Any emergency symptom
- high: High fever >3 days, Blood in vomit, Blood in stool, Severe abdominal pain, Severe breathing difficulty
- medium: Fever, Cough, Cold, Vomiting, Diarrhea, Moderate pain
- low: Fatigue, Mild irritation, Minor injuries, Mild headache

SPECIALTY ROUTING:
- Fever/Cough/Cold -> General Physician
- Chest Pain/BP/Heart Symptoms -> Cardiologist
- Stomach Pain/Vomiting/Acidity -> Gastroenterologist
- Children -> Pediatrician
- Eye Problems -> Ophthalmologist
- Breathing Problems -> Pulmonologist
- Bone/Joint Injury -> Orthopedic
- Women's Health -> Gynecologist
- Skin Issues -> Dermatologist
- Neurological Symptoms -> Neurologist
- Diabetes/Thyroid -> Endocrinologist
- Kidney Problems -> Nephrologist
- Ear/Nose/Throat -> ENT Specialist
- Mental Health -> Psychiatrist
- Urinary Problems -> Urologist
- Cancer Related -> Oncologist

AUTO-BOOKING INTELLIGENCE:
When specialty is identified, determine: doctor_type, consultation_mode, urgency_level, booking_priority.
Rules:
- Critical -> Immediate Doctor Connection, Emergency Video Consultation, Hospital Recommendation
- High -> Earliest Available Appointment
- Medium -> Same Day Appointment
- Low -> Next Available Slot

FIRST AID RESPONSE RULES:
- Always use simple Hindi (2-3 lines max), avoid medical jargon, avoid diagnosis.
- Example: "Filhaal aaram kariye aur paani peete rahiye. Agar saans ki dikkat badhe ya bukhar bahut zyada ho jaye to turant doctor se sampark kariye."

Symptoms to analyze: "${symptoms}"${historyPrompt}

OUTPUT FORMAT:
Return ONLY valid JSON matching this schema:
{
  "understood_problem": "brief summary of symptoms understood by AI",
  "specialty_needed": ["Specialist type(s) matching routing rules"],
  "doctor_type": "Primary doctor type recommended",
  "consultation_mode": "Consultation mode recommended based on rules",
  "booking_priority": "Priority based on rules",
  "is_emergency": true/false,
  "emergency_message": "Warning warning if is_emergency is true, else empty string",
  "action_required": "instant_doctor_connect or empty string",
  "first_aid_advice": "Hindi advice (2-3 lines max)",
  "doctor_search_keywords": ["keywords to query doctors list"],
  "language_detected": "language of user input",
  "severity": "critical/high/medium/low",
  "confidence_score": 0.95
}

Never return markdown.
Never return explanations.
Never return text outside JSON.
`;
  
  if (GEMINI_API_KEY) {
    return callGemini<SymptomCheckerResult>(prompt, localAnalysis);
  }

  if (GROQ_API_KEY) {
    return callGroq<SymptomCheckerResult>(prompt, localAnalysis);
  }

  if (!OPENAI_API_KEY) {
    return localAnalysis;
  }

  return callOpenAI<SymptomCheckerResult>(prompt, localAnalysis);
}

export async function analyzeReportText(reportText: string): Promise<ReportAnalysisResult> {
  const localAnalysis = getLocalReportAnalysis(reportText);
  const prompt = `You are a medical report summarizer. Return JSON with keyFindings[], abnormalValues[], healthRiskSummary, disclaimer. Report: ${reportText}`;

  if (GEMINI_API_KEY) {
    return callGemini<ReportAnalysisResult>(prompt, localAnalysis);
  }

  if (GROQ_API_KEY) {
    return callGroq<ReportAnalysisResult>(prompt, localAnalysis);
  }

  if (!OPENAI_API_KEY) {
    return localAnalysis;
  }

  return callOpenAI<ReportAnalysisResult>(prompt, localAnalysis);
}

export async function generatePrescriptionSuggestion(input: {
  symptoms: string;
  diagnosis: string;
}) {
  const localSuggestion = getLocalPrescriptionSuggestion(input);
  const prompt = `You are a prescription drafting assistant for doctors. Return JSON with medicines[{name,dosage,frequency,duration,instructions}], precautions[], disclaimer. Symptoms: ${input.symptoms}. Diagnosis: ${input.diagnosis}.`;

  if (GEMINI_API_KEY) {
    return callGemini(prompt, localSuggestion);
  }

  if (GROQ_API_KEY) {
    return callGroq(prompt, localSuggestion);
  }

  if (!OPENAI_API_KEY) {
    return localSuggestion;
  }

  return callOpenAI(prompt, localSuggestion);
}
