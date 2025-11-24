"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, Copy, Check, Link2 } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AddDeveloperDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCreatedCreds(null)
      setCopied(false)
    }
    setOpen(newOpen)
  }

  const copyCredentials = () => {
    if (!createdCreds) return
    const text = `Email: ${createdCreds.email}\nPassword: ${createdCreds.password}\nLogin Link: ${window.location.origin}/auth/login`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Credentials copied to clipboard")
  }

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
        await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {})
        throw new Error(`Failed to create developer profile: ${devError.message}`)
      }

      console.log("[v0] Step 3: Sending Magic Link...")
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      })

      if (magicLinkError) {
        console.warn("[v0] Failed to send magic link:", magicLinkError)
        toast.warning("Developer created, but failed to send magic link.")
      } else {
        toast.success("Magic link sent to " + email)
      }

      console.log("[v0] Developer created successfully!")
      setCreatedCreds({ email, password })
      router.refresh()
    } catch (error: any) {
      console.error("[v0] Error in add developer:", error)
      toast.error(error.message || "Failed to add developer. Please check console for details.")
    } finally {
      setLoading(false)
    }
  }

  if (createdCreds) {
    return (
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Developer
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-[540px] p-0">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle className="flex items-center gap-2 text-green-600">
              <Check className="h-5 w-5" /> Account Created Successfully
            </SheetTitle>
            <SheetDescription>
              The developer account has been created and a magic login link has been sent to their email.
            </SheetDescription>
          </SheetHeader>

          <div className="px-6">
            <Alert className="bg-muted border-primary/20 mt-4">
              <Link2 className="h-4 w-4" />
              <AlertTitle>Magic Link Sent</AlertTitle>
              <AlertDescription>
                A login link has been sent to {createdCreds.email}. They can click it to log in instantly.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 my-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Input value={createdCreds.email} readOnly className="bg-muted font-mono" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="flex items-center gap-2">
                  <Input value={createdCreds.password} readOnly className="bg-muted font-mono" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Please copy and share this password with the developer securely. We cannot email it for security
                  reasons.
                </p>
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-row gap-2 px-6 pb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto bg-transparent"
                onClick={copyCredentials}
              >
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied" : "Copy Details"}
              </Button>
              <Button type="button" className="w-full sm:w-auto" onClick={() => setOpen(false)}>
                Done
              </Button>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Developer
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto p-0">
        <form onSubmit={onSubmit} className="flex h-full flex-col">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>Add Developer</SheetTitle>
            <SheetDescription>Create a new developer account. They will receive a confirmation email.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-5 py-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Min 6 characters"
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue="user">
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input id="avatar_url" name="avatar_url" placeholder="https://..." />
            </div>
          </div>
          <SheetFooter className="gap-2 px-6 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
