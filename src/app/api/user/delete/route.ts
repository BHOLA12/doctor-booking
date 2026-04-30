import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete the user. Cascade delete in schema will handle related records.
    await prisma.user.delete({
      where: { id: session.userId },
    });

    const response = NextResponse.json(
      { success: true, message: "Account deleted successfully" },
      { status: 200 }
    );

    // Clear the auth cookie
    response.cookies.delete("token");

    return response;
  } catch (error: any) {
    console.error("Account deletion error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
