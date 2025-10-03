"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Car, Eye, Filter } from "lucide-react"
import { toast } from "sonner"

interface HireBooking {
  id: string
  booking_reference: string
  service_name: string
  service_type: string
  customer_name: string
  customer_email: string
  customer_phone: string
  start_date: string
  end_date: string
  duration_hours: number
  pickup_location: string
  dropoff_location: string
  passengers: number
  total_amount: number
  payment_status: string
  payment_method: string
  status: string
  special_requests: string
  admin_notes: string
  created_at: string
}

export default function HireBookingsPage() {
  const [bookings, setBookings] = useState<HireBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<HireBooking | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/hire-bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      toast.error("Failed to fetch hire bookings")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/hire-bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        await fetchBookings()
        toast.success("Booking status updated")
      }
    } catch (error) {
      toast.error("Failed to update booking")
    }
  }

  const handleSaveNotes = async () => {
    if (!selectedBooking) return

    try {
      const response = await fetch(`/api/admin/hire-bookings/${selectedBooking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: adminNotes }),
      })

      if (response.ok) {
        await fetchBookings()
        setShowDetails(false)
        toast.success("Notes saved successfully")
      }
    } catch (error) {
      toast.error("Failed to save notes")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBookings = bookings.filter((booking) => filterStatus === "all" || booking.status === filterStatus)

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Hire Service Bookings</h1>
                <p className="text-muted-foreground">Manage car hire and boat cruise bookings</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Hire Bookings ({filteredBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading bookings...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.booking_reference}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.service_name}</div>
                              <div className="text-sm text-muted-foreground">{booking.service_type}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.customer_name}</div>
                              <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(booking.start_date).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">
                                to {new Date(booking.end_date).toLocaleDateString()}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>${booking.total_amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={booking.payment_status === "paid" ? "default" : "secondary"}>
                              {booking.payment_status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={booking.status}
                              onValueChange={(value) => handleStatusUpdate(booking.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking)
                                setAdminNotes(booking.admin_notes || "")
                                setShowDetails(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Booking Details</DialogTitle>
                </DialogHeader>
                {selectedBooking && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Reference</Label>
                        <div className="font-medium">{selectedBooking.booking_reference}</div>
                      </div>
                      <div>
                        <Label>Service</Label>
                        <div className="font-medium">{selectedBooking.service_name}</div>
                      </div>
                      <div>
                        <Label>Pickup Location</Label>
                        <div>{selectedBooking.pickup_location}</div>
                      </div>
                      <div>
                        <Label>Dropoff Location</Label>
                        <div>{selectedBooking.dropoff_location}</div>
                      </div>
                      <div>
                        <Label>Passengers</Label>
                        <div>{selectedBooking.passengers}</div>
                      </div>
                      <div>
                        <Label>Duration</Label>
                        <div>{selectedBooking.duration_hours} hours</div>
                      </div>
                    </div>
                    {selectedBooking.special_requests && (
                      <div>
                        <Label>Special Requests</Label>
                        <div className="text-sm">{selectedBooking.special_requests}</div>
                      </div>
                    )}
                    <div>
                      <Label>Admin Notes</Label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add internal notes about this booking..."
                        rows={4}
                      />
                    </div>
                    <Button onClick={handleSaveNotes}>Save Notes</Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </div>
    </div>
  )
}
