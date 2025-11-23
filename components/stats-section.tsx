"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, Bug, AlertCircle } from "lucide-react"
import type { BugWithDetails, Developer, Sprint } from "@/lib/types"

interface StatsSectionProps {
  bugs: BugWithDetails[]
  developers: Developer[]
  sprints: Sprint[]
}

export function StatsSection({ bugs, developers, sprints }: StatsSectionProps) {
  const [filterBy, setFilterBy] = useState<"all" | "developer" | "sprint">("all")
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>("")
  const [selectedSprint, setSelectedSprint] = useState<string>("")

  // Filter bugs based on selection
  const filteredBugs = useMemo(() => {
    let result = bugs

    if (filterBy === "developer" && selectedDeveloper) {
      result = result.filter((b) => b.developer_id === selectedDeveloper)
    }

    if (filterBy === "sprint" && selectedSprint) {
      result = result.filter((b) => b.sprint_id === selectedSprint)
    }

    return result
  }, [bugs, filterBy, selectedDeveloper, selectedSprint])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredBugs.length
    const totalPenalty = filteredBugs.reduce((sum, b) => sum + (Number(b.penalty_amount) || 0), 0)
    const pending = filteredBugs.filter((b) => b.penalty_status === "pending").length
    const paid = filteredBugs.filter((b) => b.penalty_status === "paid").length
    const waived = filteredBugs.filter((b) => b.penalty_status === "waived").length
    const pendingPenalty = filteredBugs
      .filter((b) => b.penalty_status === "pending")
      .reduce((sum, b) => sum + (Number(b.penalty_amount) || 0), 0)

    return { total, totalPenalty, pending, paid, waived, pendingPenalty }
  }, [filteredBugs])

  // Data for developer chart
  const developerData = useMemo(() => {
    const devStats: Record<string, { name: string; bugs: number; penalty: number }> = {}

    bugs.forEach((bug) => {
      if (!devStats[bug.developer_id]) {
        devStats[bug.developer_id] = {
          name: bug.developer.name,
          bugs: 0,
          penalty: 0,
        }
      }
      devStats[bug.developer_id].bugs += 1
      devStats[bug.developer_id].penalty += Number(bug.penalty_amount) || 0
    })

    return Object.values(devStats).sort((a, b) => b.penalty - a.penalty)
  }, [bugs])

  // Data for sprint chart
  const sprintData = useMemo(() => {
    const sprintStats: Record<string, { name: string; bugs: number; penalty: number }> = {}

    bugs.forEach((bug) => {
      if (!sprintStats[bug.sprint_id]) {
        sprintStats[bug.sprint_id] = {
          name: bug.sprint.name,
          bugs: 0,
          penalty: 0,
        }
      }
      sprintStats[bug.sprint_id].bugs += 1
      sprintStats[bug.sprint_id].penalty += Number(bug.penalty_amount) || 0
    })

    return Object.values(sprintStats).sort((a, b) => b.penalty - a.penalty)
  }, [bugs])

  // Status distribution
  const COFFEE_COLORS = {
    espresso: "hsl(var(--chart-1))", // Espresso brown
    mocha: "hsl(var(--chart-2))", // Mocha
    latte: "hsl(var(--chart-3))", // Latte - light
    cappuccino: "hsl(var(--chart-4))", // Cappuccino
    americano: "hsl(var(--chart-5))", // Americano
    pending: "hsl(25 95% 53%)", // Warm orange for pending
    paid: "hsl(142 76% 36%)", // Green for paid
    waived: "hsl(215 16% 47%)", // Neutral gray for waived
  }

  const statusData = [
    { name: "Chưa đóng", value: stats.pending, color: COFFEE_COLORS.pending },
    { name: "Đã đóng", value: stats.paid, color: COFFEE_COLORS.paid },
    { name: "Miễn phí", value: stats.waived, color: COFFEE_COLORS.waived },
  ].filter((d) => d.value > 0)

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Statistics Filters</CardTitle>
          <CardDescription>Filter statistics by developer or sprint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter By</label>
              <Select
                value={filterBy}
                onValueChange={(value: any) => {
                  setFilterBy(value)
                  setSelectedDeveloper("")
                  setSelectedSprint("")
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bugs</SelectItem>
                  <SelectItem value="developer">By Developer</SelectItem>
                  <SelectItem value="sprint">By Sprint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterBy === "developer" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Developer</label>
                <Select value={selectedDeveloper} onValueChange={setSelectedDeveloper}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select developer" />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.map((dev) => (
                      <SelectItem key={dev.id} value={dev.id}>
                        {dev.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterBy === "sprint" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Sprint</label>
                <Select value={selectedSprint} onValueChange={setSelectedSprint}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {sprints.map((sprint) => (
                      <SelectItem key={sprint.id} value={sprint.id}>
                        {sprint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penalty</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat("vi-VN").format(stats.totalPenalty)}</div>
            <p className="text-xs text-muted-foreground mt-1">₫</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Intl.NumberFormat("vi-VN").format(stats.pendingPenalty)} ₫
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="default" className="bg-red-500">
                {stats.pending}
              </Badge>
              <Badge variant="default" className="bg-green-500">
                {stats.paid}
              </Badge>
              <Badge variant="secondary">{stats.waived}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Developer Stats Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bugs by Developer</CardTitle>
            <CardDescription>Total bugs and penalties per developer</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={developerData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="bugs" fill={COFFEE_COLORS.espresso} name="Bug Count" radius={[8, 8, 0, 0]} />
                <Bar dataKey="penalty" fill={COFFEE_COLORS.mocha} name="Penalty (VND)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sprint Stats Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bugs by Sprint</CardTitle>
            <CardDescription>Total bugs and penalties per sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sprintData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="bugs" fill={COFFEE_COLORS.latte} name="Bug Count" radius={[8, 8, 0, 0]} />
                <Bar dataKey="penalty" fill={COFFEE_COLORS.cappuccino} name="Penalty (VND)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        {statusData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Bug status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
