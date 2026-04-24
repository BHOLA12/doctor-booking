import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/lib/validations";
import { fail, ok } from "@/server/utils/api";
import { createAppointmentBookedNotifications } from "@/server/services/notification-service";
import {
  enrichAppointmentsWithQueue,
  getQueueMetricsForAppointment,
  resolvePriorityRank,
} from "@/server/services/queue-service";

export async function listAppointments(request: NextRequest, session: { userId: string; role: string }) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const where: Record<string, unknown> = {};

  if (session.role === "PATIENT") {
    where.patientId = session.userId;
  } else if (session.role === "DOCTOR") {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: session.userId },
    });

    if (!doctor) {
      return fail("Doctor profile not found", 404);
    }

    where.doctorId = doctor.id;
  }

  if (status) {
    where.status = status;
  }

  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        patient: {
          select: { id: true, name: true, email: true, phone: true, avatar: true },
        },
        doctor: {
          include: {
            user: {
              select: { id: true, name: true, email: true, phone: true, avatar: true },
            },
          },
        },
      },
      orderBy: [{ date: "asc" }, { priorityRank: "asc" }, { createdAt: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.appointment.count({ where }),
  ]);

  const withQueue = await enrichAppointmentsWithQueue(appointments);

  return NextResponse.json({
    success: true,
    data: withQueue,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export async function createAppointment(request: NextRequest, session: { userId: string }) {
  const body = await request.json();
  const validation = appointmentSchema.safeParse(body);

  if (!validation.success) {
    return fail(validation.error.issues[0].message, 400);
  }

  const data = validation.data;
  const appointmentType = data.isEmergency ? "EMERGENCY" : data.appointmentType;
  const priorityRank = resolvePriorityRank(appointmentType);

  const doctor = await prisma.doctor.findUnique({
    where: { id: data.doctorId },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
  });

  if (!doctor || !doctor.isApproved) {
    return fail("Doctor not available", 404);
  }

  const createdAt = new Date();
  const queueMetrics = await getQueueMetricsForAppointment({
    doctorId: data.doctorId,
    date: data.date,
    createdAt,
    priorityRank,
  });

  const appointment = await prisma.appointment.create({
    data: {
      patientId: session.userId,
      doctorId: data.doctorId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      consultationType: data.consultationType,
      appointmentType,
      priorityRank,
      queuePositionSnapshot: queueMetrics.queueNumber,
      estimatedWaitMinutes: queueMetrics.estimatedWaitMinutes,
      notes: data.notes || null,
      symptoms: data.symptoms || null,
      isEmergency: appointmentType === "EMERGENCY",
      createdAt,
    },
    include: {
      doctor: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  await createAppointmentBookedNotifications({
    appointmentId: appointment.id,
    patientId: session.userId,
    doctorUserId: doctor.userId,
    doctorName: doctor.user.name,
    date: appointment.date,
    startTime: appointment.startTime,
  });

  return ok(
    {
      ...appointment,
      queueNumber: queueMetrics.queueNumber,
      estimatedWaitMinutes: queueMetrics.estimatedWaitMinutes,
    },
    { status: 201, message: "Appointment booked successfully!" }
  );
}

export async function updateAppointmentStatus(
  request: NextRequest,
  session: { userId: string; role: string },
  id: string
) {
  const body = await request.json();
  const { status } = body;

  if (!["CONFIRMED", "CANCELLED", "COMPLETED"].includes(status)) {
    return fail("Invalid status", 400);
  }

  const appointment = await prisma.appointment.findUnique({
    where: { id },
    include: { doctor: true },
  });

  if (!appointment) {
    return fail("Appointment not found", 404);
  }

  const isPatient = appointment.patientId === session.userId;
  const isDoctor = appointment.doctor.userId === session.userId;
  const isAdmin = session.role === "ADMIN";

  if (!isPatient && !isDoctor && !isAdmin) {
    return fail("Unauthorized", 403);
  }

  if (isPatient && status !== "CANCELLED") {
    return fail("Patients can only cancel appointments", 403);
  }

  const updated = await prisma.appointment.update({
    where: { id },
    data: { status },
  });

  return ok(updated, { message: `Appointment ${status.toLowerCase()} successfully` });
}
