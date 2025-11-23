"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award } from "lucide-react"
import { useState } from "react"
import { useSprints, useActiveSprint } from "@/lib/queries/sprints"
import { useBugs } from "@/lib/queries/bugs"
import { Skeleton } from "@/components/ui/skeleton"

interface LeaderboardEntry {
  developerId: string
  developerName: string
  bugCount: number
  totalPenalty: number
}

export function DeveloperLeaderboard() {
  const { data: sprints, isLoading: sprintsLoading } = useSprints()
  const { data: activeSprint } = useActiveSprint()
  const { data: bugs, isLoading: bugsLoading } = useBugs()

  const [selectedSprintId, setSelectedSprintId] = useState<string>("")

  // Use active sprint by default
  const currentSprintId = selectedSprintId || activeSprint?.id || ""

  // Calculate leaderboard data
  const leaderboardData: LeaderboardEntry[] = []
  if (bugs && currentSprintId) {
    const sprintBugs = bugs.filter((bug) => bug.sprint_id === currentSprintId)
    const devMap = new Map<string, LeaderboardEntry>()

    sprintBugs.forEach((bug) => {
      const devId = bug.developer_id
      const devName = bug.developer?.name || "Unknown"
      const penalty = bug.penalty_amount || 0

      if (devMap.has(devId)) {
        const entry = devMap.get(devId)!
        entry.bugCount += 1
        entry.totalPenalty += penalty
      } else {
        devMap.set(devId, {
          developerId: devId,
          developerName: devName,
          bugCount: 1,
          totalPenalty: penalty,
        })
      }
    })

    leaderboardData.push(...Array.from(devMap.values()))
  }

  // Sort by bug count (descending), then by penalty (descending)
  leaderboardData.sort((a, b) => {
    if (b.bugCount !== a.bugCount) return b.bugCount - a.bugCount
    return b.totalPenalty - a.totalPenalty
  })

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Award className="h-5 w-5 text-amber-600" />
    return (
      <span className="h-5 w-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
        #{index + 1}
      </span>
    )
  }

  const getRankBadgeColor = (index: number) => {
    if (index === 0)
      return "bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-300 dark:border-yellow-700"
    if (index === 1)
      return "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/30 dark:to-gray-700/30 border-gray-300 dark:border-gray-600"
    if (index === 2)
      return "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-300 dark:border-amber-700"
    return "bg-card border-border"
  }

  if (sprintsLoading || bugsLoading) {
    return <LeaderboardSkeleton />
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Bảng xếp hạng Developer
          </CardTitle>
          <Select value={currentSprintId} onValueChange={setSelectedSprintId}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Chọn sprint" />
            </SelectTrigger>
            <SelectContent>
              {sprints?.map((sprint) => (
                <SelectItem key={sprint.id} value={sprint.id}>
                  {sprint.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {leaderboardData.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Chưa có dữ liệu cho sprint này</div>
        ) : (
          <div className="divide-y">
            {leaderboardData.map((entry, index) => (
              <div
                key={entry.developerId}
                className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors ${
                  index < 3 ? getRankBadgeColor(index) : ""
                }`}
              >
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  {index < 3 ? (
                    <div className="relative">
                      {getRankIcon(index)}
                      <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {index + 1}
                      </div>
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Developer Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base truncate">{entry.developerName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {entry.bugCount} bug{entry.bugCount !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Penalty Amount */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm sm:text-lg text-destructive">
                    {entry.totalPenalty.toLocaleString("vi-VN")} ₫
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function LeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
            <Skeleton className="h-6 w-[80px]" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
