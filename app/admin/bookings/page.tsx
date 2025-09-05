"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, Search, Filter, Eye, Phone, Mail, MapPin } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"

interface Booking {
  id: string
  booking_reference: string
  property_id: string
  user_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in_date: string
  check_out_date: string
  guests: number
  nights: number
  price_per_night: number
  total_amount: number
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show"
  payment_status: "pending" | "paid" | "refunded" | "failed"
  payment_reference: string
  special_requests: string
  created_at: string
  updated_at: string
  property_title?: string
  property_type?: string
  property_location?: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentFilter, setPaymentFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    let filtered = bookings.filter(
      (booking) =>
        booking.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.guest_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.booking_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.property_title?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    if (paymentFilter !== "all") {
      filtered = filtered.filter((booking) => booking.payment_status === paymentFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter, paymentFilter])

  const fetchBookings = async () => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { data, error } = await supabase
        .from("real_estate_bookings")
        .select(`
          *,
          listings_real_estate (title, property_type, location)
        `)
        .order("created_at", { ascending: false })

      if (data && !error) {
        const bookingsWithDetails = data.map((booking) => ({
          ...booking,
          property_title: booking.listings_real_estate?.title || "Property",
          property_type: booking.listings_real_estate?.property_type || "Unknown",
          property_location: booking.listings_real_estate?.location || "Location not specified",
        }))
        setBookings(bookingsWithDetails)
      } else {
        toast.error("Failed to fetch bookings")
      }
    } catch (error) {
      toast.error("Error loading bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking["status"]) => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { error } = await supabase
        .from("real_estate_bookings")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId)

      if (!error) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus, updated_at: new Date().toISOString() } : b)),
        )
        toast.success(`Booking status updated to ${newStatus}`)
      } else {
        toast.error("Failed to update booking status")
      }
    } catch (error) {
      toast.error("Error updating booking status")
    }
  }

  const handlePaymentStatusUpdate = async (bookingId: string, newPaymentStatus: Booking["payment_status"]) => {
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const { error } = await supabase
        .from("real_estate_bookings")
        .update({ payment_status: newPaymentStatus, updated_at: new Date().toISOString() })
        .eq("id", bookingId)

      if (!error) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, payment_status: newPaymentStatus, updated_at: new Date().toISOString() } : b,
          ),
        )
        toast.success(`Payment status updated to ${newPaymentStatus}`)
      } else {
        toast.error("Failed to update payment status")
      }
    } catch (error) {
      toast.error("Error updating payment status")
    }
  }

  const getStatusBadgeVariant = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      case "completed":
        return "outline"
      case "no_show":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentBadgeVariant = (paymentStatus: Booking["payment_status"]) => {
    switch (paymentStatus) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "refunded":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Booking Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage property reservations and guest bookings</p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search bookings, guests, or properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no_show">No Show</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {bookings.filter((b) => b.status === "pending").length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter((b) => b.status === "confirmed").length}
            </div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {bookings.filter((b) => b.status === "completed").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {bookings.filter((b) => b.status === "cancelled").length}
            </div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold">{bookings.length}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.property_title}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {booking.property_location}
                          </p>
                          <p className="text-xs text-muted-foreground">#{booking.booking_reference}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={getStatusBadgeVariant(booking.status)}>{booking.status}</Badge>
                          <Badge variant={getPaymentBadgeVariant(booking.payment_status)}>
                            {booking.payment_status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-primary">
                              {booking.guest_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{booking.guest_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{booking.guest_email}</span>
                        </div>
                        {booking.guest_phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{booking.guest_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-medium">
                            {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                            {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.nights} {booking.nights === 1 ? "night" : "nights"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span>
                          {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                        </span>
                      </div>

                      <div className="text-lg font-semibold text-primary">${booking.total_amount.toLocaleString()}</div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Select
                          value={booking.status}
                          onValueChange={(value: Booking["status"]) => handleStatusUpdate(booking.id, value)}
                        >
                          <SelectTrigger className="w-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="no_show">No Show</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={booking.payment_status}
                          onValueChange={(value: Booking["payment_status"]) =>
                            handlePaymentStatusUpdate(booking.id, value)
                          }
                        >
                          <SelectTrigger className="w-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Payment Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild className="flex-1 bg-transparent">
                          <Link href={`/bookings/${booking.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/properties/${booking.property_id}`}>
                            <MapPin className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Booked: {new Date(booking.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {booking.special_requests && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-1">Special Requests:</p>
                      <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBookings.length === 0 && !isLoading && (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                    ? "No bookings match your search criteria."
                    : "No bookings have been made yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
