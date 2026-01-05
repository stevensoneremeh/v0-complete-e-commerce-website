"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedProductForm } from "@/components/admin/enhanced-product-form"
import { Plus, Edit, Trash2, Package, Search, Filter, Eye } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category_id: string
  categories?: { name: string; slug: string }
  stock_quantity: number
  status: string
  is_featured: boolean
  is_active: boolean
  images: string[]
  created_at: string
}

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  description?: string
  image_url?: string
  sort_order?: number
  created_at?: string
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products")
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Failed to fetch products:", errorData)
        toast.error(`Failed to fetch products: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error("Network error fetching products:", error)
      toast.error("Network error: Failed to fetch products. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        // Handle both array and object responses
        const categoriesData = Array.isArray(data) ? data : data.categories || []
        // Filter to only active categories for product assignment
        setCategories(categoriesData.filter((cat: Category) => cat.is_active))
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error(`Failed to fetch categories: ${response.status}`, errorData)
        toast.error(`Failed to fetch categories: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error("Network error fetching categories:", error)
      toast.error("Network error: Failed to fetch categories. Please check your connection.")
    }
  }

  const handleSubmit = async (productData: any) => {
    try {
      const response = await fetch(
        editingProduct ? `/api/admin/products/${editingProduct.id}` : "/api/admin/products",
        {
          method: editingProduct ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        },
      )

      if (response.ok) {
        await fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
        toast.success(`Product ${editingProduct ? "updated" : "created"} successfully`)
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Failed to save product:", errorData)
        toast.error(`Failed to save product: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error("Network error saving product:", error)
      toast.error("Network error: Failed to save product. Please check your connection and try again.")
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchProducts()
          toast.success("Product deleted successfully")
        } else {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          console.error("Failed to delete product:", errorData)
          toast.error(`Failed to delete product: ${errorData.error || response.statusText}`)
        }
      } catch (error) {
        console.error("Network error deleting product:", error)
        toast.error("Network error: Failed to delete product. Please check your connection and try again.")
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || product.category_id === filterCategory
    const matchesStatus = filterStatus === "all" || product.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
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
                  placeholder="Search products..."
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
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Package className="h-5 w-5" />
            Products ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] sm:w-auto">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="hidden sm:table-cell">Stock</TableHead>
                    <TableHead className="hidden lg:table-cell">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded shadow-sm"
                          />
                        ) : (
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-muted rounded flex items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[100px] xs:max-w-[150px] sm:max-w-xs">
                          <div className="font-medium text-xs sm:text-sm truncate">{product.name}</div>
                          <div className="text-[10px] sm:text-xs text-muted-foreground truncate hidden xs:block">
                            {product.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-[10px] sm:text-xs">
                          {product.categories?.name || "No Category"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm font-semibold text-primary">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant={product.stock_quantity > 0 ? "default" : "destructive"}
                          className="text-[10px] sm:text-xs"
                        >
                          {product.stock_quantity}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-col gap-1">
                          <Badge className={cn("text-[10px]", getStatusColor(product.status))}>{product.status}</Badge>
                          {product.is_featured && (
                            <Badge variant="secondary" className="text-[10px] w-fit">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <Link href={`/admin/products/${product.id}`} className="hidden xs:block">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <EnhancedProductForm
            product={editingProduct}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
