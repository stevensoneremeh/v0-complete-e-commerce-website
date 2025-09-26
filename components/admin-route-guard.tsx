"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

interface AdminRouteGuardProps {
  children: React.ReactNode
  requiredRole?: "admin" | "super_admin"
}

export function AdminRouteGuard({ children, requiredRole = "admin" }: AdminRouteGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to auth page
        console.log("User not authenticated, redirecting to auth")
        router.push("/auth")
        return
      }

      // For now, allow access if user is authenticated (middleware will handle detailed admin checks)
      console.log("User authenticated, checking admin access via middleware")
    }
  }, [user, loading, router, requiredRole])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null
  }

  return <>{children}</>
}
