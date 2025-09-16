import * as React from "react"
import { HeartIcon, UsersIcon, TrophyIcon, TruckIcon, Heart, Award } from "lucide-react"
import { TestimonialsSection } from "@modules/aboutUs/TestimonialsSection"
import { WholesaleSection } from "@modules/aboutUs/WholesaleSection"
import { LocationSection } from "@modules/aboutUs/LocationSection"
import { getStoreInfo, SobreArgoItem } from "@lib/data/strapi"

const stats = [
  {
    icon: UsersIcon,
    number: "50,000+",
    label: "Clientes Satisfechos",
    color: "text-red-500",
    ariaLabel: "Clientes Satisfechos"
  },
  {
    icon: TrophyIcon,
    number: "15+",
    label: "Años de Experiencia",
    color: "text-red-500",
    ariaLabel: "Años de Experiencia"
  },
  {
    icon: HeartIcon,
    number: "1,000+",
    label: "Productos Únicos",
    color: "text-red-500",
    ariaLabel: "Productos Únicos"
  },
  {
    icon: TruckIcon,
    number: "100,000+",
    label: "Envíos Realizados",
    color: "text-red-500",
    ariaLabel: "Envíos Realizados"
  }
]

export default async function AboutUsPage() {
  const storeInfo: SobreArgoItem[] = await getStoreInfo()
  const info = storeInfo?.[0]
  const testimonialImages = (info?.testimonios || []).map((url: string, index: number) => ({
    id: String(index),
    url,
    alt: "Testimonio de cliente"
  }))
  return (
    <>
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side - Image */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-pink-100">
                {/* Heart icon in top right corner - positioned inside */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-red-500 rounded-full p-3 shadow-lg animate-bounce" style={{
                    animationDuration: '2s'
                  }}>
                    <Heart className="h-6 w-6 text-white" aria-label="Heart" role="img" />
                  </div>
                </div>
                
                {/* User icon in bottom left corner - positioned inside */}
                <div className="absolute bottom-4 left-4 z-10">
                  <div className="bg-black rounded-full p-3 shadow-lg">
                    <Award className="w-6 h-6 text-white" aria-label="Award" role="img" />
                  </div>
                </div>
                
                {/* Background image from store info */}
                <img
                  src={info?.argo_imagen || "/api/placeholder/600/750"}
                  alt="Nuestra Historia - ArgoStore"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="order-1 lg:order-2">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    Nuestra <span className="text-red-500">Historia</span>
                  </h1>
                  
                  <div className="space-y-4 text-gray-600 leading-relaxed">
                    <p>{info?.historia_argo || ""}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 pt-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center bg-gray-50 p-6 rounded-xl">
                      <div className="flex justify-center mb-3">
                        <div className="bg-red-50 rounded-full p-3">
                          <stat.icon className={`h-6 w-6 ${stat.color}`} aria-label={stat.ariaLabel} role="img" />
                        </div>
                      </div>
                      <div className="font-bold text-2xl text-gray-900 mb-1">
                        {stat.number}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <TestimonialsSection images={testimonialImages} />
      
      {/* Wholesale Section */}
      <WholesaleSection 
        phone={info?.whatsapp_contacto} 
        email={info?.correo_electronico}
        facebookUrl={info?.facebook_url}
        instagramUrl={info?.instagram_url}
        youtubeUrl={info?.youtube_url}
      />
      
      {/* Location Section */}
      <LocationSection />
    </>
  )
} 