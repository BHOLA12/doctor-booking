import { NextResponse } from "next/server";
import { analyzeReport } from "@/server/controllers/ai-controller";

export async function POST(request: Request) {
  try {
    return await analyzeReport(request);
  } catch (error) {
    console.error("Report analysis error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
