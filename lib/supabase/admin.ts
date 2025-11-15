import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables for admin client")
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function verifyAdminUser(userId: string) {
  try {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("is_admin, role")
      .eq("id", userId)
      .single()

    if (profileError) {
      console.error("[v0] Profile check error:", profileError)
      return false
    }

    return profile?.is_admin === true || profile?.role === "admin"
  } catch (error) {
    console.error("[v0] Admin verification error:", error)
    return false
  }
}
