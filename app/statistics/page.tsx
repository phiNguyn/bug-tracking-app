import { createClient } from "@/lib/supabase/server"
import { StatsSection } from "@/components/stats-section"

export default async function StatisticsPage() {
  const supabase = await createClient()

  // Fetch all data
  const [{ data: bugs }, { data: developers }, { data: sprints }] = await Promise.all([
    supabase
      .from("bugs")
      .select(`
        *,
        developer:developers(*),
        sprint:sprints(*)
      `)
      .order("created_at", { ascending: false }),
    supabase.from("developers").select("*").order("name"),
    supabase.from("sprints").select("*").order("start_date", { ascending: false }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground mt-2">View detailed statistics about bugs, developers, and sprints</p>
      </div>
      <StatsSection bugs={bugs || []} developers={developers || []} sprints={sprints || []} />
    </div>
  )
}
