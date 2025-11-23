import { createClient } from "@/lib/supabase/client"
import type { Sprint } from "@/lib/types"

export const sprintsApi = {
  async getAll(): Promise<Sprint[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("sprints").select("*").order("start_date", { ascending: false })

    if (error) throw error
    return data || []
  },

  async getActive(): Promise<Sprint | null> {
    const supabase = createClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from("sprints")
      .select("*")
      .lte("start_date", now)
      .gte("end_date", now)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  },

  async getById(id: string): Promise<Sprint | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("sprints").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async create(sprint: Omit<Sprint, "id" | "created_at">): Promise<Sprint> {
    const supabase = createClient()
    const { data, error } = await supabase.from("sprints").insert(sprint).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, sprint: Partial<Sprint>): Promise<Sprint> {
    const supabase = createClient()
    const { data, error } = await supabase.from("sprints").update(sprint).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from("sprints").delete().eq("id", id)

    if (error) throw error
  },
}
