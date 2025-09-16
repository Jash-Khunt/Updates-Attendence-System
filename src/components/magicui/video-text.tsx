"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface VideoTextProps {
  src: string
  children: React.ReactNode
  className?: string
}

export function VideoText({ src, children, className }: VideoTextProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.addEventListener("loadeddata", () => setIsLoaded(true))
      return () => video.removeEventListener("loadeddata", () => setIsLoaded(true))
    }
  }, [])

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 flex items-center justify-center h-full">
        <span className="text-6xl md:text-8xl font-bold text-green-400 font-mono tracking-wider mix-blend-difference">
          {children}
        </span>
      </div>
    </div>
  )
}
