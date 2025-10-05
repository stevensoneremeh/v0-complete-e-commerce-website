"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Car, Ship, Star, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const carHireServices = [
  {
    id: 1,
    name: "Luxury Sedan",
    image: "/luxury-sedan-hire-premium-car-rental.jpg",
    price: 150,
    duration: "per day",
    capacity: "4 passengers",
    features: ["Professional Driver", "Air Conditioning", "Premium Interior", "GPS Navigation"],
    rating: 4.9,
    reviews: 127,
  },
  {
    id: 2,
    name: "Executive SUV",
    image: "/executive-suv-hire-luxury-vehicle-rental.jpg",
    price: 200,
    duration: "per day",
    capacity: "7 passengers",
    features: ["Chauffeur Service", "Leather Seats", "Entertainment System", "Refreshments"],
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    name: "Sports Car",
    image: "/sports-car-hire-luxury-rental-premium.jpg",
    price: 350,
    duration: "per day",
    capacity: "2 passengers",
    features: ["Self Drive Option", "Premium Sound", "Performance Package", "Insurance Included"],
    rating: 4.9,
    reviews: 156,
  },
]

const boatCruiseServices = [
  {
    id: 1,
    name: "Sunset Cruise",
    image: "/sunset-cruise-luxury-boat-hire-premium.jpg",
    price: 120,
    duration: "3 hours",
    capacity: "12 passengers",
    features: ["Dinner Included", "Live Music", "Open Bar", "Professional Crew"],
    rating: 4.9,
    reviews: 203,
  },
  {
    id: 2,
    name: "Private Yacht",
    image: "/private-yacht-hire-luxury-boat-cruise.jpg",
    price: 500,
    duration: "6 hours",
    capacity: "20 passengers",
    features: ["Private Chef", "Water Sports", "Premium Amenities", "Dedicated Staff"],
    rating: 5.0,
    reviews: 78,
  },
  {
    id: 3,
    name: "Island Hopping",
    image: "/island-hopping-cruise-luxury-boat-tour.jpg",
    price: 180,
    duration: "8 hours",
    capacity: "15 passengers",
    features: ["Multiple Stops", "Snorkeling Gear", "Lunch Included", "Tour Guide"],
    rating: 4.8,
    reviews: 134,
  },
]

export default function HirePage() {
  const [selectedService, setSelectedService] = useState<any>(null)
  const [serviceType, setServiceType] = useState<"car" | "boat" | null>(null)
  const [bookingDate, setBookingDate] = useState<Date>()
  const [bookingTime, setBookingTime] = useState("")
  const [passengers, setPassengers] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [showBookingForm, setShowBookingForm] = useState(false)
  const { toast } = useToast()

  const handleServiceSelect = (service: any, type: "car" | "boat") => {
    setSelectedService(service)
    setServiceType(type)
    setShowBookingForm(true)
  }

  const handleBooking = async () => {
    if (!selectedService || !bookingDate || !bookingTime || !customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Here you would integrate with your payment system (Paystack)
    toast({
      title: "Booking Confirmed!",
      description: `Your ${selectedService.name} booking has been confirmed for ${format(bookingDate, "PPP")} at ${bookingTime}.`,
    })

    // Reset form
    setShowBookingForm(false)
    setSelectedService(null)
    setServiceType(null)
    setBookingDate(undefined)
    setBookingTime("")
    setPassengers("")
    setSpecialRequests("")
    setCustomerInfo({ name: "", email: "", phone: "", address: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="section-padding">
        <div className="responsive-container">
          {/* Hero Section */}
          <div className="text-center mb-16 fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Car className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Hire Services</span>
            </div>
            <h1 className="display-2 mb-6 text-balance">Luxury Car Hire & Boat Cruises</h1>
            <p className="body-large text-muted-foreground max-w-3xl mx-auto text-pretty">
              Experience luxury travel with our premium car hire and exclusive boat cruise services. Professional
              service, exceptional quality, unforgettable experiences.
            </p>
          </div>

          {!showBookingForm ? (
            <>
              {/* Car Hire Services */}
              <section className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <Car className="h-6 w-6 text-primary" />
                  <h2 className="heading-1">Luxury Car Hire</h2>
                </div>

                <div className="responsive-grid">
                  {carHireServices.map((service) => (
                    <Card
                      key={service.id}
                      className="luxury-card group cursor-pointer"
                      onClick={() => handleServiceSelect(service, "car")}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{service.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="heading-3 group-hover:text-primary transition-colors">{service.name}</h3>
                            <Badge variant="secondary">{service.capacity}</Badge>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-primary">${service.price}</span>
                            <span className="text-muted-foreground">/{service.duration}</span>
                          </div>

                          <div className="space-y-2 mb-4">
                            {service.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 luxury-button" onClick={() => handleServiceSelect(service, "car")}>
                              Book Now
                            </Button>
                            <Button variant="outline" className="flex-1" asChild>
                              <Link href={`/hire/${service.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Boat Cruise Services */}
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Ship className="h-6 w-6 text-primary" />
                  <h2 className="heading-1">Luxury Boat Cruises</h2>
                </div>

                <div className="responsive-grid">
                  {boatCruiseServices.map((service) => (
                    <Card
                      key={service.id}
                      className="luxury-card group cursor-pointer"
                      onClick={() => handleServiceSelect(service, "boat")}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.name}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs font-medium">{service.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="heading-3 group-hover:text-primary transition-colors">{service.name}</h3>
                            <Badge variant="secondary">{service.capacity}</Badge>
                          </div>

                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold text-primary">${service.price}</span>
                            <span className="text-muted-foreground">/{service.duration}</span>
                          </div>

                          <div className="space-y-2 mb-4">
                            {service.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <Button className="flex-1 luxury-button" onClick={() => handleServiceSelect(service, "boat")}>
                              Book Now
                            </Button>
                            <Button variant="outline" className="flex-1" asChild>
                              <Link href={`/hire/${service.id}`}>View Details</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            </>
          ) : (
            /* Booking Form */
            <Card className="max-w-2xl mx-auto luxury-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {serviceType === "car" ? <Car className="h-5 w-5" /> : <Ship className="h-5 w-5" />}
                  Book {selectedService?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      className="luxury-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Number of Passengers</Label>
                    <Input
                      id="passengers"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="luxury-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Booking Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingDate ? format(bookingDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={bookingDate} onSelect={setBookingDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time *</Label>
                    <Select value={bookingTime} onValueChange={setBookingTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="13:00">1:00 PM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Pickup/Meeting Address</Label>
                  <Input
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className="luxury-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requests">Special Requests</Label>
                  <Textarea
                    id="requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="luxury-input"
                    rows={3}
                  />
                </div>

                <Separator />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Service:</span>
                    <span>{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Duration:</span>
                    <span>{selectedService?.duration}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">${selectedService?.price}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setShowBookingForm(false)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleBooking} className="flex-1 luxury-button">
                    Confirm Booking & Pay
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}