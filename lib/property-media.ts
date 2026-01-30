const VIDEO_EXT_REGEX = /\.(mp4|mov|m4v|webm|ogv|ogg)(\?|#|$)/i

const isVideoUrl = (url: string) => VIDEO_EXT_REGEX.test(url)

type MediaItem =
  | string
  | {
      url?: string
      type?: string
    }

export function splitPropertyMedia(input: unknown) {
  const images: string[] = []
  const videos: string[] = []

  if (Array.isArray(input)) {
    input.forEach((item) => {
      if (!item) return
      if (typeof item === "string") {
        if (isVideoUrl(item)) {
          videos.push(item)
        } else {
          images.push(item)
        }
        return
      }
      if (typeof item === "object") {
        const candidate = (item as MediaItem).url
        if (!candidate) return
        const type = (item as MediaItem).type
        if (type === "video" || isVideoUrl(candidate)) {
          videos.push(candidate)
        } else {
          images.push(candidate)
        }
      }
    })
  }

  return { images, videos }
}

export function buildPropertyMediaPayload(images: string[], videos: string[]) {
  const cleanImages = images.filter(Boolean)
  const cleanVideos = videos.filter(Boolean)

  if (cleanVideos.length === 0) {
    return cleanImages
  }

  return [
    ...cleanImages.map((url) => ({ type: "image", url })),
    ...cleanVideos.map((url) => ({ type: "video", url })),
  ]
}
