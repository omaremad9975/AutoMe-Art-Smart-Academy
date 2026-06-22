'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const COURSE_ENRICHMENT = {
  'التفكير الإبداعي': {
    icon: '🎨',
    description_ar: 'طوّر قدراتك الإبداعية وتعلّم أساليب التفكير خارج الصندوق مع نخبة من المدربين المتخصصين. يغطي الكورس أدوات وتقنيات التفكير الإبداعي التطبيقية.',
    description_en: 'Develop your creative abilities and learn out-of-the-box thinking methods with expert trainers. The course covers applied creative thinking tools and techniques.',
    instructor_ar: 'د. محمود رمضان',
    instructor_en: 'Dr. Mahmoud Ramadan',
  },
  'الذكاء الاصطناعي': {
    icon: '🤖',
    description_ar: 'رحلة شاملة في عالم الذكاء الاصطناعي — من الأساسيات حتى التطبيقات العملية في بيئة العمل. يشمل ChatGPT والأدوات الحديثة وكيفية توظيفها.',
    description_en: 'A comprehensive journey into AI — from fundamentals to real-world workplace applications. Covers ChatGPT, modern tools, and how to leverage them.',
    instructor_ar: 'د. محمود رمضان',
    instructor_en: 'Dr. Mahmoud Ramadan',
  },
  'اللغة الصينية': {
    icon: '🈶',
    description_ar: 'تعلّم اللغة الصينية من الصفر مع منهج متكامل يشمل الحروف والمحادثة والكتابة. مناسب للمبتدئين الراغبين في الانفتاح على الثقافة والسوق الصيني.',
    description_en: 'Learn Chinese from scratch with a comprehensive curriculum covering characters, conversation, and writing. Ideal for beginners interested in Chinese culture and market.',
    instructor_ar: 'أستاذة ليلى حسن',
    instructor_en: 'Ms. Layla Hassan',
  },
}

function getInitials(name) {
  if (!name) return 'AS'
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('')
}

