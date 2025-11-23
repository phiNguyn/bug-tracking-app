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

        console.log("[v0] Auth user:", authUser?.email, "ID:", authUser?.id)

        if (!authUser) {
          setUser(null)
          setDeveloper(null)
          setIsLoading(false)
          return
        }

        setUser(authUser)

        let { data: devData, error } = await supabase.from("developers").select("*").eq("id", authUser.id).single()

        console.log("[v0] Developer by ID:", devData, "Error:", error)

        if (error || !devData) {
          console.log("[v0] Trying to find developer by email:", authUser.email)
          const { data: devByEmail, error: emailError } = await supabase
            .from("developers")
            .select("*")
            .eq("email", authUser.email)
            .single()

          console.log("[v0] Developer by email:", devByEmail, "Error:", emailError)

          if (devByEmail) {
            console.log("[v0] Updating developer ID to match auth ID")
            const { data: updatedDev, error: updateError } = await supabase
              .from("developers")
              .update({ id: authUser.id })
              .eq("email", authUser.email)
              .select()
              .single()

            if (updateError) {
              console.error("[v0] Error updating developer ID:", updateError)
            } else {
              console.log("[v0] Successfully updated developer ID:", updatedDev)
              devData = updatedDev
            }
          } else {
            console.log("[v0] Creating new developer profile for super admin")
            const { data: newDev, error: createError } = await supabase
              .from("developers")
              .insert({
                id: authUser.id,
                email: authUser.email,
                name: authUser.email?.split("@")[0] || "User",
                role: authUser.email === "phinguyenq12@gmail.com" ? "super_admin" : "developer",
              })
              .select()
              .single()

            if (createError) {
              console.error("[v0] Error creating developer:", createError)
            } else {
              console.log("[v0] Successfully created developer:", newDev)
              devData = newDev
            }
          }
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
