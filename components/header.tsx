"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { Search, User, Menu, Heart, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { CartSidebar } from "@/components/cart-sidebar"
import { useWishlist } from "@/components/wishlist-provider"
import { Badge } from "@/components/ui/badge"

const searchSuggestions = [
  "luxury perfumes",
  "premium wigs",
  "body creams",
  "luxury cars",
  "fine wines",
  "apartment rentals",
  "luxury apartments",
  "premium skincare",
  "designer fragrances",
  "luxury lifestyle",
]

export function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const { theme, setTheme } = useTheme()
  const { items } = useCart()
  const { user, logout } = useAuth()
  const { count: wishlistCount } = useWishlist()

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (value.length > 0) {
      const filtered = searchSuggestions
        .filter((suggestion) => suggestion.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
      setSelectedSuggestionIndex(-1)
    } else {
      setShowSuggestions(false)
      setFilteredSuggestions([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0) {
        handleSearch(filteredSuggestions[selectedSuggestionIndex])
      } else {
        handleSearch(searchQuery)
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    window.location.href = `/products?search=${encodeURIComponent(query)}`
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="responsive-container flex h-16 sm:h-18 lg:h-20 items-center justify-between gap-2 sm:gap-3 lg:gap-4 py-2 sm:py-2.5">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="relative">
            <div className="h-11 w-11 sm:h-13 sm:w-13 lg:h-15 lg:w-15 rounded-xl bg-card flex items-center justify-center premium-shadow-sm group-hover:premium-shadow elegant-hover overflow-hidden border border-border">
              <Image
                src="/abl-natasha-logo.png"
                alt="ABL Natasha Enterprises"
                width={56}
                height={56}
                className="object-contain w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9"
                priority
              />
            </div>
          </div>
          <div className="hidden sm:flex flex-col gap-0.5">
            <span className="font-bold text-sm lg:text-base leading-tight tracking-tight">ABL</span>
            <span className="text-[10px] lg:text-xs text-muted-foreground font-semibold tracking-wider">
              NATASHA
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">
            Home
          </Link>
          <Link href="/products" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">
            Products
          </Link>
          <Link href="/properties" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">
            Properties
          </Link>
          <Link href="/hire" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">
            Hire
          </Link>
          <Link href="/categories" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">
            Categories
          </Link>
          <Link href="/about" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">
            About
          </Link>
          <Link href="/contact" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors duration-200">
            Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center flex-1 max-w-sm lg:max-w-md xl:max-w-xl mx-3 lg:mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 lg:left-4 top-1/2 -translate-y-1/2 h-4 w-4 lg:h-4.5 lg:w-4.5 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search products, properties..."
              className="w-full pl-10 lg:pl-12 h-11 lg:h-12 rounded-xl luxury-input border border-border focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all duration-300 text-sm lg:text-base placeholder:text-muted-foreground/60"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(filteredSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl overflow-hidden z-50 shadow-lg">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    className={`w-full text-left px-4 lg:px-5 py-2.5 lg:py-3 hover:bg-muted/30 transition-colors text-sm lg:text-base ${
                      index === selectedSuggestionIndex ? "bg-muted/20" : ""
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center gap-3">
                      <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground/80">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2">
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 xs:h-9 xs:w-9 rounded-lg hover:bg-muted/50">
                  <Search className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full p-4 luxury-card">
                <div className="relative mt-8">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search luxury products..."
                    className="luxury-input pl-10 h-12 rounded-xl text-sm"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                    autoFocus
                  />
                  {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 luxury-card mt-2 overflow-hidden z-50">
                      {filteredSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <div className="flex items-center space-x-3">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-lg xs:rounded-xl hover:bg-muted/50 elegant-hover"
          >
            <Sun className="h-3.5 w-3.5 xs:h-4 xs:w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 xs:h-4 xs:w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-lg xs:rounded-xl hover:bg-muted/50 elegant-hover mobile-hidden"
            asChild
          >
            <Link href="/wishlist">
              <Heart className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 xs:-top-2 -right-1 xs:-right-2 h-4 w-4 xs:h-5 xs:w-5 rounded-full p-0 flex items-center justify-center text-[10px] xs:text-xs bg-primary text-primary-foreground">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </Badge>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>
          </Button>

          {/* Cart */}
          <CartSidebar />

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-lg xs:rounded-xl hover:bg-muted/50 elegant-hover"
                >
                  <User className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 xs:w-56 rounded-lg xs:rounded-xl luxury-card">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="text-sm">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders" className="text-sm">
                    Orders
                  </Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="text-sm">
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-sm">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="luxury-button rounded-lg xs:rounded-xl px-3 xs:px-4 sm:px-6 font-medium mobile-hidden h-8 xs:h-9 sm:h-10 text-xs xs:text-sm"
            >
              <Link href="/auth">Login</Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-lg xs:rounded-xl"
              >
                <Menu className="h-3.5 w-3.5 xs:h-4 xs:w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 xs:w-80 luxury-card">
              <div className="flex flex-col space-y-6 mt-6 xs:mt-8">
                {/* Mobile Actions */}
                <div className="pt-4 xs:pt-6 border-t border-border space-y-3 xs:space-y-4">
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 text-base xs:text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    <Heart className="h-4 w-4 xs:h-5 xs:w-5" />
                    Wishlist
                    {wishlistCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs">{wishlistCount}</Badge>
                    )}
                  </Link>

                  {!user && (
                    <Button asChild className="luxury-button w-full rounded-xl h-11 xs:h-12 text-sm xs:text-base">
                      <Link href="/auth">Login</Link>
                    </Button>
                  )}

                  {user && (
                    <div className="space-y-2 xs:space-y-3">
                      <Link
                        href="/profile"
                        className="block text-sm xs:text-base font-medium hover:text-primary transition-colors py-2"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block text-sm xs:text-base font-medium hover:text-primary transition-colors py-2"
                      >
                        Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block text-sm xs:text-base font-medium hover:text-primary transition-colors py-2"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Button
                        onClick={logout}
                        variant="outline"
                        className="w-full rounded-xl h-10 xs:h-11 text-sm xs:text-base mt-2 bg-transparent"
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
