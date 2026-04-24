import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPrescriptionSuggestion } from "@/server/controllers/ai-controller";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "DOCTOR") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return await getPrescriptionSuggestion(request);
  } catch (error) {
    console.error("Prescription suggestion error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
