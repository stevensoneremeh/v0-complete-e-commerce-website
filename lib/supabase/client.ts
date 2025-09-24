import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^"(.*)"$/, '$1')
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/^"(.*)"$/, '$1')

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'undefined' || supabaseAnonKey === 'undefined' || supabaseUrl === '' || supabaseAnonKey === '') {
    console.error("Missing or invalid Supabase environment variables")
    // Return a mock client that throws errors on use
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: new Error("Supabase not configured") }),
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error("Supabase not configured") }),
        signInWithPassword: () => Promise.reject(new Error("Supabase not configured")),
        signUp: () => Promise.reject(new Error("Supabase not configured")),
        signOut: () => Promise.reject(new Error("Supabase not configured")),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => ({
        select: () => Promise.reject(new Error("Supabase not configured")),
        insert: () => Promise.reject(new Error("Supabase not configured")),
        update: () => Promise.reject(new Error("Supabase not configured")),
        delete: () => Promise.reject(new Error("Supabase not configured"))
      })
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
