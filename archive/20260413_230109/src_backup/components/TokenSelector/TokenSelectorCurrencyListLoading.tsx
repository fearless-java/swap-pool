"use client"

export function TokenSelectorCurrencyListLoading() {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3">
          {/* Logo skeleton */}
          <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />

          {/* Symbol and name skeleton */}
          <div className="flex-1">
            <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse mb-1" />
            <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse" />
          </div>

          {/* Balance skeleton */}
          <div className="text-right">
            <div className="h-4 w-16 bg-neutral-200 rounded animate-pulse mb-1" />
            <div className="h-3 w-12 bg-neutral-200 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
