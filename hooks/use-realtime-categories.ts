"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js"

export function useRealtimeCategories() {
  const [trigger, setTrigger] = useState(0)
  
  useEffect(() => {
    const supabase = createClient()
    let channel: RealtimeChannel | null = null

    // Subscribe to category changes
    channel = supabase
      .channel("categories-changes")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "categories",
        },
        (payload: RealtimePostgresChangesPayload<{ [key: string]: any }>) => {
          console.log("[Realtime] Category changed:", payload)
          // Trigger a re-fetch by incrementing the trigger
          setTrigger((prev: number) => prev + 1)
        }
      )
      .subscribe((status: string) => {
        console.log("[Realtime] Categories subscription status:", status)
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
