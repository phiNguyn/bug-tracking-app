export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      developers: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          role: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          avatar_url?: string | null
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          role?: string | null
          created_at?: string
        }
      }
      bugs: {
        Row: {
          id: string
          title: string
          description: string | null
          sprint_id: string | null
          developer_id: string | null
          penalty_amount: number | null
          penalty_status: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          sprint_id?: string | null
          developer_id?: string | null
          penalty_amount?: number | null
          penalty_status?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          sprint_id?: string | null
          developer_id?: string | null
          penalty_amount?: number | null
          penalty_status?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      sprints: {
        Row: {
          id: string
          name: string
          start_date: string | null
          end_date: string | null
          penalty_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          start_date?: string | null
          end_date?: string | null
          penalty_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          start_date?: string | null
          end_date?: string | null
          penalty_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
