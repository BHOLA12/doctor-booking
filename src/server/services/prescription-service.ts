import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { generatePrescriptionPdf } from "./prescription-pdf-service";
import { createNotification } from "./notification-service";
import { NOTIFICATION_TYPES } from "@/lib/constants";
import { PrescriptionMedicine } from "@/types";

export async function createPrescription(input: {
  doctorUserId: string;
  patientId: string;
  appointmentId?: string;
  symptoms: string;
  diagnosis: string;
  precautions?: string;
  medicines: PrescriptionMedicine[];
}) {
  const doctor = await prisma.doctor.findUnique({
    where: { userId: input.doctorUserId },
    include: {
      user: {
        select: { name: true },
      },
    },
  });

  if (!doctor) {
    throw new Error("Doctor profile not found");
  }

  const patient = await prisma.user.findUnique({
    where: { id: input.patientId },
    select: { id: true, name: true },
  });

  if (!patient) {
    throw new Error("Patient not found");
  }

  const pdfUrl = await generatePrescriptionPdf({
    doctorName: doctor.user.name,
    patientName: patient.name,
    diagnosis: input.diagnosis,
    symptoms: input.symptoms,
    precautions: input.precautions,
    medicines: input.medicines,
  });

  const prescription = await prisma.prescription.create({
    data: {
      appointmentId: input.appointmentId,
      patientId: input.patientId,
      doctorId: doctor.id,
      symptoms: input.symptoms,
      diagnosis: input.diagnosis,
      precautions: input.precautions,
      medicines: input.medicines as unknown as Prisma.InputJsonValue,
      pdfUrl,
    },
  });

  await createNotification({
    userId: input.patientId,
    type: NOTIFICATION_TYPES.PRESCRIPTION_READY,
    title: "Prescription ready",
    message: `A new prescription from ${doctor.user.name} is now available.`,
    link: "/dashboard/patient",
    metadata: { prescriptionId: prescription.id },
  });

  return prescription;
}
