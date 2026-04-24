import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NOTIFICATION_TYPES } from "@/lib/constants";

type NotificationPayload = {
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  metadata?: Prisma.InputJsonValue;
};

export async function createNotification(payload: NotificationPayload) {
  return prisma.notification.create({
    data: payload,
  });
}

export async function createAppointmentBookedNotifications(input: {
  appointmentId: string;
  patientId: string;
  doctorUserId: string;
  doctorName: string;
  date: string;
  startTime: string;
}) {
  await Promise.all([
    createNotification({
      userId: input.patientId,
      type: NOTIFICATION_TYPES.APPOINTMENT_BOOKED,
      title: "Appointment booked",
      message: `Your appointment with ${input.doctorName} is booked for ${input.date} at ${input.startTime}.`,
      link: "/dashboard/patient/appointments",
      metadata: { appointmentId: input.appointmentId },
    }),
    createNotification({
      userId: input.doctorUserId,
      type: NOTIFICATION_TYPES.APPOINTMENT_BOOKED,
      title: "New appointment booked",
      message: `A new patient appointment was booked for ${input.date} at ${input.startTime}.`,
      link: "/dashboard/doctor",
      metadata: { appointmentId: input.appointmentId },
    }),
  ]);
}

function getUpcomingWindow() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(now.getHours() + 24);
  return { now, tomorrow };
}

export async function syncUpcomingAppointmentNotifications(userId: string) {
  const { now, tomorrow } = getUpcomingWindow();
  const todayIso = now.toISOString().split("T")[0];
  const tomorrowIso = tomorrow.toISOString().split("T")[0];

  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: userId,
      status: { in: ["PENDING", "CONFIRMED"] },
      OR: [{ date: todayIso }, { date: tomorrowIso }],
    },
    include: {
      doctor: {
        include: {
          user: {
            select: { name: true },
          },
        },
      },
    },
  });

  await Promise.all(
    appointments.map(async (appointment) => {
      const existing = await prisma.notification.findFirst({
        where: {
          userId,
          type: NOTIFICATION_TYPES.UPCOMING_APPOINTMENT,
          metadata: {
            path: ["appointmentId"],
            equals: appointment.id,
          },
        },
      });

      if (!existing) {
        await createNotification({
          userId,
          type: NOTIFICATION_TYPES.UPCOMING_APPOINTMENT,
          title: "Upcoming appointment",
          message: `Upcoming consultation with ${appointment.doctor.user.name} on ${appointment.date} at ${appointment.startTime}.`,
          link: "/dashboard/patient/appointments",
          metadata: { appointmentId: appointment.id },
        });
      }
    })
  );
}
