"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface MagicCardProps {
  children: ReactNode
  className?: string
  gradientColor?: string
}

export function MagicCard({ children, className, gradientColor = "#00ff41" }: MagicCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-green-400/30 bg-black/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-green-400 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,255,65,0.1) 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-green-500/5 to-green-500/10" />
      <div className="relative z-10">{children}</div>

      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 hover:opacity-100">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-green-400/20 to-transparent animate-pulse" />
      </div>
    </div>
  )
}
