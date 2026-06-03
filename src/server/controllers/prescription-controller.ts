import { prisma } from "@/lib/prisma";
import { prescriptionSaveSchema, sanitizePayload } from "@/lib/schemas";
import { createPrescription } from "@/server/services/prescription-service";
import { apiError, ForbiddenError } from "@/app/api/error-handler";
import { ok } from "@/server/utils/api";

export async function listPrescriptions(session: { userId: string; role: string }) {
  try {
    const where =
      session.role === "DOCTOR" || session.role === "PATHOLOGIST"
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
  } catch (error) {
    return apiError(error);
  }
}

export async function savePrescription(request: Request, session: { userId: string; role: string }) {
  try {
    if (session.role !== "DOCTOR" && session.role !== "PATHOLOGIST") {
      throw new ForbiddenError("Only doctors can save prescriptions");
    }

    const body = await request.json();
    
    // 1. Validate payload inputs before writing to DB
    const validated = prescriptionSaveSchema.parse(body);

    // 2. Escape user inputs recursively for XSS mitigation
    const cleanInput = sanitizePayload(validated);

    const prescription = await createPrescription({
      doctorUserId: session.userId,
      ...cleanInput,
    });

    return ok(prescription, { status: 201, message: "Prescription saved" });
  } catch (error) {
    return apiError(error);
  }
}
