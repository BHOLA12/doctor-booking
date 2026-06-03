import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateAppointmentStatus } from "@/server/controllers/appointments-controller";
import { apiError, UnauthorizedError } from "@/app/api/error-handler";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new UnauthorizedError();
    }

    const { id } = await params;
    return await updateAppointmentStatus(request, session, id);
  } catch (error) {
    return apiError(error);
  }
}

