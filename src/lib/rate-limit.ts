import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_URL;
const redisToken = process.env.UPSTASH_REDIS_TOKEN;

if (!redisUrl || !redisToken) {
  console.warn("⚠️ Upstash Redis environment variables missing. Rate limiting will run simulated fallback.");
}

// Edge-compatible Upstash Redis connection client
export const redis = new Redis({
  url: redisUrl || "https://mock-redis.upstash.io",
  token: redisToken || "mock",
});

// Auth Limiter: 5 requests per 15 minutes per IP
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "@upstash/ratelimit:auth",
});

// Search Limiter: 30 requests per minute per IP
export const searchLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit:search",
});

// General API Limiter: 100 requests per minute per user/IP
export const generalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit:api",
});
