import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createAppointment,
  listAppointments,
} from "@/server/controllers/appointments-controller";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return await listAppointments(request, session);
  } catch (error) {
    console.error("Appointments list error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return await createAppointment(request, session);
  } catch (error) {
    console.error("Appointment create error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
