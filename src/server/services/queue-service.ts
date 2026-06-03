import { prisma } from "@/lib/prisma";
import { APPOINTMENT_TYPES, DEFAULT_APPOINTMENT_DURATION_MINUTES } from "@/lib/constants";
import type { AppointmentStatus } from "@prisma/client";

const ACTIVE_APPOINTMENT_STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED"];

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
  if (appointments.length === 0) return [];

  // Extract unique filter criteria for the bulk query
  const doctorIds = Array.from(new Set(appointments.map((a) => a.doctorId)));
  const dates = Array.from(new Set(appointments.map((a) => a.date)));

  // Bulk query all active appointments for the target doctors and dates in ONE database hit (Fix 7)
  const allActiveAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: { in: doctorIds },
      date: { in: dates },
      status: { in: ACTIVE_APPOINTMENT_STATUSES },
    },
    orderBy: [{ priorityRank: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      doctorId: true,
      date: true,
      priorityRank: true,
      createdAt: true,
    },
  });

  // Group active items by "doctorId:date" in-memory
  const grouped = new Map<string, typeof allActiveAppointments>();
  for (const active of allActiveAppointments) {
    const key = `${active.doctorId}:${active.date}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(active);
  }

  // Map each original appointment to its queue metrics in-memory
  return appointments.map((appointment) => {
    const key = `${appointment.doctorId}:${appointment.date}`;
    const activeList = grouped.get(key) || [];

    const queueIndex = activeList.findIndex((item) => item.id === appointment.id);

    if (queueIndex >= 0) {
      const queueNumber = queueIndex + 1;
      return {
        ...appointment,
        queueNumber,
        estimatedWaitMinutes: queueIndex * DEFAULT_APPOINTMENT_DURATION_MINUTES,
      };
    }

    // Fallback if the appointment is not currently in the active list (calculate relative positioning)
    const queueNumber =
      activeList.filter((item) => {
        if (item.priorityRank !== appointment.priorityRank) {
          return item.priorityRank < appointment.priorityRank;
        }
        return item.createdAt < appointment.createdAt;
      }).length + 1;

    return {
      ...appointment,
      queueNumber,
      estimatedWaitMinutes: (queueNumber - 1) * DEFAULT_APPOINTMENT_DURATION_MINUTES,
    };
  });
}

