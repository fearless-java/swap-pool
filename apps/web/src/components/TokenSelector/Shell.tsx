"use client"

import { ReactNode } from "react"

interface ShellProps {
  children: ReactNode
  className?: string
}

export function Shell({ children, className = "" }: ShellProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-xl overflow-hidden w-[420px] max-h-[520px] ${className}`}
    >
      {children}
    </div>
  )
}

interface HeaderProps {
  title: string
  onClose?: () => void
}

export function Header({ title, onClose }: HeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
      <h2 className="font-semibold text-neutral-900">{title}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
