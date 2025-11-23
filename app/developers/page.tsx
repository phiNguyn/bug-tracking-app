"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { DeveloperList } from "@/components/developer-list"
import { AddDeveloperDialog } from "@/components/add-developer-dialog"
import { useCurrentUser } from "@/lib/hooks/use-current-user"
import type { Developer } from "@/lib/types"

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([])
  const { isSuperAdmin, loading } = useCurrentUser()
  const supabase = createClient()

  useEffect(() => {
    async function loadDevelopers() {
      const { data } = await supabase.from("developers").select("*").order("name")
      setDevelopers(data || [])
    }

    loadDevelopers()
  }, [supabase])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Developers</h1>
        {!loading && isSuperAdmin && <AddDeveloperDialog />}
      </div>
      <DeveloperList developers={developers} />
    </div>
  )
}
