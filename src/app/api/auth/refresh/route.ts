import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken, signRefreshToken, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, REFRESH_TOKEN_COOKIE, ACCESS_TOKEN_COOKIE } from "@/lib/auth";
import { findSessionByRefreshToken, rotateSession, revokeSession } from "@/server/services/session-service";
import { logAuditEvent } from "@/server/services/audit-service";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) {
      return NextResponse.json({ success: false, error: "Refresh token missing" }, { status: 401 });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Invalid refresh token" }, { status: 401 });
    }

    const session = await findSessionByRefreshToken(refreshToken);
    if (!session) {
      return NextResponse.json({ success: false, error: "Session invalid or expired" }, { status: 401 });
    }

    if (!session.isValid || session.expiresAt <= new Date()) {
      await revokeSession(session.id);
      return NextResponse.json({ success: false, error: "Session has expired" }, { status: 401 });
    }

    const accessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;
    await rotateSession(session.id, newRefreshToken);

    await logAuditEvent({
      userId: payload.userId,
      action: "REFRESH_TOKEN_ROTATED",
      entity: "Session",
      entityId: session.id,
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json({ success: true, message: "Token refreshed" }, { status: 200 });
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getAccessTokenCookieOptions());
    response.cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, getRefreshTokenCookieOptions());
    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
