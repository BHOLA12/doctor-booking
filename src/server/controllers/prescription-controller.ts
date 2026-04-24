import { prisma } from "@/lib/prisma";
import { prescriptionSaveSchema } from "@/lib/validations";
import { createPrescription } from "@/server/services/prescription-service";
import { fail, ok } from "@/server/utils/api";

export async function listPrescriptions(session: { userId: string; role: string }) {
  const where =
    session.role === "DOCTOR"
      ? {
          doctor: {
            userId: session.userId,
          },
        }
      : {
          patientId: session.userId,
        };

  const prescriptions = await prisma.prescription.findMany({
    where,
    include: {
      patient: {
        select: { id: true, name: true, email: true, phone: true, avatar: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return ok(prescriptions);
}

export async function savePrescription(request: Request, session: { userId: string; role: string }) {
  if (session.role !== "DOCTOR") {
    return fail("Only doctors can save prescriptions", 403);
  }

  const body = await request.json();
  const validation = prescriptionSaveSchema.safeParse(body);

  if (!validation.success) {
    return fail(validation.error.issues[0].message, 400);
  }

  try {
    const prescription = await createPrescription({
      doctorUserId: session.userId,
      ...validation.data,
    });

    return ok(prescription, { status: 201, message: "Prescription saved" });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to save prescription", 400);
  }
}
