import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Clock, MapPin, Shield, Package, Plane } from "lucide-react"

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: "Standard Shipping",
      icon: Truck,
      duration: "5-7 Business Days",
      cost: "Free on orders over $100",
      description: "Reliable delivery for most locations within Nigeria",
      features: ["Tracking included", "Insurance up to $500", "Signature required"],
    },
    {
      name: "Express Shipping",
      icon: Clock,
      duration: "2-3 Business Days",
      cost: "From $15",
      description: "Faster delivery for urgent orders",
      features: ["Priority handling", "SMS notifications", "Insurance up to $1000"],
    },
    {
      name: "Same-Day Delivery",
      icon: MapPin,
      duration: "Within 6 Hours",
      cost: "From $25",
      description: "Available in Lagos, Abuja, and Port Harcourt",
      features: ["Real-time tracking", "Direct delivery", "Premium packaging"],
    },
    {
      name: "International Shipping",
      icon: Plane,
      duration: "7-14 Business Days",
      cost: "Calculated at checkout",
      description: "Worldwide delivery to over 50 countries",
      features: ["Customs handling", "Full insurance", "Express options available"],
    },
  ]

  const locations = [
    { city: "Lagos", zones: ["Victoria Island", "Ikoyi", "Lekki", "Ikeja", "Surulere"] },
    { city: "Abuja", zones: ["Maitama", "Asokoro", "Wuse", "Garki", "Gwarinpa"] },
    { city: "Port Harcourt", zones: ["GRA", "Old GRA", "D-Line", "Trans Amadi", "Rumuola"] },
    { city: "Kano", zones: ["Nassarawa", "Fagge", "Gwale", "Kumbotso"] },
    { city: "Ibadan", zones: ["Bodija", "UI", "Ring Road", "Dugbe", "Mokola"] },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="responsive-container section-padding">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="display-2 mb-4 text-gradient">Shipping & Delivery</h1>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto">
            Fast, reliable, and secure delivery options to get your luxury items to you safely. We offer multiple
            shipping methods to suit your needs.
          </p>
        </div>

        {/* Shipping Options */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-12 lg:mb-16">
          {shippingOptions.map((option, index) => {
            const IconComponent = option.icon
            return (
              <Card key={index} className="luxury-card h-full">
                <CardHeader className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="heading-3">{option.name}</CardTitle>
                  <div className="space-y-2">
                    <Badge variant="secondary">{option.duration}</Badge>
                    <p className="text-sm font-medium text-primary">{option.cost}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  <ul className="space-y-2">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Shield className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Delivery Locations */}
        <Card className="luxury-card mb-12 lg:mb-16">
          <CardHeader>
            <CardTitle className="heading-2">Delivery Locations</CardTitle>
            <CardDescription className="body-medium">
              We deliver to major cities across Nigeria and internationally
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {locations.map((location, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="heading-3 flex items-center">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    {location.city}
                  </h3>
                  <div className="space-y-1">
                    {location.zones.map((zone, zoneIndex) => (
                      <Badge key={zoneIndex} variant="outline" className="mr-2 mb-2">
                        {zone}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Policies */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">Shipping Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="heading-3 mb-2">Processing Time</h3>
                <p className="text-muted-foreground">
                  Orders are processed within 1-2 business days. Custom items may take 3-5 business days.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Packaging</h3>
                <p className="text-muted-foreground">
                  All items are carefully packaged with premium materials to ensure safe delivery.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Insurance</h3>
                <p className="text-muted-foreground">
                  All shipments are insured against loss or damage during transit.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">International Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="heading-3 mb-2">Customs & Duties</h3>
                <p className="text-muted-foreground">
                  International customers are responsible for customs duties and taxes in their country.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Restricted Items</h3>
                <p className="text-muted-foreground">
                  Some items may have shipping restrictions. We'll notify you if your order is affected.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Tracking</h3>
                <p className="text-muted-foreground">
                  Full tracking is provided for all international shipments with regular updates.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
