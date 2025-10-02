"use client"

import { useState, useEffect } from "react"
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

interface HireItem {
  id: string
  name: string
  description: string
  service_type: "car" | "boat"
  price: number
  duration: string
  capacity: string
  features: string[]
  images: string[]
  rating: number
  review_count: number
}

export default function HirePage() {
  const [carHireServices, setCarHireServices] = useState<HireItem[]>([])
  const [boatCruiseServices, setBoatCruiseServices] = useState<HireItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<HireItem | null>(null)
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

  useEffect(() => {
    fetchHireItems()
  }, [])

  const fetchHireItems = async () => {
    try {
      setLoading(true)
      const [carsRes, boatsRes] = await Promise.all([
        fetch("/api/hire-items?service_type=car"),
        fetch("/api/hire-items?service_type=boat"),
      ])

      if (carsRes.ok && boatsRes.ok) {
        const carsData = await carsRes.json()
        const boatsData = await boatsRes.json()
        setCarHireServices(carsData.items || [])
        setBoatCruiseServices(boatsData.items || [])
      }
    } catch (error) {
      console.error("Error fetching hire items:", error)
      toast({
        title: "Error",
        description: "Failed to load hire services",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleServiceSelect = (service: HireItem, type: "car" | "boat") => {
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

    toast({
      title: "Booking Confirmed!",
      description: `Your ${selectedService.name} booking has been confirmed for ${format(bookingDate, "PPP")} at ${bookingTime}.`,
    })

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
              <section className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <Car className="h-6 w-6 text-primary" />
                  <h2 className="heading-1">Luxury Car Hire</h2>
                </div>

                <div className="responsive-grid">
                  {loading ? (
                    <div className="col-span-full text-center py-10">
                      <p>Loading car hire services...</p>
                    </div>
                  ) : carHireServices.length === 0 ? (
                    <div className="col-span-full text-center py-10">
                      <p>No car hire services available at the moment.</p>
                    </div>
                  ) : (
                    carHireServices.map((service) => (
                      <Card
                        key={service.id}
                        className="luxury-card group cursor-pointer"
                        onClick={() => handleServiceSelect(service, "car")}
                      >
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <Image
                              src={service.images[0] || "/placeholder.svg"}
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

                            <Button className="w-full luxury-button">Book Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-8">
                  <Ship className="h-6 w-6 text-primary" />
                  <h2 className="heading-1">Luxury Boat Cruises</h2>
                </div>

                <div className="responsive-grid">
                  {loading ? (
                    <div className="col-span-full text-center py-10">
                      <p>Loading boat cruise services...</p>
                    </div>
                  ) : boatCruiseServices.length === 0 ? (
                    <div className="col-span-full text-center py-10">
                      <p>No boat cruise services available at the moment.</p>
                    </div>
                  ) : (
                    boatCruiseServices.map((service) => (
                      <Card
                        key={service.id}
                        className="luxury-card group cursor-pointer"
                        onClick={() => handleServiceSelect(service, "boat")}
                      >
                        <CardContent className="p-0">
                          <div className="relative overflow-hidden">
                            <Image
                              src={service.images[0] || "/placeholder.svg"}
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

                            <Button className="w-full luxury-button">Book Now</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            </>
          ) : (
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
