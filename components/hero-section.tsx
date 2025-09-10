"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Shield, Clock, Building2, Play, Pause } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export function HeroSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleLoadedData = () => {
        console.log("[v0] Video loaded successfully")
        setIsVideoLoaded(true)
        setHasError(false)

        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("[v0] Autoplay started successfully")
              setIsPlaying(true)
            })
            .catch((error) => {
              console.log("[v0] Autoplay prevented by browser:", error.name)
              setIsPlaying(false)
            })
        }
      }

      const handlePlay = () => {
        console.log("[v0] Video started playing")
        setIsPlaying(true)
      }

      const handlePause = () => {
        console.log("[v0] Video paused")
        setIsPlaying(false)
      }

      const handleEnded = () => {
        console.log("[v0] Video ended")
        setIsPlaying(false)
      }

      const handleError = (e: Event) => {
        console.error("[v0] Video error:", e)
        setHasError(true)
        setIsVideoLoaded(false)
        setIsPlaying(false)
      }

      const handleCanPlay = () => {
        console.log("[v0] Video can start playing")
        setIsVideoLoaded(true)
      }

      video.addEventListener("loadeddata", handleLoadedData)
      video.addEventListener("canplay", handleCanPlay)
      video.addEventListener("play", handlePlay)
      video.addEventListener("pause", handlePause)
      video.addEventListener("ended", handleEnded)
      video.addEventListener("error", handleError)

      video.load()

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData)
        video.removeEventListener("canplay", handleCanPlay)
        video.removeEventListener("play", handlePlay)
        video.removeEventListener("pause", handlePause)
        video.removeEventListener("ended", handleEnded)
        video.removeEventListener("error", handleError)
      }
    }
  }, [])

  const toggleVideo = () => {
    if (videoRef.current && isVideoLoaded && !hasError) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("[v0] Play failed:", error)
            setHasError(true)
          })
        }
      }
    }
  }

  return (
    <section className="relative overflow-hidden h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          poster="/luxury-living-room.jpeg"
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-d87osryg91ycSMO0JRVMoOSmYnhH4e.mp4" type="video/mp4" />
          <source src="/luxury-apartment-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      <button
        onClick={toggleVideo}
        disabled={!isVideoLoaded || hasError}
        className="absolute top-6 right-6 z-20 bg-black/30 backdrop-blur-sm hover:bg-black/50 rounded-full p-3 transition-all duration-300 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {hasError ? (
          <div className="h-5 w-5 text-red-400">⚠</div>
        ) : !isVideoLoaded ? (
          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5 text-white" />
        ) : (
          <Play className="h-5 w-5 text-white fill-white" />
        )}
      </button>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full px-4 py-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">ABL Natasha Enterprises 2024</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance text-white">
                Premium
                <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                  Lifestyle
                </span>
                <span className="block text-white">& Luxury Living</span>
              </h1>
              <p className="text-lg text-white/90 max-w-lg leading-relaxed text-pretty">
                Discover exceptional luxury apartments, premium products, and unmatched elegance. ABL Natasha
                Enterprises - Where luxury meets lifestyle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-8 py-4 rounded-xl hover:scale-105 transition-transform duration-300 shadow-2xl"
              >
                <Link href="/properties">Explore Luxury Stays</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 bg-white/5 backdrop-blur-sm text-white"
              >
                <Link href="/products">Shop Premium</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-white">Luxury Apartments</span>
                <span className="text-xs text-white/70">Premium locations</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <span className="text-sm font-medium text-white">24/7 Concierge</span>
                <span className="text-xs text-white/70">Premium service</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Shield className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-white">Secure Booking</span>
                <span className="text-xs text-white/70">Protected payments</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-orange-400" />
                </div>
                <span className="text-sm font-medium text-white">Premium Quality</span>
                <span className="text-xs text-white/70">Curated excellence</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-3xl blur-3xl scale-110"></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="relative group cursor-pointer" onClick={toggleVideo}>
                <Image
                  src="/luxury-living-room.jpeg"
                  alt="Luxury Living Room - ABL Natasha Enterprises"
                  width={500}
                  height={300}
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/20 rounded-2xl group-hover:bg-black/10 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300 border border-white/30">
                    {hasError ? (
                      <div className="h-6 w-6 text-red-400 flex items-center justify-center">⚠</div>
                    ) : !isVideoLoaded ? (
                      <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-6 w-6 text-white" />
                    ) : (
                      <Play className="h-6 w-6 text-white fill-white" />
                    )}
                  </div>
                </div>
                {!isPlaying && isVideoLoaded && !hasError && (
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to play video
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Experience ABL Natasha</h3>
                <p className="text-white/80 text-sm">
                  {hasError ? "Video unavailable" : "Premium lifestyle and luxury living redefined"}
                </p>
              </div>

              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-full p-2 shadow-2xl">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
