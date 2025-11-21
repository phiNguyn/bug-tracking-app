"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Bug, Users, LayoutDashboard, Timer, Menu, X, BarChart3 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

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

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar - hidden on mobile, visible on md and up */}
      <aside
        className={cn(
          "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-64 border-r bg-background transition-transform duration-300 md:relative md:top-0 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="space-y-2 p-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                route.active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <route.icon className="mr-3 h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 top-14 z-30 bg-black/50 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
