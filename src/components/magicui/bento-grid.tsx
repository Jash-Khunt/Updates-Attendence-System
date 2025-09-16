"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BentoGridProps {
  children: ReactNode
  className?: string
}

interface BentoCardProps {
  name: string
  className: string
  background: ReactNode
  Icon: any
  description: string
  href: string
  cta: string
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return <div className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-4", className)}>{children}</div>
}

export function BentoCard({ name, className, background, Icon, description, href, cta }: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        "bg-gray-900/50 border border-green-400/30 hover:border-green-400 transition-all duration-300",
        "shadow-[0_0_20px_rgba(0,255,65,0.1)] hover:shadow-[0_0_30px_rgba(0,255,65,0.2)]",
        className,
      )}
    >
      <div>{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
        <Icon className="h-12 w-12 origin-left transform-gpu text-green-400 transition-all duration-300 ease-in-out group-hover:scale-75" />
        <h3 className="text-xl font-semibold text-green-400 font-mono">{name}</h3>
        <p className="max-w-lg text-green-300/70 font-mono text-sm">{description}</p>
      </div>

      <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <button className="pointer-events-auto bg-green-500 text-black px-4 py-2 rounded font-mono text-sm hover:bg-green-400 transition-colors">
          {cta}
        </button>
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-green-400/[.15]" />
    </div>
  )
}
