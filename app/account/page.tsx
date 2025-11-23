"use client"

import { AccountForm } from "@/components/account-form"
import { useCurrentUser } from "@/lib/hooks/use-current-user"
import { PageHeaderSkeleton } from "@/components/page-header-skeleton"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const { user, developer, isLoading } = useCurrentUser()
  const router = useRouter()

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

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your personal account information</p>
        </div>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Please log in to view your account settings.</span>
            <Button onClick={() => router.push("/auth/login")} size="sm">
              Go to Login
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!developer) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your personal account information</p>
        </div>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <div className="font-medium">Setting up your profile...</div>
              <div className="text-sm mt-1">
                Your developer profile is being created. Please refresh the page in a moment.
              </div>
            </div>
            <Button onClick={() => router.refresh()} size="sm" variant="outline">
              Refresh
            </Button>
          </AlertDescription>
        </Alert>
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
