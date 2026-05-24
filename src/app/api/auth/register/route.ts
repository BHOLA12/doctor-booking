import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { createSession } from "@/server/services/session-service";
import { logAuditEvent } from "@/server/services/audit-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      phone,
      role,
      avatar,
      specialization,
      experience,
      licenseNumber,
      degree,
      college,
      experienceHospitals,
      currentHospitalName,
      ownerName,
      pharmacistName,
      pharmacistRegNo,
      dl20,
      dl21,
      gstin,
      address,
      pincode,
    } = validation.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: role || "PATIENT",
        avatar: avatar || null,
        isVerified: role === "PATIENT",
      },
    });

    if (role === "DOCTOR" || role === "PATHOLOGIST") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          specialization: specialization || (role === "PATHOLOGIST" ? "Pathologist" : "General Physician"),
          experience: experience ?? 0,
          licenseNumber: licenseNumber || null,
          fees: 500,
          isApproved: false,
          degree: degree || null,
          college: college || null,
          experienceHospitals: experienceHospitals || null,
          currentHospitalName: currentHospitalName || null,
        },
      });
    }

    if (role === "PHARMACY") {
      await prisma.pharmacy.create({
        data: {
          userId: user.id,
          storeName: name,
          ownerName: ownerName || "",
          pharmacistName: pharmacistName || "",
          pharmacistRegNo: pharmacistRegNo || "",
          dl20: dl20 || "",
          dl21: dl21 || "",
          gstin: gstin || "",
          address: address || "",
          pincode: pincode || "",
          rating: 4.5,
          totalReviews: 0,
          isApproved: false,
        },
      });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      isVerified: user.isVerified,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? undefined;

    await createSession({
      userId: user.id,
      refreshToken,
      ipAddress,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    await logAuditEvent({
      userId: user.id,
      action: "REGISTER",
      entity: "User",
      entityId: user.id,
      ipAddress,
      userAgent: request.headers.get("user-agent") ?? undefined,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        message:
          role === "DOCTOR" || role === "PATHOLOGIST"
            ? "Registration successful! Your provider account is pending approval."
            : role === "PHARMACY"
            ? "Registration successful! Your pharmacy is pending verification."
            : "Registration successful!",
      },
      { status: 201 }
    );

    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getAccessTokenCookieOptions());
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, getRefreshTokenCookieOptions());
    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
