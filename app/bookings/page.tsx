"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Clock } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { createBrowserClient } from "@supabase/ssr"

interface Booking {
  id: string
  property_id: string
  guest_name: string
  guest_email: string
  check_in_date: string
  check_out_date: string
  guests: number
  nights: number
  total_amount: number
  status: string
  booking_reference: string
  created_at: string
  property_title?: string
}

export default function BookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
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
            listings_real_estate (title)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (data && !error) {
          setBookings(
            data.map((booking) => ({
              ...booking,
              property_title: booking.listings_real_estate?.title || "Property",
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be signed in to view your bookings.</p>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="text-muted-foreground">Manage your property bookings and reservations</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't made any property bookings yet. Explore our luxury properties to get started.
            </p>
            <Button asChild>
              <Link href="/properties">Browse Properties</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{booking.property_title}</CardTitle>
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
                    >
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Booking #{booking.booking_reference}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.guests} {booking.guests === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {booking.nights} {booking.nights === 1 ? "Night" : "Nights"}
                    </span>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount</span>
                      <span className="text-lg font-bold text-primary">${booking.total_amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href={`/bookings/${booking.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
