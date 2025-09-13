"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, CreditCard } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"
import { PaystackPayment } from "@/components/paystack-payment"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface PropertyBookingProps {
  property: {
    id: string
    title: string
    pricePerNight: number
    minimumStay: number
  }
}

export function PropertyBooking({ property }: PropertyBookingProps) {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState("1")
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingStep, setBookingStep] = useState<"details" | "payment">("details")
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "NGN">("USD")
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const totalAmount = nights * property.pricePerNight
  const convertedAmount = selectedCurrency === "NGN" ? totalAmount * 1650 : totalAmount

  const handleBookingDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!checkIn || !checkOut || !guestName || !guestEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (nights < property.minimumStay) {
      toast({
        title: "Minimum Stay Required",
        description: `This property requires a minimum stay of ${property.minimumStay} nights.`,
        variant: "destructive",
      })
      return
    }

    setBookingStep("payment")
  }

  const handlePaystackSuccess = async (reference: string) => {
    setIsSubmitting(true)

    try {
      // Create booking with payment reference
      const bookingData = {
        property_id: property.id,
        user_id: user?.id,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        check_in_date: checkIn?.toISOString().split("T")[0],
        check_out_date: checkOut?.toISOString().split("T")[0],
        guests: Number.parseInt(guests),
        nights,
        price_per_night: property.pricePerNight,
        total_amount: totalAmount,
        special_requests: specialRequests,
        payment_reference: reference,
        payment_status: "paid",
        status: "confirmed",
      }

      // Here you would call your booking API
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const { booking } = await response.json()

        toast({
          title: "Booking Confirmed! 🎉",
          description: `Your booking has been confirmed. Reference: ${reference}`,
        })

        // Redirect to booking confirmation page
        router.push(`/bookings/confirmation/${booking.id}`)
      } else {
        throw new Error("Failed to create booking")
      }
    } catch (error) {
      console.error("Booking creation error:", error)
      toast({
        title: "Booking Error",
        description: "Payment successful but booking creation failed. Please contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePaystackError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    })
  }

  const handleBackToDetails = () => {
    setBookingStep("details")
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{bookingStep === "details" ? "Book Your Stay" : "Complete Payment"}</span>
          <span className="text-2xl font-bold text-primary">
            <DualCurrencyDisplay usdAmount={property.pricePerNight} size="lg" variant="primary" compact={true} />
            /night
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookingStep === "details" ? (
          <form onSubmit={handleBookingDetailsSubmit} className="space-y-4">
            {/* Check-in Date */}
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !checkIn && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkIn}
                    onSelect={setCheckIn}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !checkOut && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOut}
                    onSelect={setCheckOut}
                    disabled={(date) => date <= (checkIn || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <Label>Number of Guests</Label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? "Guest" : "Guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guest Information */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-semibold">Guest Information</h4>

              <div className="space-y-2">
                <Label htmlFor="guest-name">Full Name *</Label>
                <Input
                  id="guest-name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guest-email">Email *</Label>
                <Input
                  id="guest-email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guest-phone">Phone Number</Label>
                <Input
                  id="guest-phone"
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-requests">Special Requests</Label>
                <Textarea
                  id="special-requests"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requests or requirements?"
                  rows={3}
                />
              </div>
            </div>

            {/* Booking Summary */}
            {nights > 0 && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>
                    <DualCurrencyDisplay
                      usdAmount={property.pricePerNight}
                      size="sm"
                      variant="default"
                      compact={true}
                    />{" "}
                    × {nights} nights
                  </span>
                  <span>
                    <DualCurrencyDisplay usdAmount={totalAmount} size="sm" variant="default" compact={true} />
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    <DualCurrencyDisplay usdAmount={totalAmount} size="lg" variant="primary" compact={true} />
                  </span>
                </div>
                {nights < property.minimumStay && (
                  <p className="text-sm text-red-600">Minimum stay: {property.minimumStay} nights</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={nights < property.minimumStay}>
              <CreditCard className="h-4 w-4 mr-2" />
              Continue to Payment
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Property:</span>
                  <span className="font-medium">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{checkIn ? format(checkIn, "MMM dd, yyyy") : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{checkOut ? format(checkOut, "MMM dd, yyyy") : ""}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>
                    {guests} {Number.parseInt(guests) === 1 ? "Guest" : "Guests"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>{nights}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Amount:</span>
                  <span>
                    <DualCurrencyDisplay usdAmount={totalAmount} size="sm" variant="primary" compact={true} />
                  </span>
                </div>
              </div>
            </div>

            {/* Currency Selection */}
            <div className="space-y-2">
              <Label>Payment Currency</Label>
              <Select value={selectedCurrency} onValueChange={(value: "USD" | "NGN") => setSelectedCurrency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Paystack Payment Component */}
            <PaystackPayment
              amount={convertedAmount}
              email={guestEmail}
              currency={selectedCurrency}
              customerName={guestName}
              onSuccess={handlePaystackSuccess}
              onError={handlePaystackError}
              disabled={isSubmitting}
            />

            <Button
              variant="outline"
              onClick={handleBackToDetails}
              className="w-full bg-transparent"
              disabled={isSubmitting}
            >
              Back to Booking Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
