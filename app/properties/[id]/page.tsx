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

  // First try real_estate_properties with product join
  let { data: propertyData, error: propertyError } = await supabase
    .from("real_estate_properties")
    .select(`
      *,
      products (
        name,
        description,
        price,
        images,
        is_active,
        slug
      )
    `)
    .eq("id", id)
    .single()

  // If not found by ID, try by product slug
  if (propertyError || !propertyData) {
    const { data: propertyBySlug } = await supabase
      .from("real_estate_properties")
      .select(`
        *,
        products!inner (
          name,
          description,
          price,
          images,
          is_active,
          slug
        )
      `)
      .eq("products.slug", id)
      .single()
    
    propertyData = propertyBySlug
  }

  if (!propertyData) {
    notFound()
  }

  const property = propertyData

    // Format property data from real_estate_properties
  const formattedProperty = {
    id: property.id,
    title: property.products?.name || property.title || "Luxury Property",
    description: property.products?.description || property.description || "Beautiful property with modern amenities",
    price: property.booking_price_per_night || Number.parseFloat(property.products?.price || "0"),
    location: property.location_details?.city || "Premium Location",
    address: property.location_details?.address || "Luxury District",
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.square_feet || 0,
    property_type: property.property_type || "apartment",
    listing_type: "rent",
    amenities: property.amenities || [],
    features: property.features || [],
    images: property.products?.images || property.images || ["/placeholder.svg?height=400&width=600&text=Property+Image"],
    available: property.is_available_for_booking || false,
    featured: property.featured || false,
    virtual_tour_url: property.virtual_tour_url || "",
    booking_price_per_night: property.booking_price_per_night || 0,
    minimum_stay_nights: property.minimum_stay_nights || 1,
    is_available_for_booking: property.is_available_for_booking || false,
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PropertyDetailClient property={formattedProperty} />
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
