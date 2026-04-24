import { prisma } from "@/lib/prisma";
import { APPOINTMENT_TYPES, DEFAULT_APPOINTMENT_DURATION_MINUTES } from "@/lib/constants";

const ACTIVE_APPOINTMENT_STATUSES = ["PENDING", "CONFIRMED"];

export function resolvePriorityRank(appointmentType: "EMERGENCY" | "FOLLOW_UP" | "NORMAL") {
  return APPOINTMENT_TYPES[appointmentType].rank;
}

export async function getQueueMetricsForAppointment(input: {
  appointmentId?: string;
  doctorId: string;
  date: string;
  createdAt: Date;
  priorityRank: number;
}) {
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: input.doctorId,
      date: input.date,
      status: { in: ACTIVE_APPOINTMENT_STATUSES },
    },
    orderBy: [{ priorityRank: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      priorityRank: true,
      createdAt: true,
      startTime: true,
      endTime: true,
    },
  });

  const queueIndex = appointments.findIndex((appointment) =>
    input.appointmentId ? appointment.id === input.appointmentId : false
  );

  if (queueIndex >= 0) {
    return {
      queueNumber: queueIndex + 1,
      estimatedWaitMinutes: queueIndex * DEFAULT_APPOINTMENT_DURATION_MINUTES,
    };
  }

  const queueNumber =
    appointments.filter((appointment) => {
      if (appointment.priorityRank !== input.priorityRank) {
        return appointment.priorityRank < input.priorityRank;
      }
      return appointment.createdAt < input.createdAt;
    }).length + 1;

  return {
    queueNumber,
    estimatedWaitMinutes: (queueNumber - 1) * DEFAULT_APPOINTMENT_DURATION_MINUTES,
  };
}

export async function enrichAppointmentsWithQueue<T extends {
  id: string;
  doctorId: string;
  date: string;
  createdAt: Date;
  priorityRank: number;
}>(appointments: T[]) {
  return Promise.all(
    appointments.map(async (appointment) => {
      const queue = await getQueueMetricsForAppointment({
        appointmentId: appointment.id,
        doctorId: appointment.doctorId,
        date: appointment.date,
        createdAt: appointment.createdAt,
        priorityRank: appointment.priorityRank,
      });

      return {
        ...appointment,
        queueNumber: queue.queueNumber,
        estimatedWaitMinutes: queue.estimatedWaitMinutes,
      };
    })
  );
}
