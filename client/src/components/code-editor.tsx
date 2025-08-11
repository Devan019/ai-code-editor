"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import type { FileContent } from "@/app/page"
import { Editor } from "@monaco-editor/react"
// import io from "socket.io-client";
// const socket = io("http://localhost:3001");
interface CodeEditorProps {
  file?: FileContent
  onContentChange: (content: string) => void
}

export function CodeEditor({ file, onContentChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [codelan, setcodelan] = useState(file?.language);
  const [code, setcode] = useState(file?.content);

  // useEffect(() => {
  //   socket.on("code-update", (newCode) => {
  //     setcode(newCode);
  //   });

  //   return () => {
  //     socket.off("code-update");
  //   };
  // }, []);

  // const handleCodeChange = (value?: string) => {
  //   setcode(value || "");
  //   socket.emit("code-change", value);
  // };

  useEffect(() => {
    if (file) {
      setcode(file.content);
      setcodelan(file.language);
      console.log("File changed:", file.name, "Language:", file.language);
    }
  }, [file])


  const getLanguageColor = (language: string) => {
    switch (language) {
      case "html":
        return "#e34c26"
      case "css":
        return "#1572b6"
      case "javascript":
        return "#f7df1e"
      default:
        return "#007acc"
    }
  }

  if (!file) {
    return (
      <div className="h-full bg-[#1e1e1e] flex items-center justify-center">
        <div className="text-gray-500">Select a file to edit</div>
      </div>
    )
  }

  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col">
      {/* Tab Bar */}
      <div className="h-8 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center px-3 py-1 bg-[#1e1e1e] border-r border-[#3e3e42] text-sm"
        >
          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getLanguageColor(file.language) }} />
          <span className="text-white">{file.name}</span>
        </motion.div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">


        <Editor
          height="100%"
          language={codelan} // will update when setcodelan changes
          value={code}       // will update when setcode changes
          theme="vs-dark"
          onChange={(value) => {
            setcode(value || "")
            onContentChange(value || "")
            // handleCodeChange(value || "")
          }}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
        />


        {/* Line numbers would go here in a more advanced implementation */}
      </div>
    </div>
  )
}
