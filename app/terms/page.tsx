import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, AlertTriangle, Shield } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="responsive-container section-padding">
        {/* Hero Section */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="display-2 mb-4 text-gradient">Terms of Service</h1>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto">
            Please read these terms carefully before using our services. By accessing our website, you agree to be bound
            by these terms.
          </p>
          <p className="text-sm text-muted-foreground mt-4">Last updated: January 2025</p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8 lg:space-y-12">
          {/* Acceptance of Terms */}
          <Card className="luxury-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Scale className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="heading-2">Acceptance of Terms</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using the ABL Natasha Enterprises website and services, you accept and agree to be
                bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                These terms apply to all visitors, users, and others who access or use our service, including but not
                limited to customers, vendors, contractors, and contributors of content.
              </p>
            </CardContent>
          </Card>

          {/* Use License */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="heading-3 mb-2">Permission is granted to:</h3>
                <ul className="space-y-2 text-muted-foreground ml-4">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Browse and purchase products from our catalog
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Create an account and manage your profile
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Book property rentals through our platform
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Contact us for customer support
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="heading-3 mb-2">
                  This license shall automatically terminate if you violate any of these restrictions.
                </h3>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card className="luxury-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <CardTitle className="heading-2">Prohibited Uses</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">You may not use our service:</p>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  For any unlawful purpose or to solicit others to perform unlawful acts
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  To violate any international, federal, provincial, or state regulations, rules, laws, or local
                  ordinances
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  To infringe upon or violate our intellectual property rights or the intellectual property rights of
                  others
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  To submit false or misleading information
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Products and Services */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">Products and Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="heading-3 mb-2">Product Information</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant
                  that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Pricing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Prices for our products are subject to change without notice. We reserve the right to modify or
                  discontinue any product without notice.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Availability</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All products are subject to availability. We reserve the right to limit quantities or refuse service
                  to anyone at our sole discretion.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">Payment Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="heading-3 mb-2">Payment Methods</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We accept various payment methods including credit cards, debit cards, bank transfers, and digital
                  wallets. All payments must be made in full before product delivery or service provision.
                </p>
              </div>
              <div>
                <h3 className="heading-3 mb-2">Refunds</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Refunds are subject to our return policy. Please refer to our Returns & Exchanges page for detailed
                  information about refund eligibility and procedures.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="luxury-card">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="heading-2">Limitation of Liability</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                In no event shall ABL Natasha Enterprises, nor its directors, employees, partners, agents, suppliers, or
                affiliates, be liable for any indirect, incidental, punitive, consequential, or similar damages arising
                out of the use of our services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our liability is limited to the maximum extent permitted by law. In jurisdictions that do not allow the
                exclusion of certain warranties or the limitation of liability for consequential damages, our liability
                is limited to the fullest extent permitted by law.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of Nigeria. Any
                disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts of
                Nigeria.
              </p>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these terms at any time. If a
                revision is material, we will try to provide at least 30 days notice prior to any new terms taking
                effect.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Your continued use of our service after any such changes constitutes your acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="luxury-card">
            <CardHeader>
              <CardTitle className="heading-2">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="heading-3 mb-2">Email</h3>
                  <p className="text-muted-foreground">legal@ablnatasha.com</p>
                </div>
                <div>
                  <h3 className="heading-3 mb-2">Phone</h3>
                  <p className="text-muted-foreground">+234-903-094-4943</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
