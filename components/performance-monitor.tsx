"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== "production") return

    // Web Vitals monitoring
    const reportWebVitals = (metric: any) => {
      // Log to console in development, send to analytics in production
      console.log(metric)

      // Example: Send to analytics service
      // analytics.track('Web Vital', {
      //   name: metric.name,
      //   value: metric.value,
      //   id: metric.id,
      // })
    }

    // Core Web Vitals
    import("web-vitals").then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals)
      onFID(reportWebVitals)
      onFCP(reportWebVitals)
      onLCP(reportWebVitals)
      onTTFB(reportWebVitals)
    })

    // Performance observer for navigation timing
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            const navEntry = entry as PerformanceNavigationTiming
            console.log("Navigation timing:", {
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
              loadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
              firstByte: navEntry.responseStart - navEntry.requestStart,
            })
          }
        }
      })

      observer.observe({ entryTypes: ["navigation"] })
    }
  }, [])

  return null
}
