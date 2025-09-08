import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing. Using fallback values.")
    // Return a mock client that won't crash the app
    return createBrowserClient("https://placeholder.supabase.co", "placeholder-anon-key")
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
