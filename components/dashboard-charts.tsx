"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface DashboardChartsProps {
  bugsByDev: any[]
  bugsBySprint: any[]
  bugsByStatus: any[]
}

export function DashboardCharts({ bugsByDev, bugsBySprint, bugsByStatus }: DashboardChartsProps) {
  // Process data for charts
  
  // 1. Penalty by Developer
  const devStats = bugsByDev.reduce((acc: any, curr: any) => {
    const name = curr.developer?.name || 'Unknown'
    if (!acc[name]) {
      acc[name] = { name, amount: 0, bugs: 0 }
    }
    acc[name].amount += Number(curr.penalty_amount)
    acc[name].bugs += 1
    return acc
  }, {})
  const devChartData = Object.values(devStats).sort((a: any, b: any) => b.amount - a.amount)

  // 2. Penalty by Sprint
  const sprintStats = bugsBySprint.reduce((acc: any, curr: any) => {
    const name = curr.sprint?.name || 'Unknown'
    if (!acc[name]) {
      acc[name] = { name, amount: 0 }
    }
    acc[name].amount += Number(curr.penalty_amount)
    return acc
  }, {})
  const sprintChartData = Object.values(sprintStats)

  // 3. Penalty Status Distribution
  const statusStats = bugsByStatus.reduce((acc: any, curr: any) => {
    const status = curr.penalty_status
    if (!acc[status]) {
      acc[status] = { name: status, value: 0 }
    }
    acc[status].value += Number(curr.penalty_amount)
    return acc
  }, {})
  const statusChartData = Object.values(statusStats)

  const COLORS = ['#ef4444', '#22c55e', '#6b7280'] // Red (pending), Green (paid), Gray (waived)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Penalty by Developer</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={devChartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Bar dataKey="amount" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-primary" />
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
                    <Cell key={`cell-${index}`} fill={
                      entry.name === 'paid' ? '#22c55e' : 
                      entry.name === 'waived' ? '#6b7280' : '#ef4444'
                    } />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Penalty by Sprint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintChartData}>
                <XAxis 
                  dataKey="name" 
                  stroke="#888888" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px' }}
                />
                <Bar dataKey="amount" fill="#adfa1d" radius={[4, 4, 0, 0]} className="fill-blue-500" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
