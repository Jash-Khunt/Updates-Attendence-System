"use client"

import type React from "react"
import { useState, useEffect } from "react"

interface InteractiveTextProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "heading" | "accent" | "access"
}

export function InteractiveText({ children, className = "", variant = "default" }: InteractiveTextProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    if (variant === "access" && isHovered) {
      const glitchInterval = setInterval(() => {
        setGlitchActive(true)
        setTimeout(() => setGlitchActive(false), 150)
      }, 800)
      return () => clearInterval(glitchInterval)
    }
  }, [isHovered, variant])

  const getVariantStyles = () => {
    switch (variant) {
      case "heading":
        return "hover:text-primary hover:drop-shadow-[0_0_12px_rgba(0,255,204,0.6)] transition-all duration-300 hover:scale-105"
      case "accent":
        return "hover:text-secondary hover:drop-shadow-[0_0_8px_rgba(255,0,127,0.5)] transition-all duration-300 hover:scale-102"
      case "access":
        return `hover:text-primary hover:drop-shadow-[0_0_20px_rgba(0,255,204,0.8)] hover:tracking-widest transition-all duration-500 hover:scale-110 ${
          glitchActive ? "animate-pulse text-secondary drop-shadow-[0_0_25px_rgba(255,0,127,0.9)]" : ""
        }`
      default:
        return "hover:text-foreground/90 hover:drop-shadow-[0_0_6px_rgba(0,255,204,0.4)] transition-all duration-200 hover:scale-101"
    }
  }

  const handleInteractionStart = () => {
    setIsHovered(true)
  }

  const handleInteractionEnd = () => {
    setIsHovered(false)
    setGlitchActive(false)
  }

  return (
    <span
      className={`${getVariantStyles()} ${className} cursor-default relative`}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
    >
      {variant === "access" && isHovered && (
        <>
          <span className="text-primary text-xs font-mono mr-3 animate-bounce drop-shadow-[0_0_15px_rgba(0,255,204,0.8)]">
            [ACCESS_GRANTED]
          </span>
          <span className="absolute -top-1 -left-2 text-secondary/40 text-xs animate-ping">●</span>
        </>
      )}
      {children}
      {variant === "access" && isHovered && (
        <>
          <span
            className={`text-primary text-xs font-mono ml-3 drop-shadow-[0_0_15px_rgba(0,255,204,0.8)] ${
              glitchActive ? "animate-bounce text-secondary" : "animate-pulse"
            }`}
          >
            [OK]
          </span>
          <span className="absolute -top-1 -right-2 text-secondary/40 text-xs animate-ping">●</span>
        </>
      )}
      {isHovered && (
        <span className="absolute inset-0 bg-primary/5 rounded blur-sm animate-pulse pointer-events-none" />
      )}
    </span>
  )
}
