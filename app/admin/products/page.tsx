"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trash } from "lucide-react"
import Image from "next/image"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Package, TrendingUp, AlertTriangle, PlusCircle, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { EnhancedProductForm } from "@/components/admin/enhanced-product-form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description?: string
  price: number
  compare_at_price?: number
  category_id: string
  sku: string
  stock_quantity: number
  low_stock_threshold: number
  weight?: number
  dimensions?: string
  images: string[]
  features: string[]
  specifications: Record<string, any>
  is_featured: boolean
  is_active: boolean
  status: string
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ])

      if (productsRes.ok && categoriesRes.ok) {
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData.products || productsData || [])
        setCategories(categoriesData || [])
      } else {
        console.error("API error:", productsRes.status, categoriesRes.status)
        toast({
          title: "Error",
          description: "Failed to load data from server.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category_id === categoryFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "in-stock" && product.stock_quantity > 0) ||
      (statusFilter === "out-of-stock" && product.stock_quantity === 0)

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleSaveProduct = async (productData: any) => {
    try {
      const method = currentProduct ? "PUT" : "POST"
      const url = currentProduct ? `/api/admin/products/${currentProduct.id}` : "/api/admin/products"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        await loadData()
        toast({
          title: currentProduct ? "Product Updated" : "Product Added",
          description: `Product "${productData.name}" has been ${currentProduct ? "updated" : "added"}.`,
        })
        setIsAddEditModalOpen(false)
        setCurrentProduct(null)
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to save product")
      }
    } catch (error: any) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: `Failed to save product: ${error.message}`,
        variant: "destructive",
      })
    }
  }

  const openAddModal = () => {
    setCurrentProduct(null)
    setIsAddEditModalOpen(true)
  }

  const openEditModal = (product: Product) => {
    setCurrentProduct(product)
    setIsAddEditModalOpen(true)
  }

  const openDeleteConfirmModal = (id: string) => {
    setProductToDelete(id)
    setIsDeleteConfirmModalOpen(true)
  }

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        const response = await fetch(`/api/admin/products/${productToDelete}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await loadData()
          toast({
            title: "Product Deleted",
            description: "The product has been successfully deleted.",
          })
        } else {
          throw new Error("Failed to delete product")
        }
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleteConfirmModalOpen(false)
        setProductToDelete(null)
      }
    }
  }

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.stock_quantity > 0).length,
    outOfStock: products.filter((p) => p.stock_quantity === 0).length,
    lowStock: products.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold).length,
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground">Loading products...</p>
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
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Products</h1>
                <p className="text-muted-foreground">Manage your store products</p>
              </div>
              <Button onClick={openAddModal}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.inStock}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Categories" />
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
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Products ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredProducts.map((product) => {
                    const category = categories.find((c) => c.id === product.category_id)
                    return (
                      <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{product.name}</h3>
                            {product.is_featured && <Badge variant="secondary">Featured</Badge>}
                            <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                              {product.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                            </Badge>
                            {product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold && (
                              <Badge variant="outline" className="text-orange-600">
                                Low Stock
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {product.sku} • {category?.name || "Unknown Category"}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-bold">${product.price.toFixed(2)}</span>
                            {product.compare_at_price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.compare_at_price.toFixed(2)}
                              </span>
                            )}
                            <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
                          </div>
                          {product.features && product.features.length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Features: {product.features.join(", ")}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openEditModal(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openDeleteConfirmModal(product.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No products found</h3>
                      <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <EnhancedProductForm
            product={currentProduct}
            categories={categories}
            onSubmit={handleSaveProduct}
            onCancel={() => {
              setIsAddEditModalOpen(false)
              setCurrentProduct(null)
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to delete this product? This action cannot be undone.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
