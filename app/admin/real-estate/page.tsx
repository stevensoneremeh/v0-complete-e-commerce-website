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
import { HomeIcon, Eye, Filter } from "lucide-react"
import { toast } from "sonner"

interface RealEstateBooking {
  id: string
  booking_reference: string
  property_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in_date: string
  check_out_date: string
  nights: number
  guests: number
  subtotal: number
  cleaning_fee: number
  service_fee: number
  tax_amount: number
  total_amount: number
  payment_status: string
  payment_method: string
  status: string
  special_requests: string
  admin_notes: string
  created_at: string
  real_estate_properties?: {
    title: string
    address: string
  }
}

export default function RealEstateBookingsPage() {
  const [bookings, setBookings] = useState<RealEstateBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<RealEstateBooking | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [adminNotes, setAdminNotes] = useState("")

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/real-estate-bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      toast.error("Failed to fetch real estate bookings")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/real-estate-bookings/${bookingId}`, {
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
      const response = await fetch(`/api/admin/real-estate-bookings/${selectedBooking.id}`, {
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
                <h1 className="text-3xl font-bold">Real Estate Bookings</h1>
                <p className="text-muted-foreground">Manage property rental bookings</p>
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
                  <HomeIcon className="h-5 w-5" />
                  Real Estate Bookings ({filteredBookings.length})
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
                        <TableHead>Property</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Check-in / Check-out</TableHead>
                        <TableHead>Guests</TableHead>
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
                              <div className="font-medium">
                                {booking.real_estate_properties?.title || "Unknown Property"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {booking.real_estate_properties?.address}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.guest_name}</div>
                              <div className="text-sm text-muted-foreground">{booking.guest_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(booking.check_in_date).toLocaleDateString()}</div>
                              <div className="text-muted-foreground">
                                {new Date(booking.check_out_date).toLocaleDateString()}
                              </div>
                              <div className="text-xs text-muted-foreground">{booking.nights} nights</div>
                            </div>
                          </TableCell>
                          <TableCell>{booking.guests}</TableCell>
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
                        <Label>Property</Label>
                        <div className="font-medium">{selectedBooking.real_estate_properties?.title}</div>
                      </div>
                      <div>
                        <Label>Guest Name</Label>
                        <div>{selectedBooking.guest_name}</div>
                      </div>
                      <div>
                        <Label>Guest Email</Label>
                        <div>{selectedBooking.guest_email}</div>
                      </div>
                      <div>
                        <Label>Guest Phone</Label>
                        <div>{selectedBooking.guest_phone}</div>
                      </div>
                      <div>
                        <Label>Number of Guests</Label>
                        <div>{selectedBooking.guests}</div>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <Label>Pricing Breakdown</Label>
                      <div className="space-y-2 text-sm mt-2">
                        <div className="flex justify-between">
                          <span>Subtotal ({selectedBooking.nights} nights)</span>
                          <span>${selectedBooking.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cleaning Fee</span>
                          <span>${selectedBooking.cleaning_fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Service Fee</span>
                          <span>${selectedBooking.service_fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span>${selectedBooking.tax_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                          <span>Total</span>
                          <span>${selectedBooking.total_amount.toFixed(2)}</span>
                        </div>
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
