"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  useEffect(() => {
    setIsNavigating(false)
  }, [pathname, searchParams])

  if (!isNavigating) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
        </div>
        <p className="text-sm font-medium text-foreground">Loading page...</p>
      </div>
    </div>
  )
}
