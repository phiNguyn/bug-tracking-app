"use client"

import { StatsSection } from "@/components/stats-section"
import { useBugs } from "@/lib/queries/bugs"
import { useDevelopers } from "@/lib/queries/developers"
import { useSprints } from "@/lib/queries/sprints"
import { StatsSkeletonExtended } from "@/components/stats-skeleton-extended"

export default function StatisticsPage() {
  const { data: bugs, isLoading: bugsLoading } = useBugs()
  const { data: developers, isLoading: developersLoading } = useDevelopers()
  const { data: sprints, isLoading: sprintsLoading } = useSprints()

  const isLoading = bugsLoading || developersLoading || sprintsLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-9 w-40 bg-muted animate-pulse rounded-md mb-2" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded-md" />
        </div>
        <StatsSkeletonExtended />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistics</h1>
        <p className="text-muted-foreground mt-2">View detailed statistics about bugs, developers, and sprints</p>
      </div>
      <StatsSection bugs={bugs || []} developers={developers || []} sprints={sprints || []} />
    </div>
  )
}
