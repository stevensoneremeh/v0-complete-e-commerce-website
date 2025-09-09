import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyDetailClient } from "@/components/property-detail-client"

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // First try listings_real_estate table
  let { data: property, error } = await supabase
    .from("listings_real_estate")
    .select("*")
    .eq("id", id)
    .eq("available", true)
    .single()

  // If not found, try real_estate_properties with product join
  if (error || !property) {
    const { data: propertyData, error: propertyError } = await supabase
      .from("real_estate_properties")
      .select(`
        *,
        products (
          name,
          description,
          price,
          images,
          is_active
        )
      `)
      .eq("id", id)
      .eq("is_available_for_booking", true)
      .single()

    if (propertyError || !propertyData) {
      notFound()
    }

    // Format property data from real_estate_properties
    property = {
      id: propertyData.id,
      title: propertyData.products?.name || "Luxury Property",
      description: propertyData.products?.description || "Beautiful property with modern amenities",
      price: propertyData.booking_price_per_night || Number.parseFloat(propertyData.products?.price || "0"),
      location: "Premium Location",
      address: "Luxury District",
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.square_feet,
      property_type: propertyData.property_type,
      listing_type: "rent",
      amenities: propertyData.amenities || [],
      features: [],
      images: propertyData.products?.images || ["/placeholder.svg?height=400&width=600&text=Property+Image"],
      available: propertyData.is_available_for_booking,
      featured: true,
      virtual_tour_url: propertyData.virtual_tour_url,
      booking_price_per_night: propertyData.booking_price_per_night,
      minimum_stay_nights: propertyData.minimum_stay_nights,
      is_available_for_booking: propertyData.is_available_for_booking,
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PropertyDetailClient property={property} />
      <Footer />
    </div>
  )
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: property } = await supabase
    .from("listings_real_estate")
    .select("title, meta_title, meta_description")
    .eq("id", id)
    .single()

  if (!property) {
    return {
      title: "Property Not Found",
      description: "The property you're looking for doesn't exist.",
    }
  }

  return {
    title: property.meta_title || property.title,
    description: property.meta_description || `View ${property.title} at ABL Natasha Enterprises`,
    openGraph: {
      title: property.meta_title || property.title,
      description: property.meta_description || `View ${property.title} at ABL Natasha Enterprises`,
    },
  }
}
