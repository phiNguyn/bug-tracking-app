"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Developer } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [developer, setDeveloper] = useState<Developer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      try {
        console.log("[v0] Loading current user...")
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        console.log("[v0] Auth user:", authUser?.email)

        if (!authUser) {
          setUser(null)
          setDeveloper(null)
          setIsLoading(false)
          return
        }

        setUser(authUser)

        const { data: devData, error } = await supabase.from("developers").select("*").eq("id", authUser.id).single()

        console.log("[v0] Developer data:", devData)
        console.log("[v0] Developer error:", error)

        if (error) {
          console.error("[v0] Error fetching developer:", error)
        }

        setDeveloper(devData)
      } catch (error) {
        console.error("[v0] Error loading user:", error)
        setUser(null)
        setDeveloper(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [supabase])

  const isSuperAdmin = developer?.role === "super_admin"

  return { user, developer, isSuperAdmin, isLoading }
}
