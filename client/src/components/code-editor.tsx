"use client"

import type React from "react"

import { use, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import type { DFile, FileContent } from "@/app/page"
import { Editor } from "@monaco-editor/react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { extensionToMime, languageToJDoodleConfig } from "@/lib/mapper"
import { getExtension } from "./file-explorer"
import { Play, Send, Terminal } from "lucide-react"
// import io from "socket.io-client";
// const socket = io("http://localhost:3001");
interface CodeEditorProps {
  file?: FileContent
  onContentChange: (content: string) => void
  Dfile: DFile
}


interface ExecutionResult {
  output: string | null;
  error: string | null;
  statusCode: number;
  memory: string;
  cpuTime: string;
  compilationStatus: string | null;
  projectKey: string | null;
  isExecutionSuccess: boolean;
  isCompiled: boolean;
}

export function CodeEditor({ file, onContentChange, Dfile }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [codelan, setcodelan] = useState(file?.language);
  const [code, setcode] = useState(file?.content);
  const { data: session } = useSession();
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

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
      setcodelan(file.language.toLowerCase());
    }
  }, [file])

  const handleRunCode = async () => {
    if (!file?.content) return;

    setIsExecuting(true);
    setShowTerminal(true);

    try {

      const response = await axios.post("/api/run", {
        code: file.content,
        language: file.language,
        versionIndex: 0
      });

      setExecutionResult(response.data.response);
    } catch (error) {
      console.error("Execution error:", error);
      setExecutionResult({
        output: null,
        error: "Failed to execute code",
        statusCode: 500,
        memory: "0",
        cpuTime: "0",
        compilationStatus: null,
        projectKey: null,
        isExecutionSuccess: false,
        isCompiled: false
      });
    } finally {
      setIsExecuting(false);
    }
  }


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
        <button className="absolute bottom-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded flex items-center hover:cursor-pointer"
          onClick={() => {
            const accessToken = session?.accessToken;
            axios.post("/api/save/drive", { fileId: Dfile.id, accessToken, code, mimeType: extensionToMime[getExtension(Dfile.name)] });
          }}
        >
          <span>Save to Drive</span>
        </button>

        <div className="top-8 absolute right-2 p-2 border-t border-[#3e3e42]">
          <button
            onClick={handleRunCode}
            disabled={!file.content || isExecuting}
            className="absolute bottom-4 right-4 z-10 bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded flex items-center hover:cursor-pointer w-28"
          >
            <Play className="w-4 h-4 z-10" />
            {isExecuting ? "Running..." : "Run Code"}
          </button>
        </div>

        {/* Terminal Output */}
        {showTerminal && (
          <div className="border-t border-[#3e3e42]">
            <div className="h-8 bg-[#2d2d30] flex items-center px-3">
              <Terminal className="w-4 h-4 mr-2 text-green-400" />
              <span className="text-xs font-medium text-gray-300">TERMINAL</span>
              <button
                onClick={() => setShowTerminal(false)}
                className="ml-auto text-xs text-gray-400 hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <div className="p-3 bg-[#1e1e1e] text-gray-200 text-sm font-mono h-48 overflow-auto">
              {isExecuting ? (
                <div className="flex items-center">
                  <div className="animate-pulse mr-2">●</div>
                  <span>Executing code...</span>
                </div>
              ) : executionResult ? (
                <div>
                  {executionResult.error ? (
                    <div className="text-red-400">
                      <div className="font-bold">Error:</div>
                      <div>{executionResult.error}</div>
                    </div>
                  ) : (
                    <div className="text-green-400">
                      <div className="font-bold">Output:</div>
                      <div>{executionResult.output}</div>
                    </div>
                  )}
                  <div className="mt-2 text-gray-400 text-xs">
                    <div>Status: {executionResult.statusCode} {executionResult.isExecutionSuccess ? "(Success)" : "(Failed)"}</div>
                    <div>Memory: {executionResult.memory}KB</div>
                    <div>CPU Time: {executionResult.cpuTime}s</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400">No execution results yet. Run your code to see output.</div>
              )}
            </div>
          </div>
        )}

        

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
