import { prisma } from "@/lib/prisma";
import { createMedicalReport } from "@/server/services/report-service";
import { fail, ok } from "@/server/utils/api";

export async function listMedicalReports(patientId: string) {
  const reports = await prisma.medicalReport.findMany({
    where: { patientId },
    orderBy: [{ date: "desc" }, { uploadedAt: "desc" }],
  });

  return ok(reports);
}

export async function uploadMedicalReport(request: Request, patientId: string) {
  const formData = await request.formData();
  const file = formData.get("file");
  const type = String(formData.get("type") || "");
  const date = String(formData.get("date") || "");

  if (!(file instanceof File)) {
    return fail("A report file is required", 400);
  }

  if (!type || !date) {
    return fail("Report type and date are required", 400);
  }

  const report = await createMedicalReport({
    patientId,
    type,
    date,
    file,
  });

  return ok(report, { status: 201, message: "Medical report uploaded" });
}
