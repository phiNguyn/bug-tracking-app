"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts"

interface DashboardChartsProps {
  bugsByDev: Array<{ developer: { name: string }; count: number; penalty: number }>
  bugsBySprint: Array<{ sprint: { name: string }; count: number; penalty: number }>
  bugsByStatus: Array<{ penalty_status: string; count: number }>
}

const COFFEE_COLORS = {
  espresso: "hsl(var(--chart-1))", // Rich brown
  mocha: "hsl(var(--chart-2))", // Medium brown
  latte: "hsl(var(--chart-3))", // Light brown
  cappuccino: "hsl(var(--chart-4))", // Tan
  americano: "hsl(var(--chart-5))", // Dark brown
  paid: "hsl(142 76% 36%)", // Green
  pending: "hsl(25 95% 53%)", // Orange
  waived: "hsl(215 16% 47%)", // Gray
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
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
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
                color: COFFEE_COLORS.espresso,
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
                <Bar dataKey="bugs" fill={COFFEE_COLORS.espresso} radius={[8, 8, 0, 0]} />
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
                color: COFFEE_COLORS.paid,
              },
              pending: {
                label: "Chưa đóng",
                color: COFFEE_COLORS.pending,
              },
              waived: {
                label: "Miễn phí",
                color: COFFEE_COLORS.waived,
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
                          ? COFFEE_COLORS.paid
                          : entry.status === "pending"
                            ? COFFEE_COLORS.pending
                            : COFFEE_COLORS.waived
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

      {/* Bugs by Sprint Chart - Full Width on mobile, 2 cols on desktop */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Bugs theo Sprint</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              bugs: {
                label: "Số bugs",
                color: COFFEE_COLORS.mocha,
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
                <Bar dataKey="bugs" fill={COFFEE_COLORS.mocha} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
