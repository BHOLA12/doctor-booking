import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { doctorSchema, sanitizePayload } from "@/lib/schemas";
import { getCached, setCached, searchCache } from "@/lib/search-cache";
import { assertOwnership } from "@/lib/auth-guards";
import { apiError, NotFoundError } from "@/app/api/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // ── Cache: return instantly if same doctor was recently fetched ──
    const cacheKey = `doctor-profile:${id}`;
    const cached = await getCached<object>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...(cached as object), fromCache: true });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        specialization: true,
        experience: true,
        rating: true,
        totalReviews: true,
        fees: true,
        bio: true,
        clinicName: true,
        clinicAddress: true,
        city: true,
        state: true,
        country: true,
        consultationType: true,
        degree: true,
        college: true,
        licenseNumber: true,
        experienceHospitals: true,
        currentHospitalName: true,
        isApproved: true,
        hospitalId: true,
        user: {
          select: { id: true, name: true, email: true, avatar: true, phone: true },
        },
        hospital: {
          select: {
            id: true, name: true, address: true, city: true,
            image: true, rating: true, totalReviews: true,
          },
        },
        slots: {
          where: { isActive: true },
          select: {
            id: true, dayOfWeek: true, startTime: true,
            endTime: true, isActive: true,
          },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        },
        reviews: {
          select: {
            id: true, rating: true, comment: true, createdAt: true,
            patient: { select: { id: true, name: true, avatar: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!doctor) {
      throw new NotFoundError("Doctor not found");
    }

    const result = { success: true, data: doctor };

    // Cache for 5 minutes — doctor profiles rarely change mid-session
    await setCached(cacheKey, result, 300);

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    const { id } = await params;
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) {
      throw new NotFoundError("Doctor profile not found");
    }

    // IDOR Check: verify requesting session user owns the doctor profile
    await assertOwnership(session, doctor.userId);

    const body = await request.json();
    const validation = doctorSchema.parse({
      specialization: body.specialization,
      experience: Number(body.experience),
      licenseNumber: body.licenseNumber,
      fees: Number(body.fees),
      bio: body.bio,
      clinicName: body.clinicName,
      clinicAddress: body.clinicAddress,
      city: body.city,
      state: body.state,
      country: body.country,
      consultationType: body.consultationType,
      degree: body.degree,
      college: body.college,
      experienceHospitals: body.experienceHospitals,
      currentHospitalName: body.currentHospitalName,
    });

    const cleanInput = sanitizePayload(validation);

    const updated = await prisma.doctor.update({
      where: { id },
      data: {
        specialization: cleanInput.specialization,
        experience: cleanInput.experience,
        licenseNumber: cleanInput.licenseNumber,
        fees: cleanInput.fees,
        bio: cleanInput.bio,
        clinicName: cleanInput.clinicName,
        clinicAddress: cleanInput.clinicAddress,
        city: cleanInput.city,
        state: cleanInput.state,
        country: cleanInput.country,
        consultationType: cleanInput.consultationType,
        degree: cleanInput.degree,
        college: cleanInput.college,
        experienceHospitals: cleanInput.experienceHospitals,
        currentHospitalName: cleanInput.currentHospitalName,
      },
    });

    // Also update user name if provided and clean
    if (body.name) {
      await prisma.user.update({
        where: { id: session!.userId },
        data: { name: sanitizePayload(body.name) },
      });
    }

    // Bust cached profile so next GET fetches fresh data
    await searchCache.delete(`doctor-profile:${id}`);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return apiError(error);
  }
}
