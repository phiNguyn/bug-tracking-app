"use client"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bug, Users, LayoutDashboard, Timer, Menu, X, BarChart3, Loader2 } from "lucide-react"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null)

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      href: "/statistics",
      label: "Statistics",
      icon: BarChart3,
      active: pathname.startsWith("/statistics"),
    },
    {
      href: "/sprints",
      label: "Sprints",
      icon: Timer,
      active: pathname.startsWith("/sprints"),
    },
    {
      href: "/developers",
      label: "Developers",
      icon: Users,
      active: pathname.startsWith("/developers"),
    },
    {
      href: "/bugs",
      label: "Bugs",
      icon: Bug,
      active: pathname.startsWith("/bugs"),
    },
  ]

  const handleNavigation = (href: string) => {
    setLoadingRoute(href)
    setIsOpen(false)
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-sidebar transition-transform duration-300",
          "md:sticky md:top-0 md:h-screen md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Desktop header trong sidebar */}
        <div className="hidden md:flex h-14 items-center border-b px-4">
          <div className="flex items-center space-x-2">
            <Bug className="h-6 w-6" />
            <span className="font-bold">BugTracker</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-4 overflow-y-auto h-[calc(100%-3.5rem)] md:h-[calc(100vh-3.5rem)]">
          {routes.map((route) => {
            const isLoading = isPending && loadingRoute === route.href
            return (
              <button
                key={route.href}
                onClick={() => handleNavigation(route.href)}
                disabled={isLoading}
                className={cn(
                  "w-full flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-50",
                  route.active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground",
                )}
              >
                {isLoading ? (
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                ) : (
                  <route.icon className="mr-3 h-5 w-5" />
                )}
                {route.label}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 top-14 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
