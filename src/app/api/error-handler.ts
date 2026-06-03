import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Custom Error classes for clean error matching
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized access. Please login.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Access denied. You do not have permissions for this resource.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  constructor(message = "Requested resource not found.") {
    super(message);
    this.name = "NotFoundError";
  }
}

/**
 * Standard API error handler. Logs detailed error trace on the server,
 * but scrubs any technical stack traces, DB credentials, or path disclosures
 * before sending a clean JSON response to clients.
 */
export function apiError(err: unknown): NextResponse {
  // Catch schema validation errors
  if (err instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid input data",
        details: err.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Catch custom authentication errors
  if (err instanceof UnauthorizedError) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 401 }
    );
  }

  // Catch custom authorization checks
  if (err instanceof ForbiddenError) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 403 }
    );
  }

  // Catch custom missing items checks
  if (err instanceof NotFoundError) {
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 404 }
    );
  }

  // Server-side logging (retained for backend debugging)
  console.error("🔥 Internal API error encountered:", err);

  // Fallback safe response for production (sanitized, zero-leak)
  return NextResponse.json(
    {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    },
    { status: 500 }
  );
}
