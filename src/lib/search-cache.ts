import { Redis } from "@upstash/redis";

const redisUrl = process.env.UPSTASH_REDIS_URL;
const redisToken = process.env.UPSTASH_REDIS_TOKEN;

// Local fallback in-memory cache for development environments
class LocalCacheFallback {
  private cache = new Map<string, { value: any; expiresAt: number }>();
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: any, ttlSeconds = 60): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

const localCache = new LocalCacheFallback();

export const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;

/**
 * Retrieves a cached item. Support async Redis lookups with in-memory fallbacks.
 */
export async function getCached<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      const data = await redis.get(key);
      if (data) {
        // Upstash redis auto-parses JSON, but we check if it is string and parse
        return typeof data === "string" ? JSON.parse(data) : (data as T);
      }
      return null;
    } catch (e) {
      console.warn("⚠️ Redis get cached failure, reverting to memory fallback:", e);
    }
  }
  return localCache.get(key) as T | null;
}

/**
 * Sets a cache item with a custom time-to-live (TTL).
 */
export async function setCached<T>(key: string, value: T, ttlSeconds = 60): Promise<void> {
  if (redis) {
    try {
      await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
      return;
    } catch (e) {
      console.warn("⚠️ Redis set cached failure, reverting to memory fallback:", e);
    }
  }
  localCache.set(key, value, ttlSeconds);
}

/**
 * Deletes a specific cache item.
 */
export async function deleteCached(key: string): Promise<void> {
  if (redis) {
    try {
      await redis.del(key);
      return;
    } catch (e) {
      console.warn("⚠️ Redis delete cached failure, reverting to memory fallback:", e);
    }
  }
  localCache.delete(key);
}

/**
 * Clears caches matching a given prefix (Bust cache pattern).
 */
export async function bustCachePattern(pattern: string): Promise<void> {
  if (redis) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (e) {
      console.warn("⚠️ Redis pattern bust failure:", e);
    }
  }
}

export function buildCacheKey(...parts: (string | number)[]): string {
  return parts.map(String).join(":").toLowerCase().trim();
}

// Backwards compatibility layer for legacy searchCache call syntax
export const searchCache = {
  delete: async (key: string) => {
    await deleteCached(key);
  }
};
