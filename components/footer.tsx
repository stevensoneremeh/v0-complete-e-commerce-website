import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="bg-foreground/95 text-background border-t border-foreground/20">
      <div className="responsive-container py-16 sm:py-20 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center overflow-hidden">
                <Image
                  src="/abl-natasha-logo.png"
                  alt="ABL Natasha Enterprises"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight">ABL</span>
                <span className="text-[10px] opacity-70 font-semibold">NATASHA</span>
              </div>
            </div>
            <p className="text-background/80 text-sm leading-relaxed">
              Premier destination for luxury products and premium apartment rentals. Experience excellence in shopping and accommodation.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-background/70 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Shop</h3>
            <div className="space-y-3">
              <Link href="/about" className="block text-background/80 hover:text-accent transition-colors text-sm">
                About Us
              </Link>
              <Link href="/contact" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Contact
              </Link>
              <Link href="/faq" className="block text-background/80 hover:text-accent transition-colors text-sm">
                FAQ
              </Link>
              <Link href="/shipping" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Shipping Info
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Categories</h3>
            <div className="space-y-3">
              <Link href="/categories/perfumes" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Perfumes
              </Link>
              <Link href="/categories/wigs" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Wigs
              </Link>
              <Link href="/categories/cars" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Automobiles
              </Link>
              <Link href="/categories/wines" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Wines
              </Link>
              <Link href="/categories/body-creams" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Skincare
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide">Legal</h3>
            <div className="space-y-3">
              <Link href="/returns" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Returns
              </Link>
              <Link href="/privacy" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Privacy
              </Link>
              <Link href="/terms" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Terms
              </Link>
              <Link href="/support" className="block text-background/80 hover:text-accent transition-colors text-sm">
                Support
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
