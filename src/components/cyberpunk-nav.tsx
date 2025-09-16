"use client"

import { useState } from "react"
import Link from "next/link"

const navItems = [
  { name: "HOME", href: "/#home" },
  { name: "ABOUT", href: "/#about" },
  { name: "UPDATES", href: "/#updates" },
  { name: "EVENTS", href: "/events" },
]

export function CyberpunkNav() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-primary font-mono text-lg font-bold hover:text-secondary transition-colors">
            {"<UPDATES/>"}
          </Link>

          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-mono text-sm transition-all duration-300 relative ${
                  hoveredItem === item.name ? "text-primary" : "text-foreground hover:text-primary"
                }`}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.name}
                {hoveredItem === item.name && <div className="absolute -inset-1 bg-primary/10 blur-sm -z-10 rounded" />}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
