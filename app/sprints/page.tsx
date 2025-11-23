"use client"

import { SprintList } from "@/components/sprint-list"
import { AddSprintDialog } from "@/components/add-sprint-dialog"
import { useSprints } from "@/lib/queries/sprints"
import { PageHeaderSkeleton } from "@/components/page-header-skeleton"
import { SprintListSkeleton } from "@/components/sprint-list-skeleton"

export default function SprintsPage() {
  const { data: sprints, isLoading } = useSprints()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <SprintListSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Sprints</h1>
        <AddSprintDialog />
      </div>
      <SprintList sprints={sprints || []} />
    </div>
  )
}
