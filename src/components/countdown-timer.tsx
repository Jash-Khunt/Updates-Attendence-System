"use client"

import { useEffect, useState } from "react"

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    const targetDate = new Date("2025-09-19T00:00:00")

    const updateTimer = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
        setIsLive(false)
      } else {
        setIsLive(true)
        setTimeLeft(null)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [])

  if (isLive) {
    return (
      <div className="text-center">
        <div className="text-2xl md:text-3xl font-bold text-green-400 font-mono animate-pulse">🔴 LIVE NOW</div>
      </div>
    )
  }

  if (!timeLeft) return null

  return (
    <div className="text-center">
      <div className="text-lg text-green-300/70 font-mono mb-2">Countdown to September 19, 2025</div>
      <div className="flex justify-center gap-4 text-green-400 font-mono">
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs">DAYS</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs">HRS</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs">MIN</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs">SEC</div>
        </div>
      </div>
    </div>
  )
}
