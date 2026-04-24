import { prisma } from "@/lib/prisma";
import {
  reportAnalysisSchema,
  symptomCheckerSchema,
  prescriptionSuggestionSchema,
} from "@/lib/validations";
import {
  analyzeReportText,
  analyzeSymptoms,
  generatePrescriptionSuggestion,
} from "@/server/services/openai-service";
import { fail, ok } from "@/server/utils/api";

export async function checkSymptoms(request: Request) {
  const body = await request.json();
  const validation = symptomCheckerSchema.safeParse(body);

  if (!validation.success) {
    return fail(validation.error.issues[0].message, 400);
  }

  const result = await analyzeSymptoms(validation.data.symptoms);
  return ok(result);
}

export async function analyzeReport(request: Request) {
  const body = await request.json();
  const validation = reportAnalysisSchema.safeParse(body);

  if (!validation.success) {
    return fail(validation.error.issues[0].message, 400);
  }

  let reportText = validation.data.reportText || "";

  if (!reportText && validation.data.reportId) {
    const report = await prisma.medicalReport.findUnique({
      where: { id: validation.data.reportId },
      select: {
        type: true,
        fileName: true,
        summary: true,
      },
    });

    if (!report) {
      return fail("Report not found", 404);
    }

    reportText = `${report.type}: ${report.fileName}. ${report.summary || "No extracted text available."}`;
  }

  const result = await analyzeReportText(reportText);
  return ok(result);
}

export async function getPrescriptionSuggestion(request: Request) {
  const body = await request.json();
  const validation = prescriptionSuggestionSchema.safeParse(body);

  if (!validation.success) {
    return fail(validation.error.issues[0].message, 400);
  }

  const result = await generatePrescriptionSuggestion(validation.data);
  return ok(result);
}
