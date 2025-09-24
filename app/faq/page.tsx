import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function FAQPage() {
  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "We offer multiple shipping options: Standard shipping (5-7 business days), Express shipping (2-3 business days), and Same-day delivery (available in select areas). International shipping takes 7-14 business days depending on location.",
        },
        {
          question: "Do you ship internationally?",
          answer:
            "Yes, we ship to over 50 countries worldwide. International shipping costs and delivery times vary by destination. Please check our shipping calculator at checkout for accurate rates.",
        },
        {
          question: "Can I track my order?",
          answer:
            "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order in real-time through your account dashboard.",
        },
        {
          question: "What if my order is damaged or incorrect?",
          answer:
            "We're sorry if that happens! Please contact us within 48 hours of delivery with photos of the damaged items. We'll arrange for a replacement or full refund immediately.",
        },
      ],
    },
    {
      category: "Products & Quality",
      questions: [
        {
          question: "Are your products authentic?",
          answer:
            "Yes, all our products are 100% authentic and sourced directly from authorized distributors and manufacturers. We provide authenticity certificates for luxury items upon request.",
        },
        {
          question: "Do you offer product warranties?",
          answer:
            "Yes, we offer manufacturer warranties on all applicable products. Electronics come with 1-2 year warranties, luxury items have authenticity guarantees, and we offer our own 30-day satisfaction guarantee on all purchases.",
        },
        {
          question: "Can I see products before buying?",
          answer:
            "For high-value items, we offer virtual consultations via video call. You can also visit our showroom by appointment, or use our detailed product photos and 360° views available online.",
        },
      ],
    },
    {
      category: "Property Rentals",
      questions: [
        {
          question: "How do I book a property?",
          answer:
            "Browse our properties, select your dates, and click 'Book Now'. You'll need to provide ID verification and pay a deposit. Our team will confirm availability within 2 hours.",
        },
        {
          question: "What's included in property rentals?",
          answer:
            "All properties include utilities, WiFi, basic amenities, and 24/7 concierge service. Luxury properties may include additional services like housekeeping, chef services, and transportation.",
        },
        {
          question: "Can I cancel my booking?",
          answer:
            "Cancellation policies vary by property. Most offer free cancellation up to 48 hours before check-in. Premium properties may have different terms. Check the specific policy during booking.",
        },
      ],
    },
    {
      category: "Payments & Returns",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards, PayPal, bank transfers, and cryptocurrency. For high-value purchases, we also offer installment plans and financing options.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes, we use industry-standard SSL encryption and are PCI DSS compliant. We never store your complete payment information on our servers.",
        },
        {
          question: "What's your return policy?",
          answer:
            "We offer a 30-day return policy for most items in original condition. Luxury items and custom orders may have different terms. Digital products and services are non-refundable.",
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
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="display-2 mb-4 text-gradient">Frequently Asked Questions</h1>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our products, services, and policies. Can't find what you're looking
            for? Contact our support team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="grid gap-8 lg:gap-12">
          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="luxury-card">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="secondary" className="text-sm">
                    {category.category}
                  </Badge>
                </div>
                <CardTitle className="heading-2">{category.category}</CardTitle>
                <CardDescription className="body-medium">
                  Common questions about {category.category.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger className="text-left hover:text-primary">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support Section */}
        <Card className="luxury-card mt-12 lg:mt-16">
          <CardHeader className="text-center">
            <CardTitle className="heading-2">Still Need Help?</CardTitle>
            <CardDescription className="body-medium">
              Our support team is here to assist you with any questions or concerns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-fit mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="heading-3 mb-2">WhatsApp</h3>
                <p className="text-muted-foreground mb-4">Get instant support via WhatsApp</p>
                <WhatsAppButton
                  message="Hello! I need help with a question not covered in your FAQ."
                  className="w-full"
                />
              </div>

              <div className="text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-fit mx-auto mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="heading-3 mb-2">Email</h3>
                <p className="text-muted-foreground mb-4">Send us a detailed message</p>
                <a
                  href="mailto:support@ablnatasha.com"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                >
                  Send Email
                </a>
              </div>

              <div className="text-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full w-fit mx-auto mb-4">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="heading-3 mb-2">Phone</h3>
                <p className="text-muted-foreground mb-4">Call us for immediate assistance</p>
                <a
                  href="tel:+2349030944943"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
                >
                  Call Now
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
