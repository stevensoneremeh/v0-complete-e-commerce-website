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
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in, redirect to auth page
        router.push("/auth")
        return
      }

      if (user.role === "customer") {
        // Regular user trying to access admin area
        router.push("/")
        return
      }

      if (requiredRole === "super_admin" && user.role !== "super_admin") {
        // Admin trying to access super admin area
        router.push("/admin")
        return
      }
    }
  }, [user, isLoading, router, requiredRole])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user doesn't have permission
  if (!user || user.role === "customer" || (requiredRole === "super_admin" && user.role !== "super_admin")) {
    return null
  }

  return <>{children}</>
}
