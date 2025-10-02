"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Plus, Search, Edit, Trash2, Car, Ship, TrendingUp, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface HireItem {
  id: string
  name: string
  slug: string
  description: string
  service_type: "car" | "boat"
  price: number
  duration: string
  capacity: string
  features: string[]
  images: string[]
  rating: number
  review_count: number
  is_active: boolean
  sort_order: number
  specifications: Record<string, any>
  created_at: string
  updated_at: string
}

export default function AdminHireItemsPage() {
  const [items, setItems] = useState<HireItem[]>([])
  const [filteredItems, setFilteredItems] = useState<HireItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<HireItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    let filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (typeFilter !== "all") {
      filtered = filtered.filter((item) => item.service_type === typeFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) =>
        statusFilter === "active" ? item.is_active : !item.is_active
      )
    }

    setFilteredItems(filtered)
  }, [items, searchTerm, typeFilter, statusFilter])

  const fetchItems = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/admin/hire-items")
      if (response.ok) {
        const data = await response.json()
        setItems(data || [])
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch hire items",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading hire items:", error)
      toast({
        title: "Error",
        description: "Failed to load hire items",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const itemData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      service_type: formData.get("service_type") as string,
      price: Number.parseFloat(formData.get("price") as string),
      duration: formData.get("duration") as string,
      capacity: formData.get("capacity") as string,
      features: (formData.get("features") as string)
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean),
      images: (formData.get("images") as string)
        .split(",")
        .map((img) => img.trim())
        .filter(Boolean),
      rating: Number.parseFloat(formData.get("rating") as string) || 0,
      review_count: Number.parseInt(formData.get("review_count") as string) || 0,
      is_active: formData.get("is_active") === "true",
      sort_order: Number.parseInt(formData.get("sort_order") as string) || 0,
      specifications: {},
    }

    try {
      const method = editingItem ? "PUT" : "POST"
      const url = editingItem
        ? `/api/admin/hire-items/${editingItem.id}`
        : "/api/admin/hire-items"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      })

      if (response.ok) {
        await fetchItems()
        toast({
          title: editingItem ? "Item Updated" : "Item Created",
          description: `Hire item "${itemData.name}" has been ${editingItem ? "updated" : "created"}.`,
        })
        setShowForm(false)
        setEditingItem(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to save item")
      }
    } catch (error: any) {
      console.error("Error saving hire item:", error)
      toast({
        title: "Error",
        description: `Failed to save hire item: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return

    try {
      const response = await fetch(`/api/admin/hire-items/${itemToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchItems()
        toast({
          title: "Item Deleted",
          description: "Hire item has been successfully deleted.",
        })
      } else {
        throw new Error("Failed to delete item")
      }
    } catch (error) {
      console.error("Error deleting hire item:", error)
      toast({
        title: "Error",
        description: "Failed to delete hire item",
        variant: "destructive",
      })
    } finally {
      setIsDeleteConfirmOpen(false)
      setItemToDelete(null)
    }
  }

  const openEditModal = (item: HireItem) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const openDeleteConfirm = (id: string) => {
    setItemToDelete(id)
    setIsDeleteConfirmOpen(true)
  }

  const stats = {
    total: items.length,
    cars: items.filter((i) => i.service_type === "car").length,
    boats: items.filter((i) => i.service_type === "boat").length,
    active: items.filter((i) => i.is_active).length,
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading hire items...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Hire Items Management</h1>
                <p className="text-muted-foreground">Manage car hire and boat cruise services</p>
              </div>
              <Button onClick={() => { setEditingItem(null); setShowForm(true); }}>
                <Plus className="mr-2 h-4 w-4" /> Add Hire Item
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Car Hire</CardTitle>
                  <Car className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.cars}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Boat Cruises</CardTitle>
                  <Ship className="h-4 w-4 text-cyan-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-cyan-600">{stats.boats}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search hire items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="car">Car Hire</SelectItem>
                      <SelectItem value="boat">Boat Cruises</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hire Items ({filteredItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Image
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          {item.service_type === "car" ? (
                            <Badge variant="outline" className="bg-blue-50">
                              <Car className="h-3 w-3 mr-1" /> Car
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-cyan-50">
                              <Ship className="h-3 w-3 mr-1" /> Boat
                            </Badge>
                          )}
                          <Badge variant={item.is_active ? "default" : "secondary"}>
                            {item.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          {item.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="font-bold text-primary">${item.price}</span>
                          <span className="text-muted-foreground">/ {item.duration}</span>
                          <span className="text-muted-foreground">{item.capacity}</span>
                          <span className="text-muted-foreground">
                            ⭐ {item.rating} ({item.review_count} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteConfirm(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {filteredItems.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No hire items found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search or filters, or add a new item
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Hire Item" : "Add Hire Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveItem} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingItem?.name || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service_type" className="text-right">Type</Label>
              <Select name="service_type" defaultValue={editingItem?.service_type || "car"} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car Hire</SelectItem>
                  <SelectItem value="boat">Boat Cruise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingItem?.description || ""}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={editingItem?.price || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration</Label>
              <Input
                id="duration"
                name="duration"
                defaultValue={editingItem?.duration || "per day"}
                className="col-span-3"
                placeholder="per day, 3 hours, etc."
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                defaultValue={editingItem?.capacity || ""}
                className="col-span-3"
                placeholder="4 passengers"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="features" className="text-right">Features</Label>
              <Input
                id="features"
                name="features"
                defaultValue={editingItem?.features.join(", ") || ""}
                className="col-span-3"
                placeholder="Comma-separated features"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">Images</Label>
              <Input
                id="images"
                name="images"
                defaultValue={editingItem?.images.join(", ") || ""}
                className="col-span-3"
                placeholder="Comma-separated URLs"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">Rating</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                defaultValue={editingItem?.rating || "0"}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="review_count" className="text-right">Reviews</Label>
              <Input
                id="review_count"
                name="review_count"
                type="number"
                defaultValue={editingItem?.review_count || "0"}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sort_order" className="text-right">Sort Order</Label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                defaultValue={editingItem?.sort_order || "0"}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_active" className="text-right">Status</Label>
              <Select name="is_active" defaultValue={editingItem?.is_active ? "true" : "false"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingItem ? "Save Changes" : "Create Item"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this hire item? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
