import { NextResponse } from "next/server";
import { checkSymptoms } from "@/server/controllers/ai-controller";

export async function POST(request: Request) {
  try {
    return await checkSymptoms(request);
  } catch (error) {
    console.error("Symptom checker error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
