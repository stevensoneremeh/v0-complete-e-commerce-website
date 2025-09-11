"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Shield, Clock, Building2, Play, Pause, ArrowRight } from "lucide-react"
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
        setIsVideoLoaded(true)
        setHasError(false)

        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
            })
            .catch(() => {
              setIsPlaying(false)
            })
        }
      }

      const handlePlay = () => {
        setIsPlaying(true)
      }

      const handlePause = () => {
        setIsPlaying(false)
      }

      const handleEnded = () => {
        setIsPlaying(false)
      }

      const handleError = () => {
        setHasError(true)
        setIsVideoLoaded(false)
        setIsPlaying(false)
      }

      const handleCanPlay = () => {
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
          playPromise.catch(() => {
            setHasError(true)
          })
        }
      }
    }
  }

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center luxury-gradient-subtle">
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
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-d87osryg91ycSMO0JRVMoOSmYnhH4e.mp4"
            type="video/mp4"
          />
          <source src="/luxury-apartment-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-background/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20"></div>
      </div>

      <button
        onClick={toggleVideo}
        disabled={!isVideoLoaded || hasError}
        className="absolute top-6 right-6 z-20 glass-effect hover:bg-white/20 rounded-full p-3 elegant-hover disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {hasError ? (
          <div className="h-5 w-5 text-destructive">⚠</div>
        ) : !isVideoLoaded ? (
          <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5 text-foreground" />
        ) : (
          <Play className="h-5 w-5 text-foreground fill-current" />
        )}
      </button>

      <div className="responsive-container section-padding relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          <div className="space-y-8 fade-in">
            <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 slide-up">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">ABL Natasha Enterprises 2024</span>
            </div>

            <div className="space-y-6">
              <h1 className="display-1 text-balance slide-up">
                Premium
                <span className="block text-gradient">Lifestyle</span>
                <span className="block">& Luxury Living</span>
              </h1>
              <p className="body-large text-muted-foreground max-w-2xl text-pretty slide-up">
                Discover exceptional luxury apartments, premium products, and unmatched elegance. ABL Natasha
                Enterprises - Where luxury meets lifestyle.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 slide-up">
              <Button size="lg" asChild className="luxury-button h-14 px-8 rounded-xl text-base font-semibold group">
                <Link href="/properties" className="flex items-center gap-2">
                  Explore Luxury Stays
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-14 px-8 rounded-xl text-base font-semibold border-2 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 bg-transparent"
              >
                <Link href="/products">Shop Premium</Link>
              </Button>
            </div>

            <div className="responsive-grid pt-8 slide-up">
              <div className="flex flex-col items-center text-center space-y-3 feature-highlight p-4 rounded-xl">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center elegant-hover">
                  <Building2 className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold block">Luxury Apartments</span>
                  <span className="text-xs text-muted-foreground">Premium locations</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 feature-highlight p-4 rounded-xl">
                <div className="h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center elegant-hover">
                  <Clock className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <span className="text-sm font-semibold block">24/7 Concierge</span>
                  <span className="text-xs text-muted-foreground">Premium service</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 feature-highlight p-4 rounded-xl">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center elegant-hover">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold block">Secure Booking</span>
                  <span className="text-xs text-muted-foreground">Protected payments</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center space-y-3 feature-highlight p-4 rounded-xl">
                <div className="h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center elegant-hover">
                  <Sparkles className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <span className="text-sm font-semibold block">Premium Quality</span>
                  <span className="text-xs text-muted-foreground">Curated excellence</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative scale-in">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl scale-110"></div>
            <div className="relative luxury-card p-8 rounded-3xl premium-shadow">
              <div className="relative group cursor-pointer" onClick={toggleVideo}>
                <Image
                  src="/luxury-living-room.jpeg"
                  alt="Luxury Living Room - ABL Natasha Enterprises"
                  width={600}
                  height={400}
                  className="rounded-2xl w-full h-auto object-cover elegant-hover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl group-hover:from-black/10 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="glass-effect rounded-full p-6 group-hover:scale-110 elegant-hover border border-white/30">
                    {hasError ? (
                      <div className="h-8 w-8 text-destructive flex items-center justify-center">⚠</div>
                    ) : !isVideoLoaded ? (
                      <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-8 w-8 text-foreground" />
                    ) : (
                      <Play className="h-8 w-8 text-foreground fill-current" />
                    )}
                  </div>
                </div>
                {!isPlaying && isVideoLoaded && !hasError && (
                  <div className="absolute bottom-6 left-6 right-6 text-center">
                    <div className="glass-effect rounded-lg px-4 py-2 text-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to play video
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <h3 className="heading-3 mb-3">Experience ABL Natasha</h3>
                <p className="text-muted-foreground body-small">
                  {hasError ? "Video unavailable" : "Premium lifestyle and luxury living redefined"}
                </p>
              </div>

              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full p-3 premium-shadow">
                <Building2 className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
