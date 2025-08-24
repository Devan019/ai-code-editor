"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileExplorer } from "@/components/file-explorer"
import { CodeEditor } from "@/components/code-editor"
import { PreviewPanel } from "@/components/preview-panel"
import { AIAgentPanel } from "@/components/ai-agent-panel"
import { Toolbar } from "@/components/toolbar"
import { ResizablePanel } from "@/components/resizable-panel"
import AuthComponent from "@/components/auth/auth-dialog"
import axios from "axios"
import { useSession } from "next-auth/react"

export interface FileContent {
  name: string
  content: string
  language: string
}

export interface DFile {
  id: string
  name: string
  mimeType: string
  size: string
}



export default function CodeEditorPage() {

  const [files, setFiles] = useState<DFile[]>([])
  const [activeFile, setActiveFile] = useState<string>("")
  const [showPreview, setShowPreview] = useState(false)
  const [showAIAgent, setShowAIAgent] = useState(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState(300)
  const [rightPanelWidth, setRightPanelWidth] = useState(400)
  const [fileContent, setFileContent] = useState<FileContent>()

  const updateFileContent = (fileName: string, content: string) => {
    setFiles((prev) => prev.map((file) => (file.name === fileName ? { ...file, content } : file)))
  }

  const getActiveFileContent = () => {
    return files.find((file) => file.name === activeFile)
  }

  return (
    <div className="h-screen bg-[#1e1e1e] text-white flex flex-col overflow-hidden">
      <Toolbar
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        showAIAgent={showAIAgent}
        setShowAIAgent={setShowAIAgent}
      />
      <AuthComponent />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - File Explorer */}
        <ResizablePanel width={leftPanelWidth} onResize={setLeftPanelWidth} minWidth={200} maxWidth={500} side="right">
          <FileExplorer setFiles={setFiles} files={files} activeFile={activeFile} onFileSelect={setActiveFile} />
        </ResizablePanel>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-hidden">
            {/* <CodeEditor
              file={getActiveFileContent()}
              onContentChange={(content) => updateFileContent(activeFile, content)}
            /> */}
          </div>

          {/* Right Panels */}
          <div className="flex">
            {/* Preview Panel */}
            {/* <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: rightPanelWidth, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <ResizablePanel
                    width={rightPanelWidth}
                    onResize={setRightPanelWidth}
                    minWidth={300}
                    maxWidth={800}
                    side="left"
                  >
                    <PreviewPanel files={files} />
                  </ResizablePanel>
                </motion.div>
              )}
            </AnimatePresence> */}

            {/* AI Agent Panel */}
            {/* <AnimatePresence>
              {showAIAgent && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 400, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <AIAgentPanel
                    files={files}
                    setFiles={setFiles}
                  />
                </motion.div>
              )}
            </AnimatePresence> */}
          </div>
        </div>
      </div>
    </div>
  )
}
