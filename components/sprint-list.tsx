"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Sprint } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarDays, MoreHorizontal, Pencil, Trash, LinkIcon, Copy } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { EditSprintDialog } from "./edit-sprint-dialog"

interface SprintListProps {
  sprints: Sprint[]
}

export function SprintList({ sprints }: SprintListProps) {
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null)
  const [deletingSprint, setDeletingSprint] = useState<Sprint | null>(null)
  const [penaltyUrlSprint, setPenaltyUrlSprint] = useState<Sprint | null>(null)
  const [penaltyUrl, setPenaltyUrl] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!deletingSprint) return

    try {
      const { error } = await supabase.from("sprints").delete().eq("id", deletingSprint.id)

      if (error) throw error

      toast.success("Sprint deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete sprint")
      console.error(error)
    } finally {
      setDeletingSprint(null)
    }
  }

  const handleSavePenaltyUrl = async () => {
    if (!penaltyUrlSprint) return

    try {
      const { error } = await supabase
        .from("sprints")
        .update({ penalty_url: penaltyUrl || null })
        .eq("id", penaltyUrlSprint.id)

      if (error) throw error

      toast.success("Penalty URL saved successfully")
      setPenaltyUrlSprint(null)
      setPenaltyUrl("")
      router.refresh()
    } catch (error) {
      toast.error("Failed to save penalty URL")
      console.error(error)
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success("URL copied to clipboard")
  }

  if (sprints.length === 0) {
    return <div className="text-center text-muted-foreground py-10">No sprints found. Create one to get started.</div>
  }

  const today = new Date()

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sprints.map((sprint) => {
          const startDate = new Date(sprint.start_date)
          const endDate = new Date(sprint.end_date)
          const isActive = today >= startDate && today <= endDate
          const isPast = today > endDate

          return (
            <Card key={sprint.id} className={isActive ? "border-primary" : ""}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-medium">{sprint.name}</CardTitle>
                  {isActive && <Badge>Active</Badge>}
                  {isPast && <Badge variant="secondary">Completed</Badge>}
                  {!isActive && !isPast && <Badge variant="outline">Upcoming</Badge>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingSprint(sprint)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setPenaltyUrlSprint(sprint)
                        setPenaltyUrl(sprint.penalty_url || "")
                      }}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Set Penalty URL
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => setDeletingSprint(sprint)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>
                    {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                  </span>
                </div>

                {sprint.penalty_url && (
                  <div className="mt-4 p-2 bg-muted rounded-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Penalty URL:</p>
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={sprint.penalty_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary underline truncate hover:no-underline"
                      >
                        {sprint.penalty_url}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopyUrl(sprint.penalty_url!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {editingSprint && (
        <EditSprintDialog
          sprint={editingSprint}
          open={!!editingSprint}
          onOpenChange={(open) => !open && setEditingSprint(null)}
        />
      )}

      <Dialog open={!!penaltyUrlSprint} onOpenChange={(open) => !open && setPenaltyUrlSprint(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Penalty Payment URL</DialogTitle>
            <DialogDescription>
              Enter the URL where developers can pay penalties for bugs in sprint "{penaltyUrlSprint?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="penalty-url">Payment URL</Label>
              <Input
                id="penalty-url"
                placeholder="https://payment.example.com/..."
                value={penaltyUrl}
                onChange={(e) => setPenaltyUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setPenaltyUrlSprint(null)}>
              Cancel
            </Button>
            <Button onClick={handleSavePenaltyUrl}>Save URL</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingSprint} onOpenChange={(open) => !open && setDeletingSprint(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sprint and all associated bugs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
