import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  listMedicalReports,
  uploadMedicalReport,
} from "@/server/controllers/report-controller";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "PATIENT") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return await listMedicalReports(session.userId);
  } catch (error) {
    console.error("Reports list error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "PATIENT") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return await uploadMedicalReport(request, session.userId);
  } catch (error) {
    console.error("Report upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
