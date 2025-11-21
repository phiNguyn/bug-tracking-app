"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Developer, Sprint } from "@/lib/types"

interface BugFiltersProps {
  developers: Developer[]
  sprints: Sprint[]
  onFilterChange: (filters: BugFiltersState) => void
}

export interface BugFiltersState {
  developer: string | null
  sprint: string | null
  status: string | null
}

export function BugFilters({ developers, sprints, onFilterChange }: BugFiltersProps) {
  const [filters, setFilters] = useState<BugFiltersState>({
    developer: null,
    sprint: null,
    status: null,
  })

  const handleFilterChange = (key: keyof BugFiltersState, value: string | null) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const emptyFilters = { developer: null, sprint: null, status: null }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filter Bugs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Developer</label>
            <Select
              value={filters.developer || "all"}
              onValueChange={(value) => handleFilterChange("developer", value === "all" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All developers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All developers</SelectItem>
                {developers.map((dev) => (
                  <SelectItem key={dev.id} value={dev.id}>
                    {dev.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sprint</label>
            <Select
              value={filters.sprint || "all"}
              onValueChange={(value) => handleFilterChange("sprint", value === "all" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All sprints" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sprints</SelectItem>
                {sprints.map((sprint) => (
                  <SelectItem key={sprint.id} value={sprint.id}>
                    {sprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value === "all" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="waived">Waived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              className="w-full bg-transparent"
            >
              <X className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.developer && (
              <Badge variant="secondary">Developer: {developers.find((d) => d.id === filters.developer)?.name}</Badge>
            )}
            {filters.sprint && (
              <Badge variant="secondary">Sprint: {sprints.find((s) => s.id === filters.sprint)?.name}</Badge>
            )}
            {filters.status && <Badge variant="secondary">Status: {filters.status}</Badge>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
