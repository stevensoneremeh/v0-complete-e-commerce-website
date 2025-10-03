"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Building2, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  FileText,
  Tag,
  Car,
  Ship
} from "lucide-react"
import Link from "next/link"

interface DashboardStats {
  products: {
    total: number
    active: number
    inactive: number
    lowStock: number
  }
  categories: {
    total: number
    active: number
    inactive: number
  }
  properties: {
    total: number
    available: number
    booked: number
    featured: number
  }
  orders: {
    total: number
    pending: number
    completed: number
    cancelled: number
  }
  bookings: {
    propertyBookings: number
    hireBookings: number
    totalRevenue: number
  }
  users: {
    total: number
    customers: number
    admins: number
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all data in parallel
      const [
        productsRes,
        categoriesRes,
        propertiesRes,
        ordersRes,
        bookingsRes,
        usersRes
      ] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/properties"),
        fetch("/api/admin/orders"),
        fetch("/api/admin/bookings"),
        fetch("/api/admin/customers")
      ])

      const [
        productsData,
        categoriesData,
        propertiesData,
        ordersData,
        bookingsData,
        usersData
      ] = await Promise.all([
        productsRes.ok ? productsRes.json() : { products: [] },
        categoriesRes.ok ? categoriesRes.json() : [],
        propertiesRes.ok ? propertiesRes.json() : [],
        ordersRes.ok ? ordersRes.json() : [],
        bookingsRes.ok ? bookingsRes.json() : { propertyBookings: [], hireBookings: [] },
        usersRes.ok ? usersRes.json() : []
      ])

      const products = productsData.products || productsData || []
      const categories = categoriesData || []
      const properties = propertiesData || []
      const orders = ordersData || []
      const users = usersData || []
      const propertyBookings = bookingsData.propertyBookings || []
      const hireBookings = bookingsData.hireBookings || []

      // Calculate statistics
      const dashboardStats: DashboardStats = {
        products: {
          total: products.length,
          active: products.filter((p: any) => p.is_active).length,
          inactive: products.filter((p: any) => !p.is_active).length,
          lowStock: products.filter((p: any) => p.stock_quantity <= p.low_stock_threshold).length,
        },
        categories: {
          total: categories.length,
          active: categories.filter((c: any) => c.is_active).length,
          inactive: categories.filter((c: any) => !c.is_active).length,
        },
        properties: {
          total: properties.length,
          available: properties.filter((p: any) => p.status === 'available').length,
          booked: properties.filter((p: any) => p.status === 'booked').length,
          featured: properties.filter((p: any) => p.is_featured).length,
        },
        orders: {
          total: orders.length,
          pending: orders.filter((o: any) => o.status === 'pending').length,
          completed: orders.filter((o: any) => o.status === 'completed').length,
          cancelled: orders.filter((o: any) => o.status === 'cancelled').length,
        },
        bookings: {
          propertyBookings: propertyBookings.length,
          hireBookings: hireBookings.length,
          totalRevenue: [...propertyBookings, ...hireBookings]
            .filter((b: any) => b.payment_status === 'completed')
            .reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0),
        },
        users: {
          total: users.length,
          customers: users.filter((u: any) => u.role === 'customer').length,
          admins: users.filter((u: any) => u.is_admin || u.role === 'admin').length,
        },
      }

      setStats(dashboardStats)

      // Set recent activity (combine recent orders and bookings)
      const recentItems = [
        ...orders.slice(0, 5).map((o: any) => ({ ...o, type: 'order' })),
        ...propertyBookings.slice(0, 3).map((b: any) => ({ ...b, type: 'property_booking' })),
        ...hireBookings.slice(0, 3).map((b: any) => ({ ...b, type: 'hire_booking' }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      
      setRecentActivity(recentItems.slice(0, 10))

    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading dashboard...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Overview of your business performance and key metrics
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Products */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.products.total || 0}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-green-600">{stats?.products.active} active</span>
                    <span>•</span>
                    <span className="text-red-600">{stats?.products.inactive} inactive</span>
                  </div>
                  {(stats?.products.lowStock || 0) > 0 && (
                    <div className="flex items-center mt-1">
                      <AlertTriangle className="h-3 w-3 text-orange-500 mr-1" />
                      <span className="text-xs text-orange-600">
                        {stats?.products.lowStock} low stock
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Properties */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Properties</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.properties.total || 0}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-green-600">{stats?.properties.available} available</span>
                    <span>•</span>
                    <span className="text-blue-600">{stats?.properties.booked} booked</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stats?.properties.featured} featured
                  </div>
                </CardContent>
              </Card>

              {/* Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.orders.total || 0}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-orange-600">{stats?.orders.pending} pending</span>
                    <span>•</span>
                    <span className="text-green-600">{stats?.orders.completed} completed</span>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${(stats?.bookings.totalRevenue || 0).toLocaleString()}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{stats?.bookings.propertyBookings} property bookings</span>
                    <span>•</span>
                    <span>{stats?.bookings.hireBookings} hire bookings</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stats?.categories.total || 0}</div>
                  <div className="text-sm text-muted-foreground">
                    {stats?.categories.active} active, {stats?.categories.inactive} inactive
                  </div>
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link href="/admin/categories">Manage Categories</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{stats?.users.total || 0}</div>
                  <div className="text-sm text-muted-foreground">
                    {stats?.users.customers} customers, {stats?.users.admins} admins
                  </div>
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link href="/admin/customers">Manage Users</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">
                    {(stats?.bookings.propertyBookings || 0) + (stats?.bookings.hireBookings || 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Property & hire service bookings
                  </div>
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link href="/admin/bookings">View Bookings</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button asChild>
                    <Link href="/admin/products" className="flex flex-col items-center gap-2 h-20">
                      <Package className="h-6 w-6" />
                      <span className="text-sm">Add Product</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/properties" className="flex flex-col items-center gap-2 h-20">
                      <Building2 className="h-6 w-6" />
                      <span className="text-sm">Add Property</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/categories" className="flex flex-col items-center gap-2 h-20">
                      <Tag className="h-6 w-6" />
                      <span className="text-sm">Manage Categories</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/admin/orders" className="flex flex-col items-center gap-2 h-20">
                      <ShoppingCart className="h-6 w-6" />
                      <span className="text-sm">View Orders</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest orders and bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No recent activity to display
                    </p>
                  ) : (
                    recentActivity.map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-3">
                          {item.type === 'order' && <ShoppingCart className="h-4 w-4 text-blue-500" />}
                          {item.type === 'property_booking' && <Building2 className="h-4 w-4 text-green-500" />}
                          {item.type === 'hire_booking' && <Car className="h-4 w-4 text-purple-500" />}
                          <div>
                            <p className="font-medium">
                              {item.type === 'order' && `Order #${item.order_number}`}
                              {item.type === 'property_booking' && `Property Booking #${item.booking_reference}`}
                              {item.type === 'hire_booking' && `${item.service_type} Hire #${item.booking_reference}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.type === 'order' && item.customer_email}
                              {item.type !== 'order' && item.customer_name}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            item.status === 'completed' || item.payment_status === 'completed' ? 'default' :
                            item.status === 'pending' ? 'secondary' : 'outline'
                          }>
                            {item.status || item.payment_status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            ${(item.total_amount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
