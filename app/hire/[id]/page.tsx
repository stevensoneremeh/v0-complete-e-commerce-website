"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Share2, Star, Users, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface HireItem {
  id: string
  name: string
  description: string
  service_type: string
  category: string
  price_per_day?: number
  price_per_week?: number
  price_per_month?: number
  price?: number
  duration?: string
  capacity?: string
  max_capacity?: number
  features?: string[]
  images?: string[]
  availability: boolean
  rating?: number
  reviews_count?: number
  created_at: string
}

export default function HireDetailPage() {
  const params = useParams()
  const hireId = params.id as string
  const [hire, setHire] = useState<HireItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [rentalType, setRentalType] = useState<"day" | "week" | "month">("day")
  const [startDate, setStartDate] = useState("")
  const [duration, setDuration] = useState(1)

  useEffect(() => {
    fetchHire()
  }, [hireId])

  const fetchHire = async () => {
    try {
      const response = await fetch("/api/admin/hire-services")
      if (response.ok) {
        const data = await response.json()
        const items = Array.isArray(data) ? data : data.services || []
        const found = items.find((h: HireItem) => h.id === hireId)
        setHire(found || null)
      }
    } catch (error) {
      console.error("Error fetching hire item:", error)
      toast.error("Failed to load hire item")
    } finally {
      setLoading(false)
    }
  }

  const nextImage = () => {
    if (hire?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % hire.images!.length)
    }
  }

  const prevImage = () => {
    if (hire?.images) {
      setCurrentImageIndex((prev) => (prev - 1 + (hire.images?.length || 1)) % (hire.images?.length || 1))
    }
  }

  const getPrice = () => {
    if (rentalType === "day") return (hire?.price_per_day || 0) * duration
    if (rentalType === "week") return (hire?.price_per_week || 0) * duration
    if (rentalType === "month") return (hire?.price_per_month || 0) * duration
    return 0
  }

  const handleBooking = () => {
    if (!startDate) {
      toast.error("Please select a start date")
      return
    }
    toast.success(`Booking request for ${duration} ${rentalType}(s) sent!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header />
        <div className="animate-pulse">Loading hire item...</div>
        <Footer />
      </div>
    )
  }

  if (!hire) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Hire item not found</h1>
          <Link href="/hire">
            <Button>Browse Hire Services</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/hire" className="hover:text-foreground transition">
            Hire Services
          </Link>
          <span>/</span>
          <span className="text-foreground">{hire.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-muted rounded-lg overflow-hidden h-96 md:h-[500px] flex items-center justify-center">
              {hire.images && hire.images.length > 0 ? (
                <>
                  <img
                    src={hire.images[currentImageIndex] || "/placeholder.svg?height=500&width=800&query=hire"}
                    alt={hire.name}
                    className="w-full h-full object-cover"
                  />
                  {hire.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 transition"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground">No image available</div>
              )}
            </div>

            {hire.images && hire.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {hire.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      index === currentImageIndex ? "border-primary" : "border-muted"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${hire.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">{hire.name}</h2>
              <Badge className="mb-4">{hire.category}</Badge>
              <p className="text-foreground leading-relaxed">{hire.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hire.max_capacity && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="font-bold text-2xl">{hire.max_capacity}</p>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                  </CardContent>
                </Card>
              )}
              {hire.rating && (
                <Card>
                  <CardContent className="p-4 text-center">
                    <Star className="h-6 w-6 mx-auto mb-2 text-yellow-400 fill-yellow-400" />
                    <p className="font-bold text-2xl">{hire.rating.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardContent className="p-4 text-center">
                  <Badge className="w-fit mx-auto mb-2">{hire.availability ? "✓ Available" : "✗ Unavailable"}</Badge>
                  <p className="text-sm text-muted-foreground">Status</p>
                </CardContent>
              </Card>
            </div>

            {hire.features && hire.features.length > 0 && (
              <div className="bg-muted rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Features & Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hire.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Book Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Rental Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { type: "day" as const, label: "Daily", price: hire.price_per_day },
                      { type: "week" as const, label: "Weekly", price: hire.price_per_week },
                      { type: "month" as const, label: "Monthly", price: hire.price_per_month },
                    ].map(
                      ({ type, label, price }) =>
                        price !== undefined && (
                          <button
                            key={type}
                            onClick={() => setRentalType(type)}
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                              rentalType === type ? "bg-primary text-white" : "bg-muted hover:bg-muted text-foreground"
                            }`}
                          >
                            {label}
                          </button>
                        ),
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium block mb-1">Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-1">Duration ({rentalType})</label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDuration(Math.max(1, duration - 1))}
                        className="px-3 py-2 hover:bg-muted rounded"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center py-2">{duration}</span>
                      <button onClick={() => setDuration(duration + 1)} className="px-3 py-2 hover:bg-muted rounded">
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per {rentalType}</span>
                    <span className="font-medium">
                      $
                      {rentalType === "day"
                        ? hire.price_per_day
                        : rentalType === "week"
                          ? hire.price_per_week
                          : hire.price_per_month}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${getPrice().toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleBooking} disabled={!hire.availability} className="w-full" size="lg">
                  {hire.availability ? "Book Now" : "Unavailable"}
                </Button>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Share2 className="h-5 w-5" />
                  </Button>
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
