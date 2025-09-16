"use client"

import { useState } from "react"
import Link from "next/link"

interface InteractiveEventProps {
  title: string
  date: string
  description: string
  href: string
}

export default function InteractiveEvent({ title, date, description, href }: InteractiveEventProps) {
  const [isFlashing, setIsFlashing] = useState(false)
  const [isTouched, setIsTouched] = useState(false)

  const handleTouch = () => {
    setIsFlashing(true)
    setIsTouched(true)
    setTimeout(() => {
      setIsFlashing(false)
      setIsTouched(false)
    }, 600)
  }

  return (
    <Link href={href} className="block">
      <div
        className={`relative p-6 border border-cyan-900/30 rounded-lg bg-black/40 backdrop-blur-sm 
                   hover:border-cyan-500/50 transition-all duration-300 cursor-pointer overflow-hidden
                   hover:shadow-lg hover:shadow-cyan-500/20 group
                   ${isFlashing ? "border-cyan-400 bg-cyan-400/10 animate-flash-touch" : ""}`}
        onClick={handleTouch}
        onTouchStart={handleTouch}
      >
        {isFlashing && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 via-blue-400/20 to-cyan-400/30 animate-flash-touch"></div>
            <div className="absolute inset-0 bg-cyan-400/10 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          </>
        )}

        <div className="relative overflow-hidden mb-3 h-7">
          <h3
            className={`text-lg font-semibold whitespace-nowrap transition-all duration-300
                         bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent
                         animate-marquee-enhanced group-hover:animation-paused animate-gradient
                         ${isTouched ? "animate-text-glow" : ""}`}
          >
            {title} • {title} • {title} • {title} • {title}
          </h3>
        </div>

        <p
          className={`text-sm mb-3 font-mono transition-all duration-300
                      bg-gradient-to-r from-cyan-600 via-cyan-500 to-cyan-600 bg-clip-text text-transparent
                      ${isTouched ? "animate-gradient" : ""}`}
        >
          {date}
        </p>

        <p
          className={`text-gray-300 text-sm leading-relaxed transition-all duration-300
                      ${isTouched ? "text-gray-200 drop-shadow-sm" : ""}`}
        >
          {description}
        </p>

        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        ></div>

        <div
          className={`absolute top-2 right-2 w-2 h-2 rounded-full transition-all duration-300
                        ${isTouched ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-ping" : "bg-cyan-900/50"}`}
        ></div>
        <div
          className={`absolute bottom-2 left-2 w-2 h-2 rounded-full transition-all duration-300
                        ${isTouched ? "bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-ping" : "bg-cyan-900/50"}`}
        ></div>

        {isTouched && (
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-marquee-enhanced"></div>
        )}
      </div>
    </Link>
  )
}
