import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "Missing JWT_SECRET environment variable. Set a strong secret in Vercel or .env.local."
    );
  }
  return secret;
}

const ACCESS_TOKEN_EXPIRY = "30m";
const REFRESH_TOKEN_EXPIRY = "8h"; // 8 hours session duration limit
const ACCESS_TOKEN_COOKIE = "clinikbook_access_token";
const REFRESH_TOKEN_COOKIE = "clinikbook_refresh_token";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  isVerified?: boolean;
  sessionId?: string; // Link session record for server-side revocation checks
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function signAccessToken(payload: JWTPayload): string {
  return jwt.sign({ ...payload, tokenType: "access" }, getJwtSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign({ ...payload, tokenType: "refresh" }, getJwtSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return null;
    }

    const parsed = payload as JWTPayload & { tokenType?: string };
    if (
      typeof parsed.userId !== "string" ||
      typeof parsed.email !== "string" ||
      typeof parsed.role !== "string" ||
      typeof parsed.name !== "string"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function verifyAccessToken(token: string): JWTPayload | null {
  const payload = verifyToken(token);
  if (!payload || (payload as any).tokenType !== "access") return null;
  return payload;
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  const payload = verifyToken(token);
  if (!payload || (payload as any).tokenType !== "refresh") return null;
  return payload;
}

export function getAccessTokenCookieOptions() {
  return {
    name: ACCESS_TOKEN_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 30, // 30 minutes
  };
}

export function getRefreshTokenCookieOptions() {
  return {
    name: REFRESH_TOKEN_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours max Age
  };
}

/**
 * Standard server-side session hook. Validates the stateless JWT token,
 * and performs database verification to check if the session is still active
 * and user has not been suspended or logged out.
 */
export async function getSession(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!token) return null;

    const payload = verifyAccessToken(token);
    if (!payload || !payload.sessionId) return null;

    // Database validity verification check on every request (Fix 3)
    const session = await prisma.session.findUnique({
      where: { id: payload.sessionId },
      select: { isValid: true, expiresAt: true },
    });

    if (!session || !session.isValid || session.expiresAt <= new Date()) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Session verification failure:", error);
    return null;
  }
}

export function getRefreshTokenHash(token: string) {
  return hashValue(token);
}

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, hashValue };


