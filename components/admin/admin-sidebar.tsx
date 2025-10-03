"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Tag,
  TicketPercent,
  Bell,
  Settings,
  Home,
  Building2,
  Calendar,
  Star,
  Car,
  HomeIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin", icon: Home, label: "Dashboard" },
    { href: "/admin/products", icon: Package, label: "Products" },
    { href: "/admin/categories", icon: Tag, label: "Categories" },
    { href: "/admin/properties", icon: Building2, label: "Properties" },
    { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
    { href: "/admin/hire-bookings", icon: Car, label: "Hire Services" },
    { href: "/admin/real-estate", icon: HomeIcon, label: "Real Estate" },
    { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { href: "/admin/reviews", icon: Star, label: "Reviews" },
    { href: "/admin/customers", icon: Users, label: "Customers" },
    { href: "/admin/coupons", icon: TicketPercent, label: "Coupons" },
    { href: "/admin/notifications", icon: Bell, label: "Notifications" },
    { href: "/admin/analytics", icon: BarChart, label: "Analytics" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-background px-4 py-6">
      <div className="mb-8 text-2xl font-bold">Admin Panel</div>
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
