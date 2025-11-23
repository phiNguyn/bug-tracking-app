"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

export function PageLoading() {
  const [loading, setLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setLoading(false)
  }, [pathname])

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    // Listen to route changes
    window.addEventListener("beforeunload", handleStart)

    return () => {
      window.removeEventListener("beforeunload", handleStart)
    }
  }, [])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
