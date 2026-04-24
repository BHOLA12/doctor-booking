import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateAppointmentStatus } from "@/server/controllers/appointments-controller";

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
    return await updateAppointmentStatus(request, session, id);
  } catch (error) {
    console.error("Appointment update error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
