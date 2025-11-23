"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface DashboardFiltersProps {
  developers: Array<{ id: string; name: string }>
  sprints: Array<{ id: string; name: string }>
}

export function DashboardFilters({ developers, sprints }: DashboardFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedDeveloper = searchParams.get("developer")
  const selectedSprint = searchParams.get("sprint")

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/")
  }

  const hasFilters = selectedDeveloper || selectedSprint

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={selectedDeveloper || "all"}
        onValueChange={(value) => updateFilter("developer", value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Developers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Developers</SelectItem>
          {developers.map((dev) => (
            <SelectItem key={dev.id} value={dev.id}>
              {dev.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedSprint || "all"}
        onValueChange={(value) => updateFilter("sprint", value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Sprints" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sprints</SelectItem>
          {sprints.map((sprint) => (
            <SelectItem key={sprint.id} value={sprint.id}>
              {sprint.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}
