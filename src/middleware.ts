import { NextRequest, NextResponse } from "next/server";
import { authLimiter, searchLimiter, generalLimiter } from "@/lib/rate-limit";

// Matcher configuration to intercept API calls
export const config = {
  matcher: ["/api/:path*"],
};

export async function middleware(request: NextRequest) {
  // If Upstash Redis environment variables are missing, bypass rate limiters locally (graceful degradation)
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
    return NextResponse.next();
  }

  const path = request.nextUrl.pathname;
  // Get safe client IP identifier
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";

  // 1. Auth Rate Limiter (/api/auth/login or /api/auth/register)
  if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
    const { success, limit, reset, remaining } = await authLimiter.limit(`ip:${ip}`);
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Too many registration or login attempts. Please slow down and try again.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  }

  // 2. Search Rate Limiter (/api/search or /api/doctors)
  if (path.startsWith("/api/search") || path.startsWith("/api/doctors")) {
    const { success, limit, reset, remaining } = await searchLimiter.limit(`ip:${ip}`);
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "Search queries rate limit exceeded. Please wait before searching again.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  }

  // 3. General API Rate Limiter (skip cron trigger paths)
  if (path.startsWith("/api/") && !path.startsWith("/api/cron")) {
    const { success, limit, reset, remaining } = await generalLimiter.limit(`ip:${ip}`);
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({
          success: false,
          error: "API rate limit exceeded. Please retry later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        }
      );
    }
  }

  return NextResponse.next();
}
