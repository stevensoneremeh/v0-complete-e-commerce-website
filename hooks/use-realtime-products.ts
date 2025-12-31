"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export function useRealtimeProducts() {
  const [trigger, setTrigger] = useState(0)
  
  useEffect(() => {
    const supabase = createClient()
    let channel: RealtimeChannel | null = null

    // Subscribe to product changes
    channel = supabase
      .channel("products-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "products",
        },
        (payload) => {
          console.log("[Realtime] Product changed:", payload)
          // Trigger a re-fetch by incrementing the trigger
          setTrigger((prev) => prev + 1)
        }
      )
      .subscribe((status) => {
        console.log("[Realtime] Products subscription status:", status)
      })

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  return trigger
}
