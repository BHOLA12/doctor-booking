import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  createAppointment,
  listAppointments,
} from "@/server/controllers/appointments-controller";
import { apiError, UnauthorizedError } from "@/app/api/error-handler";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      throw new UnauthorizedError();
    }

    return await listAppointments(request, session);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      throw new UnauthorizedError();
    }

    return await createAppointment(request, session);
  } catch (error) {
    return apiError(error);
  }
}

