import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "DOCTOR") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.userId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true, phone: true },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: doctor });
  } catch (error) {
    console.error("Doctor me error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
