import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.SUPABASE_SUPABASE_NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY

  // Return a mock client if environment variables are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not configured. Using mock client.")
    return createMockClient()
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

function createMockClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signUp: async () => ({ data: null, error: new Error("Supabase not configured") }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      insert: async () => ({ error: null }),
      update: async () => ({ error: null }),
      delete: async () => ({ error: null }),
      upsert: async () => ({ error: null }),
    }),
  } as any
}
