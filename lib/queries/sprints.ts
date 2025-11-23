import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sprintsApi } from "@/lib/api/sprints"
import type { Sprint } from "@/lib/types"
import { toast } from "sonner"

export const sprintKeys = {
  all: ["sprints"] as const,
  lists: () => [...sprintKeys.all, "list"] as const,
  list: (filters: string) => [...sprintKeys.lists(), { filters }] as const,
  details: () => [...sprintKeys.all, "detail"] as const,
  detail: (id: string) => [...sprintKeys.details(), id] as const,
  active: () => [...sprintKeys.all, "active"] as const,
}

export function useSprints() {
  return useQuery({
    queryKey: sprintKeys.lists(),
    queryFn: sprintsApi.getAll,
  })
}

export function useActiveSprint() {
  return useQuery({
    queryKey: sprintKeys.active(),
    queryFn: sprintsApi.getActive,
  })
}

export function useSprint(id: string) {
  return useQuery({
    queryKey: sprintKeys.detail(id),
    queryFn: () => sprintsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sprintsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.all })
      toast.success("Sprint created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create sprint")
    },
  })
}

export function useUpdateSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Sprint> }) => sprintsApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.all })
      queryClient.invalidateQueries({ queryKey: sprintKeys.detail(data.id) })
      toast.success("Sprint updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update sprint")
    },
  })
}

export function useDeleteSprint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sprintsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sprintKeys.all })
      toast.success("Sprint deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete sprint")
    },
  })
}
