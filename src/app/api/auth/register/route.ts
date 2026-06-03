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
import { registerSchema, sanitizePayload } from "@/lib/schemas";
import { createSession } from "@/server/services/session-service";
import { logAuditEvent } from "@/lib/audit-log";
import { apiError } from "@/app/api/error-handler";
import { randomUUID } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 1. Zod input validation BEFORE touches DB
    const validated = registerSchema.parse(body);

    // 2. Escape user inputs recursively to mitigate XSS injections
    const cleanInput = sanitizePayload(validated);

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
      addressLine1,
      landmark,
      pincode,
      city,
      state,
      latitude,
      longitude,
    } = cleanInput;

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
        addressLine1,
        landmark: landmark || null,
        pincode,
        city,
        state,
        latitude: latitude || null,
        longitude: longitude || null,
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
          latitude: latitude || null,
          longitude: longitude || null,
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
          address: addressLine1 + (landmark ? " (Landmark: " + landmark + ")" : ""),
          pincode: pincode || "",
          rating: 4.5,
          totalReviews: 0,
          isApproved: false,
          latitude: latitude || null,
          longitude: longitude || null,
        },
      });
    }

    if (role === "HOSPITAL") {
      await prisma.hospital.create({
        data: {
          userId: user.id,
          name: name,
          address: addressLine1 + (landmark ? " (Landmark: " + landmark + ")" : ""),
          city: city || "",
          state: state || "",
          rating: 4.5,
          totalReviews: 0,
          specialties: [],
        },
      });
    }

    // 3. Pre-generate Session ID for database-backed revocation
    const sessionId = randomUUID();

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      isVerified: user.isVerified,
      sessionId, // Embedded for session cookies verification
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    const ipAddress = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? null;
    const userAgent = request.headers.get("user-agent") ?? null;

    // 4. Persist the session to database with 8-hour TTL limits
    await createSession({
      id: sessionId,
      userId: user.id,
      refreshToken,
      ipAddress,
      userAgent,
    });

    await logAuditEvent({
      userId: user.id,
      action: "REGISTER",
      resourceId: user.id,
      resourceType: "user",
      ipAddress,
      userAgent,
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
            : role === "HOSPITAL"
            ? "Registration successful! Your hospital profile is pending verification."
            : "Registration successful!",
      },
      { status: 201 }
    );

    response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, getAccessTokenCookieOptions());
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, getRefreshTokenCookieOptions());
    return response;
  } catch (error) {
    return apiError(error);
  }
}

