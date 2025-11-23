"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddDeveloperDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const avatar_url = formData.get("avatar_url") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string

    console.log("[v0] Creating developer account:", { name, email, role })

    try {
      // Step 1: Create auth account
      console.log("[v0] Step 1: Creating auth account...")
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/login`,
          data: {
            role: role || "user",
            name: name,
          },
        },
      })

      console.log("[v0] Auth result:", { authData, authError })

      if (authError) {
        console.error("[v0] Auth error:", authError)
        throw new Error(`Failed to create account: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error("No user data returned from signup")
      }

      // Step 2: Create developer profile
      console.log("[v0] Step 2: Creating developer profile with ID:", authData.user.id)
      const { error: devError } = await supabase.from("developers").insert({
        id: authData.user.id,
        name,
        email,
        avatar_url: avatar_url || null,
        role: role || "user",
      })

      console.log("[v0] Developer insert result:", { devError })

      if (devError) {
        console.error("[v0] Developer insert error:", devError)
        // Try to clean up auth user if developer creation fails
        // Note: This may not work due to RLS, but we try anyway
        await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {})
        throw new Error(`Failed to create developer profile: ${devError.message}`)
      }

      console.log("[v0] Developer created successfully!")
      toast.success("Developer added successfully! Confirmation email sent to " + email)
      setOpen(false)
      router.refresh()

      // Reset form
      e.currentTarget.reset()
    } catch (error: any) {
      console.error("[v0] Error in add developer:", error)
      toast.error(error.message || "Failed to add developer. Please check console for details.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Developer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Developer</DialogTitle>
            <DialogDescription>
              Create a new developer account. They will receive a confirmation email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="sm:text-right">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input id="name" name="name" placeholder="John Doe" className="sm:col-span-3" required />
            </div>
            <div className="grid sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="sm:text-right">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                className="sm:col-span-3"
                required
              />
            </div>
            <div className="grid sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="sm:text-right">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min 6 characters"
                className="sm:col-span-3"
                minLength={6}
                required
              />
            </div>
            <div className="grid sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="sm:text-right">
                Role
              </Label>
              <Select name="role" defaultValue="user">
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="avatar_url" className="sm:text-right">
                Avatar URL
              </Label>
              <Input id="avatar_url" name="avatar_url" placeholder="https://..." className="sm:col-span-3" />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
