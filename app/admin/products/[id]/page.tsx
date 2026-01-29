"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import { EnhancedProductForm } from "@/components/admin/enhanced-product-form"

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
  features: string[]
  specifications: Record<string, string>
  meta_title: string
  meta_description: string
  created_at: string
  updated_at: string
}

interface Category {
  id: string
  name: string
  slug: string
  is_active: boolean
  description?: string
  image_url?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
      if (response.ok) {
        const data = await response.json()
        const rawProduct = data.product || data
        setProduct({
          ...rawProduct,
          images: Array.isArray(rawProduct.images) ? rawProduct.images : [],
          features: Array.isArray(rawProduct.features) ? rawProduct.features : [],
          specifications:
            rawProduct.specifications && typeof rawProduct.specifications === "object" ? rawProduct.specifications : {},
        })
      } else {
        toast.error("Product not found")
        router.push("/admin/products")
      }
    } catch (error) {
      toast.error("Failed to fetch product")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        const categoriesData = Array.isArray(data) ? data : data.categories || []
        setCategories(categoriesData.filter((cat: Category) => cat.is_active))
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  const handleUpdate = async (productData: any) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        await fetchProduct()
        setIsEditing(false)
        toast.success("Product updated successfully")
      } else {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("Failed to update product:", errorData)
        const details = errorData.details ? ` (${errorData.details})` : ""
        toast.error(`Failed to update product: ${errorData.error || response.statusText}${details}`)
      }
    } catch (error) {
      toast.error("Failed to update product")
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(`/api/admin/products/${productId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          toast.success("Product deleted successfully")
          router.push("/admin/products")
        }
      } catch (error) {
        toast.error("Failed to delete product")
      }
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading product...</div>
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Details
        </Button>
        <EnhancedProductForm
          product={product}
          categories={categories}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/products")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.categories?.name || "No Category"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open(`/products/${product.id}`, "_blank")}>
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2">
        <Badge className={product.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
          {product.status}
        </Badge>
        {product.is_featured && <Badge variant="secondary">Featured</Badge>}
        {!product.is_active && <Badge variant="destructive">Inactive</Badge>}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="text-2xl font-bold">{product.stock_quantity}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-base">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="w-full h-48 object-cover rounded border"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {product.features.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {Object.keys(product.specifications).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}</span>
                      <span className="text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
