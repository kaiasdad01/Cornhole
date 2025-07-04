import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// ---------------------------------------------------------------------------------
// DEMO FALLBACK
// ---------------------------------------------------------------------------------
// When the project is run locally without Supabase credentials we still want the
// e-mail auth flow (create account / sign-in / sign-out) to work so that the admin
// portal is usable. To achieve that, we expose a lightweight in-browser fallback
// that mimics the subset of the Supabase auth API used by this codebase.
//
// The implementation stores users and the current session in localStorage. The
// public API mirrors the real client closely enough that existing imports keep
// working unchanged.
// ---------------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

function createDemoAuthClient() {
  // Helper ──────────────────────────────────────────────────────────────────────
  const readLS = (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      return JSON.parse(window.localStorage.getItem(key) || 'null')
    } catch {
      return null
    }
  }

  const writeLS = (key: string, value: any) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  type Listener = (event: string, session: any) => void
  let listeners: Listener[] = []

  const notify = (event: string, session: any) => {
    listeners.forEach((cb) => cb(event, session))
  }

  const USERS_KEY = 'demo_users_v1'
  const SESSION_KEY = 'demo_session_v1'

  // Auth API ────────────────────────────────────────────────────────────────────
  const signUp = async ({ email, password }: { email: string; password: string }) => {
    const users: any[] = readLS(USERS_KEY) || []
    if (users.find((u) => u.email === email)) {
      return { data: null, error: { message: 'User already exists' } }
    }
    const user = { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, email, password }
    users.push(user)
    writeLS(USERS_KEY, users)

    // In Supabase, signUp does NOT create a session by default when email
    // confirmation is enabled, so we mimic that behaviour and return no session.
    return { data: { user }, error: null }
  }

  const signInWithPassword = async ({ email, password }: { email: string; password: string }) => {
    const users: any[] = readLS(USERS_KEY) || []
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      return { data: null, error: { message: 'Invalid email or password' } }
    }
    const session = { user }
    writeLS(SESSION_KEY, session)
    notify('SIGNED_IN', session)
    return { data: { session }, error: null }
  }

  const signOut = async () => {
    writeLS(SESSION_KEY, null)
    notify('SIGNED_OUT', null)
    return { error: null }
  }

  const getSession = async () => {
    const session = readLS(SESSION_KEY)
    return { data: { session: session || null } }
  }

  const onAuthStateChange = (
    callback: (event: string, session: any) => void
  ) => {
    listeners.push(callback)
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            listeners = listeners.filter((l) => l !== callback)
          },
        },
      },
    } as any
  }

  // Minimal stub for the rest of the Supabase client API we don't use in demo
  const notImplemented = () => {
    const chain: any = () => chain
    chain.select = chain.insert = chain.update = chain.delete = chain.eq = chain.single = chain.order = chain.in = () => chain
    return chain
  }

  return {
    // Mark this so the app can differentiate if needed
    __isDemo: true,
    auth: {
      signUp,
      signInWithPassword,
      signOut,
      getSession,
      onAuthStateChange,
    },
    from: notImplemented,
    channel: () => ({
      on: () => ({
        subscribe: () => ({ unsubscribe: () => {} }),
      }),
    }),
  } as any
}

// --------------------------- EXPORT CLIENT -------------------------------------
// If credentials are provided we connect to the real backend, otherwise we fall
// back to the demo auth client.
export const supabase =
  supabaseUrl !== 'https://placeholder.supabase.co'
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createDemoAuthClient()

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