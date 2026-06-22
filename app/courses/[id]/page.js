'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'

const COURSE_ENRICHMENT = {
  'التفكير الإبداعي': { icon: '🎨', description_ar: 'طوّر قدراتك الإبداعية وتعلّم أساليب التفكير خارج الصندوق مع نخبة من المدربين المتخصصين.', description_en: 'Develop creative abilities and learn out-of-the-box thinking with expert trainers.', instructor_ar: 'د. محمود رمضان', instructor_en: 'Dr. Mahmoud Ramadan' },
  'الذكاء الاصطناعي': { icon: '🤖', description_ar: 'رحلة شاملة في عالم الذكاء الاصطناعي من الأساسيات حتى التطبيقات العملية.', description_en: 'A comprehensive journey into AI — from fundamentals to real-world applications.', instructor_ar: 'د. محمود رمضان', instructor_en: 'Dr. Mahmoud Ramadan' },
  'اللغة الصينية': { icon: '🈶', description_ar: 'تعلّم اللغة الصينية من الصفر مع منهج متكامل يشمل الحروف والمحادثة والكتابة.', description_en: 'Learn Chinese from scratch with a comprehensive curriculum.', instructor_ar: 'أستاذة ليلى حسن', instructor_en: 'Ms. Layla Hassan' },
}

const COUNTRY_CODES = [
  { code: '+20', flag: '🇪🇬', name: 'Egypt' }, { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' }, { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' }, { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' }, { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' }, { code: '+218', flag: '🇱🇾', name: 'Libya' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' }, { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' }, { code: '+249', flag: '🇸🇩', name: 'Sudan' },
  { code: '+1', flag: '🇺🇸', name: 'USA/Canada' }, { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+33', flag: '🇫🇷', name: 'France' }, { code: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: '+90', flag: '🇹🇷', name: 'Turkey' }, { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+61', flag: '🇦🇺', name: 'Australia' }, { code: '+65', flag: '🇸🇬', name: 'Singapore' },
]

function getInitials(name) {
  if (!name) return 'AS'
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('')
}

