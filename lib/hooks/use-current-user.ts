"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Developer } from "@/lib/types"

export function useCurrentUser() {
  const [developer, setDeveloper] = useState<Developer | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setDeveloper(null)
          return
        }

        const { data } = await supabase.from("developers").select("*").eq("email", user.email).single()

        setDeveloper(data)
      } catch (error) {
        console.error("[v0] Error loading user:", error)
        setDeveloper(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [supabase])

  const isSuperAdmin = developer?.role === "super_admin"

  return { developer, isSuperAdmin, loading }
}
