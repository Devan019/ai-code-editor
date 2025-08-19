"use client"

import { motion } from "framer-motion"
import { FileText, Folder } from "lucide-react"
import type { FileContent } from "@/app/page"
import axios from "axios"

interface FileExplorerProps {
  files: FileContent[]
  activeFile: string
  onFileSelect: (fileName: string) => void
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()
  switch (extension) {
    case "html":
      return "🌐"
    case "css":
      return "🎨"
    case "js":
      return "⚡"
    default:
      return "📄"
  }
}

export function FileExplorer({ files, activeFile, onFileSelect }: FileExplorerProps) {


  async function getfiles() {
    const api = await axios.post("/api/files");
    
  }

  return (
    <div className="h-full bg-[#252526] border-r border-[#3e3e42] flex flex-col">
      <div className="h-8 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-3">
        <Folder className="w-4 h-4 mr-2 text-gray-400" />
        <span className="text-xs font-medium text-gray-300">EXPLORER</span>
      </div>

      <div className="flex-1 p-2">
        <div className="mb-2">
          <div className="flex items-center text-xs text-gray-400 mb-1">
            <Folder className="w-3 h-3 mr-1" />
            <span>PROJECT</span>
          </div>

          <div className="ml-2 space-y-1">
            {files.map((file) => (
              <motion.div
                key={file.name}
                whileHover={{ backgroundColor: "#2a2d2e" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onFileSelect(file.name)}
                className={`flex items-center px-2 py-1 rounded cursor-pointer text-sm transition-colors ${
                  activeFile === file.name ? "bg-[#37373d] text-white" : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="mr-2">{getFileIcon(file.name)}</span>
                <FileText className="w-3 h-3 mr-2" />
                <span>{file.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
