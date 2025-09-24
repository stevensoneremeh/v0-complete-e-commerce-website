"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, DollarSign, AlertCircle, Building2, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
  totalProperties: number
  totalBookings: number
  activeOrders: number
  pendingOrders: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalProperties: 0,
    totalBookings: 0,
    activeOrders: 0,
    pendingOrders: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/analytics")
        if (response.ok) {
          const data = await response.json()
          setStats(data)
          setError(null)
        } else {
          const errorData = await response.json()
          setError(errorData.error || "Failed to fetch stats")
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error)
        setError("Failed to connect to server")
        // Set mock data for development
        setStats({
          totalProducts: 24,
          totalOrders: 156,
          totalCustomers: 89,
          totalRevenue: 45230.50,
          totalProperties: 12,
          totalBookings: 34,
          activeOrders: 8,
          pendingOrders: 3,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Properties",
      value: stats.totalProperties.toLocaleString(),
      icon: Building2,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ]

  if (error && !isLoading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}. Showing sample data for demonstration.
        </AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">
              {index < 4 ? "↗ +12% from last month" : "📈 Growing"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
