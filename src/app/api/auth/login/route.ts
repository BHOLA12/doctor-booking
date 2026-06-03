import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth";
import { loginSchema } from "@/lib/schemas";
import { createSession } from "@/server/services/session-service";
import { logAuditEvent } from "@/lib/audit-log";
import { apiError, UnauthorizedError } from "@/app/api/error-handler";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 1. Zod input validation BEFORE touches DB
    const validated = loginSchema.parse(body);

    const { email, password } = validated;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // 2. Pre-generate Session ID for database-backed revocation
    const sessionId = randomUUID();

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      isVerified: user.isVerified,
      sessionId, // Embedded for cookie verification checks
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    // 3. Persist the session to database with 8-hour TTL limits
    await createSession({
      id: sessionId,
      userId: user.id,
      refreshToken,
      ipAddress,
      userAgent,
    });

    await logAuditEvent({
      userId: user.id,
      action: "LOGIN",
      resourceId: user.id,
      resourceType: "user",
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
          createdAt: user.createdAt.toISOString(),
        },
      },
      { status: 200 }
    );

    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getAccessTokenCookieOptions());
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, getRefreshTokenCookieOptions());
    return response;
  } catch (error) {
    return apiError(error);
  }
}

