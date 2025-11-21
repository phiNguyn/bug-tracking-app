import { createClient } from "@/lib/supabase/server"
import { BugListWithFilters } from "@/components/bug-list-with-filters"
import { AddBugDialog } from "@/components/add-bug-dialog"

export default async function BugsPage() {
  const supabase = await createClient()

  // Fetch bugs with related data
  const { data: bugs } = await supabase
    .from("bugs")
    .select(`
      *,
      developer:developers(*),
      sprint:sprints(*)
    `)
    .order("created_at", { ascending: false })

  // Fetch data needed for the add bug dialog
  const { data: developers } = await supabase.from("developers").select("*").order("name")

  // Fetch ALL sprints
  const { data: sprints } = await supabase.from("sprints").select("*").order("start_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Bugs</h1>
        <AddBugDialog developers={developers || []} sprints={sprints || []} />
      </div>
      <BugListWithFilters bugs={bugs || []} developers={developers || []} sprints={sprints || []} />
    </div>
  )
}
