"use client"

import { useState } from "react"
import Modal from "@modules/common/components/modal"
import Eye from "@modules/common/icons/eye"

type SizeGuideTabProps = {
  className?: string
}

type ZoomableImageProps = {
  src: string
  alt: string
  label: string
}

const ZoomableImage = ({ src, alt, label }: ZoomableImageProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-center gap-y-4">
      <span className="font-semibold">{label}</span>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative w-full group focus:outline-none"
        aria-label={`${label} - expandir imagen`}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-md border border-gray-200"
          loading="lazy"
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-white/90 text-gray-900 px-2 py-1 rounded-md border border-gray-200 shadow group-hover:bg-white">
          <Eye size={16} />
          <span className="text-xs font-medium">Expandir</span>
        </span>
      </button>

      <Modal isOpen={open} close={() => setOpen(false)} size="large">
        <Modal.Title>{label}</Modal.Title>
        <Modal.Body>
          <img
            src={src}
            alt={alt}
            className="max-h-[70vh] w-auto h-auto object-contain"
          />
        </Modal.Body>
      </Modal>
    </div>
  )
}

const SizeGuideTab = ({ className }: SizeGuideTabProps) => {
  return (
    <div className={`text-small-regular py-8 ${className ?? ""}`}>
      <div className="grid grid-cols-1 gap-y-8">
        <ZoomableImage
          src="/guia-tallas-playeras.jpg"
          alt="Guía de tallas para playeras"
          label="Guía de tallas - Playeras"
        />
        <ZoomableImage
          src="/guia-tallas-extras.jpg"
          alt="Guía de tallas para extras"
          label="Guía de tallas - Extras"
        />
      </div>
    </div>
  )
}

export default SizeGuideTab


