"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2, Shield, LogOut } from "lucide-react"
import type { Developer } from "@/lib/types"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface AccountFormProps {
  developer: Developer
}

export function AccountForm({ developer }: AccountFormProps) {
  const [name, setName] = useState(developer.name)
  const [avatarUrl, setAvatarUrl] = useState(developer.avatar_url || "")
  const [loading, setLoading] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Updating developer:", developer.id)
      const { error } = await supabase
        .from("developers")
        .update({
          name,
          avatar_url: avatarUrl || null,
        })
        .eq("id", developer.id)

      if (error) {
        console.error("[v0] Update error:", error)
        throw error
      }

      console.log("[v0] Developer updated successfully")
      toast({
        title: "Profile updated",
        description: "Your account information has been saved successfully",
      })

      router.refresh()
    } catch (err: any) {
      console.error("[v0] Update failed:", err)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      console.log("[v0] Logging out...")
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("[v0] Logout error:", error)
        throw error
      }

      console.log("[v0] Logged out successfully")
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })

      router.push("/auth/login")
      router.refresh()
    } catch (err: any) {
      console.error("[v0] Logout failed:", err)
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: err.message,
      })
      setLoggingOut(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {developer.role === "super_admin" && (
              <Badge variant="default" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Super Admin
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 bg-transparent"
            >
              {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              Logout
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={developer.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.push("/")} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
