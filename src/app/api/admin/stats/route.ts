import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const [totalUsers, totalDoctors, totalAppointments, pendingDoctors, recentAppointments] =
      await Promise.all([
        prisma.user.count(),
        prisma.doctor.count({ where: { isApproved: true } }),
        prisma.appointment.count(),
        prisma.doctor.count({ where: { isApproved: false } }),
        prisma.appointment.count({
          where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
        }),
      ]);

    // Get appointments by status
    const appointmentsByStatus = await prisma.appointment.groupBy({
      by: ["status"],
      _count: true,
    });

    // Get top specializations
    const topSpecs = await prisma.doctor.groupBy({
      by: ["specialization"],
      _count: true,
      orderBy: { _count: { specialization: "desc" } },
      take: 5,
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        pendingDoctors,
        recentAppointments,
        appointmentsByStatus: appointmentsByStatus.map((a) => ({
          status: a.status,
          count: a._count,
        })),
        topSpecializations: topSpecs.map((s) => ({
          specialization: s.specialization,
          count: s._count,
        })),
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { doctorId, isApproved } = body;

    const doctor = await prisma.doctor.update({
      where: { id: doctorId },
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
    console.error("Admin approve error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
