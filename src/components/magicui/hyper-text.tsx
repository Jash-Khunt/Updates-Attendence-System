"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface HyperTextProps {
  children: string
  className?: string
  animateOnScroll?: boolean
  delay?: number
}

export function HyperText({ children, className, animateOnScroll = false, delay = 0 }: HyperTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"

  const animateText = () => {
    if (isAnimating || hasAnimated) return
    setIsAnimating(true)

    const targetText = children
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex <= targetText.length) {
        const correctPart = targetText.slice(0, currentIndex)
        const randomPart = Array.from(
          { length: Math.max(0, targetText.length - currentIndex) },
          () => characters[Math.floor(Math.random() * characters.length)],
        ).join("")

        setDisplayText(correctPart + randomPart)

        if (currentIndex === targetText.length) {
          setTimeout(() => {
            setDisplayText(targetText)
            setIsAnimating(false)
            setHasAnimated(true)
          }, 1000)
          clearInterval(interval)
        }

        currentIndex++
      }
    }, 50)
  }

  useEffect(() => {
    if (!animateOnScroll) {
      setTimeout(() => animateText(), delay)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setTimeout(() => animateText(), delay)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [animateOnScroll, delay, hasAnimated])

  return (
    <div ref={ref} className={cn("font-mono", className)} onMouseEnter={() => !animateOnScroll && animateText()}>
      {displayText || children}
    </div>
  )
}
