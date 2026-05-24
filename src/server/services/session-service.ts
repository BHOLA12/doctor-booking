import { prisma } from "@/lib/prisma";
import { getRefreshTokenHash } from "@/lib/auth";

export async function createSession(options: {
  userId: string;
  refreshToken: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  const refreshTokenHash = getRefreshTokenHash(options.refreshToken);
  return prisma.session.create({
    data: {
      userId: options.userId,
      refreshTokenHash,
      ipAddress: options.ipAddress || null,
      userAgent: options.userAgent || null,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
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
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      lastUsedAt: new Date(),
    },
  });
}
