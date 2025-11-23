"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts"

interface DashboardChartsProps {
  bugsByDev: Array<{ developer: { name: string }; count: number; penalty: number }>
  bugsBySprint: Array<{ sprint: { name: string }; count: number; penalty: number }>
  bugsByStatus: Array<{ penalty_status: string; count: number }>
}

const CHART_COLORS = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  tertiary: "hsl(var(--chart-3))",
  quaternary: "hsl(var(--chart-4))",
  quinary: "hsl(var(--chart-5))",
  paid: "hsl(var(--chart-3))", // Latte - light and positive
  pending: "hsl(var(--chart-1))", // Espresso - strong attention
  waived: "hsl(var(--chart-4))", // Cappuccino - neutral
}

export function DashboardCharts({ bugsByDev, bugsBySprint, bugsByStatus }: DashboardChartsProps) {
  const devChartData = bugsByDev.map((item) => ({
    name: item.developer.name,
    bugs: item.count,
    penalty: item.penalty,
  }))

  const sprintChartData = bugsBySprint.map((item) => ({
    name: item.sprint.name,
    bugs: item.count,
    penalty: item.penalty,
  }))

  const statusChartData = bugsByStatus.map((item) => ({
    name: item.penalty_status === "paid" ? "Đã đóng" : item.penalty_status === "pending" ? "Chưa đóng" : "Miễn phí",
    value: item.count,
    status: item.penalty_status,
  }))

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      {/* Bugs by Developer Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Bugs theo Developer</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              bugs: {
                label: "Số bugs",
                color: CHART_COLORS.primary,
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={devChartData}>
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="bugs" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Penalty Status Pie Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Trạng thái đóng phạt</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              paid: {
                label: "Đã đóng",
                color: CHART_COLORS.paid,
              },
              pending: {
                label: "Chưa đóng",
                color: CHART_COLORS.pending,
              },
              waived: {
                label: "Miễn phí",
                color: CHART_COLORS.waived,
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.status === "paid"
                          ? CHART_COLORS.paid
                          : entry.status === "pending"
                            ? CHART_COLORS.pending
                            : CHART_COLORS.waived
                      }
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bugs by Sprint Chart - Full Width */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Bugs theo Sprint</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              bugs: {
                label: "Số bugs",
                color: CHART_COLORS.secondary,
              },
            }}
            className="h-[300px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintChartData}>
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="bugs" fill={CHART_COLORS.secondary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
