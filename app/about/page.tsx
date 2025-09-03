import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Truck, HeadphonesIcon, Award, Users, Globe } from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Shield,
    title: "Secure Shopping",
    description: "Your data and payments are protected with industry-leading security measures.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and reliable shipping to get your products to you as soon as possible.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our customer service team is always ready to help you with any questions.",
  },
  {
    icon: Award,
    title: "Quality Guarantee",
    description: "We stand behind every product with our comprehensive quality guarantee.",
  },
]

const stats = [
  { number: "1M+", label: "Happy Customers" },
  { number: "50K+", label: "Products" },
  { number: "100+", label: "Countries" },
  { number: "99.9%", label: "Uptime" },
]

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "/placeholder.svg?height=300&width=300",
    description: "Visionary leader with 15+ years in e-commerce",
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "/placeholder.svg?height=300&width=300",
    description: "Tech expert ensuring seamless user experience",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Customer Success",
    image: "/placeholder.svg?height=300&width=300",
    description: "Dedicated to making every customer happy",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About ABL Natasha Enterprises</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We're on a mission to provide exceptional luxury experiences through premium products and exclusive
              apartment rentals. Since 2020, ABL Natasha Enterprises has been setting new standards in both e-commerce
              and hospitality.
            </p>
            <Badge variant="secondary" className="text-lg px-6 py-2">
              Trusted by millions worldwide
            </Badge>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    ABL Natasha Enterprises was born from a vision to create exceptional experiences in both luxury
                    shopping and premium accommodations. Our founders recognized the need for a platform that seamlessly
                    combines high-quality products with exclusive property rentals.
                  </p>
                  <p>
                    What started as a boutique enterprise has evolved into a comprehensive luxury platform serving
                    discerning customers worldwide. We've maintained our commitment to excellence, quality, and
                    personalized service throughout our growth.
                  </p>
                  <p>
                    Today, ABL Natasha Enterprises stands as a premier destination for luxury products and exclusive
                    apartment rentals, offering curated experiences that exceed expectations in every interaction.
                  </p>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Our Story"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose ABL Natasha Enterprises?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're committed to providing exceptional luxury experiences with services designed around your
                sophisticated needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <Card key={index} className="text-center">
                    <CardContent className="p-6">
                      <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The passionate people behind ABL Natasha Enterprises who work tirelessly to make your shopping
                experience exceptional.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={150}
                      height={150}
                      className="rounded-full mx-auto mb-4"
                    />
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary text-sm mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
              To redefine luxury experiences by creating a platform where premium products and exclusive accommodations
              meet, fostering connections that enhance lifestyles and create lasting memories.
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6" />
                <span>People First</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6" />
                <span>Global Impact</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <span>Trust & Security</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
