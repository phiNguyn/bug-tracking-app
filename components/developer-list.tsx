"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Developer } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import { EditDeveloperDialog } from "./edit-developer-dialog"

interface DeveloperListProps {
  developers: Developer[]
}

export function DeveloperList({ developers }: DeveloperListProps) {
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null)
  const [deletingDeveloper, setDeletingDeveloper] = useState<Developer | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!deletingDeveloper) return

    try {
      const { error } = await supabase.from("developers").delete().eq("id", deletingDeveloper.id)

      if (error) throw error

      toast.success("Developer deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete developer")
      console.error(error)
    } finally {
      setDeletingDeveloper(null)
    }
  }

  if (developers.length === 0) {
    return <div className="text-center text-muted-foreground py-10">No developers found. Add one to get started.</div>
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {developers.map((dev) => (
          <Card key={dev.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={dev.avatar_url || ""} alt={dev.name} />
                  <AvatarFallback>{dev.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-base">{dev.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{dev.email}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditingDeveloper(dev)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => setDeletingDeveloper(dev)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Joined</span>
                <span>{new Date(dev.created_at).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingDeveloper && (
        <EditDeveloperDialog
          developer={editingDeveloper}
          open={!!editingDeveloper}
          onOpenChange={(open) => !open && setEditingDeveloper(null)}
        />
      )}

      <AlertDialog open={!!deletingDeveloper} onOpenChange={(open) => !open && setDeletingDeveloper(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the developer and remove their data from our
              servers.
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
