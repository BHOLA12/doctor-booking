import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { bulkSlotsSchema, sanitizePayload } from "@/lib/schemas";
import { apiError, ForbiddenError, NotFoundError, UnauthorizedError } from "@/app/api/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const slots = await prisma.slot.findMany({
      where: { doctorId: id, isActive: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });

    return NextResponse.json({ success: true, data: slots });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new UnauthorizedError();
    }

    if (session.role !== "ADMIN" && session.role !== "DOCTOR" && session.role !== "PATHOLOGIST") {
      throw new ForbiddenError("Only healthcare providers can configure schedules");
    }

    const { id } = await params;
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      throw new NotFoundError("Doctor profile not found");
    }

    // Verify IDOR ownership - check if this profile belongs to the authenticated user
    if (doctor.userId !== session.userId && session.role !== "ADMIN") {
      throw new ForbiddenError("You cannot modify availability for other providers");
    }

    // 1. Zod input validation BEFORE executing DB edits
    const jsonBody = await request.json();
    const validated = bulkSlotsSchema.parse(jsonBody);

    // 2. Escape inputs recursively to prevent stored XSS attacks
    const sanitizedSlots = sanitizePayload(validated.slots);

    // 3. Database transaction: delete existing slots and createMany concurrently, roll back on errors
    const count = await prisma.$transaction(async (tx) => {
      await tx.slot.deleteMany({ where: { doctorId: id } });

      const created = await tx.slot.createMany({
        data: sanitizedSlots.map((slot) => ({
          doctorId: id,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isActive: slot.isActive ?? true,
        })),
      });

      return created.count;
    });

    return NextResponse.json({
      success: true,
      data: { count },
      message: "Slots updated successfully",
    });
  } catch (error) {
    return apiError(error);
  }
}

