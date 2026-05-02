import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCached, setCached, buildCacheKey } from "@/lib/search-cache";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city           = searchParams.get("city")           || "";
    const specialization = searchParams.get("specialization") || "";
    const rawSearch      = (searchParams.get("search")        || "").trim();
    const page           = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit          = Math.min(50, parseInt(searchParams.get("limit") || "12"));
    const sortBy         = searchParams.get("sortBy") || "experience_reviews";

    // ── Short-circuit: ignore search strings < 2 chars (avoids wasteful DB scan) ──
    const search = rawSearch.length >= 2 ? rawSearch : "";

    // ── Cache key (all filter dimensions) ──
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

    // ── Build WHERE clause ──
    const where: Record<string, unknown> = { isApproved: true };

    // Exact enum match for specialization — hits index directly, no LIKE
    if (specialization && specialization !== "all") {
      where.specialization = { equals: specialization, mode: "insensitive" };
    }

    // City filter — startsWith is index-friendly (prefix scan) vs contains (full scan)
    if (city && city !== "all") {
      where.city = { startsWith: city, mode: "insensitive" };
    }

    // Free-text search — only triggered when >= 2 chars
    // Use startsWith on the primary display field (name via user join) for index use,
    // and contains only on secondary fields so the OR stays narrow
    if (search) {
      where.OR = [
        { user: { name: { startsWith: search, mode: "insensitive" } } },
        { specialization: { startsWith: search, mode: "insensitive" } },
        { clinicName:     { contains:   search, mode: "insensitive" } },
        { city:           { startsWith: search, mode: "insensitive" } },
        { currentHospitalName: { contains: search, mode: "insensitive" } },
      ];
    }

    // ── Sort order — all fields are indexed ──
    let orderBy: Record<string, string>[] | Record<string, string> = [];
    switch (sortBy) {
      case "rating":          orderBy = { rating: "desc" }; break;
      case "fees_low":        orderBy = { fees: "asc" };    break;
      case "fees_high":       orderBy = { fees: "desc" };   break;
      case "experience":      orderBy = { experience: "desc" }; break;
      default:                orderBy = [{ experience: "desc" }, { totalReviews: "desc" }, { rating: "desc" }];
    }

    // ── Parallel DB calls — only the columns the UI actually needs ──
    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        select: {
          id:                 true,
          specialization:     true,
          city:               true,
          rating:             true,
          fees:               true,
          experience:         true,
          totalReviews:       true,
          consultationType:   true,
          bio:                true,
          clinicName:         true,
          degree:             true,          // needed for qualification pill on card
          currentHospitalName: true,         // needed for hospital display on card
          user: {
            select: { id: true, name: true, avatar: true },
          },
          hospital: {
            select: { id: true, name: true }, // needed for doctor.hospital?.name fallback
          },
          slots: {
            select: { id: true, dayOfWeek: true, startTime: true, endTime: true, isActive: true },
            where: { isActive: true },
          },
        },
        orderBy,
        skip:  (page - 1) * limit,
        take:  limit,
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

    // Cache 90s for non-search browsing, 30s for active searches (fresher results)
    setCached(cacheKey, result, search ? 30 : 90);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Doctors list error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
