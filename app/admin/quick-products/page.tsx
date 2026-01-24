'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { SimpleProductForm } from '@/components/admin/simple-product-form'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  stock_quantity: number
  status: string
  categories?: { name: string }
}

interface Category {
  id: string
  name: string
}

export default function QuickProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pRes, cRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/categories'),
      ])

      if (pRes.ok) {
        const pData = await pRes.json()
        setProducts(pData.products || [])
      }
      if (cRes.ok) {
        const cData = await cRes.json()
        setCategories(Array.isArray(cData) ? cData : cData.categories || [])
      }
    } catch (error) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData: any) => {
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products'
      
      const res = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await fetchData()
        setShowForm(false)
        setEditingProduct(null)
        toast.success(`Product ${editingProduct ? 'updated' : 'created'} successfully!`)
      } else {
        const error = await res.json()
        toast.error(error.error || 'Failed to save')
      }
    } catch (error) {
      toast.error('Error saving product')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchData()
        toast.success('Product deleted')
      } else {
        toast.error('Failed to delete')
      }
    } catch {
      toast.error('Error deleting product')
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className='space-y-6 p-4 md:p-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>Products</h1>
          <p className='text-sm md:text-base text-gray-500'>Add and manage products</p>
        </div>
        <Button 
          onClick={() => {
            setEditingProduct(null)
            setShowForm(true)
          }}
          size='lg'
          className='w-full sm:w-auto'
        >
          <Plus className='w-4 h-4 mr-2' />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div>
        <Input
          placeholder='Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-md'
        />
      </div>

      {/* Products List */}
      <div className='space-y-2'>
        {loading ? (
          <div className='text-center py-8'>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            {products.length === 0 ? 'No products yet. Create one!' : 'No products match your search'}
          </div>
        ) : (
          filtered.map((product) => (
            <Card key={product.id} className='p-4'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold truncate'>{product.name}</h3>
                  <p className='text-sm text-gray-500'>
                    ${product.price.toFixed(2)} • Stock: {product.stock_quantity}
                  </p>
                  <p className='text-xs text-gray-400'>
                    {product.categories?.name || 'No category'} • {product.status}
                  </p>
                </div>
                <div className='flex gap-2 w-full sm:w-auto'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setEditingProduct(product)
                      setShowForm(true)
                    }}
                    className='flex-1 sm:flex-none'
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(product.id)}
                    className='flex-1 sm:flex-none'
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
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <SimpleProductForm
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
