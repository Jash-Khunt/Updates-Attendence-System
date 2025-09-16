"use client"

import { cn } from "@/lib/utils"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface TextRevealProps {
  children: string
  className?: string
}

export function TextReveal({ children, className }: TextRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const words = children.split(" ")

  return (
    <div ref={ref} className={cn("", className)}>
      <motion.div className="text-4xl md:text-6xl font-bold text-green-400 font-mono text-center leading-tight">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="inline-block mr-2"
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
