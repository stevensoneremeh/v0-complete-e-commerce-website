"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  Briefcase,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  totalProducts: number
  totalProperties: number
  totalHireItems: number
  pendingOrders: number
  lowStockProducts: number
  recentOrders: any[]
  recentBookings: any[]
  salesData: any[]
  orderStatusData: any[]
  topProducts: any[]
  topProperties: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")

  useEffect(() => {
    fetchDashboardStats()
  }, [timeRange])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/dashboard?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else if (response.status === 401) {
        toast.error("Admin access denied. Please log in again.")
        window.location.href = "/auth"
      } else {
        toast.error("Failed to fetch dashboard stats")
      }
    } catch (error) {
      console.error("[v0] Error fetching dashboard stats:", error)
      toast.error("Error loading dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

  return (
    <div className="space-y-6">
      {/* Header with Time Range */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your complete business overview.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              onClick={() => setTimeRange(range)}
              size="sm"
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Orders */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Orders
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-orange-600 font-medium">{stats?.pendingOrders || 0} pending</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Total Revenue
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalRevenue?.toFixed(0) || "0"}</div>
            <p className="text-xs text-muted-foreground">From all orders</p>
          </CardContent>
        </Card>

        {/* Total Customers */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Customers
              <Users className="h-4 w-4 text-purple-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">Active users</p>
          </CardContent>
        </Card>

        {/* Total Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Products
              <Package className="h-4 w-4 text-orange-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-red-600 font-medium">{stats?.lowStockProducts || 0} low stock</p>
          </CardContent>
        </Card>

        {/* Properties */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Properties
              <Home className="h-4 w-4 text-cyan-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProperties || 0}</div>
            <p className="text-xs text-muted-foreground">Listings</p>
          </CardContent>
        </Card>

        {/* Hire Services */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Hire Services
              <Briefcase className="h-4 w-4 text-indigo-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalHireItems || 0}</div>
            <p className="text-xs text-muted-foreground">Available</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.salesData && stats.salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} name="Sales" />
                  <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Orders" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-250 flex items-center justify-center text-muted-foreground">
                No sales data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.orderStatusData && stats.orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-250 flex items-center justify-center text-muted-foreground">
                No order data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Summaries Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats?.lowStockProducts ? (
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{stats.lowStockProducts} Products Low Stock</p>
                  <p className="text-xs text-muted-foreground">Reorder to avoid stockouts</p>
                </div>
              </div>
            ) : null}

            {stats?.pendingOrders ? (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{stats.pendingOrders} Pending Orders</p>
                  <p className="text-xs text-muted-foreground">Review and process</p>
                </div>
              </div>
            ) : null}

            {!stats?.lowStockProducts && !stats?.pendingOrders ? (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">All Systems Operational</p>
                  <p className="text-xs text-muted-foreground">No critical alerts</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.topProducts && stats.topProducts.length > 0 ? (
              <div className="space-y-2">
                {stats.topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <Badge variant="secondary">{product.sales} sold</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">No data</div>
            )}
          </CardContent>
        </Card>

        {/* Top Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5 text-cyan-600" />
              Top Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.topProperties && stats.topProperties.length > 0 ? (
              <div className="space-y-2">
                {stats.topProperties.slice(0, 5).map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                    <p className="text-sm font-medium truncate">{property.title}</p>
                    <Badge variant="secondary">{property.bookings} bookings</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">No data</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-2">
                {stats.recentOrders.slice(0, 5).map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.customer_name}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={order.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {order.status}
                      </Badge>
                      <p className="text-sm font-medium">${order.total?.toFixed(0) || "0"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">No recent orders</div>
            )}
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Home className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="space-y-2">
                {stats.recentBookings.slice(0, 5).map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded hover:bg-muted/50">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{booking.booking_reference}</p>
                      <p className="text-xs text-muted-foreground truncate">{booking.guest_name}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={booking.status === "confirmed" ? "default" : "secondary"} className="text-xs">
                        {booking.status}
                      </Badge>
                      <p className="text-sm font-medium">${booking.total_amount?.toFixed(0) || "0"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground text-sm">No recent bookings</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
