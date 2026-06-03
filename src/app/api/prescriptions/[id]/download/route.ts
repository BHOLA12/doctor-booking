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
    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        doctor: {
          select: { userId: true },
        },
      },
    });

    if (!prescription) {
      throw new NotFoundError("Prescription not found");
    }

    if (!prescription.pdfUrl) {
      throw new NotFoundError("Prescription PDF file is not available");
    }

    // IDOR Check: patient owns it OR issuing doctor owns it OR admin
    const isPatient = prescription.patientId === session.userId;
    const isDoctor = prescription.doctor.userId === session.userId;
    const isAdmin = session.role === "ADMIN";

    if (!isPatient && !isDoctor && !isAdmin) {
      throw new ForbiddenError("You are not authorized to access this prescription");
    }

    // Generate pre-signed URL (15 minutes expiry)
    const url = await getPresignedDownloadUrl(prescription.pdfUrl, 900);

    // Extract headers for audit logging
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    // Log the compliance audit event
    await logAuditEvent({
      userId: session.userId,
      action: "DOWNLOAD_PRESCRIPTION",
      resourceId: id,
      resourceType: "prescription",
      ipAddress,
      userAgent,
    });

    // Redirect user to temporary pre-signed URL
    return NextResponse.redirect(url);
  } catch (error) {
    return apiError(error);
  }
}
