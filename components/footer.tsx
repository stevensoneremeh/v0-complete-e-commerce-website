import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                <Image
                  src="/abl-natasha-logo.png"
                  alt="ABL Natasha Enterprises"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl">ABL Natasha Enterprises</span>
            </div>
            <p className="text-muted-foreground">
              Your premier destination for luxury products and premium apartment rentals. Experience excellence in both
              shopping and accommodation with ABL Natasha Enterprises.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-muted-foreground hover:text-primary">
                About Us
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-primary">
                Contact
              </Link>
              <Link href="/faq" className="block text-muted-foreground hover:text-primary">
                FAQ
              </Link>
              <Link href="/shipping" className="block text-muted-foreground hover:text-primary">
                Shipping Info
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold">Categories</h3>
            <div className="space-y-2">
              <Link href="/categories/electronics" className="block text-muted-foreground hover:text-primary">
                Electronics
              </Link>
              <Link href="/categories/fashion" className="block text-muted-foreground hover:text-primary">
                Fashion
              </Link>
              <Link href="/categories/home" className="block text-muted-foreground hover:text-primary">
                Home & Garden
              </Link>
              <Link href="/categories/sports" className="block text-muted-foreground hover:text-primary">
                Sports
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <div className="space-y-2">
              <Link href="/returns" className="block text-muted-foreground hover:text-primary">
                Returns & Exchanges
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/support" className="block text-muted-foreground hover:text-primary">
                Support Center
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 ABL Natasha Enterprises. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
