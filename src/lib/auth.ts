import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const ACCESS_TOKEN_EXPIRY = "30m";
const REFRESH_TOKEN_EXPIRY = "30d";
const ACCESS_TOKEN_COOKIE = "docbook_access_token";
const REFRESH_TOKEN_COOKIE = "docbook_refresh_token";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  isVerified?: boolean;
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
  return jwt.sign({ ...payload, tokenType: "access" }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function signRefreshToken(payload: JWTPayload): string {
  return jwt.sign({ ...payload, tokenType: "refresh" }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
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
    maxAge: 60 * 60 * 24 * 30, // 30 days
  };
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}

export function getRefreshTokenHash(token: string) {
  return hashValue(token);
}

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, hashValue };

