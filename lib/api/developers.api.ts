import { createClient } from "@/lib/supabase/client"
import type { Developer } from "@/lib/types"

export const developersApi = {
  async getAll(): Promise<Developer[]> {
    const supabase = createClient()
    const { data, error } = await supabase.from("developers").select("*").order("name", { ascending: true })

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Developer | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("developers").select("*").eq("id", id).single()

    if (error) throw error
    return data
  },

  async create(developer: Omit<Developer, "id" | "created_at">): Promise<Developer> {
    const supabase = createClient()
    const { data, error } = await supabase.from("developers").insert(developer).select().single()

    if (error) throw error
    return data
  },

  async update(id: string, developer: Partial<Developer>): Promise<Developer> {
    const supabase = createClient()
    const { data, error } = await supabase.from("developers").update(developer).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from("developers").delete().eq("id", id)

    if (error) throw error
  },
}
