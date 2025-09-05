"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, MapPin, Users, Clock, Phone, Mail } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { createBrowserClient } from "@supabase/ssr"
import { WhatsAppButton } from "@/components/whatsapp-button"

interface BookingDetail {
  id: string
  property_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in_date: string
  check_out_date: string
  guests: number
  nights: number
  total_amount: number
  price_per_night: number
  status: string
  booking_reference: string
  special_requests: string
  created_at: string
  property_title?: string
  property_address?: string
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBooking = async () => {
      if (!user) return

      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { data, error } = await supabase
          .from("real_estate_bookings")
          .select(`
            *,
            listings_real_estate (title, address)
          `)
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (data && !error) {
          setBooking({
            ...data,
            property_title: data.listings_real_estate?.title || "Property",
            property_address: data.listings_real_estate?.address || "Address not available",
          })
        } else {
          setError("Booking not found")
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
        setError("Failed to load booking details")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBooking()
    }
  }, [params.id, user])

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to view booking details.</p>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The booking you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/bookings">Back to Bookings</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{booking.property_title}</CardTitle>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{booking.property_address}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Booking Reference: #{booking.booking_reference}</p>
                  </div>
                  <Badge
                    variant={
                      booking.status === "confirmed"
                        ? "default"
                        : booking.status === "pending"
                          ? "secondary"
                          : booking.status === "cancelled"
                            ? "destructive"
                            : "outline"
                    }
                    className="text-sm"
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Check-in</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.check_in_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Check-out</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.check_out_date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Guests</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.nights} {booking.nights === 1 ? "Night" : "Nights"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {booking.guest_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{booking.guest_name}</p>
                    <p className="text-sm text-muted-foreground">Primary Guest</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{booking.guest_email}</span>
                </div>

                {booking.guest_phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{booking.guest_phone}</span>
                  </div>
                )}

                {booking.special_requests && (
                  <div className="pt-3 border-t">
                    <p className="font-medium mb-2">Special Requests</p>
                    <p className="text-sm text-muted-foreground">{booking.special_requests}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      ${booking.price_per_night}/night × {booking.nights} nights
                    </span>
                    <span>${(booking.price_per_night * booking.nights).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span className="text-primary">${booking.total_amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <WhatsAppButton
                    product={{
                      name: `Booking #${booking.booking_reference}`,
                      price: booking.total_amount,
                      category: "Booking Support",
                    }}
                    className="w-full"
                  />

                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/properties/${booking.property_id}`}>View Property</Link>
                  </Button>
                </div>

                <div className="pt-4 border-t text-xs text-muted-foreground">
                  <p>Booked on {new Date(booking.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
