"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { BugWithDetails, Developer, Sprint } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { DollarSign, Calendar, MoreHorizontal, Pencil, Trash, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import { EditBugDialog } from "./edit-bug-dialog"

interface BugListProps {
  bugs: BugWithDetails[]
  developers?: Developer[]
  sprints?: Sprint[]
}

export function BugList({ bugs, developers = [], sprints = [] }: BugListProps) {
  const [editingBug, setEditingBug] = useState<BugWithDetails | null>(null)
  const [deletingBug, setDeletingBug] = useState<BugWithDetails | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!deletingBug) return

    try {
      const { error } = await supabase.from("bugs").delete().eq("id", deletingBug.id)

      if (error) throw error

      toast.success("Bug deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete bug")
      console.error(error)
    } finally {
      setDeletingBug(null)
    }
  }

  const handlePay = (bug: BugWithDetails) => {
    if (bug.sprint?.penalty_url) {
      window.open(bug.sprint.penalty_url, "_blank")
      toast.success("Opening payment page...")
    } else {
      toast.error("No payment URL configured for this sprint")
    }
  }

  const handleMarkAsPaid = async (bug: BugWithDetails) => {
    try {
      const { error } = await supabase.from("bugs").update({ penalty_status: "paid" }).eq("id", bug.id)

      if (error) throw error

      toast.success("Bug marked as paid")
      router.refresh()
    } catch (error) {
      toast.error("Failed to update bug status")
      console.error(error)
    }
  }

  if (bugs.length === 0) {
    return <div className="text-center text-muted-foreground py-10">No bugs recorded. Add one to get started.</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500 hover:bg-green-600"
      case "waived":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-red-500 hover:bg-red-600"
    }
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bugs.map((bug) => (
          <Card key={bug.id}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-medium line-clamp-1">{bug.title}</CardTitle>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {format(new Date(bug.created_at), "MMM d, yyyy")}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(bug.penalty_status)}>{bug.penalty_status}</Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingBug(bug)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    {bug.penalty_status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => handlePay(bug)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Pay Now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleMarkAsPaid(bug)}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Mark as Paid
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem className="text-red-600" onClick={() => setDeletingBug(bug)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                  {bug.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={bug.developer?.avatar_url || ""} />
                      <AvatarFallback>{bug.developer?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{bug.developer?.name}</span>
                  </div>
                  <div className="flex items-center font-bold text-red-500">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {new Intl.NumberFormat("vi-VN").format(bug.penalty_amount)}
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-right">Sprint: {bug.sprint?.name}</div>

                {bug.penalty_status === "pending" && (
                  <Button size="sm" className="w-full" onClick={() => handlePay(bug)}>
                    Pay Penalty
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingBug && (
        <EditBugDialog
          bug={editingBug}
          developers={developers}
          sprints={sprints}
          open={!!editingBug}
          onOpenChange={(open) => !open && setEditingBug(null)}
        />
      )}

      <AlertDialog open={!!deletingBug} onOpenChange={(open) => !open && setDeletingBug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bug record.
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
