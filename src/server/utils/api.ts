import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: { status?: number; message?: string }) {
  return NextResponse.json(
    {
      success: true,
      data,
      message: init?.message,
    },
    { status: init?.status ?? 200 }
  );
}

export function fail(error: string, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  );
}
