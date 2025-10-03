"use client"

import { useEffect, useState } from "react"

interface AdminCheckData {
  isAdmin: boolean
  user: {
    id: string
    email: string
  } | null
  profile: {
    id: string
    full_name: string
    role: string
    is_admin: boolean
  } | null
}

export function useAdminCheck() {
  const [data, setData] = useState<AdminCheckData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch("/api/admin/check")
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to check admin access")
        }

        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [])

  return { data, isLoading, error, isAdmin: data?.isAdmin ?? false }
}
