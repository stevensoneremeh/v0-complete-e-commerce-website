
"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Shield, Clock, Building2, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const HERO_VIDEOS = [
  {
    url: "https://ebtaejra5dml5xmn.public.blob.vercel-storage.com/4a8e454f-7892-4718-964c-1af2410438b2.mov",
    poster: "/luxury-living-room.jpeg",
  },
  {
    url: "https://ebtaejra5dml5xmn.public.blob.vercel-storage.com/b51bdeca-23b8-4ac2-abf1-6778424283ba.mov",
    poster: "/luxury-living-room.jpeg",
  },
  {
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64bb5c83-2bb1-4c22-8f9f-642334f46cac-d87osryg91ycSMO0JRVMoOSmYnhH4e.mp4",
    poster: "/luxury-living-room.jpeg",
  },
]

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const currentVideo = videoRefs.current[currentIndex]
    if (currentVideo) {
      const handleEnded = () => {
        setCurrentIndex((prev) => (prev + 1) % HERO_VIDEOS.length)
      }

      currentVideo.addEventListener("ended", handleEnded)
      
      const playPromise = currentVideo.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silently handle autoplay restrictions
        })
      }

      return () => {
        currentVideo.removeEventListener("ended", handleEnded)
      }
    }
  }, [currentIndex])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + HERO_VIDEOS.length) % HERO_VIDEOS.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_VIDEOS.length)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goToNext()
    }
    if (touchStart - touchEnd < -75) {
      goToPrevious()
    }
  }

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center luxury-gradient-subtle">
      <div 
        className="absolute inset-0 z-0"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {HERO_VIDEOS.map((video, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <video
              ref={(el) => {
                videoRefs.current[index] = el
              }}
              muted
              playsInline
              preload={index === 0 ? "auto" : "metadata"}
              className="w-full h-full object-cover"
              poster={video.poster}
            >
              <source src={video.url} type="video/mp4" />
              <source src={video.url} type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/60 to-background/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20"></div>
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 glass-effect hover:bg-white/20 rounded-full p-3 elegant-hover"
        aria-label="Previous video"
      >
        <ChevronLeft className="h-6 w-6 text-foreground" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 glass-effect hover:bg-white/20 rounded-full p-3 elegant-hover"
        aria-label="Next video"
      >
        <ChevronRight className="h-6 w-6 text-foreground" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_VIDEOS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-primary w-8" : "bg-white/50"
            }`}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>

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
              <div className="relative group cursor-pointer">
                <Image
                  src="/luxury-living-room.jpeg"
                  alt="Luxury Living Room - ABL Natasha Enterprises"
                  width={600}
                  height={400}
                  className="rounded-2xl w-full h-auto object-cover elegant-hover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl group-hover:from-black/10 transition-all duration-300"></div>
              </div>

              <div className="mt-6 text-center">
                <h3 className="heading-3 mb-3">Experience ABL Natasha</h3>
                <p className="text-muted-foreground body-small">
                  Premium lifestyle and luxury living redefined
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
