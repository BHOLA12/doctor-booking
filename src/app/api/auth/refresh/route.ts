import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken, signRefreshToken, getAccessTokenCookieOptions, getRefreshTokenCookieOptions, REFRESH_TOKEN_COOKIE, ACCESS_TOKEN_COOKIE } from "@/lib/auth";
import { findSessionByRefreshToken, rotateSession, revokeSession } from "@/server/services/session-service";
import { logAuditEvent } from "@/lib/audit-log";
import { apiError, UnauthorizedError } from "@/app/api/error-handler";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token is missing");
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedError("Invalid refresh token payload");
    }

    const session = await findSessionByRefreshToken(refreshToken);
    if (!session) {
      throw new UnauthorizedError("Session invalid or expired");
    }

    if (!session.isValid || session.expiresAt <= new Date()) {
      await revokeSession(session.id);
      throw new UnauthorizedError("Session validity has expired");
    }

    // Explicitly carry forward the correct sessionId
    const sessionPayload = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
      isVerified: payload.isVerified,
      sessionId: session.id,
    };

    const accessToken = signAccessToken(sessionPayload);
    const newRefreshToken = signRefreshToken(sessionPayload);
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;
    await rotateSession(session.id, newRefreshToken);

    await logAuditEvent({
      userId: payload.userId,
      action: "REFRESH_TOKEN_ROTATED",
      resourceId: session.id,
      resourceType: "session",
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json({ success: true, message: "Token refreshed" }, { status: 200 });
    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getAccessTokenCookieOptions());
    response.cookies.set(REFRESH_TOKEN_COOKIE, newRefreshToken, getRefreshTokenCookieOptions());
    return response;
  } catch (error) {
    return apiError(error);
  }
}

