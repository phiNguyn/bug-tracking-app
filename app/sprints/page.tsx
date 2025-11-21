import { createClient } from "@/lib/supabase/server"
import { SprintList } from "@/components/sprint-list"
import { AddSprintDialog } from "@/components/add-sprint-dialog"

export default async function SprintsPage() {
  const supabase = await createClient()
  const { data: sprints } = await supabase
    .from("sprints")
    .select("*")
    .order("start_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sprints</h1>
        <AddSprintDialog />
      </div>
      <SprintList sprints={sprints || []} />
    </div>
  )
}
