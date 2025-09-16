"use client"

import { useState, useEffect } from "react"

interface DecryptionTextProps {
  text: string
  className?: string
  delay?: number
}

export function DecryptionText({ text, className = "", delay = 0 }: DecryptionTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(false)

  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDecrypting(true)
      let currentIndex = 0

      const decryptInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          const decrypted = text.slice(0, currentIndex)
          const encrypted = Array.from(
            { length: text.length - currentIndex },
            () => chars[Math.floor(Math.random() * chars.length)],
          ).join("")

          setDisplayText(decrypted + encrypted)
          currentIndex++
        } else {
          setDisplayText(text)
          setIsDecrypting(false)
          clearInterval(decryptInterval)
        }
      }, 50)

      return () => clearInterval(decryptInterval)
    }, delay)

    return () => clearTimeout(timer)
  }, [text, delay, chars])

  return <span className={`font-mono ${isDecrypting ? "text-primary" : ""} ${className}`}>{displayText || text}</span>
}
