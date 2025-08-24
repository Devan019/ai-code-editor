"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { RefreshCw, ExternalLink } from "lucide-react"
import type { FileContent } from "@/app/page"

interface PreviewPanelProps {
  files: FileContent[]
}

export function PreviewPanel({ files }: PreviewPanelProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshPreview = () => {
    setIsLoading(true)
    updatePreview()
    setTimeout(() => setIsLoading(false), 500)
  }

  const updatePreview = () => {
    if (!iframeRef.current) return

    const htmlFile = files.find((f) => f.name === "index.html")
    const cssFile = files.find((f) => f.name === "style.css")
    const jsFile = files.find((f) => f.name === "script.js")


    if (!htmlFile) return

    let htmlContent = htmlFile.content

    // Inject CSS
    if (cssFile) {
      htmlContent += `<style>${cssFile.content}</style>`
    }

    // Inject JavaScript
    if (jsFile) {
      htmlContent += `<script>${jsFile.content}</script>`
    }

    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)

    iframeRef.current.src = url

    // Clean up the blob URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  useEffect(() => {
    updatePreview()
  }, [files])

  return (
    <div className="h-[100vh] w-full  bg-[#252526] border-l border-[#3e3e42] flex flex-col">
      {/* Header */}
      <div className="h-8 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-3">
        <span className="text-xs font-medium text-gray-300">PREVIEW</span>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={refreshPreview}
            className="text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </motion.button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white relative">
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
            />
          </div>
        )}
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
          title="Preview"
        />
      </div>
    </div>
  )
}
