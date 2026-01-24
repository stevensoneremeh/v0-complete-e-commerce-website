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
import { Plus, Edit, Trash2, MapPin } from 'lucide-react'

interface Property {
  id: string
  name: string
  location: string
  bedrooms: number
  bathrooms: number
  price_per_night: number
  max_guests: number
  status: string
}

export default function QuickPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    max_guests: 2,
    price_per_night: 0,
    description: '',
    status: 'available',
    is_active: true,
  })

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/admin/properties')
      if (res.ok) {
        const data = await res.json()
        setProperties(data.properties || [])
      }
    } catch (error) {
      toast.error('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.location.trim()) {
      toast.error('Name and location required')
      return
    }

    try {
      const url = editing ? `/api/admin/properties/${editing.id}` : '/api/admin/properties'
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        await fetchProperties()
        setShowForm(false)
        setEditing(null)
        resetForm()
        toast.success(`Property ${editing ? 'updated' : 'created'}!`)
      }
    } catch (error) {
      toast.error('Error saving')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await fetchProperties()
        toast.success('Deleted')
      }
    } catch {
      toast.error('Error')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      bedrooms: 1,
      bathrooms: 1,
      max_guests: 2,
      price_per_night: 0,
      description: '',
      status: 'available',
      is_active: true,
    })
  }

  return (
    <div className='space-y-6 p-4 md:p-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>Properties</h1>
          <p className='text-sm md:text-base text-gray-500'>Manage rental properties</p>
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
          Add Property
        </Button>
      </div>

      <div className='space-y-2'>
        {loading ? (
          <div className='text-center py-8'>Loading...</div>
        ) : properties.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>No properties yet</div>
        ) : (
          properties.map((prop) => (
            <Card key={prop.id} className='p-4'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                <div className='flex-1'>
                  <h3 className='font-semibold'>{prop.name}</h3>
                  <div className='flex items-center gap-1 text-sm text-gray-500'>
                    <MapPin className='w-3 h-3' />
                    {prop.location}
                  </div>
                  <p className='text-xs text-gray-400 mt-1'>
                    {prop.bedrooms} bed • {prop.bathrooms} bath • {prop.max_guests} guests • ${prop.price_per_night}/night
                  </p>
                </div>
                <div className='flex gap-2 w-full sm:w-auto'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setEditing(prop)
                      setFormData({
                        name: prop.name,
                        location: prop.location,
                        bedrooms: prop.bedrooms,
                        bathrooms: prop.bathrooms,
                        max_guests: prop.max_guests,
                        price_per_night: prop.price_per_night,
                        description: '',
                        status: prop.status,
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
                    onClick={() => handleDelete(prop.id)}
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
        <DialogContent className='max-w-md max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit' : 'Add'} Property</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className='space-y-3'>
            <div>
              <Label className='text-sm'>Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder='Property name'
                className='mt-1 text-sm'
              />
            </div>
            <div>
              <Label className='text-sm'>Location *</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder='City, Country'
                className='mt-1 text-sm'
              />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <Label className='text-sm'>Bedrooms</Label>
                <Input
                  type='number'
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                  className='mt-1 text-sm'
                />
              </div>
              <div>
                <Label className='text-sm'>Bathrooms</Label>
                <Input
                  type='number'
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                  className='mt-1 text-sm'
                />
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <div>
                <Label className='text-sm'>Max Guests</Label>
                <Input
                  type='number'
                  value={formData.max_guests}
                  onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) })}
                  className='mt-1 text-sm'
                />
              </div>
              <div>
                <Label className='text-sm'>Price/Night *</Label>
                <Input
                  type='number'
                  step='0.01'
                  value={formData.price_per_night || ''}
                  onChange={(e) => setFormData({ ...formData, price_per_night: parseFloat(e.target.value) || 0 })}
                  className='mt-1 text-sm'
                />
              </div>
            </div>
            <div className='flex gap-2 pt-3 border-t'>
              <Button type='button' variant='outline' onClick={() => setShowForm(false)} className='flex-1 text-sm'>
                Cancel
              </Button>
              <Button type='submit' className='flex-1 text-sm'>
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
