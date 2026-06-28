'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const BASE_URL = typeof window !== 'undefined' ? window.location.origin : ''

function CertCard({ cert, isRTL }) {
  const [copied, setCopied] = useState(false)
  const verifyUrl  = `${BASE_URL}/verify/${cert.verification_code}`
  const issuedDate = new Date(cert.issued_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

  const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME` +
    `&name=${encodeURIComponent(cert.course_name_en || cert.course_name_ar)}` +
    `&organizationName=${encodeURIComponent('Art Smart Academy')}` +
    `&issueYear=${new Date(cert.issued_at).getFullYear()}` +
    `&issueMonth=${new Date(cert.issued_at).getMonth() + 1}` +
    `&certUrl=${encodeURIComponent(verifyUrl)}` +
    `&certId=${encodeURIComponent(cert.verification_code)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', border: '1px solid #FFE4D4', boxShadow: '0 8px 32px rgba(255,92,26,0.08)', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,92,26,0.15)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,92,26,0.08)'}>

      {/* Header strip */}
      <div style={{ background: 'linear-gradient(135deg,#FF5C1A,#C73D08)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', margin: '0 0 6px' }}>
              {isRTL ? 'شهادة إتمام' : 'Certificate of Completion'}
            </p>
            <h3 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '18px', margin: '0 0 4px', fontFamily: 'Cairo, sans-serif', lineHeight: 1.3 }}>
              {isRTL ? cert.course_name_ar : cert.course_name_en}
            </h3>
            {isRTL && cert.course_name_en && (
              <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: '12px', margin: 0, fontFamily: 'Cairo, sans-serif' }}>{cert.course_name_en}</p>
            )}
          </div>
          <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.18)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>🎓</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px' }}>
        {/* Student + date */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <p style={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Cairo, sans-serif', margin: '0 0 3px' }}>{isRTL ? 'الطالب' : 'Student'}</p>
            <p style={{ color: '#111827', fontSize: '14px', fontWeight: 700, fontFamily: 'Cairo, sans-serif', margin: 0 }}>{cert.student_name}</p>
          </div>
          <div>
            <p style={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Cairo, sans-serif', margin: '0 0 3px' }}>{isRTL ? 'تاريخ الإصدار' : 'Issue Date'}</p>
            <p style={{ color: '#111827', fontSize: '14px', fontWeight: 700, fontFamily: 'Cairo, sans-serif', margin: 0 }}>{issuedDate}</p>
          </div>
        </div>

        {/* Verification code */}
        <div style={{ background: '#FFF8F4', border: '1px solid #FFE4D4', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <p style={{ color: '#9CA3AF', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Cairo, sans-serif', margin: '0 0 2px' }}>{isRTL ? 'رمز التحقق' : 'Verification Code'}</p>
            <p style={{ color: '#FF5C1A', fontSize: '15px', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '2px', margin: 0 }}>{cert.verification_code}</p>
          </div>
          <button onClick={handleCopy} style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #FFE4D4', background: copied ? '#059669' : '#FFFFFF', color: copied ? '#FFFFFF' : '#FF5C1A', fontSize: '11px', fontWeight: 700, fontFamily: 'Cairo, sans-serif', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}>
            {copied ? '✓ Copied' : isRTL ? 'نسخ الرابط' : 'Copy Link'}
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {cert.certificate_url ? (
            <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '13px', fontFamily: 'Cairo, sans-serif', textAlign: 'center', boxShadow: '0 3px 12px rgba(255,92,26,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {isRTL ? 'تحميل الشهادة' : 'Download PDF'}
            </a>
          ) : (
            <div style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', background: '#F3F4F6', color: '#9CA3AF', fontWeight: 700, fontSize: '12px', fontFamily: 'Cairo, sans-serif', textAlign: 'center', border: '1px solid #E5E7EB' }}>
              {isRTL ? 'PDF قيد التجهيز...' : 'PDF being prepared...'}
            </div>
          )}
          <a href={linkedInUrl} target="_blank" rel="noopener noreferrer"
            style={{ padding: '10px 14px', borderRadius: '10px', background: '#0A66C2', color: '#FFFFFF', textDecoration: 'none', fontWeight: 800, fontSize: '13px', fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            LinkedIn
          </a>
          <a href={verifyUrl} target="_blank" rel="noopener noreferrer"
            style={{ padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#F9FAFB', color: '#6B7280', textDecoration: 'none', fontWeight: 700, fontSize: '12px', fontFamily: 'Cairo, sans-serif', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
            🔗 {isRTL ? 'تحقق' : 'Verify'}
          </a>
        </div>
      </div>
    </div>
  )
}

export default function MyCertificates() {
  const router = useRouter()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading]           = useState(true)
  const [email, setEmail]               = useState('')
  const [lang, setLang]                 = useState('ar')
  const isRTL = lang === 'ar'

  useEffect(() => {
    const token = localStorage.getItem('student_token')
    const storedEmail = localStorage.getItem('student_email')
    if (!token) { router.replace('/student/login?reason=session'); return }
    try {
      const payload = JSON.parse(atob(token))
      if (payload.exp < Date.now()) {
        localStorage.removeItem('student_token')
        router.replace('/student/login?reason=expired')
        return
      }
      // Old-format token (no sig field) — invalidated by security upgrade
      if (!payload.sig) {
        localStorage.removeItem('student_token')
        router.replace('/student/login?reason=expired')
        return
      }
      setEmail(storedEmail || payload.email)
    } catch { router.replace('/student/login?reason=session'); return }

    fetch('/api/student/my-certificates', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => {
        if (r.status === 401) {
          localStorage.removeItem('student_token')
          router.replace('/student/login?reason=expired')
          return null
        }
        return r.json()
      })
      .then(data => { if (data) { setCertificates(data.certificates || []); setLoading(false) } })
      .catch(() => setLoading(false))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('student_token')
    localStorage.removeItem('student_email')
    router.push('/student/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F4', fontFamily: 'Cairo, sans-serif', direction: isRTL ? 'rtl' : 'ltr' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } * { box-sizing: border-box; }`}</style>

      {/* Nav */}
      <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #FFE4D4', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(255,92,26,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo_mark_black.png" alt="Art Smart Academy" style={{ height: '28px', objectFit: 'contain' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#FF5C1A', fontFamily: 'Cairo, sans-serif' }}>{isRTL ? 'شهاداتي' : 'My Certificates'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')} style={{ padding: '5px 12px', borderRadius: '16px', border: '1.5px solid #FFE4D4', background: '#FFF8F4', color: '#FF5C1A', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
            {isRTL ? 'EN' : 'عربي'}
          </button>
          <button onClick={handleLogout} style={{ padding: '5px 12px', borderRadius: '16px', border: '1.5px solid #E5E7EB', background: '#F9FAFB', color: '#9CA3AF', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
            {isRTL ? 'خروج' : 'Logout'}
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '36px 20px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ color: '#111827', fontWeight: 900, fontSize: '26px', margin: '0 0 6px', fontFamily: 'Cairo, sans-serif' }}>
            {isRTL ? `أهلاً، ${email.split('@')[0]} 👋` : `Welcome, ${email.split('@')[0]} 👋`}
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
            {loading ? '...' : isRTL
              ? `لديك ${certificates.length} شهادة${certificates.length !== 1 ? '' : ''}`
              : `You have ${certificates.length} certificate${certificates.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5C1A" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
          </div>
        )}

        {/* Empty state */}
        {!loading && certificates.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #FFE4D4' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎓</div>
            <h3 style={{ color: '#111827', fontWeight: 800, fontSize: '18px', margin: '0 0 8px', fontFamily: 'Cairo, sans-serif' }}>
              {isRTL ? 'لا توجد شهادات بعد' : 'No certificates yet'}
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7, margin: 0, fontFamily: 'Cairo, sans-serif' }}>
              {isRTL ? 'ستظهر شهاداتك هنا بمجرد إصدارها من قِبل الأكاديمية' : "Your certificates will appear here once issued by the academy"}
            </p>
          </div>
        )}

        {/* Certificates grid */}
        {!loading && certificates.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
            {certificates.map(cert => <CertCard key={cert.id} cert={cert} isRTL={isRTL} />)}
          </div>
        )}
      </div>
    </div>
  )
}
