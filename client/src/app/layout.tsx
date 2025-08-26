import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/providers/sessionProvider"
import SessionRefresher from "@/components/refreshToken"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "VS Code Style Editor",
  description: "A VS Code inspired code editor with live preview and AI assistant",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <SessionRefresher />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
