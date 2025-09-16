"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"

export function InteractiveLogo() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [pulseActive, setPulseActive] = useState(false)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isHovered || isTouched) {
      const pulseInterval = setInterval(() => {
        setPulseActive(true)
        setTimeout(() => setPulseActive(false), 200)
      }, 1000)
      return () => clearInterval(pulseInterval)
    }
  }, [isHovered, isTouched])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (logoRef.current) {
        const rect = logoRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        setMousePosition({
          x: (e.clientX - centerX) / 25,
          y: (e.clientY - centerY) / 25,
        })
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (logoRef.current && e.touches.length > 0) {
        const rect = logoRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const touch = e.touches[0]

        setMousePosition({
          x: (touch.clientX - centerX) / 25,
          y: (touch.clientY - centerY) / 25,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  const handleTouchStart = () => {
    setIsTouched(true)
    setIsHovered(true)
  }

  const handleTouchEnd = () => {
    setIsTouched(false)
    setTimeout(() => setIsHovered(false), 300)
  }

  return (
    <div
      ref={logoRef}
      className="relative z-10 flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`relative transition-all duration-500 ease-out ${
          isHovered || isTouched ? "scale-110" : "scale-100"
        } ${pulseActive ? "animate-pulse" : ""}`}
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(${isHovered || isTouched ? 1.1 : 1})`,
          filter:
            isHovered || isTouched
              ? "drop-shadow(0 0 25px #00ffcc) drop-shadow(0 0 50px rgba(0,255,204,0.5))"
              : "drop-shadow(0 0 5px rgba(0,255,204,0.2))",
        }}
      >
        <div
          className={`absolute inset-0 rounded-lg transition-all duration-500 ${
            isHovered || isTouched ? "opacity-80" : "opacity-20"
          } ${pulseActive ? "scale-125" : "scale-120"}`}
          style={{
            background: "radial-gradient(circle, rgba(0,255,204,0.3) 0%, rgba(255,0,127,0.1) 50%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />

        {(isHovered || isTouched) && (
          <div
            className="absolute inset-0 rounded-lg opacity-40 animate-pulse"
            style={{
              background: "radial-gradient(circle, rgba(255,0,127,0.2) 0%, transparent 60%)",
              filter: "blur(30px)",
              transform: "scale(1.4)",
            }}
          />
        )}

        {/* Main logo */}
        <div className="relative">
          <Image
            src="/logo-transparent.png"
            alt="UPDATES 2K25"
            width={500}
            height={350}
            className={`transition-all duration-500 ${isHovered || isTouched ? "brightness-110" : "brightness-100"}`}
            priority
          />

          {(isHovered || isTouched) && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="text-primary font-mono text-xs opacity-60 absolute top-2 left-2 animate-pulse drop-shadow-[0_0_10px_rgba(0,255,204,0.8)]">
                {"> SYSTEM ACTIVE"}
              </div>
              <div className="text-secondary font-mono text-xs opacity-50 absolute bottom-2 right-2 animate-bounce">
                {"[ONLINE]"}
              </div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-ping opacity-60" />
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-secondary rounded-full animate-ping opacity-60" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
