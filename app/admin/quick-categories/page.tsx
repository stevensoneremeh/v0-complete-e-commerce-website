'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  is_active: boolean
  product_count?: number
}

export default function QuickCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/test-admin/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : data.categories || [])
      } else {
        console.error('[v0] Failed to fetch:', res.status, res.statusText)
        toast.error('Failed to load categories')
      }
    } catch (error) {
      console.error('[v0] Fetch error:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const slug = formData.name.toLowerCase().replace(/\s+/g, '-')
      const url = editing ? `/api/admin/categories/${editing.id}` : '/api/test-admin/categories'
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug }),
      })

      if (res.ok) {
        await fetchCategories()
        setShowForm(false)
        setEditing(null)
        resetForm()
        toast.success(`Category ${editing ? 'updated' : 'created'} successfully!`)
      } else {
        const error = await res.json()
        console.error('[v0] Save error:', error)
        toast.error(error.error || 'Failed to save')
      }
    } catch (error) {
      console.error('[v0] Error saving:', error)
      toast.error('Error saving category')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchCategories()
        toast.success('Deleted')
      }
    } catch {
      toast.error('Error deleting')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', description: '', is_active: true })
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>Categories</h1>
          <p className='text-sm md:text-base text-gray-500'>Organize your products</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            resetForm()
            setShowForm(true)
          }}
          size='lg'
          className='w-full sm:w-auto'
        >
          <Plus className='w-4 h-4 mr-2' />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {loading ? (
          <div className='col-span-full text-center py-8'>Loading...</div>
        ) : categories.length === 0 ? (
          <div className='col-span-full text-center py-8 text-gray-500'>
            No categories yet. Create one!
          </div>
        ) : (
          categories.map((cat) => (
            <Card key={cat.id} className='p-4'>
              <div className='space-y-3'>
                <div>
                  <h3 className='font-semibold text-lg'>{cat.name}</h3>
                  <p className='text-xs text-gray-400'>{cat.slug}</p>
                </div>
                {cat.description && (
                  <p className='text-sm text-gray-600 line-clamp-2'>{cat.description}</p>
                )}
                <div className='text-xs text-gray-500'>
                  {cat.product_count || 0} products
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setEditing(cat)
                      setFormData({
                        name: cat.name,
                        description: cat.description || '',
                        is_active: cat.is_active,
                      })
                      setShowForm(true)
                    }}
                    className='flex-1'
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(cat.id)}
                    className='flex-1'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='E.g., Jewelry, Cars'
                className='mt-2'
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder='Optional description'
                className='mt-2 h-20'
              />
            </div>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className='w-4 h-4'
              />
              <span className='text-sm'>Active</span>
            </label>
            <div className='flex gap-2 pt-4 border-t'>
              <Button type='button' variant='outline' onClick={() => setShowForm(false)} className='flex-1'>
                Cancel
              </Button>
              <Button type='submit' className='flex-1'>
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
