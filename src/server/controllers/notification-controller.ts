import { prisma } from "@/lib/prisma";
import { syncUpcomingAppointmentNotifications } from "@/server/services/notification-service";
import { fail, ok } from "@/server/utils/api";

export async function listNotifications(userId: string) {
  await syncUpcomingAppointmentNotifications(userId);

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return ok(notifications);
}

export async function markNotificationsRead(request: Request, userId: string) {
  const body = await request.json();
  const ids = Array.isArray(body.ids) ? body.ids : [];

  if (ids.length === 0) {
    return fail("No notifications selected", 400);
  }

  await prisma.notification.updateMany({
    where: {
      userId,
      id: { in: ids },
    },
    data: { isRead: true },
  });

  return ok({ updated: ids.length }, { message: "Notifications updated" });
}
