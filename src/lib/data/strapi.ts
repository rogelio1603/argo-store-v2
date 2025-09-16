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

// Sobre Argo (testimonials) types
interface StrapiMediaUrl {
  url: string
}

interface StrapiSobreArgo {
  id: number
  documentId: string
  argo_imagen: StrapiMediaUrl | null
  historia_argo: string
  testimonios: StrapiMediaUrl[]
  telefono_contacto: string | number | null
  whatsapp_contacto: string | number | null
  direccion_tienda: string
  horarios_tienda: string
  correo_electronico: string
  publishedAt: string
  createdAt: string
  updatedAt: string
}

interface StrapiSobreArgoResponse {
  data: StrapiSobreArgo[]
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

export interface SobreArgoItem {
  id: number
  argo_imagen: string | null
  historia_argo: string
  testimonios: string[]
  telefono_contacto: string
  whatsapp_contacto: string
  direccion_tienda: string
  horarios_tienda: string
  correo_electronico: string
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
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

// Returns store information from `sobre-argos`
export const getStoreInfo = async (): Promise<SobreArgoItem[]> => {
  try {
    const url = `${STRAPI_HOST}/api/sobre-argos?populate[argo_imagen][fields][0]=url&populate[testimonios][fields][0]=url`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300,
        tags: ['store-info']
      },
      cache: 'force-cache'
    })

    if (!response.ok) {
      return []
    }

    const data: StrapiSobreArgoResponse = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      return []
    }

    const items: SobreArgoItem[] = data.data.map((item) => ({
      id: item.id,
      argo_imagen: item.argo_imagen ? `${STRAPI_HOST}${item.argo_imagen.url}` : null,
      historia_argo: item.historia_argo || '',
      testimonios: item.testimonios?.map((image) => `${STRAPI_HOST}${image.url}`) || [],
      telefono_contacto: String(item.telefono_contacto ?? ''),
      whatsapp_contacto: String(item.whatsapp_contacto ?? ''),
      direccion_tienda: item.direccion_tienda || '',
      horarios_tienda: item.horarios_tienda || '',
      correo_electronico: item.correo_electronico || '',
      facebook_url: (item as any).facebook_url || undefined,
      instagram_url: (item as any).instagram_url || undefined,
      youtube_url: (item as any).youtube_url || undefined
    }))

    return items
  } catch (_error) {
    return []
  }
}