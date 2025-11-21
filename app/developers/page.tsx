import { createClient } from "@/lib/supabase/server"
import { DeveloperList } from "@/components/developer-list"
import { AddDeveloperDialog } from "@/components/add-developer-dialog"

export default async function DevelopersPage() {
  const supabase = await createClient()
  const { data: developers } = await supabase
    .from("developers")
    .select("*")
    .order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Developers</h1>
        <AddDeveloperDialog />
      </div>
      <DeveloperList developers={developers || []} />
    </div>
  )
}
