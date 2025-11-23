import { createClient } from "@/lib/supabase/client"
import type { Bug } from "@/lib/types"

export const bugsApi = {
  async getAll(): Promise<Bug[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("bugs")
      .select(`
        *,
        developer:developers(*),
        sprint:sprints(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async getBySprintId(sprintId: string): Promise<Bug[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("bugs")
      .select(`
        *,
        developer:developers(*),
        sprint:sprints(*)
      `)
      .eq("sprint_id", sprintId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async getByDeveloperId(developerId: string): Promise<Bug[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("bugs")
      .select(`
        *,
        developer:developers(*),
        sprint:sprints(*)
      `)
      .eq("developer_id", developerId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(bug: Omit<Bug, "id" | "created_at">): Promise<Bug> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("bugs")
      .insert(bug)
      .select(`
        *,
        developer:developers(*),
        sprint:sprints(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, bug: Partial<Bug>): Promise<Bug> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("bugs")
      .update(bug)
      .eq("id", id)
      .select(`
        *,
        developer:developers(*),
        sprint:sprints(*)
      `)
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from("bugs").delete().eq("id", id)

    if (error) throw error
  },
}