// ── Searchable Country Dropdown ───────────────────────────────────────────────
function CountryDropdown({ value, onSelect }) {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')
  const ref                 = useRef(null)
  const searchRef           = useRef(null)
  const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0]
  const filtered = COUNTRY_CODES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search))
  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch('') } }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])
  useEffect(() => { if (open) setTimeout(() => searchRef.current?.focus(), 50) }, [open])
  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0, width: '110px' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ width: '100%', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', padding: '0 10px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 600, color: '#111827' }}>
        <span>{selected.flag} {selected.code}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '48px', left: 0, zIndex: 9999, background: '#FFFFFF', border: '1.5px solid #FFE4D4', borderRadius: '12px', boxShadow: '0 8px 28px rgba(0,0,0,0.14)', width: '230px', maxHeight: '260px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '8px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F9FAFB', borderRadius: '8px', padding: '6px 10px', border: '1px solid #E5E7EB' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input ref={searchRef} type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', fontFamily: 'Cairo, sans-serif', color: '#111827', width: '100%' }} />
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map(c => (
              <button key={c.code} type="button" onClick={() => { onSelect(c.code); setOpen(false); setSearch('') }} style={{ width: '100%', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '8px', background: value === c.code ? '#FFF8F4' : 'transparent', border: 'none', borderBottom: '1px solid #F9FAFB', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: '13px', color: '#111827' }}>
                <span style={{ fontSize: '16px' }}>{c.flag}</span>
                <span style={{ flex: 1, textAlign: 'left', fontWeight: value === c.code ? 700 : 400 }}>{c.name}</span>
                <span style={{ color: '#6B7280', fontWeight: 700, fontSize: '12px' }}>{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Inline Registration Form ──────────────────────────────────────────────────
const INPUT = { width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px', fontFamily: 'Cairo, sans-serif', color: '#111827', outline: 'none', border: '1.5px solid #E5E7EB', background: '#F9FAFB', boxSizing: 'border-box' }
const onFocusIn  = e => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.12)'; e.target.style.background = '#FFFFFF' }
const onFocusOut = e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }

function RegistrationForm({ course, lang }) {
  const isAr = lang === 'ar'
  const [form, setForm]               = useState({ name: '', phonePrefix: '+20', phoneLocal: '', email: '', paymentMethod: 'vodafone_cash' })
  const [errors, setErrors]           = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [serverError, setServerError] = useState('')
  const [receiptUrl, setReceiptUrl]   = useState('')
  const [uploading, setUploading]     = useState(false)
  const [receiptError, setReceiptError] = useState('')
  const fileInputRef = useRef(null)

  const MANUAL_DETAILS = {
    vodafone_cash: { label: isAr ? 'فودافون كاش' : 'Vodafone Cash', number: '01*********', color: '#E40000' },
    instapay:      { label: isAr ? 'إنستاباي' : 'InstaPay',      number: '01*********', color: '#6B2FA0' },
  }

  async function handleReceiptUpload(e) {
    const file = e.target.files?.[0]; if (!file) return; e.target.value = ''
    if (file.size > 5 * 1024 * 1024) { setReceiptError(isAr ? 'الملف أكبر من 5MB' : 'File exceeds 5MB'); return }
    setUploading(true); setReceiptError(''); setReceiptUrl('')
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const urlRes = await fetch(`/api/public/get-receipt-upload-url?ext=${ext}`)
      const urlData = await urlRes.json()
      if (!urlRes.ok || urlData.error) { setReceiptError(isAr ? 'فشل الرفع' : 'Upload failed'); setUploading(false); return }
      const uploadRes = await fetch(urlData.signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type, 'x-upsert': 'false' } })
      if (uploadRes.ok) setReceiptUrl(urlData.publicUrl)
      else setReceiptError(isAr ? 'فشل الرفع' : 'Upload failed')
    } catch { setReceiptError(isAr ? 'خطأ في الاتصال' : 'Network error') }
    setUploading(false)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = isAr ? 'مطلوب' : 'Required'
    const digits = form.phoneLocal.replace(/\D/g, '')
    if (!form.phoneLocal.trim()) e.phone = isAr ? 'مطلوب' : 'Required'
    else if (digits.length < 4 || digits.length > 13) e.phone = isAr ? 'رقم غير صحيح' : 'Invalid number'
    if (!form.email.trim()) e.email = isAr ? 'مطلوب' : 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = isAr ? 'بريد غير صحيح' : 'Invalid email'
    if (!receiptUrl) e.receipt = isAr ? 'الإيصال مطلوب' : 'Receipt required'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({}); setSubmitting(true); setServerError('')
    try {
      const res = await fetch('/api/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phonePrefix + form.phoneLocal, email: form.email, whatsapp: form.phonePrefix + form.phoneLocal, courseId: course.id, paymentMethod: form.paymentMethod, receiptUrl }),
      })
      const data = await res.json()
      if (!res.ok) { setServerError(data.error || 'Something went wrong'); setSubmitting(false); return }
      setSubmitted(true)
    } catch { setServerError(isAr ? 'خطأ في الاتصال' : 'Network error'); setSubmitting(false) }
  }

  if (submitted) return (
    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px', border: '1px solid #FFE4D4', textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
      <h3 style={{ color: '#111827', fontWeight: 800, fontSize: '18px', fontFamily: 'Cairo, sans-serif', marginBottom: '8px' }}>{isAr ? 'تم استلام طلبك!' : 'Request Received!'}</h3>
      <p style={{ color: '#6B7280', fontSize: '14px', fontFamily: 'Cairo, sans-serif', lineHeight: 1.7 }}>{isAr ? 'سيقوم فريقنا بمراجعة الإيصال وتأكيد تسجيلك خلال 24 ساعة.' : 'Our team will review your receipt and confirm your registration within 24 hours.'}</p>
    </div>
  )

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '28px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.08)' }}>
      <h2 style={{ color: '#FF5C1A', fontWeight: 800, fontSize: '18px', marginBottom: '20px', fontFamily: 'Cairo, sans-serif' }}>
        {isAr ? '📝 سجّل في الكورس' : '📝 Register for this Course'}
      </h2>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Name */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '6px', fontFamily: 'Cairo, sans-serif' }}>{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={isAr ? 'مثال: محمد أحمد' : 'e.g. Mohamed Ahmed'} style={INPUT} onFocus={onFocusIn} onBlur={onFocusOut} />
          {errors.name && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', fontFamily: 'Cairo, sans-serif' }}>{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '6px', fontFamily: 'Cairo, sans-serif' }}>{isAr ? 'رقم الهاتف *' : 'Phone Number *'}</label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <CountryDropdown value={form.phonePrefix} onSelect={code => setForm(f => ({ ...f, phonePrefix: code }))} />
            <input type="tel" inputMode="numeric" value={form.phoneLocal} onChange={e => setForm(f => ({ ...f, phoneLocal: e.target.value }))} placeholder="XXXXXXXXXX" style={{ ...INPUT, flex: 1 }} onFocus={onFocusIn} onBlur={onFocusOut} />
          </div>
          {errors.phone && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', fontFamily: 'Cairo, sans-serif' }}>{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '6px', fontFamily: 'Cairo, sans-serif' }}>{isAr ? 'البريد الإلكتروني *' : 'Email Address *'}</label>
          <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="example@email.com" style={{ ...INPUT, direction: 'ltr' }} onFocus={onFocusIn} onBlur={onFocusOut} />
          {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', fontFamily: 'Cairo, sans-serif' }}>{errors.email}</p>}
        </div>

        {/* Payment method */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '8px', fontFamily: 'Cairo, sans-serif' }}>{isAr ? 'طريقة الدفع *' : 'Payment Method *'}</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {Object.entries(MANUAL_DETAILS).map(([key, { label, color }]) => (
              <button key={key} type="button" onClick={() => setForm(f => ({ ...f, paymentMethod: key }))}
                style={{ flex: 1, padding: '10px 8px', borderRadius: '10px', border: `2px solid ${form.paymentMethod === key ? color : '#E5E7EB'}`, background: form.paymentMethod === key ? `${color}10` : '#F9FAFB', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, color: form.paymentMethod === key ? color : '#6B7280' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Payment details */}
        <div style={{ background: '#FFF8F4', border: '1px solid #FFE4D4', borderRadius: '10px', padding: '14px 16px' }}>
          <p style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>{isAr ? 'حوّل المبلغ إلى:' : 'Transfer amount to:'}</p>
          <p style={{ fontSize: '16px', fontWeight: 800, color: '#111827', fontFamily: 'Cairo, sans-serif' }}>
            {MANUAL_DETAILS[form.paymentMethod].number}
          </p>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#FF5C1A', fontFamily: 'Cairo, sans-serif', marginTop: '2px' }}>
            {course.price} {isAr ? 'جنيه' : 'EGP'}
          </p>
        </div>

        {/* Receipt upload */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '6px', fontFamily: 'Cairo, sans-serif' }}>{isAr ? 'إيصال الدفع *' : 'Payment Receipt *'}</label>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleReceiptUpload} />
          {receiptUrl ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px' }}>
              <span style={{ fontSize: '18px' }}>✅</span>
              <span style={{ flex: 1, fontSize: '13px', color: '#15803D', fontFamily: 'Cairo, sans-serif', fontWeight: 600 }}>{isAr ? 'تم رفع الإيصال بنجاح' : 'Receipt uploaded successfully'}</span>
              <button type="button" onClick={() => setReceiptUrl('')} style={{ fontSize: '12px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>{isAr ? 'إزالة' : 'Remove'}</button>
            </div>
          ) : (
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px dashed #FFE4D4', background: '#FFF8F4', cursor: uploading ? 'default' : 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: '13px', fontWeight: 700, color: uploading ? '#A0A0A0' : '#FF5C1A' }}>
              {uploading ? (isAr ? 'جارٍ الرفع...' : 'Uploading...') : (isAr ? '📎 ارفع إيصال الدفع' : '📎 Upload Payment Receipt')}
            </button>
          )}
          {receiptError && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', fontFamily: 'Cairo, sans-serif' }}>{receiptError}</p>}
          {errors.receipt && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px', fontFamily: 'Cairo, sans-serif' }}>{errors.receipt}</p>}
        </div>

        {serverError && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px' }}><p style={{ color: '#DC2626', fontSize: '13px', fontFamily: 'Cairo, sans-serif', margin: 0 }}>{serverError}</p></div>}

        <button type="submit" disabled={submitting}
          style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: submitting ? '#FFB89A' : 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', fontWeight: 900, fontSize: '16px', fontFamily: 'Cairo, sans-serif', cursor: submitting ? 'default' : 'pointer', boxShadow: submitting ? 'none' : '0 6px 20px rgba(255,92,26,0.30)' }}>
          {submitting ? (isAr ? 'جارٍ الإرسال...' : 'Submitting...') : (isAr ? 'إرسال الطلب ←' : 'Submit Registration →')}
        </button>
      </form>
    </div>
  )
}

// ── Main Course Detail Page ───────────────────────────────────────────────────
export default function CourseDetailPage() {
  const { id }   = useParams()
  const router   = useRouter()
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

  const enriched    = COURSE_ENRICHMENT[course.name_ar] || {}
  const icon        = enriched.icon || '📚'
  const title       = isAr ? course.name_ar : (course.name_en || course.name_ar)
  const description = isAr ? (course.description_ar || enriched.description_ar || '') : (course.description_en || enriched.description_en || '')
  const instructor  = isAr ? (course.instructor_ar || enriched.instructor_ar || '') : (course.instructor_en || enriched.instructor_en || '')
  const initials    = getInitials(instructor)
  const seatsLeft   = course.seats > 0 ? course.seats : null

  return (
    <div style={{ minHeight: '100vh', background: '#FFF8F4', fontFamily: 'Cairo, sans-serif', direction: isAr ? 'rtl' : 'ltr' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } } * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* Nav */}
      <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #FFE4D4', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(255,92,26,0.06)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src="/logo_mark_black.png" alt="Art Smart Academy" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
        </a>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')} style={{ padding: '6px 14px', borderRadius: '20px', border: '1.5px solid #FFE4D4', background: '#FFF8F4', color: '#FF5C1A', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'Cairo, sans-serif' }}>
            {isAr ? 'English' : 'عربي'}
          </button>
          <a href="/#courses" style={{ padding: '6px 14px', borderRadius: '20px', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}>
            {isAr ? '← الكورسات' : '← Courses'}
          </a>
        </div>
      </nav>

      {/* Hero — image or orange gradient */}
      {course.image_url ? (
        <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
          <img src={course.image_url} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.20) 60%, transparent 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '28px 24px', textAlign: 'center' }}>
            <h1 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '26px', lineHeight: 1.3, marginBottom: '12px', fontFamily: 'Cairo, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{title}</h1>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {course.duration && <span style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', color: '#FFFFFF', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>📅 {course.duration}</span>}
              {seatsLeft && <span style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', color: '#FFFFFF', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>👥 {seatsLeft} {isAr ? 'مقعد' : 'seats'}</span>}
              <span style={{ background: 'rgba(255,92,26,0.85)', color: '#FFFFFF', padding: '5px 18px', borderRadius: '20px', fontSize: '15px', fontWeight: 900, fontFamily: 'Cairo, sans-serif' }}>{course.price} {isAr ? 'جنيه' : 'EGP'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: 'linear-gradient(135deg,#FF5C1A 0%,#C73D08 100%)', padding: '48px 24px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ fontSize: '52px', marginBottom: '14px' }}>{icon}</div>
          <h1 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '26px', lineHeight: 1.3, marginBottom: '12px', fontFamily: 'Cairo, sans-serif' }}>{title}</h1>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {course.duration && <span style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>📅 {course.duration}</span>}
            {seatsLeft && <span style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', padding: '5px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>👥 {seatsLeft} {isAr ? 'مقعد' : 'seats'}</span>}
            <span style={{ background: 'rgba(255,255,255,0.25)', color: '#FFFFFF', padding: '5px 18px', borderRadius: '20px', fontSize: '15px', fontWeight: 900, fontFamily: 'Cairo, sans-serif' }}>{course.price} {isAr ? 'جنيه' : 'EGP'}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '740px', margin: '0 auto', padding: '36px 20px 80px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Description */}
        {description && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px 28px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}>
            <h2 style={{ color: '#FF5C1A', fontWeight: 800, fontSize: '15px', marginBottom: '12px', fontFamily: 'Cairo, sans-serif' }}>{isAr ? '📋 عن الكورس' : '📋 About This Course'}</h2>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: 1.8, fontFamily: 'Cairo, sans-serif' }}>{description}</p>
          </div>
        )}

        {/* Instructor */}
        {instructor && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '20px 24px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, fontFamily: 'Cairo, sans-serif', flexShrink: 0 }}>{initials}</div>
            <div>
              <p style={{ color: '#9CA3AF', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Cairo, sans-serif', marginBottom: '3px' }}>{isAr ? 'المدرب / المدربة' : 'Instructor'}</p>
              <p style={{ color: '#111827', fontSize: '15px', fontWeight: 800, fontFamily: 'Cairo, sans-serif' }}>{instructor}</p>
            </div>
          </div>
        )}

        {/* Details grid */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '22px 24px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}>
          <h2 style={{ color: '#FF5C1A', fontWeight: 800, fontSize: '15px', marginBottom: '14px', fontFamily: 'Cairo, sans-serif' }}>{isAr ? '📌 تفاصيل الكورس' : '📌 Course Details'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { label: isAr ? 'المدة' : 'Duration', value: course.duration || '—' },
              { label: isAr ? 'السعر' : 'Price', value: `${course.price} ${isAr ? 'جنيه' : 'EGP'}` },
              { label: isAr ? 'المقاعد' : 'Seats', value: seatsLeft ? `${seatsLeft} ${isAr ? 'متاح' : 'left'}` : (isAr ? 'محدود' : 'Limited') },
              { label: isAr ? 'الحالة' : 'Status', value: isAr ? 'متاح للتسجيل ✅' : 'Open for registration ✅' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#FFF8F4', borderRadius: '10px', padding: '12px 14px', border: '1px solid #FFE4D4' }}>
                <p style={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'Cairo, sans-serif', marginBottom: '4px' }}>{label}</p>
                <p style={{ color: '#111827', fontSize: '14px', fontWeight: 800, fontFamily: 'Cairo, sans-serif' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Registration form */}
        <RegistrationForm course={course} lang={lang} />
      </div>

      <div style={{ background: '#111827', padding: '18px 24px', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '12px', fontFamily: 'Cairo, sans-serif' }}>© 2026 Art Smart Academy — {isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved'}</p>
      </div>
    </div>
  )
}
