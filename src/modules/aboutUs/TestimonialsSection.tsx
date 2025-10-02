"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Images } from "lucide-react"

interface TestimonialImage {
  id: string
  url: string
  alt: string
}

interface TestimonialsSectionProps {
  images: TestimonialImage[]
  tiktokUrl?: string
}

export function TestimonialsSection({ images, tiktokUrl }: TestimonialsSectionProps) {
  const isLoading = false
  const error = null

  const testimonials = images || []
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const trackRef = React.useRef<HTMLDivElement | null>(null)
  const [distance, setDistance] = React.useState(0)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [selectedImage, setSelectedImage] = React.useState<TestimonialImage | null>(null)
  const [isViewerOpen, setIsViewerOpen] = React.useState(false)

  React.useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    // Move by half the track since we duplicate content once
    const totalWidth = track.scrollWidth
    const halfWidth = totalWidth / 2
    setDistance(halfWidth)
  }, [testimonials])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isViewerOpen) setIsViewerOpen(false)
        else setIsModalOpen(false)
      }
    }
    if (isModalOpen || isViewerOpen) {
      window.addEventListener('keydown', onKey)
    }
    return () => window.removeEventListener('keydown', onKey)
  }, [isModalOpen, isViewerOpen])

  // Lock background scroll while any modal is open
  React.useEffect(() => {
    const modalOpen = isModalOpen || isViewerOpen
    const original = document.body.style.overflow
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = original || ''
    }
    return () => {
      document.body.style.overflow = original || ''
    }
  }, [isModalOpen, isViewerOpen])

  if (error) {
    return (
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Error al cargar los testimonios</p>
        </div>
      </section>
    )
  }

  // Duplicate testimonials once to create a seamless loop
  const loopedTestimonials = testimonials.length > 0 ? [...testimonials, ...testimonials] : []

  return (
    <section className="py-16 lg:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Lo que dicen nuestros <span className="text-red-500">Clientes</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Miles de clientes satisfechos han compartido su experiencia con nosotros en redes sociales
          </motion.p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex space-x-6 animate-pulse">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64 h-80 bg-gray-200 rounded-xl" />
            ))}
          </div>
        )}

        {/* Infinite Carousel */}
        {!isLoading && testimonials.length > 0 && (
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
            
            {/* Carousel container */}
            <div ref={containerRef} className="flex overflow-hidden">
              <motion.div
                ref={trackRef}
                className="flex space-x-6"
                animate={distance > 0 ? { x: [0, -distance] } : undefined}
                transition={distance > 0 ? { duration: Math.max(12, distance / 80), ease: "linear", repeat: Infinity } : undefined}
              >
                {loopedTestimonials.map((testimonial, index) => (
                  <div key={`${testimonial.id}-${index}`} className="flex-shrink-0">
                    <div className="relative w-64 h-80 rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                      <img
                        src={testimonial.url}
                        alt={testimonial.alt}
                        className="object-cover w-full h-full"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && testimonials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay testimonios disponibles en este momento</p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex justify-center mb-6">
            <button
              type="button"
              onClick={() => { setIsModalOpen(true) }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              <Images className="w-5 h-5" aria-hidden="true" />
              Ver todos las imagenes
            </button>
          </div>
          <motion.p 
            className="text-gray-600 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            ¿Ya eres cliente de ArgoStore? ¡Comparte tu experiencia!
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.685"/>
              </svg>
              WhatsApp
            </a>
            <a
              href={tiktokUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12.9 2h3.1c.2 1.4 1 2.7 2.2 3.6 1 .8 2.3 1.2 3.6 1.3v3.2c-1.3-.1-2.6-.4-3.8-.9-.7-.3-1.4-.7-2-.1v5.6c0 3.2-2.6 5.8-5.8 5.8S4.4 18.9 4.4 15.7c0-3 2.2-5.4 5.1-5.8v3.3c-1.1.3-1.9 1.3-1.9 2.5 0 1.4 1.1 2.6 2.6 2.6s2.6-1.1 2.6-2.6V2z"/></svg>
              TikTok
            </a>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-colors duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Modal - Gallery Grid */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overscroll-contain"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-[95vw] max-w-6xl h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Galería de testimonios</h3>
              <button
                className="p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsModalOpen(false)}
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Grid */}
            <div className="p-4 sm:p-6 overflow-auto overscroll-contain h-[calc(85vh-4rem)]">
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
                initial="hidden"
                animate="show"
                variants={{ hidden: { opacity: 1 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
              >
                {testimonials.map((img) => (
                  <motion.button
                    key={img.id}
                    type="button"
                    className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onClick={() => { setSelectedImage(img); setIsViewerOpen(true) }}
                    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="object-cover w-full h-full group-hover:opacity-90"
                      loading="lazy"
                      decoding="async"
                    />
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Viewer Modal (on top of grid modal) */}
      {isViewerOpen && selectedImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 cursor-zoom-out p-4"
          onClick={() => setIsViewerOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative cursor-zoom-out"
            onClick={() => setIsViewerOpen(false)}
          >
            {/* Close button, tucked just inside the image bounds */}
            <button
              className="absolute -top-3 -right-3 sm:top-2 sm:right-2 z-10 p-2 rounded-full bg-black/70 text-white hover:bg-black/80 shadow"
              onClick={(e) => { e.stopPropagation(); setIsViewerOpen(false) }}
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {/* Image sized to content but constrained by viewport */}
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-[92vw] max-h-[82vh] w-auto h-auto object-contain rounded-lg shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </section>
  )
} 