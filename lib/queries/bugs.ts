import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { bugsApi } from "@/lib/api/bugs"
import type { Bug } from "@/lib/types"
import { toast } from "sonner"

export const bugKeys = {
  all: ["bugs"] as const,
  lists: () => [...bugKeys.all, "list"] as const,
  list: (filters: string) => [...bugKeys.lists(), { filters }] as const,
  bySprint: (sprintId: string) => [...bugKeys.all, "sprint", sprintId] as const,
  byDeveloper: (developerId: string) => [...bugKeys.all, "developer", developerId] as const,
}

export function useBugs() {
  return useQuery({
    queryKey: bugKeys.lists(),
    queryFn: bugsApi.getAll,
  })
}

export function useBugsBySprint(sprintId: string) {
  return useQuery({
    queryKey: bugKeys.bySprint(sprintId),
    queryFn: () => bugsApi.getBySprintId(sprintId),
    enabled: !!sprintId,
  })
}

export function useBugsByDeveloper(developerId: string) {
  return useQuery({
    queryKey: bugKeys.byDeveloper(developerId),
    queryFn: () => bugsApi.getByDeveloperId(developerId),
    enabled: !!developerId,
  })
}

export function useCreateBug() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bugsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bugKeys.all })
      toast.success("Bug created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create bug")
    },
  })
}

export function useUpdateBug() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bug> }) => bugsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bugKeys.all })
      toast.success("Bug updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update bug")
    },
  })
}

export function useDeleteBug() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bugsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bugKeys.all })
      toast.success("Bug deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete bug")
    },
  })
}
