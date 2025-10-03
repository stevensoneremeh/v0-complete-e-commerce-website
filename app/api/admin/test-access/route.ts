import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
        authError: authError?.message,
        step: "authentication"
      }, { status: 401 })
    }

    // Check if user is admin (with fallback to email check)
    let isAdmin = false
    let profile = null

    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_admin, email")
        .eq("id", user.id)
        .single()

      if (!profileError && profileData) {
        profile = profileData
        isAdmin = profileData.is_admin || profileData.role === "admin" || profileData.role === "super_admin"
      }
    } catch (error) {
      console.log("Profile check failed, using email fallback:", error)
    }

    // Fallback to hardcoded email check
    if (!isAdmin) {
      isAdmin = user.email === "talktostevenson@gmail.com"
    }

    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        error: "Forbidden - Admin access required",
        userEmail: user.email,
        profile: profile,
        step: "authorization"
      }, { status: 403 })
    }

    // Test database access
    const databaseTests = {
      products: { count: 0, error: null },
      orders: { count: 0, error: null },
      categories: { count: 0, error: null },
      profiles: { count: 0, error: null }
    }

    try {
      const { count: productsCount, error: productsError } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
      databaseTests.products = { count: productsCount || 0, error: productsError?.message || null }
    } catch (error) {
      databaseTests.products.error = error.message
    }

    try {
      const { count: ordersCount, error: ordersError } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
      databaseTests.orders = { count: ordersCount || 0, error: ordersError?.message || null }
    } catch (error) {
      databaseTests.orders.error = error.message
    }

    try {
      const { count: categoriesCount, error: categoriesError } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
      databaseTests.categories = { count: categoriesCount || 0, error: categoriesError?.message || null }
    } catch (error) {
      databaseTests.categories.error = error.message
    }

    try {
      const { count: profilesCount, error: profilesError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
      databaseTests.profiles = { count: profilesCount || 0, error: profilesError?.message || null }
    } catch (error) {
      databaseTests.profiles.error = error.message
    }

    return NextResponse.json({
      success: true,
      message: "Admin access verified successfully",
      user: {
        id: user.id,
        email: user.email,
      },
      profile: profile,
      isAdmin: isAdmin,
      databaseAccess: databaseTests,
      timestamp: new Date().toISOString(),
      step: "complete"
    })

  } catch (error) {
    console.error("Admin test access error:", error)
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      details: error.message,
      step: "error"
    }, { status: 500 })
  }
}
