"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { FileContent } from "@/app/page"
import axios from "axios"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}



export function AIAgentPanel({files, setFiles}:{
  files : FileContent[]
  setFiles: React.Dispatch<React.SetStateAction<FileContent[]>>
}) {

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI coding assistant. I can help you with HTML, CSS, JavaScript, and more. What would you like to work on?",
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

    // Simulate AI response

    let code = "";
    files.map((file) => {
      code += `// ${file.name}\n${file.content}\n\n`;
    })

    const api = await axios.post("/api/gemini", {
      prompt : inputValue, code 
    })

    const data = api.data;
    console.log(data)

    setFiles((prev) =>
      prev.map((file, index) => {
        if(index == 0){
          return { ...file, content: data.html }
        }else if(index == 1){
          return { ...file, content: data.css }
        }else{
          return {...file, content: data.js }
        }
      })
    )

    setIsTyping(false);

  }

  const getAIResponse = (input: string): string => {
    const responses = [
      "I can help you with that! Let me suggest some improvements to your code.",
      "Great question! Here's what I recommend for your project.",
      "I see what you're trying to do. Let me provide some guidance.",
      "That's an interesting approach! Here are some alternatives you might consider.",
      "I can help optimize that code for better performance and readability.",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
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
                className={`flex items-start space-x-2 max-w-[80%] ${
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    message.sender === "user" ? "bg-[#007acc]" : "bg-gradient-to-r from-purple-500 to-pink-500"
                  }`}
                >
                  {message.sender === "user" ? (
                    <User className="w-3 h-3 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 text-sm ${
                    message.sender === "user" ? "bg-[#007acc] text-white" : "bg-[#3c3c3c] text-gray-200"
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
