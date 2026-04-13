"use client";

import Link from "next/link";
import { Button } from "@sushiswap/ui/components";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black p-8">
      {/* Logo / Brand */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-brand-primary dark:text-brand-primary">
          SUSHI
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          Swap & Pool Interface
        </p>
      </div>

      {/* Navigation Cards - No borders, just colors */}
      <div className="grid w-full max-w-lg gap-6 sm:grid-cols-2">
        {/* Swap Card */}
        <Link href="/swap" className="group">
          <div className="flex flex-col items-center justify-center rounded-xl bg-brand-secondary p-10 transition-all group-hover:scale-105 dark:bg-brand-secondary/90">
            <span className="text-5xl mb-3">🔄</span>
            <span className="text-2xl font-bold text-black dark:text-black">Swap</span>
            <span className="text-sm text-black/60 mt-2 dark:text-black/60">Exchange tokens instantly</span>
          </div>
        </Link>

        {/* Pool Card */}
        <Link href="/pool" className="group">
          <div className="flex flex-col items-center justify-center rounded-xl bg-brand-accent p-10 transition-all group-hover:scale-105 dark:bg-brand-accent/90">
            <span className="text-5xl mb-3">🏊</span>
            <span className="text-2xl font-bold text-black dark:text-black">Pool</span>
            <span className="text-sm text-black/60 mt-2 dark:text-black/60">Provide liquidity & earn</span>
          </div>
        </Link>
      </div>

      {/* Footer - Minimal thin borders */}
      <div className="mt-16 flex gap-4">
        <a
          href="https://sushi.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-black dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Documentation
        </a>
        <a
          href="https://github.com/sushi-labs/sushiswap"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-black dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          GitHub
        </a>
      </div>
    </div>
  );
}
