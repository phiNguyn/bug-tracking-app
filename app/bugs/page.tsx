"use client"

import { BugListWithFilters } from "@/components/bug-list-with-filters"
import { AddBugDialog } from "@/components/add-bug-dialog"
import { useBugs } from "@/lib/queries/bugs"
import { useDevelopers } from "@/lib/queries/developers"
import { useSprints } from "@/lib/queries/sprints"
import { PageHeaderSkeleton } from "@/components/page-header-skeleton"
import { BugListSkeleton } from "@/components/bug-list-skeleton"

export default function BugsPage() {
  const { data: bugs, isLoading: bugsLoading } = useBugs()
  const { data: developers, isLoading: developersLoading } = useDevelopers()
  const { data: sprints, isLoading: sprintsLoading } = useSprints()

  const isLoading = bugsLoading || developersLoading || sprintsLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <BugListSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Bugs</h1>
        <AddBugDialog developers={developers || []} sprints={sprints || []} />
      </div>
      <BugListWithFilters bugs={bugs || []} developers={developers || []} sprints={sprints || []} />
    </div>
  )
}
