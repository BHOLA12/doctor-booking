import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
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
  const session = await getSession();
  if (!session) {
    return fail("Unauthorized", 401);
  }

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
        patientId: true,
      },
    });

    if (!report) {
      return fail("Report not found", 404);
    }

    // IDOR verification
    if (report.patientId !== session.userId && session.role !== "ADMIN" && session.role !== "DOCTOR") {
      return fail("Access denied", 403);
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