export default function CourseDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [course, setCourse]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang]       = useState('ar')
  const isAr = lang === 'ar'

  useEffect(() => {
    fetch('/api/public/courses')
      .then(r => r.json())
      .then(({ courses }) => {
        const found = (courses || []).find(c => c.id === id)
        if (found) setCourse(found)
        else router.push('/')
        setLoading(false)
      })
      .catch(() => { router.push('/'); setLoading(false) })
  }, [id, router])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F4', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5C1A" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
        <p style={{ color: '#A0A0A0', fontSize: '14px' }}>جارٍ التحميل...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!course) return null

  const enriched     = COURSE_ENRICHMENT[course.name_ar] || {}
  const icon         = enriched.icon || '📚'
  const title        = isAr ? course.name_ar : (course.name_en || course.name_ar)
  const description  = isAr ? (course.description_ar || enriched.description_ar || '') : (course.description_en || enriched.description_en || '')
  const instructor   = isAr ? (course.instructor_ar || enriched.instructor_ar || '') : (course.instructor_en || enriched.instructor_en || '')
  const initials     = getInitials(instructor)
  const seatsLeft    = course.seats > 0 ? course.seats : null

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F4', fontFamily: 'Cairo, sans-serif', direction: isAr ? 'rtl' : 'ltr' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* ── Nav ── */}
      <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #FFE4D4', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(255,92,26,0.06)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo_mark_black.png" alt="Art Smart Academy" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
        </a>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
            style={{ padding: '6px 14px', borderRadius: '20px', border: '1.5px solid #FFE4D4', background: '#FFF8F4', color: '#FF5C1A', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}
          >
            {isAr ? 'English' : 'عربي'}
          </button>
          <a href="/#courses" style={{ padding: '6px 14px', borderRadius: '20px', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
            {isAr ? '← الكورسات' : '← Courses'}
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg,#FF5C1A 0%,#C73D08 100%)', padding: '56px 24px 64px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>{icon}</div>
        <h1 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '28px', lineHeight: 1.3, marginBottom: '12px', fontFamily: 'Cairo, sans-serif' }}>{title}</h1>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {course.duration && (
            <span style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>
              📅 {course.duration}
            </span>
          )}
          {seatsLeft && (
            <span style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>
              👥 {seatsLeft} {isAr ? 'مقعد متاح' : 'seats left'}
            </span>
          )}
          <span style={{ background: 'rgba(255,255,255,0.25)', color: '#FFFFFF', padding: '6px 20px', borderRadius: '20px', fontSize: '16px', fontWeight: 900, fontFamily: 'Cairo, sans-serif' }}>
            {course.price} {isAr ? 'جنيه' : 'EGP'}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Description */}
        {description && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)', marginBottom: '20px' }}>
            <h2 style={{ color: '#FF5C1A', fontWeight: 800, fontSize: '16px', marginBottom: '14px', fontFamily: 'Cairo, sans-serif' }}>
              {isAr ? '📋 عن الكورس' : '📋 About This Course'}
            </h2>
            <p style={{ color: '#374151', fontSize: '15px', lineHeight: 1.8, fontFamily: 'Cairo, sans-serif' }}>{description}</p>
          </div>
        )}

        {/* Instructor */}
        {instructor && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px 28px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, fontFamily: 'Cairo, sans-serif', flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <p style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>
                {isAr ? 'المدرب / المدربة' : 'Instructor'}
              </p>
              <p style={{ color: '#111827', fontSize: '16px', fontWeight: 800, fontFamily: 'Cairo, sans-serif' }}>{instructor}</p>
            </div>
          </div>
        )}

        {/* Details card */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px 28px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)', marginBottom: '28px' }}>
          <h2 style={{ color: '#FF5C1A', fontWeight: 800, fontSize: '16px', marginBottom: '16px', fontFamily: 'Cairo, sans-serif' }}>
            {isAr ? '📌 تفاصيل الكورس' : '📌 Course Details'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: isAr ? 'المدة' : 'Duration',      value: course.duration || '—' },
              { label: isAr ? 'السعر' : 'Price',         value: `${course.price} ${isAr ? 'جنيه' : 'EGP'}` },
              { label: isAr ? 'المقاعد' : 'Seats',       value: seatsLeft ? `${seatsLeft} ${isAr ? 'متاح' : 'available'}` : (isAr ? 'محدود' : 'Limited') },
              { label: isAr ? 'الحالة' : 'Status',       value: isAr ? 'متاح للتسجيل' : 'Open for registration' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#FFF8F4', borderRadius: '10px', padding: '14px 16px', border: '1px solid #FFE4D4' }}>
                <p style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>{label}</p>
                <p style={{ color: '#111827', fontSize: '15px', fontWeight: 800, fontFamily: 'Cairo, sans-serif' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <a
          href={`/?courseId=${course.id}#courses`}
          style={{
            display: 'block', width: '100%', padding: '16px', borderRadius: '14px',
            background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF',
            fontWeight: 900, fontSize: '18px', textAlign: 'center', textDecoration: 'none',
            boxShadow: '0 8px 28px rgba(255,92,26,0.35)', fontFamily: 'Cairo, sans-serif',
            transition: 'transform 0.2s',
          }}
        >
          {isAr ? 'سجّل الآن ←' : 'Register Now →'}
        </a>

        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '12px', marginTop: '16px', fontFamily: 'Cairo, sans-serif' }}>
          {isAr ? 'سيتم توجيهك إلى صفحة التسجيل' : 'You will be redirected to the registration page'}
        </p>
      </div>

      {/* Footer */}
      <div style={{ background: '#111827', padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '12px', fontFamily: 'Cairo, sans-serif' }}>
          © 2026 Art Smart Academy — {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
        </p>
      </div>
    </div>
  )
}
