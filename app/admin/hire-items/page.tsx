"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Car, Search, Filter, Eye } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface HireItem {
  id: string
  name: string
  description: string
  category: string
  price_per_day: number
  price_per_week: number
  price_per_month: number
  availability: boolean
  images: string[]
  created_at: string
}

export default function HireItemsPage() {
  const [hireItems, setHireItems] = useState<HireItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterAvailability, setFilterAvailability] = useState("all")

  useEffect(() => {
    fetchHireItems()
  }, [])

  const fetchHireItems = async () => {
    try {
      const response = await fetch("/api/admin/hire-services")
      if (response.ok) {
        const data = await response.json()
        setHireItems(Array.isArray(data) ? data : data.hire_items || [])
      }
    } catch (error) {
      toast.error("Failed to fetch hire items")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (hireItemId: string) => {
    if (confirm("Are you sure you want to delete this hire item?")) {
      try {
        const response = await fetch(`/api/admin/hire-services/${hireItemId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchHireItems()
          toast.success("Hire item deleted successfully")
        }
      } catch (error) {
        toast.error("Failed to delete hire item")
      }
    }
  }

  const filteredItems = hireItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    const matchesAvailability =
      filterAvailability === "all" || (filterAvailability === "available" ? item.availability : !item.availability)
    return matchesSearch && matchesCategory && matchesAvailability
  })

  const categories = [...new Set(hireItems.map((item) => item.category))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hire Items Management</h1>
          <p className="text-muted-foreground">Manage cars, boats, and other hire services</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Hire Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hire items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterAvailability} onValueChange={setFilterAvailability}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Hire Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Hire Items ({filteredItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading hire items...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Car className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{item.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>${item.price_per_day}/day</div>
                        <div className="text-muted-foreground">${item.price_per_week}/week</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.availability ? "default" : "destructive"}>
                        {item.availability ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/hire-items/${item.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/hire-items/${item.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
