import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUpcomingAppointmentNotifications } from "@/server/services/notification-service";
import { apiError } from "@/app/api/error-handler";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Secure cron route using shared secret auth token checks
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: "Access Denied: Invalid cron secret credentials" },
        { status: 403 }
      );
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const todayIso = now.toISOString().split("T")[0];
    const tomorrowIso = tomorrow.toISOString().split("T")[0];

    // Find all patients who have active appointments today or tomorrow
    const upcomingBookings = await prisma.appointment.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [{ date: todayIso }, { date: tomorrowIso }],
      },
      select: {
        patientId: true,
      },
    });

    const uniquePatientIds = Array.from(
      new Set(upcomingBookings.map((a) => a.patientId))
    );

    // Sync upcoming appointment alerts for each active patient
    let processedCount = 0;
    for (const patientId of uniquePatientIds) {
      await syncUpcomingAppointmentNotifications(patientId);
      processedCount++;
    }

    return NextResponse.json({
      success: true,
      message: "Upcoming appointment notifications synced successfully",
      data: { patientsProcessed: processedCount },
    });
  } catch (error) {
    return apiError(error);
  }
}
