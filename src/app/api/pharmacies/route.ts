import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
      include: {
        user: {
          select: {
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: pharmacies,
    });
  } catch (error: any) {
    console.error("Failed to fetch pharmacies:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch pharmacies" },
      { status: 500 }
    );
  }
}
