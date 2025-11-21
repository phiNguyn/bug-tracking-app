"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Developer, Sprint, BugWithDetails } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface EditBugDialogProps {
  bug: BugWithDetails
  developers: Developer[]
  sprints: Sprint[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBugDialog({ bug, developers, sprints, open, onOpenChange }: EditBugDialogProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const penalty_amount = formData.get("penalty_amount") as string
    const developer_id = formData.get("developer_id") as string
    const sprint_id = formData.get("sprint_id") as string
    const image_url = formData.get("image_url") as string
    const penalty_status = formData.get("penalty_status") as string

    try {
      const { error } = await supabase
        .from("bugs")
        .update({
          title,
          description,
          penalty_amount: Number(penalty_amount),
          developer_id,
          sprint_id,
          image_url: image_url || null,
          penalty_status,
        })
        .eq("id", bug.id)

      if (error) throw error

      toast.success("Bug updated successfully")
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast.error("Failed to update bug")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl">Edit Bug</DialogTitle>
            <DialogDescription className="text-base">
              Update bug details, developer assignment, sprint, and penalty status.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Bug Title <span className="text-red-500">*</span>
              </Label>
              <Input id="title" name="title" defaultValue={bug.title} required className="h-10" />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={bug.description || ""}
                className="min-h-24 resize-none"
              />
            </div>

            {/* Developer and Sprint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="developer" className="text-sm font-semibold">
                  Developer <span className="text-red-500">*</span>
                </Label>
                <Select name="developer_id" defaultValue={bug.developer_id} required>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select developer" />
                  </SelectTrigger>
                  <SelectContent>
                    {developers.map((dev) => (
                      <SelectItem key={dev.id} value={dev.id}>
                        {dev.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sprint" className="text-sm font-semibold">
                  Sprint <span className="text-red-500">*</span>
                </Label>
                <Select name="sprint_id" defaultValue={bug.sprint_id} required>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {sprints.map((sprint) => (
                      <SelectItem key={sprint.id} value={sprint.id}>
                        {sprint.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Penalty and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="penalty" className="text-sm font-semibold">
                  Penalty Amount (VND) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="penalty"
                  name="penalty_amount"
                  type="number"
                  defaultValue={bug.penalty_amount}
                  required
                  min="0"
                  step="1000"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select name="penalty_status" defaultValue={bug.penalty_status} required>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="waived">Waived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-semibold">
                Image URL
              </Label>
              <Input
                id="image"
                name="image_url"
                defaultValue={bug.image_url || ""}
                placeholder="https://..."
                className="h-10"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
