"use client"

import { motion } from "framer-motion"
import { Eye, Bot, Code } from "lucide-react"
import { useState } from "react"
import KeyDialog from "./api-keys/keyDialog"

interface ToolbarProps {
  showPreview: boolean
  setShowPreview: (show: boolean) => void
  showAIAgent: boolean
  setShowAIAgent: (show: boolean) => void
  apiKeys: any
  setApiKeys: (keys: any) => void
}

export function Toolbar({ showPreview, setShowPreview, showAIAgent, setShowAIAgent, apiKeys, setApiKeys }: ToolbarProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <div className="h-12 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-[#007acc]" />
          <span className="text-sm font-medium">Code Editor</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm transition-colors ${isDialogOpen ? "bg-[#007acc] text-white" : "bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
          }`}>
          <KeyDialog
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            apiKeys={apiKeys}
            setApiKeys={setApiKeys}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm transition-colors ${showPreview ? "bg-[#007acc] text-white" : "bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
            }`}
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAIAgent(!showAIAgent)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm transition-colors ${showAIAgent ? "bg-[#007acc] text-white" : "bg-[#3c3c3c] text-gray-300 hover:bg-[#4c4c4c]"
            }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Agent</span>
        </motion.button>


      </div>
    </div>
  )
}
