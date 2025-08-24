"use client"

import { motion } from "framer-motion"
import { FileText, Folder, Plus, RefreshCw } from "lucide-react"
import type { DFile } from "@/app/page"
import axios from "axios"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { extensionToMime } from "@/lib/mapper"

interface FileExplorerProps {
  files: DFile[]
  activeFile: string
  onFileSelect: (fileName: string) => void
  setFiles: (files: DFile[]) => void
}

const getExtension = (fileName: string) => {
  return fileName.split(".").pop()
}
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function FileExplorer({ files, activeFile, onFileSelect, setFiles }: FileExplorerProps) {

  const { data: session, status } = useSession()
  // const [files, setFiles] = useState<FileContent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [newFileName, setNewFileName] = useState("")
  const [showAddFile, setShowAddFile] = useState(false)

  async function createFile() {
    if (!newFileName.trim() || !session?.accessToken) return

    setLoading(true)
    setError("")
    try {
      const folderId = localStorage.getItem("folderId")
      if (!folderId) {
        setError("No folder selected")
        return
      }

      const mimeType = extensionToMime[getExtension(newFileName)?? ""]

      const response = await axios.post("/api/drive/create_file", {
        accessToken: session.accessToken,
        folderId: folderId,
        fileName: newFileName,
        mimeType: mimeType || "text/plain"
      })

      // Add the new file to our list
      console.log(response)
      setNewFileName("")
      setShowAddFile(false)
    } catch (err: any) {
      console.error("Error creating file:", err)
      setError(err.response?.data?.error || "Failed to create file")
    } finally {
      setLoading(false)
    }
  }

  async function getFiles() {
    if (!session?.accessToken) return

    setLoading(true)
    setError("")
    try {
      const folderId = localStorage.getItem("folderId")
      if (!folderId) {
        setError("No folder selected")
        return
      }

      const response = await axios.post("/api/drive/files", {
        accessToken: session.accessToken,
        folderId: folderId
      })

      // Update the file list
      console.log(response.data)
      setFiles(response.data)
    } catch (err: any) {
      console.error("Error fetching files:", err)
      setError(err.response?.data?.error || "Failed to fetch files")
    } finally {
      setLoading(false)
    }
  }

  async function selectFile(file: DFile) {
    onFileSelect(file.name)
    const api = await axios.post("/api/drive/get-content", {
      accessToken: session?.accessToken,
      fileId: file.id,
      mimeType: file.mimeType
    })
    const data = api.data;
    console.log(data.fileContent)
  }

  useEffect(()=>{
    if(session?.user){
      getFiles()
    }
  },[session?.user])

  return (
    <div className="h-full bg-[#252526] border-r border-[#3e3e42] flex flex-col">
      <div className="h-8 bg-[#2d2d30] border-b border-[#3e3e42] flex items-center px-3 justify-between">
        <div className="flex items-center">
          <Folder className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-xs font-medium text-gray-300">EXPLORER</span>
        </div>
        <div className="flex items-center">
          <button
            onClick={getFiles}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
            title="Refresh files"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowAddFile(true)}
            className="p-1 text-gray-400 hover:text-white"
            title="Add new file"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-2 overflow-y-auto">
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <div className="flex items-center">
              <Folder className="w-3 h-3 mr-1" />
              <span>ai-editor</span>
            </div>
            <span className="text-xs">{files?.length} items</span>
          </div>

          {showAddFile && (
            <div className="ml-2 mb-2 flex items-center">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="filename.js"
                className="flex-1 bg-[#3c3c3c] text-white text-xs p-1 rounded border border-[#007acc] focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && createFile()}
                autoFocus
              />
              <button
                onClick={createFile}
                disabled={!newFileName.trim() || loading}
                className="ml-1 px-2 py-1 bg-[#007acc] text-white text-xs rounded disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddFile(false)}
                className="ml-1 px-2 py-1 bg-[#5a5a5a] text-white text-xs rounded"
              >
                Cancel
              </button>
            </div>
          )}

          {error && (
            <div className="ml-2 mb-2 text-xs text-red-400 bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}

          <div className="ml-2 space-y-1">
            {files?.length === 0 && !loading ? (
              <div className="text-xs text-gray-500 italic py-2">
                No files found in this folder
              </div>
            ) : (
              files?.map((file) => (
                <motion.div
                  key={file.id}
                  whileHover={{ backgroundColor: "#2a2d2e" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>  selectFile(file)}
                  className={`flex items-center px-2 py-1 rounded cursor-pointer text-sm transition-colors ${activeFile === file.id ? "bg-[#37373d] text-white" : "text-gray-300 hover:text-white"}`}
                >
                  {/* <span className="mr-2 text-base">{getFileIcon(file.mimeType, file.name)}</span> */}
                  <FileText className="w-3 h-3 mr-2" />
                  <span className="truncate flex-1">{file.name}</span>
                  {file.size && (
                    <span className="text-xs text-gray-500 ml-2">
                      {formatFileSize(parseInt(file.size))}
                    </span>
                  )}
                </motion.div>
              ))
            )}

            {loading && (
              <div className="flex justify-center py-4">
                <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
