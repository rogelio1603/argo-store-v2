"use client"

import { useState, useEffect, useCallback } from "react"
import { Button, Heading } from "@medusajs/ui"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { type CarouselSlide } from "@lib/data/strapi"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface HeroCarouselProps {
  slides: CarouselSlide[]
}

const HeroCarousel = ({ slides }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      skipSnaps: false,
      dragFree: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentSlide(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    
    emblaApi.on('select', onSelect)
    onSelect()
    
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  // Get all images from all slides for the background carousel
  const allImages = slides.flatMap((slide) => slide.images)
  
  // Use the first slide's text for the static overlay
  const staticText = slides.length > 0 ? slides[0] : null

  return (
    <div className="h-[60vh] w-full border-b border-ui-border-base relative overflow-hidden">
      {/* Background Image Carousel */}
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {allImages.map((image, imageIndex) => (
            <div key={image.id} className="embla__slide flex-[0_0_100%] min-w-0 relative">
              <div className="absolute inset-0">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  priority={imageIndex === 0}
                  quality={90}
                  unoptimized={true}
                  onError={(e) => {
                    // Set fallback background
                    const target = e.target as HTMLImageElement
                    if (target.parentElement) {
                      target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-5"></div>

      {/* Static Content Overlay */}
      {staticText && (
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
          <span className="max-w-4xl">
            <Heading
              level="h1"
              className="text-4xl md:text-6xl leading-tight text-white font-bold mb-4"
            >
              {staticText.primer_texto}
            </Heading>
            <Heading
              level="h2"
              className="text-xl md:text-2xl leading-relaxed text-white/90 font-normal"
            >
              {staticText.segundo_texto}
            </Heading>
          </span>
          
          <LocalizedClientLink href="/store">
            <Button 
              variant="secondary" 
              className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 px-8 py-3 text-lg"
            >
              Explorar Colección
            </Button>
          </LocalizedClientLink>
        </div>
      )}

      {/* Slide Indicators */}
      {allImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-2">
            {allImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeroCarousel