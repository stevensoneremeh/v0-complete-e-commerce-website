'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Plus, Edit, Trash2, Car, Ship } from 'lucide-react'

interface HireService {
  id: string
  name: string
  category: string
  price_per_day: number
  is_available: boolean
  rating?: number
}

export default function QuickHirePage() {
  const [services, setServices] = useState<HireService[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<HireService | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'car',
    description: '',
    price_per_day: 0,
    is_available: true,
    is_active: true,
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/admin/hire-services')
      if (res.ok) {
        const data = await res.json()
        setServices(data.services || [])
      }
    } catch (error) {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Service name is required')
      return
    }

    try {
      const url = editing ? `/api/admin/hire-services/${editing.id}` : '/api/admin/hire-services'
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await fetchServices()
        setShowForm(false)
        setEditing(null)
        resetForm()
        toast.success(`Service ${editing ? 'updated' : 'created'}!`)
      }
    } catch (error) {
      toast.error('Error saving')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    try {
      const res = await fetch(`/api/admin/hire-services/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchServices()
        toast.success('Deleted')
      }
    } catch {
      toast.error('Error')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'car',
      description: '',
      price_per_day: 0,
      is_available: true,
      is_active: true,
    })
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>Hire Services</h1>
          <p className='text-sm md:text-base text-gray-500'>Manage car & boat rentals</p>
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
          Add Service
        </Button>
      </div>

      <div className='space-y-2'>
        {loading ? (
          <div className='text-center py-8'>Loading...</div>
        ) : services.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>No services yet</div>
        ) : (
          services.map((svc) => (
            <Card key={svc.id} className='p-4'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    {svc.category === 'car' ? <Car className='w-4 h-4' /> : <Ship className='w-4 h-4' />}
                    <h3 className='font-semibold'>{svc.name}</h3>
                  </div>
                  <p className='text-sm text-gray-500'>${svc.price_per_day}/day • {svc.category}</p>
                </div>
                <div className='flex gap-2 w-full sm:w-auto'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setEditing(svc)
                      setFormData({
                        name: svc.name,
                        category: svc.category,
                        description: '',
                        price_per_day: svc.price_per_day,
                        is_available: svc.is_available,
                        is_active: true,
                      })
                      setShowForm(true)
                    }}
                    className='flex-1 sm:flex-none'
                  >
                    <Edit className='w-4 h-4' />
                  </Button>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => handleDelete(svc.id)}
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

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className='max-w-md'>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='E.g., Luxury Car, Yacht'
                className='mt-2'
              />
            </div>
            <div>
              <Label>Type *</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                <SelectTrigger className='mt-2'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='car'>Car</SelectItem>
                  <SelectItem value='boat'>Boat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price Per Day *</Label>
              <Input
                type='number'
                step='0.01'
                value={formData.price_per_day || ''}
                onChange={(e) => setFormData({ ...formData, price_per_day: parseFloat(e.target.value) || 0 })}
                className='mt-2'
              />
            </div>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className='w-4 h-4'
              />
              <span className='text-sm'>Available</span>
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
