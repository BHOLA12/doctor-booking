import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { reviewSchema, sanitizePayload } from "@/lib/schemas";
import { apiError, ForbiddenError, UnauthorizedError } from "@/app/api/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: "doctorId is required" },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    // 1. Zod input checks BEFORE touches DB
    const validated = reviewSchema.parse(body);

    // 2. Escape user inputs recursively for XSS protection
    const cleanInput = sanitizePayload(validated);
    const { doctorId, rating, comment } = cleanInput;

    // Check if user already reviewed this doctor
    const existing = await prisma.review.findUnique({
      where: {
        patientId_doctorId: {
          patientId: session.userId,
          doctorId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "You have already reviewed this doctor" },
        { status: 409 }
      );
    }

    // 3. Database Transaction: create review and update doctor avg stats concurrently
    const review = await prisma.$transaction(async (tx) => {
      const createdReview = await tx.review.create({
        data: {
          patientId: session.userId,
          doctorId,
          rating,
          comment: comment || null,
        },
      });

      const allReviews = await tx.review.findMany({
        where: { doctorId },
        select: { rating: true },
      });

      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await tx.doctor.update({
        where: { id: doctorId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          totalReviews: allReviews.length,
        },
      });

      return createdReview;
    });

    return NextResponse.json(
      { success: true, data: review, message: "Review submitted!" },
      { status: 201 }
    );
  } catch (error) {
    return apiError(error);
  }
}
