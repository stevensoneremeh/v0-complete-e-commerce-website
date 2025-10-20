"use client"

import { Bell, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { getNotifications } from "@/lib/local-storage"

export function AdminHeader() {
  const pathname = usePathname()
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0)

  useEffect(() => {
    const updateNotificationCount = () => {
      const notifications = getNotifications()
      setUnreadNotificationsCount(notifications.filter((n) => !n.isRead).length)
    }

    updateNotificationCount()
    window.addEventListener("storage", updateNotificationCount)
    return () => window.removeEventListener("storage", updateNotificationCount)
  }, [])

  const getPageTitle = () => {
    const titleMap: Record<string, string> = {
      "/admin": "Dashboard",
      "/admin/products": "Products",
      "/admin/categories": "Categories",
      "/admin/orders": "Orders",
      "/admin/customers": "Customers",
      "/admin/coupons": "Coupons",
      "/admin/notifications": "Notifications",
      "/admin/settings": "Settings",
      "/admin/analytics": "Analytics",
      "/admin/properties": "Properties",
      "/admin/bookings": "Bookings",
      "/admin/hire-bookings": "Hire Services",
      "/admin/real-estate": "Real Estate",
      "/admin/reviews": "Reviews",
    }
    return titleMap[pathname] || "Admin Panel"
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/notifications" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotificationsCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
              >
                {unreadNotificationsCount}
              </Badge>
            )}
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs leading-none text-muted-foreground">admin@ablnatasha.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth">Log out</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
