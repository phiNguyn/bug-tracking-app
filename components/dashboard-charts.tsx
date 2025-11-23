"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"

interface DashboardChartsProps {
  bugsByDev: Array<{ developer: { name: string }; count: number }>
  bugsBySprint: Array<{ sprint: { name: string }; count: number }>
  bugsByStatus: Array<{ penalty_status: string; count: number }>
}

export function DashboardCharts({ bugsByDev, bugsBySprint, bugsByStatus }: DashboardChartsProps) {
  const devChartData = bugsByDev.map((item) => ({
    name: item.developer.name,
    bugs: item.count,
  }))

  const sprintChartData = bugsBySprint.map((item) => ({
    name: item.sprint.name,
    bugs: item.count,
  }))

  const statusChartData = bugsByStatus.map((item) => ({
    name: item.penalty_status,
    value: item.count,
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Bugs by Developer</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={devChartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "8px" }} />
                <Bar dataKey="bugs" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Penalty Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.name === "paid" ? "#22c55e" : entry.name === "waived" ? "#6b7280" : "#ef4444"}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Bugs by Sprint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintChartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "transparent" }} contentStyle={{ borderRadius: "8px" }} />
                <Bar dataKey="bugs" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-blue-500" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
