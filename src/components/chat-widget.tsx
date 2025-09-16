"use client"

import type React from "react"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      // Handle message submission here
      console.log("Message sent:", message)
      setMessage("")
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Box */}
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-black/90 border border-emerald-400/30 rounded-lg shadow-2xl backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-emerald-400/20">
            <h3 className="text-emerald-400 font-mono font-bold">Security Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 h-64 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-emerald-400/10 p-3 rounded-lg border border-emerald-400/20">
                <p className="text-emerald-300 text-sm font-mono">
                  Hello! I'm your cybersecurity assistant. How can I help you with UPDATES 2K25?
                </p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-emerald-400/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your query..."
                className="flex-1 bg-black/50 border border-emerald-400/30 rounded px-3 py-2 text-emerald-300 placeholder-emerald-400/50 font-mono text-sm focus:outline-none focus:border-emerald-400"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-400/30"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <Button
      variant='destructive'
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full  from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-400/30 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110"
        style={{
          boxShadow: "0 0 20px rgba(18, 99, 49, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)",
        }}
      >
        {isOpen ? <X className="h-6 w-6 text-emerald-400" /> : <MessageCircle className="h-6 w-6 text-emerald-400" />}
      </Button>
    </div>
  )
}
