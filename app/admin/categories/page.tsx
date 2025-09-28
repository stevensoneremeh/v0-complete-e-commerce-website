
"use client"

import { Badge } from "@/components/ui/badge"
import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Edit, Trash, Upload, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Tag, TrendingUp, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  slug: string
  description: string
  image_url: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  productCount?: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriesRes, productsRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/products")
      ])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        let productsData = []
        
        if (productsRes.ok) {
          const productResult = await productsRes.json()
          productsData = productResult.products || productResult || []
        }

        // Update productCount for each category
        const updatedCategories = categoriesData.map((category: Category) => ({
          ...category,
          productCount: productsData.filter((product: any) => product.category_id === category.id).length,
        }))

        setCategories(updatedCategories)
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

  const handleFileUpload = async (file: File): Promise<string> => {
    if (!file) return ""
    
    setUploading(true)
    try {
      // For production, implement proper file upload to storage bucket
      // For now, we'll use a placeholder URL
      const fileName = `category-${Date.now()}-${file.name}`
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Return a placeholder URL - in production, this would be the actual uploaded file URL
      return `/uploads/categories/${fileName}`
    } catch (error) {
      console.error("Upload error:", error)
      throw new Error("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const imageFile = formData.get("imageFile") as File
    const imageUrl = formData.get("image_url") as string
    const is_active = formData.get("isActive") === "on"

    let finalImageUrl = imageUrl || currentCategory?.image_url || ""

    // Handle file upload if a new file is selected
    if (imageFile && imageFile.size > 0) {
      try {
        finalImageUrl = await handleFileUpload(imageFile)
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Using URL instead.",
          variant: "destructive",
        })
      }
    }

    const categoryData = {
      name,
      description,
      image_url: finalImageUrl || `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(name)}`,
      is_active,
      sort_order: categories.length,
    }

    try {
      const method = currentCategory ? "PUT" : "POST"
      const url = currentCategory ? `/api/categories/${currentCategory.id}` : "/api/categories"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })

      if (response.ok) {
        await loadData()
        toast({
          title: currentCategory ? "Category Updated" : "Category Added",
          description: `Category "${name}" has been ${currentCategory ? "updated" : "added"}.`,
        })
      } else {
        throw new Error("Failed to save category")
      }
    } catch (error) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      })
    }
    
    setIsAddEditModalOpen(false)
    setCurrentCategory(null)
  }

  const openAddModal = () => {
    setCurrentCategory(null)
    setIsAddEditModalOpen(true)
  }

  const openEditModal = (category: Category) => {
    setCurrentCategory(category)
    setIsAddEditModalOpen(true)
  }

  const openDeleteConfirmModal = (id: string) => {
    const category = categories.find((c) => c.id === id)
    if (category && category.productCount && category.productCount > 0) {
      toast({
        title: "Cannot Delete Category",
        description: `Category "${category.name}" has ${category.productCount} products. Please reassign or delete products first.`,
        variant: "destructive",
      })
      return
    }
    setCategoryToDelete(id)
    setIsDeleteConfirmModalOpen(true)
  }

  const handleDeleteCategory = async () => {
    if (categoryToDelete !== null) {
      try {
        const response = await fetch(`/api/categories/${categoryToDelete}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await loadData()
          toast({
            title: "Category Deleted",
            description: "The category has been successfully deleted.",
          })
        } else {
          throw new Error("Failed to delete category")
        }
      } catch (error) {
        console.error("Error deleting category:", error)
        toast({
          title: "Error",
          description: "Failed to delete category. Please try again.",
          variant: "destructive",
        })
      }
      
      setIsDeleteConfirmModalOpen(false)
      setCategoryToDelete(null)
    }
  }

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.is_active).length,
    inactive: categories.filter((c) => !c.is_active).length,
    totalProducts: categories.reduce((sum, c) => sum + (c.productCount || 0), 0),
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
                <h1 className="text-3xl font-bold">Categories Management</h1>
                <p className="text-muted-foreground">Manage your product categories with image uploads</p>
              </div>
              <Button onClick={openAddModal}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                  <Tag className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Image
                        src={category.image_url || "/placeholder.svg"}
                        alt={category.name}
                        width={60}
                        height={60}
                        className="rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{category.name}</h3>
                          <Badge variant={category.is_active ? "default" : "secondary"}>
                            {category.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                        <p className="text-sm font-medium">{category.productCount || 0} products</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteConfirmModal(category.id)}
                        disabled={(category.productCount || 0) > 0}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredCategories.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No categories found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or add new categories</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Category Modal */}
      <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentCategory ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEditCategory} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={currentCategory?.name || ""} 
                className="col-span-3" 
                required 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={currentCategory?.description || ""}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageFile" className="text-right">
                Upload Image
              </Label>
              <div className="col-span-3">
                <Input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/*,video/*"
                  className="mb-2"
                />
                <Input
                  name="image_url"
                  defaultValue={currentCategory?.image_url || ""}
                  placeholder="Or enter image URL"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Active
              </Label>
              <Checkbox
                id="isActive"
                name="isActive"
                defaultChecked={currentCategory?.is_active ?? true}
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={uploading}>
                {uploading ? "Uploading..." : currentCategory ? "Save Changes" : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to delete this category? This action cannot be undone.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
