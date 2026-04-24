import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || "";
    const specialization = searchParams.get("specialization") || "";
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sortBy") || "experience_reviews";

    const where: Record<string, unknown> = {
      isApproved: true,
    };

    let validIds: string[] | undefined;

    if (city && city !== "all") {
      const cityLower = city.toLowerCase();
      const rawIds: { id: string }[] = await prisma.$queryRaw`SELECT id FROM Doctor WHERE LOWER(city) LIKE '%' || ${cityLower} || '%'`;
      validIds = rawIds.map((r) => r.id);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      const searchRawIds: { id: string }[] = await prisma.$queryRaw`
        SELECT d.id 
        FROM Doctor d 
        JOIN User u ON d.userId = u.id 
        WHERE LOWER(u.name) LIKE '%' || ${searchLower} || '%' 
           OR LOWER(d.specialization) LIKE '%' || ${searchLower} || '%' 
           OR LOWER(d.clinicName) LIKE '%' || ${searchLower} || '%'
      `;
      const searchIds = searchRawIds.map((r) => r.id);
      
      if (validIds) {
        validIds = validIds.filter(id => searchIds.includes(id));
      } else {
        validIds = searchIds;
      }
    }

    if (validIds !== undefined) {
      where.id = { in: validIds };
    }

    if (specialization && specialization !== "all") {
      where.specialization = { contains: specialization };
    }

    let orderBy: Record<string, string>[] | Record<string, string> = {};
    if (sortBy === "experience_reviews") {
      orderBy = [{ experience: "desc" }, { totalReviews: "desc" }, { rating: "desc" }];
    } else if (sortBy === "rating") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "fees_low") {
      orderBy = { fees: "asc" };
    } else if (sortBy === "fees_high") {
      orderBy = { fees: "desc" };
    } else if (sortBy === "experience") {
      orderBy = { experience: "desc" };
    } else {
      orderBy = [{ experience: "desc" }, { totalReviews: "desc" }];
    }

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
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

    return NextResponse.json({
      success: true,
      data: doctors,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Doctors list error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
