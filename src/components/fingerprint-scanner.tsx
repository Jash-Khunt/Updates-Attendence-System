"use client"

import { useState } from "react"

interface FingerprintScannerProps {
  className?: string
}

export default function FingerprintScanner({ className = "" }: FingerprintScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [currentFinger, setCurrentFinger] = useState(0)
  const [scannedFingers, setScannedFingers] = useState<number[]>([])

  const fingerSegments = [
    { id: 0, name: "OUTER", delay: 0 },
    { id: 1, name: "RIDGE", delay: 200 },
    { id: 2, name: "MIDDLE", delay: 400 },
    { id: 3, name: "INNER", delay: 600 },
    { id: 4, name: "CORE", delay: 800 },
  ]

  const handleScan = () => {
    if (isScanning || isComplete) return

    setIsScanning(true)
    setScanProgress(0)
    setScannedFingers([])
    setCurrentFinger(0)

    fingerSegments.forEach((finger, index) => {
      setTimeout(() => {
        setCurrentFinger(finger.id)
        setScannedFingers((prev) => [...prev, finger.id])
      }, finger.delay)
    })

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setIsComplete(true)

          // Reset after 3 seconds
          setTimeout(() => {
            setIsComplete(false)
            setScanProgress(0)
            setScannedFingers([])
            setCurrentFinger(0)
          }, 3000)

          return 100
        }
        return prev + 1
      })
    }, 20)
  }

  return (
    <div className={`relative cursor-pointer select-none ${className}`} onClick={handleScan} onTouchStart={handleScan}>
      <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/30 to-cyan-500/20 blur-xl animate-pulse"></div>

        {/* Main fingerprint container */}
        <div className="relative w-24 h-24 rounded-full border-2 border-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <svg viewBox="0 0 100 100" className="w-16 h-16 transition-all duration-300" fill="none">
            {/* Outer fingerprint curve */}
            <path
              d="M30 20 Q50 10 70 20 Q80 50 70 80 Q50 90 30 80 Q20 50 30 20"
              fill="none"
              stroke={scannedFingers.includes(0) ? "#10b981" : currentFinger === 0 ? "#06b6d4" : "#374151"}
              strokeWidth="2"
              className={`transition-all duration-300 ${currentFinger === 0 ? "animate-pulse drop-shadow-lg" : ""}`}
              style={{ filter: currentFinger === 0 ? "drop-shadow(0 0 4px currentColor)" : "none" }}
            />

            {/* Second fingerprint curve */}
            <path
              d="M35 25 Q50 18 65 25 Q72 50 65 75 Q50 82 35 75 Q28 50 35 25"
              fill="none"
              stroke={scannedFingers.includes(1) ? "#10b981" : currentFinger === 1 ? "#06b6d4" : "#374151"}
              strokeWidth="2"
              className={`transition-all duration-300 ${currentFinger === 1 ? "animate-pulse drop-shadow-lg" : ""}`}
              style={{ filter: currentFinger === 1 ? "drop-shadow(0 0 4px currentColor)" : "none" }}
            />

            {/* Third fingerprint curve */}
            <path
              d="M40 30 Q50 25 60 30 Q65 50 60 70 Q50 75 40 70 Q35 50 40 30"
              fill="none"
              stroke={scannedFingers.includes(2) ? "#10b981" : currentFinger === 2 ? "#06b6d4" : "#374151"}
              strokeWidth="2"
              className={`transition-all duration-300 ${currentFinger === 2 ? "animate-pulse drop-shadow-lg" : ""}`}
              style={{ filter: currentFinger === 2 ? "drop-shadow(0 0 4px currentColor)" : "none" }}
            />

            {/* Inner fingerprint curve */}
            <path
              d="M45 35 Q50 32 55 35 Q58 50 55 65 Q50 68 45 65 Q42 50 45 35"
              fill="none"
              stroke={scannedFingers.includes(3) ? "#10b981" : currentFinger === 3 ? "#06b6d4" : "#374151"}
              strokeWidth="2"
              className={`transition-all duration-300 ${currentFinger === 3 ? "animate-pulse drop-shadow-lg" : ""}`}
              style={{ filter: currentFinger === 3 ? "drop-shadow(0 0 4px currentColor)" : "none" }}
            />

            {/* Center fingerprint lines */}
            <path
              d="M50 40 L50 60"
              stroke={scannedFingers.includes(4) ? "#10b981" : currentFinger === 4 ? "#06b6d4" : "#374151"}
              strokeWidth="2"
              strokeLinecap="round"
              className={`transition-all duration-300 ${currentFinger === 4 ? "animate-pulse drop-shadow-lg" : ""}`}
              style={{ filter: currentFinger === 4 ? "drop-shadow(0 0 6px currentColor)" : "none" }}
            />
            <path
              d="M47 42 L47 58"
              stroke={scannedFingers.includes(4) ? "#10b981" : currentFinger === 4 ? "#06b6d4" : "#374151"}
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`transition-all duration-300 ${currentFinger === 4 ? "animate-pulse drop-shadow-lg" : ""}`}
              style={{ filter: currentFinger === 4 ? "drop-shadow(0 0 6px currentColor)" : "none" }}
            />
            <path
              d="M53 42 L53 58"
              stroke={scannedFingers.includes(4) ? "#10b981" : currentFinger === 4 ? "#06b6d4" : "#374151"}
              strokeWidth="1.5"
              strokeLinecap="round"
              className={`transition-all duration-300 ${currentFinger === 4 ? "animate-pulse drop-shadow-lg" : ""}`}
              style={{ filter: currentFinger === 4 ? "drop-shadow(0 0 6px currentColor)" : "none" }}
            />
          </svg>
        </div>

        {isScanning && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 animate-ping opacity-75 shadow-lg shadow-cyan-400/50"></div>
            <div className="absolute inset-2 rounded-full border-2 border-gradient-to-r from-green-400 via-emerald-400 to-green-400 animate-pulse opacity-60 shadow-lg shadow-green-400/30"></div>
            <div className="absolute inset-4 rounded-full border border-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-spin opacity-40 shadow-lg shadow-blue-400/20"></div>
          </>
        )}

        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="completeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <circle cx="50%" cy="50%" r="60" fill="none" stroke="rgba(6, 182, 212, 0.1)" strokeWidth="2" />
          <circle
            cx="50%"
            cy="50%"
            r="60"
            fill="none"
            stroke={isComplete ? "url(#completeGradient)" : "url(#progressGradient)"}
            strokeWidth="4"
            strokeDasharray={`${2 * Math.PI * 60}`}
            strokeDashoffset={`${2 * Math.PI * 60 * (1 - scanProgress / 100)}`}
            className="transition-all duration-100"
            style={{
              filter: isScanning ? "drop-shadow(0 0 12px currentColor)" : "none",
            }}
          />
        </svg>
      </div>

      <div className="text-center">
        <p
          className={`text-lg font-mono font-bold transition-all duration-300 bg-gradient-to-r ${
            isScanning
              ? "from-cyan-300 via-blue-400 to-cyan-300 animate-pulse"
              : isComplete
                ? "from-green-300 via-emerald-400 to-green-300"
                : "from-cyan-400 via-blue-500 to-cyan-400"
          } bg-clip-text text-transparent bg-300% animate-gradient tracking-wider`}
          style={{
            textShadow: isScanning || isComplete ? "0 0 20px rgba(6, 182, 212, 0.5)" : "none",
          }}
        >
          {isScanning
            ? `SCANNING ${fingerSegments[currentFinger]?.name || ""}...`
            : isComplete
              ? "ACCESS GRANTED"
              : "TOUCH TO ACCESS"}
        </p>

        {isScanning && (
          <div className="space-y-3 mt-4">
            <p className="text-sm text-cyan-400 font-mono font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {scanProgress.toFixed(0)}% COMPLETE
            </p>
            <div className="flex justify-center space-x-2">
              {fingerSegments.map((finger) => (
                <div
                  key={finger.id}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    scannedFingers.includes(finger.id)
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/60 scale-110"
                      : currentFinger === finger.id
                        ? "bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse shadow-lg shadow-cyan-400/60 scale-105"
                        : "bg-gray-600 border border-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {isComplete && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-emerald-400/20 to-green-400/10 rounded-2xl animate-pulse shadow-2xl shadow-green-400/20"></div>
      )}
    </div>
  )
}
