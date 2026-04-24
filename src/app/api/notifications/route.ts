import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  listNotifications,
  markNotificationsRead,
} from "@/server/controllers/notification-controller";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return await listNotifications(session.userId);
  } catch (error) {
    console.error("Notifications list error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return await markNotificationsRead(request, session.userId);
  } catch (error) {
    console.error("Notifications update error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
