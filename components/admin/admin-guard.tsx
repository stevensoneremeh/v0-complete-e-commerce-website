"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Spinner } from "@/components/ui/spinner"

interface AdminGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Client-side admin guard component
 * Checks if user has admin access and redirects if not
 */
export function AdminGuard({ children, fallback }: AdminGuardProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch("/api/admin/check")
        const data = await response.json()

        if (!data.isAdmin) {
          router.push("/admin/access")
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error("[v0] Failed to check admin access:", error)
        router.push("/admin/access")
      } finally {
        setIsChecking(false)
      }
    }

    checkAdmin()
  }, [router])

  if (isChecking) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      )
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
