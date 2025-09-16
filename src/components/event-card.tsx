"use client"

import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

const Card = ({
  title,
  tagline,
  coverImage,
}: {
  title: string
  tagline: string
  coverImage: string
}) => {
  const [touchActive, setTouchActive] = useState(false)

  return (
    <div
      className="group relative overflow-hidden mx-auto max-w-xs w-full rounded-lg bg-gray-900/80 border border-emerald-400/30 transition-all duration-500 cursor-pointer hover:border-emerald-400/60"
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 0 30px rgba(0, 255, 204, 0.4), 0 0 60px rgba(0, 255, 204, 0.2), inset 0 0 20px rgba(0, 255, 204, 0.1)"
        e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none"
        e.currentTarget.style.transform = "translateY(0) scale(1)"
      }}
      onTouchStart={(e) => {
        setTouchActive(true)
        e.currentTarget.style.boxShadow = "0 0 40px rgba(0, 255, 204, 0.5), 0 0 80px rgba(0, 255, 204, 0.3)"
        e.currentTarget.style.transform = "scale(1.05)"
      }}
      onTouchEnd={(e) => {
        setTouchActive(false)
        e.currentTarget.style.boxShadow = "none"
        e.currentTarget.style.transform = "scale(1)"
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse" />
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse" />
      <div
        className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"
        style={{ animationDelay: "0.4s" }}
      />

      <div
        className={cn(
          "absolute inset-0 bg-emerald-400/10 opacity-0 transition-opacity duration-200",
          touchActive && "opacity-100",
        )}
      />

      {/* Card inner content */}
      <div className={cn("relative z-10 w-full h-fit md:h-96 flex flex-col justify-between gap-6 py-6 px-4")}>
        {/* Image */}
        <div className="relative overflow-hidden rounded border border-emerald-400/30 group-hover:border-emerald-400/60 transition-colors duration-300">
          <Image
            src={coverImage || "/placeholder.svg"}
            alt={`cover image for event ${title}`}
            width={1080}
            height={1920}
            className="object-cover h-48 aspect-video transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Text & Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="font-bold text-lg md:text-xl uppercase text-emerald-400 font-mono group-hover:animate-pulse transition-all duration-300 group-hover:text-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(0,255,204,0.8)]">
              {title}
            </h1>
            <p className="font-medium text-xs text-emerald-300/70 font-mono group-hover:text-emerald-300/90 transition-colors duration-300">
              {tagline}
            </p>
          </div>
          <Button
            size="sm"
            className="bg-emerald-500/20 hover:bg-emerald-400/40 text-emerald-400 border border-emerald-400/50 hover:border-emerald-400 px-3 py-1 text-xs font-mono transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,204,0.5)] hover:scale-105"
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Card
