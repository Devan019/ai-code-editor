"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, Play, Terminal } from "lucide-react"
import { DFile, FileContent } from "@/app/page"
import axios from "axios"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ModelSelectorProps {
  groq: string;
  gemini: string;
  openai: string;
  anthropic: string;
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

import { models } from "@/lib/models";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useSession } from "next-auth/react"
import { getExtension } from "./file-explorer"
import { extensionToLanguage, extensionToMime, languageToJDoodleConfig } from "@/lib/mapper"

export function AIAgentPanel({ files, setFiles, apiKeys, activeFile, setActiveFile, fileContent, setFileContent }: {
  files: DFile[]
  setFiles: React.Dispatch<React.SetStateAction<DFile[]>>
  apiKeys: ModelSelectorProps
  activeFile: DFile | undefined
  setActiveFile: React.Dispatch<React.SetStateAction<DFile | undefined>>
  fileContent: FileContent | undefined
  setFileContent: React.Dispatch<React.SetStateAction<FileContent | undefined>>
}) {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedLabel, setSelectedLabel] = useState<string>('')
  const { data: session } = useSession();
  const [showTerminal, setShowTerminal] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Get available models based on API keys
  const availableModels = () => {
    const result: { provider: string, model: string }[] = [];

    if (apiKeys.groq) {
      models.groq.forEach(model => result.push({ provider: 'groq', model }));
    }

    if (apiKeys.gemini) {
      models.google.forEach(model => result.push({ provider: 'google', model }));
    }

    if (apiKeys.openai) {
      models.openai.forEach(model => result.push({ provider: 'openai', model }));
    }

    if (apiKeys.anthropic) {
      models.anthropic.forEach(model => result.push({ provider: 'anthropic', model }));
    }

    return result;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI coding assistant.",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // AI response
    try {
      const api = await axios.post(`/api/ai/${selectedLabel}`, {
        prompt: inputValue,
        userId: session?.user?.id,
        model: selectedModel,
      })

      const data = api.data;

      const { response } = data;
      const { filename, code } = response;

      //make a new file
      const newfileApi = await axios.post("/api/drive/create_file", {
        accessToken: session?.accessToken,
        fileName: filename,
        mimeType: extensionToMime[getExtension(filename)],
        folderId: localStorage.getItem("folderId")
      })

      // fileId, accessToken, code, mimeType
      //upload code
      const uploadapi = await axios.post("/api/save/drive", {
        accessToken: session?.accessToken,
        fileId: newfileApi.data.id,
        code: code,
        mimeType:  extensionToMime[getExtension(filename)],
      })

      console.log("at upload", uploadapi.data)

      //all files
      const filesapi = await axios.post("/api/drive/files", {
        accessToken: session?.accessToken,
        folderId: localStorage.getItem("folderId")
      })
      const setfiledata = filesapi.data;

      //setfiles
      setFiles(setfiledata)

      //activefile
      setActiveFile((prev) => {
        return {
          id: newfileApi.data.id,
          name: filename,
          mimeType:  extensionToMime[getExtension(filename)],
          size: uploadapi.data.size,
        };
      })

      //set code
      setFileContent((prev) => ({
        name: filename,
        language: extensionToLanguage[getExtension(filename) as keyof typeof extensionToLanguage] || 'plaintext',
        content: code
      }));

    } catch (error) {
      setIsTyping(false);
    }
    setIsTyping(false);
  }

  const handleRunCode = async () => {
    if (!fileContent) return;
    
    setIsExecuting(true);
    setShowTerminal(true);
    
    try {
      
      const response = await axios.post("/api/run", {
        code: fileContent.content,
        language: fileContent.language,
        versionIndex: languageToJDoodleConfig[fileContent.language.toLowerCase() as keyof typeof languageToJDoodleConfig].defaultVersion
      });
      
      setExecutionResult(response.data);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full bg-[#252526] border-l border-[#3e3e42] flex flex-col w-96">
      {/* Header */}
      <div className="h-8 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-3">
        <Bot className="w-4 h-4 mr-2 text-[#007acc]" />
        <span className="text-xs font-medium text-gray-300">AI ASSISTANT</span>
        <Sparkles className="w-3 h-3 ml-auto text-yellow-400" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${message.sender === "user" ? "bg-[#007acc]" : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-3 h-3 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 text-sm ${message.sender === "user" ? "bg-[#007acc] text-white" : "bg-[#3c3c3c] text-gray-200"
                    }`}
                >
                  {message.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <div className="bg-[#3c3c3c] rounded-lg p-3">
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Model Selector */}
      <div className="p-2 border-t border-[#3e3e42]">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full px-3 py-2 rounded-md bg-[#3c3c3c] text-gray-200 text-sm flex items-center justify-between">
            {selectedModel || 'Select Model'}
            <span className="text-xs opacity-70">▼</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-[#3c3c3c] border border-[#4c4c4c]">
            <DropdownMenuLabel className="text-gray-200">Models</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#4c4c4c]" />
            {availableModels().map((modelObj, idx) => (
              <div key={idx}>
                <DropdownMenuItem 
                  className="text-gray-200 hover:bg-[#4c4c4c] cursor-pointer"
                  onClick={() => { setSelectedModel(modelObj.model); setSelectedLabel(modelObj.provider) }} 
                  key={modelObj.model}
                >
                  {modelObj.model}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#4c4c4c]" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      

      {/* Input */}
      <div className="p-3 border-t border-[#3e3e42]">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your code..."
              className="w-full bg-[#3c3c3c] text-gray-200 rounded-lg px-3 py-2 text-sm resize-none outline-none border border-[#4c4c4c] focus:border-[#007acc] transition-colors"
              rows={1}
              style={{ minHeight: "36px", maxHeight: "100px" }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="bg-[#007acc] text-white p-2 rounded-lg hover:bg-[#005a9e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}