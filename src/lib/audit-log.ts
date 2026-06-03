import { prisma } from "@/lib/prisma";

/**
 * Appends a new immutable log entry to the AuditLog table.
 * Standardizes security events tracking (e.g., viewing records, downloading documents).
 * Note: The application logic contains no functions to edit or delete from this table.
 */
export async function logAuditEvent(options: {
  userId: string;
  action: string;
  resourceId: string;
  resourceType: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: options.userId,
        action: options.action,
        resourceId: options.resourceId,
        resourceType: options.resourceType,
        ipAddress: options.ipAddress || null,
        userAgent: options.userAgent || null,
      },
    });
  } catch (error) {
    // Audit logs must not block request fulfillment if database is slow, but should be logged
    console.error("❌ Failed to write audit log entry:", error);
  }
}
