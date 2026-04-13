import { NextResponse } from "next/server"
import { getTokenPrices } from "@/lib/api/coingecko"
import { createPriceCache, getCachedPrices } from "@/lib/cache/price"

// Module-level cache instance
// In serverless environments (Vercel, AWS Lambda), this cache persists
// across invocations within the same execution context for ~30 seconds (TTL).
// This is a common pattern to reduce API calls and improve performance.
const cache = createPriceCache()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coinIds = searchParams.get("ids")?.split(",") || []
  const currencies = searchParams.get("currencies")?.split(",") || ["usd"]

  if (coinIds.length === 0) {
    return NextResponse.json({ error: "No coin IDs provided" }, { status: 400 })
  }

  // Try to get from cache first
  const cached = getCachedPrices(cache, coinIds)
  if (cached) {
    return NextResponse.json({
      data: cached,
      source: "cache",
      timestamp: Date.now(),
    })
  }

  // Fetch from CoinGecko
  try {
    const prices = await getTokenPrices(coinIds, currencies)

    // Store in cache
    cache.set(coinIds.join(","), prices)

    return NextResponse.json({
      data: prices,
      source: "coingecko",
      timestamp: Date.now(),
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 })
  }
}
