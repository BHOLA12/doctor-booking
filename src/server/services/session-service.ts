import { prisma } from "@/lib/prisma";
import { getRefreshTokenHash } from "@/lib/auth";

export async function createSession(options: {
  id?: string;
  userId: string;
  refreshToken: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const refreshTokenHash = getRefreshTokenHash(options.refreshToken);
  return prisma.session.create({
    data: {
      id: options.id,
      userId: options.userId,
      refreshTokenHash,
      ipAddress: options.ipAddress || null,
      userAgent: options.userAgent || null,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8), // 8 hours (Fix 3)
    },
  });
}

export async function revokeSession(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { isValid: false },
  });
}

export async function revokeUserSessions(userId: string) {
  return prisma.session.updateMany({
    where: { userId, isValid: true },
    data: { isValid: false },
  });
}

export async function findSessionByRefreshToken(token: string) {
  const refreshTokenHash = getRefreshTokenHash(token);
  return prisma.session.findFirst({
    where: {
      refreshTokenHash,
      isValid: true,
      expiresAt: { gt: new Date() },
    },
  });
}

export async function rotateSession(sessionId: string, refreshToken: string) {
  const refreshTokenHash = getRefreshTokenHash(refreshToken);
  return prisma.session.update({
    where: { id: sessionId },
    data: {
      refreshTokenHash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8), // 8 hours (Fix 3)
      lastUsedAt: new Date(),
    },
  });
}
