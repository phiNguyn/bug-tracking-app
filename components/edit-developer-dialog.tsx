"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Developer } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface EditDeveloperDialogProps {
  developer: Developer
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDeveloperDialog({ developer, open, onOpenChange }: EditDeveloperDialogProps) {
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

    try {
      const { error } = await supabase
        .from("developers")
        .update({
          name,
          email,
          avatar_url: avatar_url || null,
        })
        .eq("id", developer.id)

      if (error) throw error

      toast.success("Developer updated successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error("Failed to update developer")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto p-0">
        <form onSubmit={onSubmit} className="flex h-full flex-col">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>Edit Developer</SheetTitle>
            <SheetDescription>Update developer details. Click save when you're done.</SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-5 py-6 px-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input id="name" name="name" defaultValue={developer.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input id="email" name="email" type="email" defaultValue={developer.email} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input id="avatar_url" name="avatar_url" defaultValue={developer.avatar_url || ""} />
            </div>
          </div>
          <SheetFooter className="gap-2 px-6 pb-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
