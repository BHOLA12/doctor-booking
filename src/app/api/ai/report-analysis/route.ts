import { NextResponse } from "next/server";
import { analyzeReport } from "@/server/controllers/ai-controller";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return await analyzeReport(request);
  } catch (error) {
    console.error("Report analysis error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
