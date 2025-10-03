import { createClient } from "@/lib/supabase/server"

export interface AdminCheckResult {
  isAdmin: boolean
  user: any | null
  profile: any | null
}

/**
 * Check if the current user is an admin
 * This should be called on the server side only
 */
export async function checkAdminAccess(): Promise<AdminCheckResult> {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { isAdmin: false, user: null, profile: null }
  }

  // Check admin status from profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_admin, role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    // Fallback to hardcoded email check
    const isAdmin = user.email === "talktostevenson@gmail.com"
    return { isAdmin, user, profile: null }
  }

  const isAdmin = profile.is_admin || profile.role === "admin" || profile.role === "super_admin"

  return { isAdmin, user, profile }
}

/**
 * Require admin access or throw an error
 * Use this in API routes and server actions
 */
export async function requireAdmin() {
  const { isAdmin, user, profile } = await checkAdminAccess()

  if (!isAdmin) {
    throw new Error("Forbidden: Admin access required")
  }

  return { user, profile }
}

/**
 * Check if a user can perform super admin actions
 * (like changing other users' admin status)
 */
export async function checkSuperAdminAccess(): Promise<boolean> {
  const { isAdmin, profile } = await checkAdminAccess()

  if (!isAdmin) {
    return false
  }

  // Super admin check
  return profile?.role === "super_admin"
}
