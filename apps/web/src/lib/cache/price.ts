/**
 * In-memory price cache with TTL
 * L1 Cache: 30 seconds TTL
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const DEFAULT_TTL = 30_000 // 30 seconds

export interface PriceCache {
  get(key: string): CacheEntry<unknown> | undefined
  set(key: string, data: unknown): void
  delete(key: string): void
  clear(): void
}

export function createPriceCache(ttl: number = DEFAULT_TTL): PriceCache {
  const cache = new Map<string, CacheEntry<unknown>>()

  return {
    get(key: string): CacheEntry<unknown> | undefined {
      const entry = cache.get(key)
      if (!entry) return undefined

      // Check if expired
      if (Date.now() - entry.timestamp > ttl) {
        cache.delete(key)
        return undefined
      }

      return entry
    },

    set(key: string, data: unknown): void {
      cache.set(key, { data, timestamp: Date.now() })
    },

    delete(key: string): void {
      cache.delete(key)
    },

    clear(): void {
      cache.clear()
    },
  }
}

export function getCachedPrices(
  cache: PriceCache,
  coinIds: string[]
): Record<string, unknown> | null {
  const key = coinIds.join(",")
  const entry = cache.get(key)
  return entry ? (entry.data as Record<string, unknown>) : null
}
