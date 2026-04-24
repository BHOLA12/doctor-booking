import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken, getTokenCookieOptions } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";

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

    const { name, email, password, phone, role, avatar, specialization, experience, licenseNumber } = validation.data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: role || "PATIENT",
        avatar: avatar || null,
        isVerified: true, // Auto-verify all users for demo purposes
      },
    });

    // If registering as doctor, create doctor profile placeholder
    if (role === "DOCTOR") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          specialization: specialization || "General Physician",
          experience: experience || 0,
          licenseNumber: licenseNumber || null,
          fees: 500,
          isApproved: false,
        },
      });
    }

    // Generate JWT
    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const cookieOptions = getTokenCookieOptions();
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
        message: "Registration successful!",
      },
      { status: 201 }
    );

    response.cookies.set(cookieOptions.name, token, cookieOptions);
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
