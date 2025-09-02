"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CancelOrderDialog } from "@/components/cancel-order-dialog"
import { DeleteOrderDialog } from "@/components/delete-order-dialog"
import { useAuth } from "@/components/auth-provider"
import { useOrders } from "@/components/order-provider"
import { useToast } from "@/hooks/use-toast"
import { Package, Search, Eye, Download, RefreshCw, X, Trash2, AlertCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-100 text-green-800"
    case "shipped":
      return "bg-blue-100 text-blue-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "delivered":
      return "Delivered"
    case "shipped":
      return "Shipped"
    case "processing":
      return "Processing"
    case "cancelled":
      return "Cancelled"
    default:
      return status
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const { getUserOrders, cancelOrder, deleteOrder, canCancelOrder, canDeleteOrder } = useOrders()
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const orders = getUserOrders()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const selectedOrder = selectedOrderId ? orders.find((o) => o.id === selectedOrderId) : null

  const handleCancelOrder = async (reason: string) => {
    if (!selectedOrderId) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const success = cancelOrder(selectedOrderId, reason)
    if (success) {
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully. Refund will be processed within 3-5 business days.",
      })
    } else {
      toast({
        title: "Failed to cancel order",
        description: "Unable to cancel this order. Please contact support.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
    setCancelDialogOpen(false)
    setSelectedOrderId(null)
  }

  const handleDeleteOrder = async () => {
    if (!selectedOrderId) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const success = deleteOrder(selectedOrderId)
    if (success) {
      toast({
        title: "Order deleted",
        description: "The cancelled order has been removed from your order history.",
      })
    } else {
      toast({
        title: "Failed to delete order",
        description: "Unable to delete this order. Please try again.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
    setDeleteDialogOpen(false)
    setSelectedOrderId(null)
  }

  const openCancelDialog = (orderId: string) => {
    setSelectedOrderId(orderId)
    setCancelDialogOpen(true)
  }

  const openDeleteDialog = (orderId: string) => {
    setSelectedOrderId(orderId)
    setDeleteDialogOpen(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your orders</h1>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your order history</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders found</h2>
            <p className="text-muted-foreground mb-6">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You haven't placed any orders yet"}
            </p>
            <Button asChild>
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.date).toLocaleDateString()}
                        {order.cancelDate && (
                          <span className="ml-2">• Cancelled on {new Date(order.cancelDate).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                      <span className="font-semibold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {item.quantity} • ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cancel Reason */}
                    {order.status === "cancelled" && order.cancelReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-red-800">Cancellation Reason:</p>
                            <p className="text-sm text-red-700">{order.cancelReason}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Details */}
                    {order.status !== "cancelled" && (
                      <div className="pt-4 border-t space-y-2">
                        {order.tracking && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tracking Number:</span>
                            <span className="font-mono">{order.tracking}</span>
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Estimated Delivery:</span>
                            <span>{new Date(order.estimatedDelivery).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>

                      {order.status === "delivered" && (
                        <>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download Invoice
                          </Button>
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reorder
                          </Button>
                        </>
                      )}

                      {order.tracking && order.status === "shipped" && (
                        <Button variant="outline" size="sm">
                          Track Package
                        </Button>
                      )}

                      {canCancelOrder(order) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openCancelDialog(order.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel Order
                        </Button>
                      )}

                      {canDeleteOrder(order) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(order.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Order
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Cancel Order Dialog */}
        <CancelOrderDialog
          isOpen={cancelDialogOpen}
          onClose={() => {
            setCancelDialogOpen(false)
            setSelectedOrderId(null)
          }}
          onConfirm={handleCancelOrder}
          orderTotal={selectedOrder?.total || 0}
          isLoading={isLoading}
        />

        {/* Delete Order Dialog */}
        <DeleteOrderDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false)
            setSelectedOrderId(null)
          }}
          onConfirm={handleDeleteOrder}
          orderId={selectedOrderId || ""}
          isLoading={isLoading}
        />
      </main>
      <Footer />
    </div>
  )
}
