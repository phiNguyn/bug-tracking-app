import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Bug, Timer, Users } from "lucide-react"
import { DashboardCharts } from "@/components/dashboard-charts"
import { DashboardFilters } from "@/components/dashboard-filters"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ developer?: string; sprint?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  // Build filter conditions
  let bugQuery = supabase.from("bugs").select("*", { count: "exact", head: true })
  let chartBugQuery = supabase.from("bugs").select(`
    penalty_amount,
    penalty_status,
    developer:developers(name),
    sprint:sprints(name)
  `)

  if (params.developer) {
    bugQuery = bugQuery.eq("developer_id", params.developer)
    chartBugQuery = chartBugQuery.eq("developer_id", params.developer)
  }
  if (params.sprint) {
    bugQuery = bugQuery.eq("sprint_id", params.sprint)
    chartBugQuery = chartBugQuery.eq("sprint_id", params.sprint)
  }

  // Fetch summary stats
  const today = new Date().toISOString().split("T")[0]
  const { count: activeSprints } = await supabase
    .from("sprints")
    .select("*", { count: "exact", head: true })
    .lte("start_date", today)
    .gte("end_date", today)

  const { count: totalBugs } = await bugQuery

  const { data: penaltyData } = await chartBugQuery

  const totalPenalty = penaltyData?.reduce((sum, bug) => sum + (Number(bug.penalty_amount) || 0), 0) || 0

  const { count: totalDevs } = await supabase.from("developers").select("*", { count: "exact", head: true })

  // Fetch all developers and sprints for filter options
  const { data: developers } = await supabase.from("developers").select("id, name").order("name")

  const { data: sprints } = await supabase.from("sprints").select("id, name").order("created_at", { ascending: false })

  // Process data for charts
  const bugsByDevMap = new Map<string, number>()
  const bugsBySprintMap = new Map<string, number>()
  const bugsByStatusMap = new Map<string, number>()

  penaltyData?.forEach((bug) => {
    const devName = bug.developer?.name || "Unassigned"
    const sprintName = bug.sprint?.name || "No Sprint"
    const status = bug.penalty_status || "pending"

    bugsByDevMap.set(devName, (bugsByDevMap.get(devName) || 0) + 1)
    bugsBySprintMap.set(sprintName, (bugsBySprintMap.get(sprintName) || 0) + 1)
    bugsByStatusMap.set(status, (bugsByStatusMap.get(status) || 0) + 1)
  })

  const bugsByDev = Array.from(bugsByDevMap.entries()).map(([name, count]) => ({
    developer: { name },
    count,
  }))

  const bugsBySprint = Array.from(bugsBySprintMap.entries()).map(([name, count]) => ({
    sprint: { name },
    count,
  }))

  const bugsByStatus = Array.from(bugsByStatusMap.entries()).map(([status, count]) => ({
    penalty_status: status,
    count,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <DashboardFilters developers={developers || []} sprints={sprints || []} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penalty</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPenalty)}
            </div>
            <p className="text-xs text-muted-foreground">Accumulated from all bugs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sprints</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSprints || 0}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBugs || 0}</div>
            <p className="text-xs text-muted-foreground">Recorded in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Developers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevs || 0}</div>
            <p className="text-xs text-muted-foreground">Active contributors</p>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts bugsByDev={bugsByDev} bugsBySprint={bugsBySprint} bugsByStatus={bugsByStatus} />
    </div>
  )
}
