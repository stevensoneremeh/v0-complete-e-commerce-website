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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["main"])
  const { isMobile, setOpenMobile } = useSidebar()

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => (prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]))
  }

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
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
    <Sidebar collapsible="icon" className="border-r shadow-sm">
      <SidebarHeader className="p-4 sm:p-6">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">
            Admin Panel
          </div>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 truncate">ABL Natasha Enterprises</p>
      </SidebarHeader>

      <SidebarContent className="px-2 sm:px-4 py-2 sm:py-4">
        <SidebarMenu className="space-y-4 sm:space-y-6">
          {navGroups.map((group) => (
            <SidebarMenuItem key={group.id}>
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between w-full px-2 sm:px-3 py-1 sm:py-2 text-[10px] sm:text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="truncate">{group.label}</span>
                <ChevronDown
                  className={cn(
                    "h-3 w-3 sm:h-4 sm:w-4 transition-transform",
                    expandedGroups.includes(group.id) && "rotate-180",
                  )}
                />
              </button>
              {expandedGroups.includes(group.id) && (
                <div className="space-y-1 mt-1 sm:mt-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className={cn(
                        "flex items-center gap-2 sm:gap-3 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all hover:bg-muted/50",
                        pathname === item.href
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start bg-transparent text-xs sm:text-sm" asChild>
          <Link href="/auth">
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
            Logout
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
