"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface ResizablePanelProps {
  children: React.ReactNode
  width: number
  onResize: (width: number) => void
  minWidth: number
  maxWidth: number
  side: "left" | "right"
}

export function ResizablePanel({ children, width, onResize, minWidth, maxWidth, side }: ResizablePanelProps) {
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !panelRef.current) return

      const rect = panelRef.current.getBoundingClientRect()
      let newWidth: number

      if (side === "right") {
        newWidth = e.clientX - rect.left
      } else {
        newWidth = rect.right - e.clientX
      }

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      onResize(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, minWidth, maxWidth, onResize, side])

  return (
    <div ref={panelRef} style={{ width }} className="relative flex-shrink-0">
      {children}

      {/* Resize Handle */}
      <motion.div
        className={`absolute top-0 bottom-0 w-1 bg-transparent hover:bg-[#007acc] cursor-col-resize group ${
          side === "right" ? "right-0" : "left-0"
        }`}
        onMouseDown={() => setIsResizing(true)}
        whileHover={{ backgroundColor: "#007acc" }}
      >
        <div className="absolute inset-0 w-3 -translate-x-1" />
      </motion.div>
    </div>
  )
}
