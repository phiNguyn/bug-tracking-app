import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { developersApi } from "@/lib/api/developers.api"
import type { Developer } from "@/lib/types"
import { toast } from "sonner"

export const developerKeys = {
  all: ["developers"] as const,
  lists: () => [...developerKeys.all, "list"] as const,
  list: (filters: string) => [...developerKeys.lists(), { filters }] as const,
  details: () => [...developerKeys.all, "detail"] as const,
  detail: (id: string) => [...developerKeys.details(), id] as const,
}

export function useDevelopers() {
  return useQuery({
    queryKey: developerKeys.lists(),
    queryFn: developersApi.getAll,
  })
}

export function useDeveloper(id: string) {
  return useQuery({
    queryKey: developerKeys.detail(id),
    queryFn: () => developersApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateDeveloper() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: developersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.all })
      toast.success("Developer created successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create developer")
    },
  })
}

export function useUpdateDeveloper() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Developer> }) => developersApi.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: developerKeys.all })
      queryClient.invalidateQueries({ queryKey: developerKeys.detail(data.id) })
      toast.success("Developer updated successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update developer")
    },
  })
}

export function useDeleteDeveloper() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: developersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.all })
      toast.success("Developer deleted successfully")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete developer")
    },
  })
}
