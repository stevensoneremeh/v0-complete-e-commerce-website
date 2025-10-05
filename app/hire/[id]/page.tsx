
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Ship, Star, CheckCircle, Calendar, Users, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const carHireServices = [
  {
    id: "luxury-sedan",
    name: "Luxury Sedan",
    type: "car",
    image: "/luxury-sedan-hire-premium-car-rental.jpg",
    price: 150,
    duration: "per day",
    capacity: "4 passengers",
    features: ["Professional Driver", "Air Conditioning", "Premium Interior", "GPS Navigation"],
    rating: 4.9,
    reviews: 127,
    description: "Experience luxury travel with our premium sedan service. Perfect for business trips, special occasions, or comfortable daily transportation. Our professional chauffeurs ensure a smooth and elegant journey.",
  },
  {
    id: "executive-suv",
    name: "Executive SUV",
    type: "car",
    image: "/executive-suv-hire-luxury-vehicle-rental.jpg",
    price: 200,
    duration: "per day",
    capacity: "7 passengers",
    features: ["Chauffeur Service", "Leather Seats", "Entertainment System", "Refreshments"],
    rating: 4.8,
    reviews: 89,
    description: "Travel in style with our executive SUV. Spacious interior, premium amenities, and professional service make this perfect for families or executive travel.",
  },
  {
    id: "sports-car",
    name: "Sports Car",
    type: "car",
    image: "/sports-car-hire-luxury-rental-premium.jpg",
    price: 350,
    duration: "per day",
    capacity: "2 passengers",
    features: ["Self Drive Option", "Premium Sound", "Performance Package", "Insurance Included"],
    rating: 4.9,
    reviews: 156,
    description: "Feel the thrill of driving a luxury sports car. Perfect for special occasions, weekend getaways, or making a statement.",
  },
]

const boatCruiseServices = [
  {
    id: "sunset-cruise",
    name: "Sunset Cruise",
    type: "boat",
    image: "/sunset-cruise-luxury-boat-hire-premium.jpg",
    price: 120,
    duration: "3 hours",
    capacity: "12 passengers",
    features: ["Dinner Included", "Live Music", "Open Bar", "Professional Crew"],
    rating: 4.9,
    reviews: 203,
    description: "Experience breathtaking sunsets on our luxury cruise. Includes dinner, live entertainment, and stunning ocean views.",
  },
  {
    id: "private-yacht",
    name: "Private Yacht",
    type: "boat",
    image: "/private-yacht-hire-luxury-boat-cruise.jpg",
    price: 500,
    duration: "6 hours",
    capacity: "20 passengers",
    features: ["Private Chef", "Water Sports", "Premium Amenities", "Dedicated Staff"],
    rating: 5.0,
    reviews: 78,
    description: "Charter your own private yacht for an unforgettable experience. Perfect for celebrations, corporate events, or intimate gatherings.",
  },
  {
    id: "island-hopping",
    name: "Island Hopping",
    type: "boat",
    image: "/island-hopping-cruise-luxury-boat-tour.jpg",
    price: 180,
    duration: "8 hours",
    capacity: "15 passengers",
    features: ["Multiple Stops", "Snorkeling Gear", "Lunch Included", "Tour Guide"],
    rating: 4.8,
    reviews: 134,
    description: "Explore multiple islands in one day. Includes snorkeling, lunch, and guided tours of pristine beaches and hidden coves.",
  },
]

interface HireDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function HireDetailPage({ params }: HireDetailPageProps) {
  const { id } = await params
  
  const allServices = [...carHireServices, ...boatCruiseServices]
  const service = allServices.find(s => s.id === id)

  if (!service) {
    notFound()
  }

  const Icon = service.type === "car" ? Car : Ship

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-padding">
        <div className="responsive-container">
          {/* Service Header */}
          <div className="mb-8">
            <Link href="/hire" className="text-primary hover:underline mb-4 inline-block">
              ← Back to Hire Services
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.name}
                width={800}
                height={600}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{service.rating}</span>
                  <span className="text-xs text-muted-foreground">({service.reviews})</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-6 w-6 text-primary" />
                  <Badge variant="secondary">{service.type === "car" ? "Car Hire" : "Boat Cruise"}</Badge>
                </div>
                <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
                <p className="text-lg text-muted-foreground">{service.description}</p>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold text-primary">${service.price}</span>
                  <span className="text-muted-foreground">/{service.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Users className="h-4 w-4" />
                  <span>{service.capacity}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Features & Amenities</h3>
                {service.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild className="w-full luxury-button" size="lg">
                <Link href="/hire">Book Now</Link>
              </Button>
            </div>
          </div>

          {/* Additional Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">What to Expect</h2>
              <div className="prose max-w-none">
                <p>
                  Our {service.name.toLowerCase()} service provides an exceptional experience with attention to every detail.
                  Whether you're celebrating a special occasion or need reliable transportation, we ensure comfort,
                  safety, and luxury throughout your journey.
                </p>
                <h3>Booking Information</h3>
                <ul>
                  <li>Advance booking recommended (24-48 hours notice preferred)</li>
                  <li>Flexible pickup and drop-off locations</li>
                  <li>Professional and experienced staff</li>
                  <li>All safety equipment and insurance included</li>
                  <li>Customizable packages available</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: HireDetailPageProps) {
  const { id } = await params
  const allServices = [...carHireServices, ...boatCruiseServices]
  const service = allServices.find(s => s.id === id)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  return {
    title: `${service.name} - Hire Services | ABL Natasha Enterprises`,
    description: service.description,
  }
}
