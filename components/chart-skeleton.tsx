import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-end justify-between gap-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="w-full" style={{ height: `${Math.random() * 60 + 40}%` }} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PieChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-[200px]" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
          <Skeleton className="h-48 w-48 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}
