'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface SimpleProductFormProps {
  product?: any
  categories: any[]
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function SimpleProductForm({ product, categories, onSubmit, onCancel }: SimpleProductFormProps) {
  const [data, setData] = useState({
    name: '',
    description: '',
    price: 0,
    category_id: '',
    stock_quantity: 0,
    status: 'active',
    is_featured: false,
    is_active: true,
    images: [] as string[],
  })

  useEffect(() => {
    if (product) {
      setData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        category_id: product.category_id || '',
        stock_quantity: product.stock_quantity || 0,
        status: product.status || 'active',
        is_featured: product.is_featured || false,
        is_active: product.is_active !== false,
        images: product.images || [],
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!data.name.trim()) {
      toast.error('Product name is required')
      return
    }
    if (!data.category_id) {
      toast.error('Category is required')
      return
    }
    if (data.price <= 0) {
      toast.error('Price must be greater than 0')
      return
    }
    
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Product Name */}
      <div>
        <Label className='font-semibold text-sm'>Product Name *</Label>
        <Input
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          placeholder='E.g., Premium Jewelry, Sports Car'
          className='mt-2'
        />
      </div>

      {/* Category */}
      <div>
        <Label className='font-semibold text-sm'>Category *</Label>
        <Select value={data.category_id} onValueChange={(val) => setData({ ...data, category_id: val })}>
          <SelectTrigger className='mt-2'>
            <SelectValue placeholder='Select a category' />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price & Stock (2 columns) */}
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <Label className='font-semibold text-sm'>Price *</Label>
          <Input
            type='number'
            step='0.01'
            value={data.price || ''}
            onChange={(e) => setData({ ...data, price: parseFloat(e.target.value) || 0 })}
            placeholder='0.00'
            className='mt-2'
          />
        </div>
        <div>
          <Label className='font-semibold text-sm'>Stock Quantity *</Label>
          <Input
            type='number'
            value={data.stock_quantity || ''}
            onChange={(e) => setData({ ...data, stock_quantity: parseInt(e.target.value) || 0 })}
            placeholder='0'
            className='mt-2'
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label className='font-semibold text-sm'>Description</Label>
        <Textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          placeholder='Describe your product...'
          className='mt-2 h-24 resize-none'
        />
      </div>

      {/* Checkboxes */}
      <div className='space-y-2'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            checked={data.is_featured}
            onChange={(e) => setData({ ...data, is_featured: e.target.checked })}
            className='w-4 h-4'
          />
          <span className='text-sm'>Featured Product</span>
        </label>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            checked={data.is_active}
            onChange={(e) => setData({ ...data, is_active: e.target.checked })}
            className='w-4 h-4'
          />
          <span className='text-sm'>Active</span>
        </label>
      </div>

      {/* Status */}
      <div>
        <Label className='font-semibold text-sm'>Status</Label>
        <Select value={data.status} onValueChange={(val) => setData({ ...data, status: val })}>
          <SelectTrigger className='mt-2'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='draft'>Draft</SelectItem>
            <SelectItem value='active'>Active</SelectItem>
            <SelectItem value='archived'>Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Buttons */}
      <div className='flex gap-2 justify-end pt-4 border-t'>
        <Button type='button' variant='outline' onClick={onCancel}>Cancel</Button>
        <Button type='submit'>{product ? 'Update' : 'Create'} Product</Button>
      </div>
    </form>
  )
}
