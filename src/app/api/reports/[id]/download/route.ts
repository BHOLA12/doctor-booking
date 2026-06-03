import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getPresignedDownloadUrl } from "@/lib/s3";
import { logAuditEvent } from "@/lib/audit-log";
import { apiError, ForbiddenError, NotFoundError, UnauthorizedError } from "@/app/api/error-handler";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      throw new UnauthorizedError();
    }

    const { id } = await params;
    const report = await prisma.medicalReport.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundError("Medical report not found");
    }

    // IDOR Check: patient owns the report OR role is ADMIN/DOCTOR/PATHOLOGIST
    const isPatient = report.patientId === session.userId;
    const isProvider = session.role === "DOCTOR" || session.role === "PATHOLOGIST";
    const isAdmin = session.role === "ADMIN";

    if (!isPatient && !isProvider && !isAdmin) {
      throw new ForbiddenError("You are not authorized to access this report");
    }

    // Generate secure pre-signed download link (valid for 15 minutes)
    const url = await getPresignedDownloadUrl(report.fileUrl, 900);

    // Extract headers for audit logging
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    // Log the compliance audit event
    await logAuditEvent({
      userId: session.userId,
      action: "DOWNLOAD_REPORT",
      resourceId: id,
      resourceType: "report",
      ipAddress,
      userAgent,
    });

    // Redirect user to the secure temporary S3 url
    return NextResponse.redirect(url);
  } catch (error) {
    return apiError(error);
  }
}
