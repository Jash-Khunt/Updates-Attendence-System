"use client"

import { useState, useEffect } from "react"

export function DockBar() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // return (
  //   <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-t border-green-400/30">
  //     <div className="flex items-center justify-between px-6 py-3">
  //       <div className="flex items-center space-x-4">
  //         <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
  //         <span className="text-green-400 font-mono text-sm">SYSTEM ONLINE</span>
  //       </div>

  //       <div className="flex items-center space-x-6 text-green-400 font-mono text-sm">
  //         <span>{formatDate(currentTime)}</span>
  //         <span className="text-green-300">{formatTime(currentTime)}</span>
  //       </div>
  //     </div>
  //   </div>
  // )
}
