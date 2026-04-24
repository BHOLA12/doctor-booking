import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

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
    console.error("Slots fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "DOCTOR") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor || doctor.userId !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { slots } = body; // Array of { dayOfWeek, startTime, endTime, isActive }

    if (!Array.isArray(slots)) {
      return NextResponse.json(
        { success: false, error: "Slots must be an array" },
        { status: 400 }
      );
    }

    // Delete existing slots for this doctor and recreate
    await prisma.slot.deleteMany({ where: { doctorId: id } });

    const created = await prisma.slot.createMany({
      data: slots.map((slot: { dayOfWeek: number; startTime: string; endTime: string; isActive?: boolean }) => ({
        doctorId: id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isActive: slot.isActive ?? true,
      })),
    });

    return NextResponse.json({
      success: true,
      data: { count: created.count },
      message: "Slots updated successfully",
    });
  } catch (error) {
    console.error("Slots update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
