import { prisma } from "@/lib/prisma";

export async function logAuditEvent(options: {
  userId?: string | null;
  action: string;
  entity?: string | null;
  entityId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  return prisma.auditLog.create({
    data: {
      userId: options.userId || null,
      action: options.action,
      entity: options.entity || null,
      entityId: options.entityId || null,
      ipAddress: options.ipAddress || null,
      userAgent: options.userAgent || null,
    },
  });
}
