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
  LogOut,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["main"])

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => (prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]))
  }

  const navGroups = [
    {
      id: "main",
      label: "Main",
      items: [{ href: "/admin", icon: Home, label: "Dashboard" }],
    },
    {
      id: "catalog",
      label: "Catalog Management",
      items: [
        { href: "/admin/products", icon: Package, label: "Products" },
        { href: "/admin/categories", icon: Tag, label: "Categories" },
        { href: "/admin/reviews", icon: Star, label: "Reviews" },
      ],
    },
    {
      id: "properties",
      label: "Properties & Rentals",
      items: [
        { href: "/admin/properties", icon: Building2, label: "Properties" },
        { href: "/admin/real-estate", icon: HomeIcon, label: "Real Estate" },
        { href: "/admin/bookings", icon: Calendar, label: "Bookings" },
      ],
    },
    {
      id: "services",
      label: "Services",
      items: [{ href: "/admin/hire-bookings", icon: Car, label: "Hire Services" }],
    },
    {
      id: "sales",
      label: "Sales & Orders",
      items: [
        { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
        { href: "/admin/coupons", icon: TicketPercent, label: "Coupons" },
      ],
    },
    {
      id: "users",
      label: "Users & Communication",
      items: [
        { href: "/admin/customers", icon: Users, label: "Customers" },
        { href: "/admin/notifications", icon: Bell, label: "Notifications" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics & Settings",
      items: [
        { href: "/admin/analytics", icon: BarChart, label: "Analytics" },
        { href: "/admin/settings", icon: Settings, label: "Settings" },
      ],
    },
  ]

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-gradient-to-b from-background to-muted/20 px-4 py-6 overflow-y-auto">
      <div className="mb-8">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Admin Panel
        </div>
        <p className="text-xs text-muted-foreground mt-1">ABL Natasha Enterprises</p>
      </div>

      <nav className="flex-1 space-y-6">
        {navGroups.map((group) => (
          <div key={group.id}>
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              {group.label}
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", expandedGroups.includes(group.id) && "rotate-180")}
              />
            </button>
            {expandedGroups.includes(group.id) && (
              <div className="space-y-1 mt-2">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-muted/50",
                      pathname === item.href
                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t pt-4">
        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
          <Link href="/auth">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Link>
        </Button>
      </div>
    </aside>
  )
}
