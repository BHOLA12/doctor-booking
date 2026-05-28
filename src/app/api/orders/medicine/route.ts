import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items, totalAmount, address, phone, notes, pharmacyId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: "No items in order" }, { status: 400 });
    }
    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid total amount" }, { status: 400 });
    }

    // Verify pharmacy exists if provided
    let resolvedPharmacyId: string | null = null;
    if (pharmacyId) {
      const pharmacy = await prisma.pharmacy.findUnique({ where: { id: pharmacyId } });
      resolvedPharmacyId = pharmacy ? pharmacy.id : null;
    } else {
      // Auto-assign to first available pharmacy
      const firstPharmacy = await prisma.pharmacy.findFirst({ orderBy: { createdAt: "asc" } });
      resolvedPharmacyId = firstPharmacy?.id ?? null;
    }

    const order = await prisma.medicineOrder.create({
      data: {
        userId: session.userId,
        pharmacyId: resolvedPharmacyId,
        items: items,
        totalAmount: Math.round(totalAmount),
        status: "CONFIRMED",
        address: address || null,
        phone: phone || null,
        notes: notes || null,
      },
      include: {
        pharmacy: {
          select: { storeName: true, address: true },
        },
        user: {
          select: { name: true, phone: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        itemCount: (order.items as any[]).length,
        pharmacy: order.pharmacy,
        createdAt: order.createdAt,
      },
      message: "Order placed successfully!",
    }, { status: 201 });

  } catch (error: any) {
    console.error("Medicine order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.medicineOrder.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        pharmacy: { select: { storeName: true, address: true } },
      },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
