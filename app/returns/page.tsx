import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RotateCcw, Shield, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: "Contact Us",
      description: "Reach out within 30 days of delivery via WhatsApp, email, or phone",
      icon: AlertCircle,
    },
    {
      step: 2,
      title: "Get Authorization",
      description: "Receive a Return Authorization Number (RAN) and return instructions",
      icon: CheckCircle,
    },
    {
      step: 3,
      title: "Package Item",
      description: "Pack the item in original packaging with all accessories and documentation",
      icon: Shield,
    },
    {
      step: 4,
      title: "Ship Back",
      description: "Use our prepaid return label or arrange pickup for high-value items",
      icon: RotateCcw,
    },
  ]

  const returnPolicies = [
    {
      category: "Electronics & Gadgets",
      period: "30 days",
      conditions: "Original packaging, unused condition, all accessories included",
      restockingFee: "None",
      status: "eligible",
    },
    {
      category: "Luxury Items (Watches, Jewelry)",
      period: "14 days",
      conditions: "Unworn, original packaging, authenticity certificate",
      restockingFee: "None",
      status: "eligible",
    },
    {
      category: "Perfumes & Cosmetics",
      period: "7 days",
      conditions: "Unopened, sealed packaging only",
      restockingFee: "None",
      status: "limited",
    },
    {
      category: "Custom/Personalized Items",
      period: "N/A",
      conditions: "Not eligible for return unless defective",
      restockingFee: "N/A",
      status: "not-eligible",
    },
    {
      category: "Digital Products",
      period: "N/A",
      conditions: "Not eligible for return after download/access",
      restockingFee: "N/A",
      status: "not-eligible",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "eligible":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "limited":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "not-eligible":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "eligible":
        return <CheckCircle className="h-4 w-4" />
      case "limited":
        return <AlertCircle className="h-4 w-4" />
      case "not-eligible":
        return <XCircle className="h-4 w-4" />
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
              <RotateCcw className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="display-2 mb-4 text-gradient">Returns & Exchanges</h1>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto">
            We want you to be completely satisfied with your purchase. Our hassle-free return policy makes it easy to
            return or exchange items.
          </p>
        </div>

        {/* Return Process */}
        <Card className="luxury-card mb-12 lg:mb-16">
          <CardHeader>
            <CardTitle className="heading-2">How to Return an Item</CardTitle>
            <CardDescription className="body-medium">Follow these simple steps to return your purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {returnSteps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <div key={index} className="text-center">
                    <div className="relative mb-4">
                      <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="heading-3 mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Return Policies by Category */}
        <Card className="luxury-card mb-12 lg:mb-16">
          <CardHeader>
            <CardTitle className="heading-2">Return Policy by Category</CardTitle>
            <CardDescription className="body-medium">
              Different product categories have specific return conditions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Category</th>
                    <th className="text-left py-3 px-2">Return Period</th>
                    <th className="text-left py-3 px-2">Conditions</th>
                    <th className="text-left py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {returnPolicies.map((policy, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-2">
                        <div className="font-medium">{policy.category}</div>
                      </td>
                      <td className="py-4 px-2">
                        <Badge variant="outline">{policy.period}</Badge>
                      </td>
                      <td className="py-4 px-2 text-sm text-muted-foreground max-w-xs">{policy.conditions}</td>
                      <td className="py-4 px-2">
                        <Badge className={getStatusColor(policy.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(policy.status)}
                            {policy.status === "eligible"
                              ? "Eligible"
                              : policy.status === "limited"
                                ? "Limited"
                                : "Not Eligible"}
                          </span>
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <div className="grid gap-8 md:grid-cols-2 mb-12 lg:mb-16">
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">Refund Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="heading-3 mb-2">Processing Time</h3>
                <p className="text-muted-foreground">
                  Refunds are processed within 3-5 business days after we receive your return.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Refund Method</h3>
                <p className="text-muted-foreground">
                  Refunds are issued to the original payment method used for the purchase.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Partial Refunds</h3>
                <p className="text-muted-foreground">
                  Items returned in used condition may receive partial refunds at our discretion.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">Exchange Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="heading-3 mb-2">Size/Color Exchanges</h3>
                <p className="text-muted-foreground">Free exchanges for different sizes or colors within 30 days.</p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Defective Items</h3>
                <p className="text-muted-foreground">
                  Immediate replacement or full refund for defective items, no questions asked.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Upgrade Exchanges</h3>
                <p className="text-muted-foreground">Exchange for higher-value items by paying the difference.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact for Returns */}
        <Card className="luxury-card">
          <CardHeader className="text-center">
            <CardTitle className="heading-2">Need to Start a Return?</CardTitle>
            <CardDescription className="body-medium">
              Contact our customer service team to begin your return process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Quick Returns</h3>
                <p className="text-muted-foreground mb-4">Start your return via WhatsApp for fastest processing</p>
                <WhatsAppButton
                  message="Hello! I would like to return an item I purchased. Can you help me with the return process?"
                  className="w-full"
                />
              </div>

              <div className="text-center">
                <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">Send detailed return request via email</p>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="mailto:returns@ablnatasha.com">Email Returns Team</a>
                </Button>
              </div>

              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-primary mx-auto mb-4" />
                <h3 className="heading-3 mb-2">Phone Support</h3>
                <p className="text-muted-foreground mb-4">Speak directly with our returns specialist</p>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <a href="tel:+2349030944943">Call Returns Line</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
