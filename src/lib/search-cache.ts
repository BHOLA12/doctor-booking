/**
 * Simple in-memory LRU cache for search results.
 * Max 200 entries, configurable TTL per entry.
 * Falls back gracefully — no external dependency needed.
 */

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly maxSize: number;

  constructor(maxSize = 200) {
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.value;
  }

  set(key: string, value: T, ttlSeconds = 60): void {
    if (this.cache.has(key)) this.cache.delete(key);
    if (this.cache.size >= this.maxSize) {
      // Evict the oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// Singleton — shared across all API route invocations in the same Node process
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalCache = globalThis as typeof globalThis & { __searchCache?: LRUCache<any> };
if (!globalCache.__searchCache) {
  globalCache.__searchCache = new LRUCache(200);
}

export const searchCache = globalCache.__searchCache as LRUCache<unknown>;

/** Convenience wrapper */
export function getCached<T>(key: string): T | null {
  return searchCache.get(key) as T | null;
}

export function setCached<T>(key: string, value: T, ttlSeconds = 60): void {
  searchCache.set(key, value, ttlSeconds);
}

export function buildCacheKey(...parts: (string | number)[]): string {
  return parts.map(String).join(":").toLowerCase().trim();
}
