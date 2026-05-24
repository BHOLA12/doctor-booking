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
import { loginSchema } from "@/lib/validations";
import { createSession } from "@/server/services/session-service";
import { logAuditEvent } from "@/server/services/audit-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      isVerified: user.isVerified,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    await createSession({
      userId: user.id,
      refreshToken,
      ipAddress,
      userAgent,
    });

    await logAuditEvent({
      userId: user.id,
      action: "LOGIN",
      entity: "User",
      entityId: user.id,
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
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
