import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCached, setCached, buildCacheKey } from "@/lib/search-cache";
import { searchMedicines, searchLabTests, searchDietPlans } from "@/lib/fuse-indexes";

export const dynamic = "force-dynamic";

export type SearchCategory = "all" | "doctors" | "medicines" | "lab-tests" | "nutrition";

type DoctorResult = {
  id: string;
  name: string;
  specialization: string;
  city: string;
  rating: number;
  fees: number;
  experience: number;
};

const PAGE_SIZES: Record<SearchCategory, number> = {
  all: 5,       // 5 per category in multi-mode
  doctors: 20,
  medicines: 20,
  "lab-tests": 20,
  nutrition: 20,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get("q") || "").trim();
    const category = (searchParams.get("category") || "all") as SearchCategory;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = parseInt(searchParams.get("limit") || String(PAGE_SIZES[category]));

    if (!query) {
      return NextResponse.json({
        query: "",
        category,
        results: { doctors: [], medicines: [], labTests: [], dietPlans: [] },
        total: 0,
        page: 1,
        hasMore: false,
      });
    }

    // ── Cache key ──
    const cacheKey = buildCacheKey("search", category, query, `p${page}`, `l${limit}`);
    const cached = getCached<object>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, fromCache: true });
    }

    // ── Fetch by category ──
    let doctors: DoctorResult[] = [];
    let medicines = [] as ReturnType<typeof searchMedicines>;
    let labTests = [] as ReturnType<typeof searchLabTests>;
    let dietPlans = [] as ReturnType<typeof searchDietPlans>;
    let total = 0;
    let hasMore = false;

    const doctorLimit = category === "all" ? PAGE_SIZES.all : limit;
    const staticLimit = category === "all" ? PAGE_SIZES.all : limit;

    // Doctors — DB with cache
    if (category === "all" || category === "doctors") {
      const doctorCacheKey = buildCacheKey("doctors", query, `p${page}`, `l${doctorLimit}`);
      let doctorData = getCached<{ rows: DoctorResult[]; count: number }>(doctorCacheKey);

      if (!doctorData) {
        const qLower = query.toLowerCase();
        const [rows, count] = await Promise.all([
          prisma.doctor.findMany({
            where: {
              isApproved: true,
              OR: [
                { specialization: { contains: query, mode: "insensitive" } },
                { clinicName: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { user: { name: { contains: query, mode: "insensitive" } } },
              ],
            },
            select: {
              id: true,
              specialization: true,
              city: true,
              rating: true,
              fees: true,
              experience: true,
              user: { select: { name: true } },
            },
            orderBy: [{ rating: "desc" }, { experience: "desc" }],
            skip: (page - 1) * doctorLimit,
            take: doctorLimit,
          }),
          prisma.doctor.count({
            where: {
              isApproved: true,
              OR: [
                { specialization: { contains: query, mode: "insensitive" } },
                { clinicName: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { user: { name: { contains: query, mode: "insensitive" } } },
              ],
            },
          }),
        ]);

        doctorData = {
          rows: rows.map((d) => ({
            id: d.id,
            name: d.user.name,
            specialization: d.specialization,
            city: d.city,
            rating: d.rating,
            fees: d.fees,
            experience: d.experience,
          })),
          count,
        };
        setCached(doctorCacheKey, doctorData, 60); // 60s TTL
      }

      doctors = doctorData.rows;
      if (category === "doctors") {
        total = doctorData.count;
        hasMore = page * doctorLimit < doctorData.count;
      }
    }

    // Static data — Fuse.js (no DB, no cache needed — already in-memory)
    if (category === "all" || category === "medicines") {
      medicines = searchMedicines(query, staticLimit);
      if (category === "medicines") {
        total = medicines.length;
        hasMore = false;
      }
    }

    if (category === "all" || category === "lab-tests") {
      labTests = searchLabTests(query, staticLimit);
      if (category === "lab-tests") {
        total = labTests.length;
        hasMore = false;
      }
    }

    if (category === "all" || category === "nutrition") {
      dietPlans = searchDietPlans(query, staticLimit);
      if (category === "nutrition") {
        total = dietPlans.length;
        hasMore = false;
      }
    }

    if (category === "all") {
      total = doctors.length + medicines.length + labTests.length + dietPlans.length;
    }

    const response = {
      query,
      category,
      results: { doctors, medicines, labTests, dietPlans },
      total,
      page,
      hasMore,
      fromCache: false,
    };

    // Cache the full response for 60s
    setCached(cacheKey, response, 60);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
