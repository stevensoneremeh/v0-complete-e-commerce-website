"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Users, Clock } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"

interface BookingConfirmation {
  id: string
  booking_reference: string
  property_title: string
  guest_name: string
  check_in_date: string
  check_out_date: string
  guests: number
  nights: number
  total_amount: number
  status: string
}

export default function BookingConfirmationPage() {
  const params = useParams()
  const [booking, setBooking] = useState<BookingConfirmation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { data, error } = await supabase
          .from("real_estate_bookings")
          .select(`
            *,
            listings_real_estate (title)
          `)
          .eq("id", params.id)
          .single()

        if (data && !error) {
          setBooking({
            ...data,
            property_title: data.listings_real_estate?.title || "Property",
          })
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBooking()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded max-w-2xl mx-auto"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Not Found</h1>
          <p className="text-muted-foreground mb-6">The booking confirmation you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/properties">Browse Properties</Link>
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
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-green-600">Booking Confirmed!</h1>
            <p className="text-lg text-muted-foreground">Your reservation has been successfully submitted</p>
          </div>

          {/* Booking Details Card */}
          <Card className="text-left">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Booking Details</span>
                <span className="text-sm font-normal text-muted-foreground">#{booking.booking_reference}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{booking.property_title}</h3>
                <p className="text-muted-foreground">Guest: {booking.guest_name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Check-in</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.check_in_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Check-out</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.check_out_date).toLocaleDateString()}
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

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">${booking.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Confirmation Email</p>
                    <p className="text-sm text-muted-foreground">
                      You'll receive a confirmation email with all booking details within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Property Contact</p>
                    <p className="text-sm text-muted-foreground">
                      Our team will contact you to finalize payment and provide check-in instructions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Enjoy Your Stay</p>
                    <p className="text-sm text-muted-foreground">
                      Check in on your scheduled date and enjoy your luxury accommodation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href={`/bookings/${booking.id}`}>View Booking Details</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/bookings">My Bookings</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/properties">Browse More Properties</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
