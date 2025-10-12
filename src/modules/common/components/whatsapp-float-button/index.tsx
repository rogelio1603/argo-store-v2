"use client"

import { useEffect, useState } from "react"

interface WhatsAppFloatButtonProps {
  phoneNumber: string
  message?: string
}

export default function WhatsAppFloatButton({ 
  phoneNumber, 
  message = "Hola, me gustaría obtener más información" 
}: WhatsAppFloatButtonProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Mostrar el botón después de un pequeño delay para mejor UX
    const timer = setTimeout(() => setIsVisible(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
    // Limpiar el número de teléfono (solo dígitos)
    const cleanPhone = phoneNumber.replace(/\D/g, "")
    
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message)
    
    // Crear URL de WhatsApp
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")
  }

  if (!phoneNumber) return null

  return (
    <button
      onClick={handleClick}
      className={`
        fixed bottom-6 right-6 z-50
        bg-[#25D366] hover:bg-[#20BA5A]
        text-white rounded-full
        w-14 h-14 md:w-16 md:h-16
        flex items-center justify-center
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        transform hover:scale-110
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
      `}
      aria-label="Contactar por WhatsApp"
      title="Chatea con nosotros en WhatsApp"
    >
      {/* Logo de WhatsApp oficial */}
      <svg 
        viewBox="0 0 32 32" 
        className="w-8 h-8 md:w-9 md:h-9 relative z-10"
        fill="currentColor"
      >
        <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 7.933-2.127c2.42 1.37 5.173 2.127 8.067 2.127 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-4.713 1.262 1.262-4.669-0.292-0.508c-1.207-2.100-1.847-4.507-1.847-6.953 0-7.51 6.11-13.62 13.62-13.62s13.62 6.11 13.62 13.62-6.557 13.030-14.073 13.030zM21.305 19.26c-0.346-0.174-2.049-1.007-2.366-1.123-0.316-0.117-0.547-0.174-0.776 0.174s-0.893 1.123-1.094 1.347c-0.201 0.231-0.401 0.26-0.747 0.087-0.346-0.174-1.461-0.537-2.785-1.711-1.027-0.909-1.721-2.035-1.923-2.382-0.201-0.346-0.022-0.533 0.152-0.705 0.156-0.155 0.346-0.401 0.518-0.603 0.174-0.201 0.231-0.346 0.346-0.576 0.117-0.231 0.058-0.431-0.028-0.603-0.087-0.174-0.776-1.87-1.063-2.565-0.28-0.672-0.56-0.58-0.776-0.591-0.201-0.010-0.431-0.012-0.662-0.012s-0.603 0.087-0.92 0.431c-0.316 0.346-1.206 1.179-1.206 2.873s1.235 3.333 1.406 3.561c0.174 0.231 2.421 3.815 5.944 5.201 0.838 0.354 1.472 0.565 1.988 0.737 0.817 0.263 1.554 0.227 2.143 0.139 0.654-0.098 2.049-0.831 2.337-1.636 0.288-0.804 0.288-1.495 0.201-1.636-0.087-0.144-0.316-0.231-0.662-0.404z"/>
      </svg>
      
      {/* Animación de pulso suave y lenta - Primera onda */}
      <span 
        className="absolute inset-0 rounded-full bg-[#25D366]"
        style={{
          animation: 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
      ></span>
      
      {/* Animación de pulso suave y lenta - Segunda onda (con delay) */}
      <span 
        className="absolute inset-0 rounded-full bg-[#25D366]"
        style={{
          animation: 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) 1.5s infinite'
        }}
      ></span>
      
      <style jsx>{`
        @keyframes pulseSlow {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.3);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  )
}