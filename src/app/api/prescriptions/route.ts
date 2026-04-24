import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { listPrescriptions, savePrescription } from "@/server/controllers/prescription-controller";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return await listPrescriptions(session);
  } catch (error) {
    console.error("Prescriptions list error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return await savePrescription(request, session);
  } catch (error) {
    console.error("Prescription save error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
