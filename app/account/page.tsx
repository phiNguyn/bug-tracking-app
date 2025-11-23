"use client"

import { AccountForm } from "@/components/account-form"
import { useCurrentUser } from "@/lib/hooks/use-current-user"
import { PageHeaderSkeleton } from "@/components/page-header-skeleton"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountPage() {
  const { user, developer, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <Card className="p-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </Card>
      </div>
    )
  }

  if (!user || !developer) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <Card className="p-6">
          <p className="text-muted-foreground">
            {!user ? "Please log in to view your account settings." : "Developer profile not found."}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your personal account information</p>
      </div>

      <AccountForm developer={developer} />
    </div>
  )
}
