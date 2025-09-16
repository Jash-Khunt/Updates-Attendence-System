// "use client"

// import { cn } from "@/lib/utils"
// import { useEffect, useRef } from "react"

// interface GlobeProps {
//   className?: string
// }

// export function Globe({ className }: GlobeProps) {
//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     canvas.width = 400
//     canvas.height = 400

//     let animationId: number
//     let rotation = 0

//     const drawGlobe = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)

//       const centerX = canvas.width / 2
//       const centerY = canvas.height / 2
//       const radius = 150

//       // Draw globe outline
//       ctx.beginPath()
//       ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
//       ctx.strokeStyle = "#00ff41"
//       ctx.lineWidth = 2
//       ctx.stroke()

//       // Draw grid lines
//       ctx.strokeStyle = "#00ff4150"
//       ctx.lineWidth = 1

//       // Longitude lines
//       for (let i = 0; i < 8; i++) {
//         const angle = (i * Math.PI) / 4 + rotation
//         const ellipseRadius = Math.abs(radius * Math.cos(angle))
//         if (ellipseRadius > 5) {
//           // Only draw if radius is meaningful
//           ctx.beginPath()
//           ctx.ellipse(centerX, centerY, ellipseRadius, radius, 0, 0, Math.PI * 2)
//           ctx.stroke()
//         }
//       }

//       // Latitude lines
//       for (let i = 1; i < 4; i++) {
//         const y = (radius * i) / 4
//         const latRadius = radius * Math.sqrt(Math.max(0, 1 - (y / radius) ** 2))
//         if (latRadius > 5) {
//           // Only draw if radius is meaningful
//           ctx.beginPath()
//           ctx.ellipse(centerX, centerY - y, latRadius, radius / 8, 0, 0, Math.PI * 2)
//           ctx.stroke()
//           ctx.beginPath()
//           ctx.ellipse(centerX, centerY + y, latRadius, radius / 8, 0, 0, Math.PI * 2)
//           ctx.stroke()
//         }
//       }

//       // Draw connection points
//       for (let i = 0; i < 12; i++) {
//         const angle = (i * Math.PI * 2) / 12 + rotation
//         const x = centerX + Math.cos(angle) * radius * 0.8
//         const y = centerY + Math.sin(angle) * radius * 0.8

//         ctx.beginPath()
//         ctx.arc(x, y, 3, 0, Math.PI * 2)
//         ctx.fillStyle = "#00ff41"
//         ctx.fill()

//         // Glow effect
//         ctx.shadowColor = "#00ff41"
//         ctx.shadowBlur = 10
//         ctx.fill()
//         ctx.shadowBlur = 0
//       }

//       rotation += 0.01
//       animationId = requestAnimationFrame(drawGlobe)
//     }

//     drawGlobe()

//     return () => {
//       if (animationId) {
//         cancelAnimationFrame(animationId)
//       }
//     }
//   }, [])

//   return <canvas ref={canvasRef} className={cn("", className)} style={{ filter: "drop-shadow(0 0 20px #00ff4150)" }} />
// }
"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface GlobeProps {
  className?: string
}

export function Globe({ className }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 400

    let animationId: number
    let rotation = 0

    const drawGlobe = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 150

      // Draw globe outline
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "#00ff41"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw grid lines
      ctx.strokeStyle = "#00ff4150"
      ctx.lineWidth = 1

      // Longitude lines
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 + rotation
        const ellipseRadius = Math.abs(radius * Math.cos(angle))
        if (ellipseRadius > 5) {
          // Only draw if radius is meaningful
          ctx.beginPath()
          ctx.ellipse(centerX, centerY, ellipseRadius, radius, 0, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // Latitude lines
      for (let i = 1; i < 4; i++) {
        const y = (radius * i) / 4
        const latRadius = radius * Math.sqrt(Math.max(0, 1 - (y / radius) ** 2))
        if (latRadius > 5) {
          // Only draw if radius is meaningful
          ctx.beginPath()
          ctx.ellipse(centerX, centerY - y, latRadius, radius / 8, 0, 0, Math.PI * 2)
          ctx.stroke()
          ctx.beginPath()
          ctx.ellipse(centerX, centerY + y, latRadius, radius / 8, 0, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      // Draw connection points
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 + rotation
        const x = centerX + Math.cos(angle) * radius * 0.8
        const y = centerY + Math.sin(angle) * radius * 0.8

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#00ff41"
        ctx.fill()

        // Glow effect
        ctx.shadowColor = "#00ff41"
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      }

      rotation += 0.01
      animationId = requestAnimationFrame(drawGlobe)
    }

    drawGlobe()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className={cn("", className)} style={{ filter: "drop-shadow(0 0 20px #00ff4150)" }} />
}
