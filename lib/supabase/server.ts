import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/^"(.*)"$/, "$1")
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().replace(/^"(.*)"$/, "$1")

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl === "undefined" ||
    supabaseAnonKey === "undefined" ||
    supabaseUrl === "" ||
    supabaseAnonKey === ""
  ) {
    console.error("Missing or invalid Supabase environment variables")
    throw new Error("Supabase not configured")
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
        }
      },
    },
  })
}
