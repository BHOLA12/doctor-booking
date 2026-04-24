import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

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
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = reviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { doctorId, rating, comment } = validation.data;

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

    const review = await prisma.review.create({
      data: {
        patientId: session.userId,
        doctorId,
        rating,
        comment: comment || null,
      },
    });

    // Update doctor's average rating
    const allReviews = await prisma.review.findMany({
      where: { doctorId },
      select: { rating: true },
    });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: allReviews.length,
      },
    });

    return NextResponse.json(
      { success: true, data: review, message: "Review submitted!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review create error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
