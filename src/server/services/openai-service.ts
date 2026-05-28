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

export async function analyzeSymptoms(symptoms: string): Promise<SymptomCheckerResult> {
  const localAnalysis = getLocalSymptomAnalysis(symptoms);
  const prompt = `You are a medical triage assistant. Return JSON with fields possibleDiseases[{name,probability,reason}], suggestedTests[], precautions[], disclaimer. Symptoms: ${symptoms}`;
  
  if (GROQ_API_KEY) {
    return callGroq<SymptomCheckerResult>(prompt, localAnalysis);
  }

  if (GEMINI_API_KEY) {
    return callGemini<SymptomCheckerResult>(prompt, localAnalysis);
  }

  if (!OPENAI_API_KEY) {
    return localAnalysis;
  }

  return callOpenAI<SymptomCheckerResult>(prompt, localAnalysis);
}

export async function analyzeReportText(reportText: string): Promise<ReportAnalysisResult> {
  const localAnalysis = getLocalReportAnalysis(reportText);
  const prompt = `You are a medical report summarizer. Return JSON with keyFindings[], abnormalValues[], healthRiskSummary, disclaimer. Report: ${reportText}`;

  if (GROQ_API_KEY) {
    return callGroq<ReportAnalysisResult>(prompt, localAnalysis);
  }

  if (GEMINI_API_KEY) {
    return callGemini<ReportAnalysisResult>(prompt, localAnalysis);
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

  if (GROQ_API_KEY) {
    return callGroq(prompt, localSuggestion);
  }

  if (GEMINI_API_KEY) {
    return callGemini(prompt, localSuggestion);
  }

  if (!OPENAI_API_KEY) {
    return localSuggestion;
  }

  return callOpenAI(prompt, localSuggestion);
}
