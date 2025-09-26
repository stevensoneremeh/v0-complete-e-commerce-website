"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

interface RealtimeContextType {
  refreshProducts: () => void
  refreshCategories: () => void
  refreshProperties: () => void
  refreshOrders: () => void
  refreshBookings: () => void
  isConnected: boolean
  lastUpdate: Date | null
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

interface RealtimeProviderProps {
  children: React.ReactNode
}

export function RealtimeProvider({ children }: RealtimeProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [refreshCallbacks, setRefreshCallbacks] = useState<{
    products: (() => void)[]
    categories: (() => void)[]
    properties: (() => void)[]
    orders: (() => void)[]
    bookings: (() => void)[]
  }>({
    products: [],
    categories: [],
    properties: [],
    orders: [],
    bookings: []
  })

  // Only create client if environment variables are properly configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  const supabase = (supabaseUrl && supabaseAnonKey && 
                   supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined') 
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null

  // Refresh functions that can be called by components
  const refreshProducts = useCallback(() => {
    refreshCallbacks.products.forEach(callback => callback())
    setLastUpdate(new Date())
    
    // Also dispatch a custom event for components not using the context
    window.dispatchEvent(new CustomEvent('products-updated'))
  }, [refreshCallbacks.products])

  const refreshCategories = useCallback(() => {
    refreshCallbacks.categories.forEach(callback => callback())
    setLastUpdate(new Date())
    
    window.dispatchEvent(new CustomEvent('categories-updated'))
  }, [refreshCallbacks.categories])

  const refreshProperties = useCallback(() => {
    refreshCallbacks.properties.forEach(callback => callback())
    setLastUpdate(new Date())
    
    window.dispatchEvent(new CustomEvent('properties-updated'))
  }, [refreshCallbacks.properties])

  const refreshOrders = useCallback(() => {
    refreshCallbacks.orders.forEach(callback => callback())
    setLastUpdate(new Date())
    
    window.dispatchEvent(new CustomEvent('orders-updated'))
  }, [refreshCallbacks.orders])

  const refreshBookings = useCallback(() => {
    refreshCallbacks.bookings.forEach(callback => callback())
    setLastUpdate(new Date())
    
    window.dispatchEvent(new CustomEvent('bookings-updated'))
  }, [refreshCallbacks.bookings])

  useEffect(() => {
    if (!supabase) {
      console.log('Supabase not configured, using fallback refresh system')
      setIsConnected(false)
      return
    }

    try {
      // Set up secure real-time subscriptions for public data only
      const productsChannel = supabase
        .channel('products-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: 'is_active=eq.true'
        }, () => {
          refreshProducts()
          // No payload logging for security
        })
        .subscribe()

      const categoriesChannel = supabase
        .channel('categories-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'categories',
          filter: 'is_active=eq.true'
        }, () => {
          refreshCategories()
          // No payload logging for security
        })
        .subscribe()

      const propertiesChannel = supabase
        .channel('properties-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'real_estate_properties',
          filter: 'is_available=eq.true'
        }, () => {
          refreshProperties()
          // No payload logging for security
        })
        .subscribe()

      // Orders and bookings are NOT subscribed to on the client for security
      // These will use polling or admin-only subscriptions

      setIsConnected(true)

      // Cleanup subscriptions
      return () => {
        supabase.removeChannel(productsChannel)
        supabase.removeChannel(categoriesChannel)
        supabase.removeChannel(propertiesChannel)
      }
    } catch (error) {
      console.error('Error setting up real-time subscriptions:', error)
      setIsConnected(false)
    }
  }, [refreshProducts, refreshCategories, refreshProperties, refreshOrders, refreshBookings])

  // Fallback polling system when Supabase real-time is not available
  useEffect(() => {
    if (!isConnected) {
      const pollInterval = setInterval(() => {
        // Check for updates via custom events or manual refresh
        const lastCheck = localStorage.getItem('last-data-check')
        const now = Date.now()
        
        if (!lastCheck || now - parseInt(lastCheck) > 30000) { // 30 seconds
          // Trigger refresh for all data types
          refreshProducts()
          refreshCategories()
          refreshProperties()
          refreshOrders()
          refreshBookings()
          
          localStorage.setItem('last-data-check', now.toString())
        }
      }, 30000) // Poll every 30 seconds

      return () => clearInterval(pollInterval)
    }
  }, [isConnected, refreshProducts, refreshCategories, refreshProperties, refreshOrders, refreshBookings])

  const value = {
    refreshProducts,
    refreshCategories,
    refreshProperties,
    refreshOrders,
    refreshBookings,
    isConnected,
    lastUpdate
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}

// Custom hook for components to register refresh callbacks
export function useDataRefresh(type: 'products' | 'categories' | 'properties' | 'orders' | 'bookings', callback: () => void) {
  const { refreshProducts, refreshCategories, refreshProperties, refreshOrders, refreshBookings } = useRealtime()

  useEffect(() => {
    // Register the callback
    const currentCallbacks = JSON.parse(localStorage.getItem(`refresh-callbacks-${type}`) || '[]')
    const callbackId = Date.now().toString()
    currentCallbacks.push(callbackId)
    localStorage.setItem(`refresh-callbacks-${type}`, JSON.stringify(currentCallbacks))

    // Listen for custom events as fallback
    const eventListener = () => callback()
    window.addEventListener(`${type}-updated`, eventListener)

    // Cleanup
    return () => {
      window.removeEventListener(`${type}-updated`, eventListener)
      const updatedCallbacks = JSON.parse(localStorage.getItem(`refresh-callbacks-${type}`) || '[]')
      const filteredCallbacks = updatedCallbacks.filter((id: string) => id !== callbackId)
      localStorage.setItem(`refresh-callbacks-${type}`, JSON.stringify(filteredCallbacks))
    }
  }, [type, callback])

  // Return the appropriate refresh function
  switch (type) {
    case 'products': return refreshProducts
    case 'categories': return refreshCategories
    case 'properties': return refreshProperties
    case 'orders': return refreshOrders
    case 'bookings': return refreshBookings
    default: return () => {}
  }
}