import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCached, setCached, buildCacheKey } from "@/lib/search-cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "";
    const specialization = searchParams.get("specialization") || "";
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const sortBy = searchParams.get("sortBy") || "experience_reviews";

    // ── Cache key (includes all filter dimensions) ──
    const cacheKey = buildCacheKey(
      "doctors-list",
      search,
      specialization,
      city,
      sortBy,
      `p${page}`,
      `l${limit}`
    );

    const cached = getCached<object>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // ── Build Prisma where clause (no raw SQL) ──
    const where: Record<string, unknown> = { isApproved: true };

    if (specialization && specialization !== "all") {
      where.specialization = { contains: specialization, mode: "insensitive" };
    }

    if (city && city !== "all") {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (search) {
      where.OR = [
        { specialization: { contains: search, mode: "insensitive" } },
        { clinicName: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // ── Sort order ──
    let orderBy: Record<string, string>[] | Record<string, string> = [];
    if (sortBy === "rating") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "fees_low") {
      orderBy = { fees: "asc" };
    } else if (sortBy === "fees_high") {
      orderBy = { fees: "desc" };
    } else if (sortBy === "experience") {
      orderBy = { experience: "desc" };
    } else {
      orderBy = [{ experience: "desc" }, { totalReviews: "desc" }, { rating: "desc" }];
    }

    // ── Run Prisma query with limited select ──
    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        select: {
          id: true,
          specialization: true,
          city: true,
          rating: true,
          fees: true,
          experience: true,
          totalReviews: true,
          consultationType: true,
          bio: true,
          clinicName: true,
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.doctor.count({ where }),
    ]);

    const result = {
      success: true,
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };

    // Cache for 60 seconds (short enough to stay fresh)
    setCached(cacheKey, result, 60);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Doctors list error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
