import { Button, Heading } from "@medusajs/ui"
import { getCarouselSlides } from "@lib/data/strapi"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import HeroCarousel from "./hero-carousel"

const Hero = async () => {
  const slides = await getCarouselSlides()

  // If no slides from Strapi, show fallback
  if (!slides || slides.length === 0) {
    return (
      <div className="h-[60vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center gap-6">
          <span>
            <Heading level="h1" className="text-3xl leading-10 text-ui-fg-base font-normal">
              Moda que Define tu Estilo
            </Heading>
            <Heading level="h2" className="text-3xl leading-10 text-ui-fg-subtle font-normal">
              Descubre nuestra colección exclusiva
            </Heading>
          </span>
          <LocalizedClientLink href="/store">
            <Button variant="secondary">
              Ver todos los productos
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  return <HeroCarousel slides={slides} />
}

export default Hero
