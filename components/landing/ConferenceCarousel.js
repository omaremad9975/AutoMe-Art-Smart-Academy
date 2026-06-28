'use client'

import { useState, useEffect, useRef } from 'react'

function ConferenceCarousel({ lang }) {
  const [photos, setPhotos]   = useState(FALLBACK_PHOTOS)
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(false)
  const containerRef          = useRef(null)
  const isRTL = lang === 'ar'

  useEffect(() => {
    fetch('/api/public/gallery')
      .then((r) => r.json())
      .then(({ photos: dbPhotos }) => { if (dbPhotos?.length) { setPhotos(dbPhotos); setCurrent(0) } })
      .catch(() => {})
  }, [])

  // Pause auto-advance when carousel is off-screen
  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const total = photos.length
  const prev  = () => setCurrent((c) => (c - 1 + total) % total)
  const next  = () => setCurrent((c) => (c + 1) % total)

  useEffect(() => {
    if (!visible) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % total), 4500)
    return () => clearInterval(timer)
  }, [total, visible])

  const caption = isRTL
    ? (photos[current]?.caption_ar || photos[current]?.caption_en || '')
    : (photos[current]?.caption_en || photos[current]?.caption_ar || '')

  return (
    <div ref={containerRef} className="relative max-w-3xl mx-auto">
      {/* Main image */}
      <div className="relative rounded-asa-radius-xl overflow-hidden shadow-asa-shadow-orange" style={{ aspectRatio: '16/9' }}>
        {photos.map((photo, i) => (
          <img
            key={photo.id || i}
            src={photo.url || photo.src}
            alt={photo.caption_en || photo.caption_ar || ''}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          />
        ))}
        {/* Gradient overlay at bottom for caption */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        {/* Caption */}
        {caption && (
          <p className="absolute bottom-4 left-6 right-6 text-white text-xs md:text-sm font-semibold font-cairo text-center drop-shadow">
            {caption}
          </p>
        )}
        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all duration-200"
          aria-label="Previous"
        >
          <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-all duration-200"
          aria-label="Next"
        >
          <svg className="w-4 h-4 text-[#1A1A1A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-asa-orange w-6' : 'bg-asa-border w-2 hover:bg-asa-orange/40'}`}
            aria-label={`Go to photo ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

// ==========================================

export default ConferenceCarousel
