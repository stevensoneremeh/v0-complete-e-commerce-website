import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^"(.*)"$/, '$1')
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/^"(.*)"$/, '$1')

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined' || supabaseAnonKey === 'undefined' || supabaseUrl === '' || supabaseAnonKey === '') {
    console.warn("Supabase not configured, using fallback client")
    // Return a mock client that provides fallback responses
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
        signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        update: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        delete: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
        single: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") })
      })
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
