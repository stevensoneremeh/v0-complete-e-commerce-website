"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/admin/file-upload"

interface ProductFormProps {
  product?: any
  categories: any[]
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function EnhancedProductForm({ product, categories, onSubmit, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || "",
    stock_quantity: product?.stock_quantity || 0,
    status: product?.status || "active",
    is_featured: product?.is_featured || false,
    is_active: product?.is_active || true,
    images: product?.images || [],
  })

  const [newImageUrl, setNewImageUrl] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.description || !formData.price || !formData.category_id) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, Description, Price, Category)",
        variant: "destructive",
      })
      return
    }

    onSubmit({
      ...formData,
      price: Number.parseFloat(formData.price),
      stock_quantity: Number.parseInt(formData.stock_quantity),
    })
  }

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }))
      setNewImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
          <TabsTrigger value="media">Images</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="stock_quantity">Stock Quantity</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="is_featured">Featured Product</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Upload Images</Label>
                  <FileUpload
                    multiple={true}
                    maxFiles={10}
                    initialFiles={formData.images}
                    onUpload={(url) => {
                      setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, url],
                      }))
                    }}
                    onDelete={(url) => {
                      setFormData((prev) => ({
                        ...prev,
                        images: prev.images.filter((img: string) => img !== url),
                      }))
                    }}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or enter image URL</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input placeholder="Paste image URL" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} />
                  <Button type="button" onClick={addImage}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div>
                  <Label className="mb-2 block">Current Images ({formData.images.length})</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {formData.images.map((image: string, index: number) => (
                      <div key={index} className="relative group">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4 border-t sticky bottom-0 bg-background">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{product ? "Update Product" : "Create Product"}</Button>
      </div>
    </form>
  )
}
