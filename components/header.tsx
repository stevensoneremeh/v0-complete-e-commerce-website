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
      <div className="responsive-container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="h-12 w-12 rounded-xl bg-card flex items-center justify-center premium-shadow group-hover:scale-105 elegant-hover overflow-hidden border border-primary/20">
              <Image
                src="/abl-natasha-logo.png"
                alt="ABL Natasha Enterprises"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col mobile-hidden">
            <span className="font-bold text-xl text-gradient">ABL Natasha</span>
            <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">Enterprises</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center space-x-8">
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

        <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search luxury products & properties..."
              className="luxury-input pl-10 h-12 rounded-xl transition-all duration-300 border-2 focus:border-primary/30"
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
                    className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors ${
                      index === selectedSuggestionIndex ? "bg-muted/50" : ""
                    }`}
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
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="h-10 w-10 rounded-xl hover:bg-muted/50 elegant-hover"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl hover:bg-muted/50 elegant-hover mobile-hidden"
            asChild
          >
            <Link href="/wishlist">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {wishlistCount}
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
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted/50 elegant-hover">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl luxury-card">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Orders</Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="luxury-button rounded-xl px-6 font-medium mobile-hidden">
              <Link href="/auth">Login</Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden h-10 w-10 rounded-xl">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 luxury-card">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="luxury-input pl-10 h-12 rounded-xl" />
                </div>

                {/* Navigation Links */}
                <div className="space-y-4">
                  <Link href="/" className="block text-lg font-medium hover:text-primary transition-colors">
                    Home
                  </Link>
                  <Link href="/products" className="block text-lg font-medium hover:text-primary transition-colors">
                    Products
                  </Link>
                  <Link href="/properties" className="block text-lg font-medium hover:text-primary transition-colors">
                    Properties
                  </Link>
                  <Link href="/categories" className="block text-lg font-medium hover:text-primary transition-colors">
                    Categories
                  </Link>
                  <Link href="/about" className="block text-lg font-medium hover:text-primary transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="block text-lg font-medium hover:text-primary transition-colors">
                    Contact
                  </Link>
                </div>

                {/* Mobile Actions */}
                <div className="pt-6 border-t border-border space-y-4">
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 text-lg font-medium hover:text-primary transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist
                    {wishlistCount > 0 && <Badge className="bg-primary text-primary-foreground">{wishlistCount}</Badge>}
                  </Link>

                  {!user && (
                    <Button asChild className="luxury-button w-full rounded-xl">
                      <Link href="/auth">Login</Link>
                    </Button>
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
