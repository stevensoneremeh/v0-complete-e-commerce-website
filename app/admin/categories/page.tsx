"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Tag, Upload as UploadIcon } from "lucide-react"
import { toast } from "sonner"
import { FileUpload } from "@/components/admin/file-upload"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  is_active: boolean
  display_order: number
  product_count?: number
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    is_active: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories")
      if (response.ok) {
        const data = await response.json()
        const categoriesData = Array.isArray(data) ? data : data.categories || []
        setCategories(categoriesData)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error(`Failed to fetch categories: ${response.status}`, errorData)
        toast.error(`Failed to fetch categories: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error("Network error fetching categories:", error)
      toast.error("Network error: Failed to fetch categories. Please check your connection.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast.error("Category name is required")
      return
    }

    setSubmitting(true)
    try {
      const slug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
      const categoryData = { ...formData, slug }

      const response = await fetch(
        editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories",
        {
          method: editingCategory ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryData),
        },
      )

      if (response.ok) {
        await fetchCategories()
        setShowAddDialog(false)
        setEditingCategory(null)
        setFormData({ name: "", description: "", image_url: "", is_active: true })
        toast.success(`Category ${editingCategory ? "updated" : "created"} successfully`)
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Failed to save category:', errorData)
        toast.error(`Failed to save category: ${errorData.error || response.statusText}`)
      }
    } catch (error) {
      console.error('Network error saving category:', error)
      toast.error("Network error: Failed to save category. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: category.is_active,
    })
    setEditingCategory(category)
    setShowAddDialog(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchCategories()
          toast.success("Category deleted successfully")
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          console.error('Failed to delete category:', errorData)
          toast.error(`Failed to delete category: ${errorData.error || response.statusText}`)
        }
      } catch (error) {
        console.error('Network error deleting category:', error)
        toast.error("Network error: Failed to delete category. Please check your connection and try again.")
      }
    }
  }

  const toggleStatus = async (categoryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      })

      if (response.ok) {
        await fetchCategories()
        toast.success("Category status updated")
      }
    } catch (error) {
      toast.error("Failed to update category status")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Organize your products into categories</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          setShowAddDialog(open)
          if (!open) {
            // Reset form when dialog is closed
            setEditingCategory(null)
            setFormData({ name: "", description: "", image_url: "", is_active: true })
            setSubmitting(false)
          }
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null)
                setFormData({ name: "", description: "", image_url: "", is_active: true })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <div className="space-y-3">
                <Label>Category Image</Label>
                <FileUpload
                  multiple={false}
                  maxFiles={1}
                  initialFiles={formData.image_url ? [formData.image_url] : []}
                  onUpload={(url) => {
                    setFormData((prev) => ({ ...prev, image_url: url }))
                  }}
                  onDelete={() => {
                    setFormData((prev) => ({ ...prev, image_url: "" }))
                  }}
                />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or enter URL</span>
                  </div>
                </div>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="Or paste image URL"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Category preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t sticky bottom-0 bg-background">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || !formData.name.trim()}>
                  {submitting ? "Saving..." : editingCategory ? "Update" : "Create"} {submitting ? "" : "Category"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading categories...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      {category.image_url ? (
                        <img
                          src={category.image_url || "/placeholder.svg"}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground">{category.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{category.description || "No description"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{category.product_count || 0} products</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={category.is_active}
                          onCheckedChange={() => toggleStatus(category.id, category.is_active)}
                        />
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(category.id)}>
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
