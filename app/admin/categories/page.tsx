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
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import { toast } from "sonner"

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
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    is_active: true,
    display_order: 0,
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
        toast.error(`Failed to fetch categories: ${response.status}`)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
        setFormData({ name: "", description: "", image_url: "", is_active: true, display_order: 0 })
        toast.success(`Category ${editingCategory ? "updated" : "created"} successfully`)
      }
    } catch (error) {
      toast.error("Failed to save category")
    }
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: category.is_active,
      display_order: category.display_order,
    })
    setEditingCategory(category)
    setShowAddDialog(true)
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/admin/categories/${categoryId}`, {
          method: "DELETE",
        })

        if (response.ok) {
          await fetchCategories()
          toast.success("Category deleted successfully")
        }
      } catch (error) {
        toast.error("Failed to delete category")
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
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingCategory(null)
                setFormData({ name: "", description: "", image_url: "", is_active: true, display_order: 0 })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
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
              <div>
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: Number.parseInt(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingCategory ? "Update" : "Create"} Category</Button>
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
                  <TableHead>Display Order</TableHead>
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
                    <TableCell>{category.display_order}</TableCell>
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
