"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"
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

  leaderboardData.sort((a, b) => {
    if (b.totalPenalty !== a.totalPenalty) return b.totalPenalty - a.totalPenalty
    return b.bugCount - a.bugCount
  })

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-[hsl(var(--coffee-gold))]" />
    if (index === 1) return <Medal className="h-6 w-6 text-[hsl(var(--coffee-silver))]" />
    if (index === 2) return <Award className="h-6 w-6 text-[hsl(var(--coffee-bronze))]" />
    return <TrendingUp className="h-5 w-5 text-muted-foreground" />
  }

  const getRankBadgeColor = (index: number) => {
    if (index === 0)
      return "bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-900/40 border-amber-300 dark:border-amber-700/50"
    if (index === 1)
      return "bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900/40 dark:to-gray-800/40 border-slate-300 dark:border-slate-600/50"
    if (index === 2)
      return "bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/40 dark:to-amber-900/40 border-orange-300 dark:border-orange-700/50"
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
                <div className="flex-shrink-0 flex items-center justify-center">{getRankIcon(index)}</div>

                {/* Developer Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base truncate">{entry.developerName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {entry.bugCount} bug{entry.bugCount !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Penalty Amount - now the primary sorting metric */}
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm sm:text-lg text-destructive">
                    {entry.totalPenalty.toLocaleString("vi-VN")} ₫
                  </p>
                  {index < 3 && <p className="text-xs text-muted-foreground">Hạng {index + 1}</p>}
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
