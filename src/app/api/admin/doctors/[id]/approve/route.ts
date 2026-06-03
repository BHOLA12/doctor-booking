import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { apiError, ForbiddenError } from "@/app/api/error-handler";

// PUT /api/admin/doctors/[id]/approve
// Body: { isApproved: boolean }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      throw new ForbiddenError("Only platform administrators can approve providers");
    }

    const { id } = await params;
    const body = await request.json();
    const { isApproved } = body as { isApproved: boolean };

    if (typeof isApproved !== "boolean") {
      return NextResponse.json(
        { success: false, error: "isApproved must be a boolean" },
        { status: 400 }
      );
    }

    const doctor = await prisma.doctor.update({
      where: { id },
      data: { isApproved },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: doctor,
      message: `Doctor ${isApproved ? "approved" : "rejected"} successfully`,
    });
  } catch (error) {
    return apiError(error);
  }
}

