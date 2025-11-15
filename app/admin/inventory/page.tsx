"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit2, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface InventoryItem {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  price: number
  type: "product" | "hire" | "property"
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<"all" | "product" | "hire" | "property">("all")

  useEffect(() => {
    fetchInventory()
  }, [filterType])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/inventory?type=${filterType === "all" ? "" : filterType}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      toast.error("Failed to fetch inventory")
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage all your products, properties, and hire services</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "product", "hire", "property"] as const).map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  onClick={() => setFilterType(type)}
                  size="sm"
                >
                  {type === "all" ? "All" : type === "product" ? "Products" : type === "hire" ? "Hire" : "Properties"}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading inventory...</div>
          ) : filteredItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">SKU</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Stock</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <p className="font-medium">{item.name}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.sku}</td>
                      <td className="py-3 px-4 text-sm">{item.category}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {item.type === "product" ? "Product" : item.type === "hire" ? "Hire" : "Property"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={item.stock > 10 ? "secondary" : "destructive"}>{item.stock} units</Badge>
                      </td>
                      <td className="py-3 px-4 font-medium">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No inventory items found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
