import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { HeadphonesIcon, MessageCircle, Mail, Phone, Clock, CheckCircle, AlertCircle, HelpCircle } from "lucide-react"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function SupportPage() {
  const supportChannels = [
    {
      name: "WhatsApp Support",
      icon: MessageCircle,
      description: "Get instant help via WhatsApp",
      availability: "24/7",
      responseTime: "Within 5 minutes",
      status: "online",
      action: "whatsapp",
    },
    {
      name: "Email Support",
      icon: Mail,
      description: "Send detailed inquiries via email",
      availability: "24/7",
      responseTime: "Within 2 hours",
      status: "online",
      action: "email",
    },
    {
      name: "Phone Support",
      icon: Phone,
      description: "Speak directly with our team",
      availability: "9 AM - 9 PM WAT",
      responseTime: "Immediate",
      status: "online",
      action: "phone",
    },
    {
      name: "Live Chat",
      icon: HeadphonesIcon,
      description: "Chat with our support agents",
      availability: "9 AM - 9 PM WAT",
      responseTime: "Within 2 minutes",
      status: "online",
      action: "chat",
    },
  ]

  const commonIssues = [
    {
      category: "Orders",
      issues: ["Track my order", "Cancel or modify order", "Payment issues", "Delivery problems"],
    },
    {
      category: "Products",
      issues: [
        "Product information",
        "Authenticity verification",
        "Size/color availability",
        "Product recommendations",
      ],
    },
    {
      category: "Account",
      issues: ["Login problems", "Update profile", "Password reset", "Account verification"],
    },
    {
      category: "Properties",
      issues: ["Booking assistance", "Property availability", "Cancellation policy", "Special requests"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "busy":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "offline":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-3 w-3" />
      case "busy":
        return <AlertCircle className="h-3 w-3" />
      case "offline":
        return <AlertCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="responsive-container section-padding">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <HeadphonesIcon className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="display-2 mb-4 text-gradient">Customer Support</h1>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Get assistance with orders, products, bookings, or any questions about our services. Our
            support team is ready to assist you.
          </p>
        </div>

        {/* Support Channels */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12 lg:mb-16">
          {supportChannels.map((channel, index) => {
            const IconComponent = channel.icon
            return (
              <Card key={index} className="luxury-card h-full">
                <CardHeader className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="heading-3">{channel.name}</CardTitle>
                  <Badge className={getStatusColor(channel.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(channel.status)}
                      {channel.status}
                    </span>
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-4">{channel.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-center text-sm">
                      <Clock className="h-4 w-4 mr-2" />
                      {channel.availability}
                    </div>
                    <p className="text-xs text-muted-foreground">Response: {channel.responseTime}</p>
                  </div>
                  {channel.action === "whatsapp" && (
                    <WhatsAppButton
                      message="Hello! I need support with my order/account. Can you please help me?"
                      className="w-full"
                    />
                  )}
                  {channel.action === "email" && (
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href="mailto:support@ablnatasha.com">Send Email</a>
                    </Button>
                  )}
                  {channel.action === "phone" && (
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href="tel:+2349030944943">Call Now</a>
                    </Button>
                  )}
                  {channel.action === "chat" && (
                    <Button variant="outline" className="w-full bg-transparent">
                      Start Chat
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Common Issues */}
        <Card className="luxury-card mb-12 lg:mb-16">
          <CardHeader>
            <CardTitle className="heading-2">Common Issues</CardTitle>
            <CardDescription className="body-medium">Quick solutions for frequently asked questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {commonIssues.map((category, index) => (
                <div key={index}>
                  <h3 className="heading-3 mb-3 flex items-center">
                    <HelpCircle className="h-5 w-5 text-primary mr-2" />
                    {category.category}
                  </h3>
                  <ul className="space-y-2">
                    {category.issues.map((issue, issueIndex) => (
                      <li key={issueIndex}>
                        <button className="text-left text-sm text-muted-foreground hover:text-primary transition-colors">
                          {issue}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="luxury-card">
          <CardHeader>
            <CardTitle className="heading-2">Send us a Message</CardTitle>
            <CardDescription className="body-medium">
              Fill out the form below and we'll get back to you as soon as possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="Enter your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a category</option>
                    <option value="orders">Orders & Shipping</option>
                    <option value="products">Products & Services</option>
                    <option value="account">Account Issues</option>
                    <option value="properties">Property Bookings</option>
                    <option value="technical">Technical Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of your issue" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Please provide detailed information about your issue or question..."
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full luxury-button">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
