"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Developer, Sprint } from "@/lib/types"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"

interface AddBugDialogProps {
  developers: Developer[]
  sprints: Sprint[]
}

export function AddBugDialog({ developers, sprints }: AddBugDialogProps) {
  const [open, setOpen] = useState(false)
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

    try {
      const { error } = await supabase.from("bugs").insert({
        title,
        description,
        penalty_amount: Number(penalty_amount),
        developer_id,
        sprint_id,
        image_url: image_url || null,
        penalty_status: "pending",
      })

      if (error) throw error

      toast.success("Bug recorded successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Failed to record bug")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Bug
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl">Record New Bug</DialogTitle>
            <DialogDescription className="text-base">
              Log a bug, assign a developer, select a sprint, and set the penalty amount.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Bug Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Login button not responsive"
                required
                className="h-10"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the bug in detail..."
                className="min-h-24 resize-none"
              />
            </div>

            {/* Two Column Layout for smaller screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Developer Field */}
              <div className="space-y-2">
                <Label htmlFor="developer" className="text-sm font-semibold">
                  Developer <span className="text-red-500">*</span>
                </Label>
                <Select name="developer_id" required>
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

              {/* Sprint Field */}
              <div className="space-y-2">
                <Label htmlFor="sprint" className="text-sm font-semibold">
                  Sprint <span className="text-red-500">*</span>
                </Label>
                <Select name="sprint_id" required>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select sprint" />
                  </SelectTrigger>
                  <SelectContent>
                    {sprints.length > 0 ? (
                      sprints.map((sprint) => (
                        <SelectItem key={sprint.id} value={sprint.id}>
                          {sprint.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-sprints" disabled>
                        No sprints available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Penalty and Image URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="penalty" className="text-sm font-semibold">
                  Penalty Amount (VND) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="penalty"
                  name="penalty_amount"
                  type="number"
                  placeholder="50000"
                  required
                  min="0"
                  step="1000"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-semibold">
                  Image URL
                </Label>
                <Input id="image" name="image_url" placeholder="https://..." className="h-10" />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Recording..." : "Record Bug"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
