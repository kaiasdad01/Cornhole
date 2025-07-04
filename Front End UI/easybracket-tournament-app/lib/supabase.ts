import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Tournament {
  id: string
  name: string
  date: string
  location: string
  status: 'setup' | 'active' | 'completed'
  bracket_type: 'single-elimination' | 'double-elimination' | 'group-stage'
  bracket_region?: string
  created_at: string
  updated_at: string
  created_by: string
}

export interface Team {
  id: string
  tournament_id: string
  name: string
  players: string[]
  seed?: number
  created_at: string
}

export interface Match {
  id: string
  tournament_id: string
  team1_id: string
  team2_id: string
  team1_score?: number
  team2_score?: number
  status: 'scheduled' | 'in-progress' | 'completed'
  round: string
  round_number: number
  match_number: number
  court?: string
  scheduled_time?: string
  actual_start?: string
  actual_end?: string
  weather?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface SoloPlayer {
  id: string
  tournament_id: string
  name: string
  paired: boolean
  created_at: string
} 