import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, UserCheck, Database, Globe } from "lucide-react"

export default function PrivacyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        {
          subtitle: "Personal Information",
          details:
            "Name, email address, phone number, shipping address, and payment information when you make a purchase or create an account.",
        },
        {
          subtitle: "Usage Information",
          details:
            "How you interact with our website, including pages visited, products viewed, and time spent on our site.",
        },
        {
          subtitle: "Device Information",
          details:
            "IP address, browser type, device type, and operating system for security and optimization purposes.",
        },
        {
          subtitle: "Communication Data",
          details: "Records of your communications with us, including customer service interactions and feedback.",
        },
      ],
    },
    {
      title: "How We Use Your Information",
      icon: UserCheck,
      content: [
        {
          subtitle: "Order Processing",
          details: "To process your orders, arrange shipping, handle payments, and provide customer support.",
        },
        {
          subtitle: "Account Management",
          details: "To create and manage your account, track your order history, and save your preferences.",
        },
        {
          subtitle: "Communication",
          details:
            "To send order confirmations, shipping updates, promotional offers, and important account information.",
        },
        {
          subtitle: "Improvement",
          details: "To analyze website usage, improve our services, and develop new features and products.",
        },
      ],
    },
    {
      title: "Information Sharing",
      icon: Globe,
      content: [
        {
          subtitle: "Service Providers",
          details:
            "We share information with trusted third-party service providers who help us operate our business, such as payment processors and shipping companies.",
        },
        {
          subtitle: "Legal Requirements",
          details:
            "We may disclose information when required by law, to protect our rights, or to ensure the safety of our users.",
        },
        {
          subtitle: "Business Transfers",
          details:
            "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.",
        },
        {
          subtitle: "Consent",
          details:
            "We will share your information with third parties only with your explicit consent for specific purposes.",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="responsive-container section-padding">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="display-2 mb-4 text-gradient">Privacy Policy</h1>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal
            information when you use our services.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: January 2025</p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8 lg:space-y-12">
          {sections.map((section, index) => {
            const IconComponent = section.icon
            return (
              <Card key={index} className="luxury-card">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="heading-2">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h3 className="heading-3 mb-2">{item.subtitle}</h3>
                        <p className="text-muted-foreground leading-relaxed">{item.details}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Data Security */}
        <Card className="luxury-card mt-8 lg:mt-12">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="heading-2">Data Security</CardTitle>
            </div>
            <CardDescription className="body-medium">How we protect your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="heading-3 mb-3">Technical Safeguards</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    SSL encryption for all data transmission
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Secure servers with regular security updates
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Regular security audits and penetration testing
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Multi-factor authentication for admin access
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="heading-3 mb-3">Operational Safeguards</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start">
                    <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Limited access to personal data on need-to-know basis
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Employee training on data protection practices
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Regular data backups and disaster recovery plans
                  </li>
                  <li className="flex items-start">
                    <Shield className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    Incident response procedures for data breaches
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="luxury-card mt-8 lg:mt-12">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="heading-2">Your Rights</CardTitle>
            </div>
            <CardDescription className="body-medium">You have control over your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <h3 className="heading-3 mb-2">Access</h3>
                <p className="text-muted-foreground text-sm">
                  Request a copy of the personal information we hold about you.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Correction</h3>
                <p className="text-muted-foreground text-sm">Update or correct any inaccurate personal information.</p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Deletion</h3>
                <p className="text-muted-foreground text-sm">
                  Request deletion of your personal information, subject to legal requirements.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Portability</h3>
                <p className="text-muted-foreground text-sm">
                  Receive your personal information in a structured, machine-readable format.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Restriction</h3>
                <p className="text-muted-foreground text-sm">
                  Limit how we process your personal information in certain circumstances.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Objection</h3>
                <p className="text-muted-foreground text-sm">
                  Object to processing of your personal information for marketing purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="luxury-card mt-8 lg:mt-12">
          <CardHeader>
            <CardTitle className="heading-2">Contact Us</CardTitle>
            <CardDescription className="body-medium">
              Questions about this privacy policy or your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="heading-3 mb-3">Privacy Officer</h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>Email: privacy@ablnatasha.com</p>
                  <p>Phone: +234-903-094-4943</p>
                  <p>Response time: Within 30 days</p>
                </div>
              </div>
              <div>
                <h3 className="heading-3 mb-3">Mailing Address</h3>
                <div className="space-y-1 text-muted-foreground">
                  <p>ABL Natasha Enterprises</p>
                  <p>Privacy Department</p>
                  <p>Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
