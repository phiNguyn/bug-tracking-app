import type React from "react"
import { Bug } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <Bug className="h-6 w-6" />
            <span className="font-bold">BugTracker</span>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
