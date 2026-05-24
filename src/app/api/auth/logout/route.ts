import { NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth";
import { getSession } from "@/lib/auth";
import { revokeUserSessions } from "@/server/services/session-service";

export async function POST() {
  try {
    const session = await getSession();
    if (session?.userId) {
      await revokeUserSessions(session.userId);
    }
  } catch (error) {
    console.error("Logout error:", error);
  }

  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(REFRESH_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
