import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Bug, Timer, Users } from 'lucide-react'
import { DashboardCharts } from '@/components/dashboard-charts'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch summary stats
  const today = new Date().toISOString().split('T')[0]
  const { count: activeSprints } = await supabase
    .from('sprints')
    .select('*', { count: 'exact', head: true })
    .lte('start_date', today)
    .gte('end_date', today)

  const { count: totalBugs } = await supabase
    .from('bugs')
    .select('*', { count: 'exact', head: true })

  const { data: penaltyData } = await supabase
    .from('bugs')
    .select('penalty_amount')
  
  const totalPenalty = penaltyData?.reduce((sum, bug) => sum + (Number(bug.penalty_amount) || 0), 0) || 0

  const { count: totalDevs } = await supabase
    .from('developers')
    .select('*', { count: 'exact', head: true })

  // Fetch data for charts
  const { data: bugsByDev } = await supabase
    .from('bugs')
    .select(`
      penalty_amount,
      developer:developers(name)
    `)

  const { data: bugsBySprint } = await supabase
    .from('bugs')
    .select(`
      penalty_amount,
      sprint:sprints(name)
    `)

  const { data: bugsByStatus } = await supabase
    .from('bugs')
    .select('penalty_status, penalty_amount')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penalty</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPenalty)}</div>
            <p className="text-xs text-muted-foreground">
              Accumulated from all bugs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sprints</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSprints || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBugs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Recorded in system
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Developers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active contributors
            </p>
          </CardContent>
        </Card>
      </div>

      <DashboardCharts 
        bugsByDev={bugsByDev || []}
        bugsBySprint={bugsBySprint || []}
        bugsByStatus={bugsByStatus || []}
      />
    </div>
  )
}
