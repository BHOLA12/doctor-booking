import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const order = await prisma.medicineOrder.findUnique({
      where: { id },
      include: {
        pharmacy: { select: { storeName: true, address: true, pincode: true } },
        user: { select: { name: true, phone: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Only allow the owner (or admin/pharmacy) to view
    if (order.userId !== session.userId && session.role !== "ADMIN" && session.role !== "PHARMACY") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { status } = await request.json();
    const validStatuses = ["CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    // Retrieve order to check authorization
    const orderExists = await prisma.medicineOrder.findUnique({ where: { id } });
    if (!orderExists) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // Only admin/pharmacy can update order stages; user can only cancel their own order
    if (session.role !== "ADMIN" && session.role !== "PHARMACY" && !(status === "CANCELLED" && orderExists.userId === session.userId)) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const order = await prisma.medicineOrder.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
