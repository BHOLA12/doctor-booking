import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "./storage-service";
import { createNotification } from "./notification-service";
import { NOTIFICATION_TYPES } from "@/lib/constants";

export async function createMedicalReport(input: {
  patientId: string;
  type: string;
  date: string;
  file: File;
}) {
  const upload = await saveUploadedFile({
    file: input.file,
    folder: `uploads/reports/${input.patientId}`,
  });

  const report = await prisma.medicalReport.create({
    data: {
      patientId: input.patientId,
      fileUrl: upload.fileUrl,
      fileName: upload.fileName,
      type: input.type,
      date: new Date(input.date),
    },
  });

  await createNotification({
    userId: input.patientId,
    type: NOTIFICATION_TYPES.REPORT_UPLOADED,
    title: "Report uploaded",
    message: `${input.type} report uploaded successfully.`,
    link: "/dashboard/patient",
    metadata: { reportId: report.id },
  });

  return report;
}
