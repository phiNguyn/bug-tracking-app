"use client"

import { useState, useMemo } from "react"
import type { BugWithDetails, Developer, Sprint } from "@/lib/types"
import { BugFilters, type BugFiltersState } from "./bug-filters"
import { BugList } from "./bug-list"

interface BugListWithFiltersProps {
  bugs: BugWithDetails[]
  developers: Developer[]
  sprints: Sprint[]
}

export function BugListWithFilters({ bugs, developers, sprints }: BugListWithFiltersProps) {
  const [filters, setFilters] = useState<BugFiltersState>({
    developer: null,
    sprint: null,
    status: null,
  })

  // Filter bugs based on selected filters
  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      if (filters.developer && bug.developer_id !== filters.developer) {
        return false
      }
      if (filters.sprint && bug.sprint_id !== filters.sprint) {
        return false
      }
      if (filters.status && bug.penalty_status !== filters.status) {
        return false
      }
      return true
    })
  }, [bugs, filters])

  return (
    <div className="space-y-6">
      <BugFilters developers={developers} sprints={sprints} onFilterChange={setFilters} />

      {/* Show count of filtered bugs */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredBugs.length} of {bugs.length} bugs
      </div>

      <BugList bugs={filteredBugs} developers={developers} sprints={sprints} />
    </div>
  )
}
