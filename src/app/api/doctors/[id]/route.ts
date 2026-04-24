import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { doctorProfileSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true, phone: true },
        },
        slots: {
          where: { isActive: true },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
        reviews: {
          include: {
            patient: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: doctor });
  } catch (error) {
    console.error("Doctor detail error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
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
    const validation = doctorProfileSchema.safeParse({
      specialization: body.specialization,
      experience: Number(body.experience),
      licenseNumber: body.licenseNumber,
      fees: Number(body.fees),
      bio: body.bio,
      clinicName: body.clinicName,
      clinicAddress: body.clinicAddress,
      city: body.city,
      state: body.state,
      country: body.country,
      consultationType: body.consultationType,
    });

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const updated = await prisma.doctor.update({
      where: { id },
      data: {
        specialization: validation.data.specialization,
        experience: validation.data.experience,
        licenseNumber: validation.data.licenseNumber,
        fees: validation.data.fees,
        bio: validation.data.bio,
        clinicName: validation.data.clinicName,
        clinicAddress: validation.data.clinicAddress,
        city: validation.data.city,
        state: validation.data.state,
        country: validation.data.country,
        consultationType: validation.data.consultationType,
      },
    });

    // Also update user name if provided
    if (body.name) {
      await prisma.user.update({
        where: { id: session.userId },
        data: { name: body.name },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Doctor update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
