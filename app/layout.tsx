import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Bug } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { NavigationProgress } from "@/components/navigation-progress"

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <NavigationProgress />
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="flex h-14 items-center px-4">
              <div className="flex items-center space-x-2">
                <Bug className="h-6 w-6" />
                <span className="font-bold">BugTracker</span>
              </div>
              <div className="ml-auto">
                <Sidebar />
              </div>
            </div>
          </header>
          <div className="flex flex-1 md:mt-0">
            {/* Desktop sidebar - luôn hiển thị */}
            <div className="hidden md:flex">
              <Sidebar />
            </div>
            <main className="flex-1 w-full max-w-full overflow-x-hidden">
              <div className="container py-6 px-4 md:px-6 max-w-7xl mx-auto">{children}</div>
            </main>
          </div>
        </div>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
