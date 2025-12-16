import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { checkAdminAccess } from "@/lib/auth/check-admin"
import { redirect } from "next/navigation"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log("[v0] Admin layout: Checking admin access...")

  const { isAdmin, error } = await checkAdminAccess()

  console.log("[v0] Admin layout: Check result -", { isAdmin, error })

  if (!isAdmin) {
    console.log("[v0] Admin layout: Redirecting to /auth (not admin)")
    redirect("/auth")
  }

  console.log("[v0] Admin layout: Access granted, rendering admin dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
