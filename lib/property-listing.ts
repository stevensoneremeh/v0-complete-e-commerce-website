const LISTING_PREFIX = "__listing_type:"

export function extractListingType(amenities: unknown) {
  const list = Array.isArray(amenities) ? amenities.filter((a) => typeof a === "string") : []
  const listingEntry = list.find((item) => item.startsWith(LISTING_PREFIX))
  const listingType = listingEntry ? listingEntry.replace(LISTING_PREFIX, "") : undefined
  const cleanedAmenities = list.filter((item) => !item.startsWith(LISTING_PREFIX))

  return { listingType, amenities: cleanedAmenities }
}

export function withListingType(amenities: unknown, listingType?: string) {
  const list = Array.isArray(amenities) ? amenities.filter((a) => typeof a === "string") : []
  const cleaned = list.filter((item) => !item.startsWith(LISTING_PREFIX))

  if (listingType) {
    cleaned.push(`${LISTING_PREFIX}${listingType}`)
  }

  return cleaned
}
