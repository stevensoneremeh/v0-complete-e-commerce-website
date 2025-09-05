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
import { CalendarIcon } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { DualCurrencyDisplay } from "@/components/dual-currency-display"

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
  const { toast } = useToast()

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0
  const totalAmount = nights * property.pricePerNight

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true)

    try {
      // Here you would typically submit to your booking API
      // For now, we'll simulate the booking process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Booking Request Submitted!",
        description: "We'll contact you shortly to confirm your booking.",
      })

      // Reset form
      setCheckIn(undefined)
      setCheckOut(undefined)
      setGuests("1")
      setGuestName("")
      setGuestEmail("")
      setGuestPhone("")
      setSpecialRequests("")
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Book Your Stay</span>
          <span className="text-2xl font-bold text-primary">
            <DualCurrencyDisplay usdAmount={property.pricePerNight} size="lg" variant="primary" compact={true} />
            /night
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  <DualCurrencyDisplay usdAmount={property.pricePerNight} size="sm" variant="default" compact={true} />{" "}
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

          <Button type="submit" className="w-full" disabled={isSubmitting || nights < property.minimumStay}>
            {isSubmitting ? "Submitting..." : "Request Booking"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            You won't be charged yet. We'll contact you to confirm your booking.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
