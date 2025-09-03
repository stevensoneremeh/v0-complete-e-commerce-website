"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Calendar, Users } from "lucide-react"

interface PropertySearchProps {
  onSearch: (query: string) => void
}

export function PropertySearch({ onSearch }: PropertySearchProps) {
  const [location, setLocation] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState("")

  const handleSearch = () => {
    const searchQuery = `${location} ${checkIn} ${checkOut} ${guests}`.trim()
    onSearch(searchQuery)
  }

  return (
    <Card className="premium-shadow border-0">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-12 border-0 bg-muted/50"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Check in"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="pl-10 h-12 border-0 bg-muted/50"
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Check out"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="pl-10 h-12 border-0 bg-muted/50"
            />
          </div>

          <div className="relative">
            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="pl-10 h-12 border-0 bg-muted/50"
              min="1"
            />
          </div>

          <Button
            onClick={handleSearch}
            className="h-12 luxury-gradient text-white font-medium hover:scale-105 transition-transform"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
