"use server"

interface StrapiCarouselImage {
  id: number
  name: string
  alternativeText: string | null
  url: string
  width: number
  height: number
}

interface StrapiCarouselSlide {
  id: number
  documentId: string
  primer_texto: string
  segundo_texto: string
  imagenes: StrapiCarouselImage[]
  publishedAt: string
  createdAt: string
  updatedAt: string
}

interface StrapiCarouselResponse {
  data: StrapiCarouselSlide[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface CarouselSlide {
  id: number
  primer_texto: string
  segundo_texto: string
  images: {
    id: number
    name: string
    alt: string
    url: string
    width: number
    height: number
  }[]
}

const STRAPI_HOST = process.env.NEXT_PUBLIC_STRAPI_HOST
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN

if (!STRAPI_HOST) {
  throw new Error('NEXT_PUBLIC_STRAPI_HOST environment variable is not set')
}

if (!STRAPI_TOKEN) {
  throw new Error('NEXT_PUBLIC_STRAPI_TOKEN environment variable is not set')
}

export const getCarouselSlides = async (): Promise<CarouselSlide[]> => {
  try {
    const url = `${STRAPI_HOST}/api/carousel-inicios?populate[imagenes][fields][0]=url&populate[imagenes][fields][1]=alternativeText&populate[imagenes][fields][2]=name&populate[imagenes][fields][3]=width&populate[imagenes][fields][4]=height`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // Revalidate every 5 minute
        tags: ['carousel-slides']
      },
      cache: 'force-cache'
    })

    if (!response.ok) {
      return []
    }

    const data: StrapiCarouselResponse = await response.json()
    
    if (!data.data || !Array.isArray(data.data)) {
      return []
    }

    // Transform Strapi data to our format
    const slides: CarouselSlide[] = data.data.map((slide) => ({
      id: slide.id,
      primer_texto: slide.primer_texto || '',
      segundo_texto: slide.segundo_texto || '',
      images: slide.imagenes?.map((image) => ({
        id: image.id,
        name: image.name || 'Image',
        alt: image.alternativeText || image.name || 'Carousel image',
        url: `${STRAPI_HOST}${image.url}`,
        width: image.width || 1920,
        height: image.height || 1080,
      })) || []
    }))

    return slides

  } catch (error) {
    return []
  }
}