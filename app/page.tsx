"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Bug, Timer, Users } from "lucide-react";
import { DashboardCharts } from "@/components/dashboard-charts";
import { DashboardFilters } from "@/components/dashboard-filters";
import { DeveloperLeaderboard } from "@/components/developer-leaderboard";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsGridSkeleton } from "@/components/stats-skeleton";
import { ChartSkeleton } from "@/components/chart-skeleton";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeSprints: 0,
    totalBugs: 0,
    totalPenalty: 0,
    totalDevs: 0,
  });
  const [chartData, setChartData] = useState({
    bugsByDev: [] as Array<{
      developer: { name: string };
      count: number;
      penalty: number;
    }>,
    bugsBySprint: [] as Array<{
      sprint: { name: string };
      count: number;
      penalty: number;
    }>,
    bugsByStatus: [] as Array<{ penalty_status: string; count: number }>,
  });
  const [filterOptions, setFilterOptions] = useState({
    developers: [] as Array<{ id: string; name: string }>,
    sprints: [] as Array<{ id: string; name: string }>,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const supabase = createClient();

      const developer = searchParams.get("developer");
      const sprint = searchParams.get("sprint");

      // Build filter conditions
      let bugQuery = supabase
        .from("bugs")
        .select("*", { count: "exact", head: true });
      let chartBugQuery = supabase.from("bugs").select(`
        penalty_amount,
        penalty_status,
        developer:developers(name),
        sprint:sprints(name)
      `);

      if (developer) {
        bugQuery = bugQuery.eq("developer_id", developer);
        chartBugQuery = chartBugQuery.eq("developer_id", developer);
      }
      if (sprint) {
        bugQuery = bugQuery.eq("sprint_id", sprint);
        chartBugQuery = chartBugQuery.eq("sprint_id", sprint);
      }

      // Fetch summary stats
      const today = new Date().toISOString().split("T")[0];
      const { count: activeSprints } = await supabase
        .from("sprints")
        .select("*", { count: "exact", head: true })
        .lte("start_date", today)
        .gte("end_date", today);

      const { count: totalBugs } = await bugQuery;

      const { data: penaltyData } = await chartBugQuery;

      const totalPenalty =
        penaltyData?.reduce(
          (sum, bug) => sum + (Number(bug.penalty_amount) || 0),
          0
        ) || 0;

      const { count: totalDevs } = await supabase
        .from("developers")
        .select("*", { count: "exact", head: true });

      // Fetch filter options
      const { data: developers } = await supabase
        .from("developers")
        .select("id, name")
        .order("name");
      const { data: sprints } = await supabase
        .from("sprints")
        .select("id, name")
        .order("created_at", { ascending: false });

      // Process data for charts
      const bugsByDevMap = new Map<
        string,
        { count: number; penalty: number }
      >();
      const bugsBySprintMap = new Map<
        string,
        { count: number; penalty: number }
      >();
      const bugsByStatusMap = new Map<string, number>();

      penaltyData?.forEach((bug) => {
        const devName = bug.developer?.name || "Unassigned";
        const sprintName = bug.sprint?.name || "No Sprint";
        const status = bug.penalty_status || "pending";
        const penalty = Number(bug.penalty_amount) || 0;

        const devEntry = bugsByDevMap.get(devName) || { count: 0, penalty: 0 };
        bugsByDevMap.set(devName, {
          count: devEntry.count + 1,
          penalty: devEntry.penalty + penalty,
        });

        const sprintEntry = bugsBySprintMap.get(sprintName) || {
          count: 0,
          penalty: 0,
        };
        bugsBySprintMap.set(sprintName, {
          count: sprintEntry.count + 1,
          penalty: sprintEntry.penalty + penalty,
        });

        bugsByStatusMap.set(status, (bugsByStatusMap.get(status) || 0) + 1);
      });

      const bugsByDev = Array.from(bugsByDevMap.entries()).map(
        ([name, data]) => ({
          developer: { name },
          count: data.count,
          penalty: data.penalty,
        })
      );

      const bugsBySprint = Array.from(bugsBySprintMap.entries()).map(
        ([name, data]) => ({
          sprint: { name },
          count: data.count,
          penalty: data.penalty,
        })
      );

      const bugsByStatus = Array.from(bugsByStatusMap.entries()).map(
        ([status, count]) => ({
          penalty_status: status,
          count,
        })
      );

      setStats({
        activeSprints: activeSprints || 0,
        totalBugs: totalBugs || 0,
        totalPenalty,
        totalDevs: totalDevs || 0,
      });

      setChartData({
        bugsByDev,
        bugsBySprint,
        bugsByStatus,
      });

      setFilterOptions({
        developers: developers || [],
        sprints: sprints || [],
      });

      setLoading(false);
    }

    fetchData();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-[200px]" />
        <StatsGridSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Suspense fallback={<Skeleton className="h-10 w-[400px]" />}>
          <DashboardFilters
            developers={filterOptions.developers}
            sprints={filterOptions.sprints}
          />
        </Suspense>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng tiền phạt
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(stats.totalPenalty)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tích lũy từ tất cả bugs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sprint đang chạy
            </CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSprints}</div>
            <p className="text-xs text-muted-foreground">Hiện tại</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Bugs</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBugs}</div>
            <p className="text-xs text-muted-foreground">
              Ghi nhận trong hệ thống
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Developers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDevs}</div>
            <p className="text-xs text-muted-foreground">
              Thành viên hoạt động
            </p>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
        <DeveloperLeaderboard />
      </Suspense>

      {/* Charts */}
      <DashboardCharts
        bugsByDev={chartData.bugsByDev}
        bugsBySprint={chartData.bugsBySprint}
        bugsByStatus={chartData.bugsByStatus}
      />
    </div>
  );
}
