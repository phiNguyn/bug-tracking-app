import { redirect } from "next/navigation"
import { getCurrentDeveloper } from "@/lib/auth"
import { AccountForm } from "@/components/account-form"

export default async function AccountPage() {
  const developer = await getCurrentDeveloper()

  if (!developer) {
    redirect("/auth/login")
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
