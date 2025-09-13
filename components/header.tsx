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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="responsive-container flex h-16 xs:h-18 sm:h-20 items-center justify-between gap-2 xs:gap-3 sm:gap-4">
        <Link href="/" className="flex items-center space-x-2 xs:space-x-3 group flex-shrink-0">
          <div className="relative">
            <div className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 lg:h-20 lg:w-20 rounded-lg xs:rounded-xl bg-card flex items-center justify-center premium-shadow group-hover:scale-105 elegant-hover overflow-hidden border border-primary/20">
              <Image
                src="/abl-natasha-logo.png"
                alt="ABL Natasha Enterprises"
                width={64}
                height={64}
                className="object-contain w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
              />
            </div>
            <div className="absolute -top-0.5 xs:-top-1 -right-0.5 xs:-right-1 h-2 w-2 xs:h-3 xs:w-3 bg-primary rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col mobile-hidden">
            <span className="font-bold text-sm xs:text-base sm:text-lg md:text-xl text-gradient">ABL Natasha</span>
            <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-muted-foreground font-medium tracking-wider uppercase">
              Enterprises
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Products
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/properties" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Properties
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/hire" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Hire
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Categories
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors relative group">
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-4 lg:mx-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 lg:left-3 top-2.5 lg:top-3 h-3.5 w-3.5 lg:h-4 lg:w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search luxury products..."
              className="luxury-input pl-8 lg:pl-10 h-10 lg:h-12 rounded-lg lg:rounded-xl transition-all duration-300 border-2 focus:border-primary/30 text-sm lg:text-base"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => searchQuery.length > 0 && setShowSuggestions(filteredSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 luxury-card mt-2 overflow-hidden z-50">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    className={`w-full text-left px-3 lg:px-4 py-2 lg:py-3 hover:bg-muted/50 transition-colors ${
                      index === selectedSuggestionIndex ? "bg-muted/50" : ""
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center space-x-2 lg:space-x-3">
                      <Search className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-muted-foreground" />
                      <span className="text-xs lg:text-sm">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 xs:space-x-1.5 sm:space-x-2">
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
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="luxury-input pl-10 h-11 xs:h-12 rounded-xl text-sm"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                  />
                </div>

                {/* Navigation Links */}
                <div className="space-y-3 xs:space-y-4">
                  <Link
                    href="/"
                    className="block text-base xs:text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="block text-base xs:text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    Products
                  </Link>
                  <Link
                    href="/properties"
                    className="block text-base xs:text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    Properties
                  </Link>
                  <Link
                    href="/hire"
                    className="block text-base xs:text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    Hire
                  </Link>
                  <Link
                    href="/categories"
                    className="block text-base xs:text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/about"
                    className="block text-base xs:text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-base xs:text-lg font-medium hover:text-primary transition-colors py-2"
                  >
                    Contact
                  </Link>
                </div>

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
