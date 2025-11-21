export interface Developer {
  id: string
  name: string
  email: string
  avatar_url: string | null
  created_at: string
}

export interface Sprint {
  id: string
  name: string
  start_date: string
  end_date: string
  created_at: string
  penalty_url?: string | null
}

export interface Bug {
  id: string
  sprint_id: string
  developer_id: string
  title: string
  description: string | null
  image_url: string | null
  penalty_amount: number
  penalty_status: "pending" | "paid" | "waived"
  created_at: string
}

export interface BugWithDetails extends Bug {
  developer: Developer
  sprint: Sprint
}

export interface DeveloperStats {
  developer: Developer
  total_bugs: number
  total_penalty: number
  pending_penalty: number
  paid_penalty: number
  waived_penalty: number
}

export interface SprintStats {
  sprint: Sprint
  total_bugs: number
  total_penalty: number
  bugs_by_status: {
    pending: number
    paid: number
    waived: number
  }
}
