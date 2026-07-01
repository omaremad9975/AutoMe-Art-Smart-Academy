'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

// ── Course fallback data ──────────────────────────────────────────────────────
const COURSE_ENRICHMENT = {
  'التفكير الإبداعي': { icon: '🎨', description_ar: 'طوّر قدراتك الإبداعية وتعلّم أساليب التفكير خارج الصندوق مع نخبة من المدربين المتخصصين.', description_en: 'Develop creative abilities and learn out-of-the-box thinking with expert trainers.', instructor_ar: 'د. محمود رمضان', instructor_en: 'Dr. Mahmoud Ramadan' },
  'الذكاء الاصطناعي': { icon: '🤖', description_ar: 'رحلة شاملة في عالم الذكاء الاصطناعي من الأساسيات حتى التطبيقات العملية.', description_en: 'A comprehensive journey into AI — from fundamentals to real-world applications.', instructor_ar: 'د. محمود رمضان', instructor_en: 'Dr. Mahmoud Ramadan' },
  'اللغة الصينية': { icon: '🈶', description_ar: 'تعلّم اللغة الصينية من الصفر مع منهج متكامل يشمل الحروف والمحادثة والكتابة.', description_en: 'Learn Chinese from scratch with a comprehensive curriculum.', instructor_ar: 'أستاذة ليلى حسن', instructor_en: 'Ms. Layla Hassan' },
}

// ── Country codes ─────────────────────────────────────────────────────────────
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

// ── Payment Logos (same as landing page) ─────────────────────────────────────
function CardLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', height: '28px' }}>
      <svg width="38" height="12" viewBox="0 0 216 68" fill="none"><path fill="#1A1F71" d="M87.5 1.4L58.6 66.6H38.8L24.5 17.1c-.9-3.4-1.6-4.7-4.3-6.1C14.6 8.7 5.8 6.5.9 5.1L1.4 1.4h33.1c4.2 0 8 2.8 9 7.4l8.2 43.5L76.2 1.4h11.3zm44.3 43.9c.1-18.8-26-19.8-25.8-28.2.1-2.6 2.5-5.3 7.8-6 2.7-.3 10-.5 18.4 3.2l3.3-15.2C131.8.5 127-.6 121.1 0 101.9 0 88.4 11 88.3 26.7c-.1 12.5 11.2 19.4 19.7 23.5 8.8 4.3 11.7 7 11.7 10.9 0 5.9-7 8.5-13.5 8.6-11.3.2-17.8-3-23-5.5l-4.1 19C83.5 85.5 91 87.2 100 87.3c20.3 0 33.5-10 33.5-25.6l.3-16.4zm73.7 21.3H188l-19.3-65.2h-16c-3.7 0-6.8 2.1-8.2 5.4L116.4 66.6H136l4.1-11.4h24.5l2.3 11.4zm-21-30.5l10-27.5 5.8 27.5h-15.8zM94.7 1.4L79.3 66.6H60.5L75.9 1.4h18.8z"/></svg>
      <svg width="30" height="19" viewBox="0 0 38 24" fill="none"><circle cx="14" cy="12" r="12" fill="#EB001B"/><circle cx="24" cy="12" r="12" fill="#F79E1B"/><path fill="#FF5F00" d="M19 3.5A12 12 0 0 1 23.2 12 12 12 0 0 1 19 20.5 12 12 0 0 1 14.8 12 12 12 0 0 1 19 3.5z"/></svg>
    </div>
  )
}
function VodafoneCashLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <svg width="28" height="28" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#E60000"/><path fill="white" d="M 65,22 C 81,22 81,42 65,42 C 59,42 54,39 51,36 L 44,44 L 47.5,35.5 C 33,33 33,22 50,22 Z"/><circle cx="50" cy="32" r="6" fill="#E60000"/></svg>
      <span style={{ fontWeight: 800, fontSize: '13px', color: '#E60000', fontFamily: 'Arial, sans-serif' }}>Cash</span>
    </div>
  )
}
function InstaPayLogo() {
  return (
    <svg width="80" height="26" viewBox="0 0 200 65"><defs><linearGradient id="ip-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8B2FC9"/><stop offset="100%" stopColor="#5B0FA8"/></linearGradient></defs><rect width="200" height="65" rx="10" fill="url(#ip-g)"/><text x="100" y="27" textAnchor="middle" fill="white" fontSize="16" fontWeight="400" fontFamily="Arial, sans-serif" letterSpacing="0.5">insta</text><text x="100" y="48" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-0.5">Pay</text></svg>
  )
}

const PAYMENT_OPTIONS = [
  { key: 'fawry',         ar: 'بطاقة',       en: 'Card',          noteAr: 'تأكيد تلقائي', noteEn: 'Auto-confirmed', color: '#1A1F71', bg: '#EEF2FF', Logo: CardLogo },
  { key: 'vodafone_cash', ar: 'فودافون كاش', en: 'Vodafone Cash', noteAr: 'تأكيد يدوي',   noteEn: 'Manual confirm', color: '#E60000', bg: '#FFF1F1', Logo: VodafoneCashLogo },
  { key: 'instapay',      ar: 'إنستاباي',    en: 'InstaPay',      noteAr: 'تأكيد يدوي',   noteEn: 'Manual confirm', color: '#6B2FA0', bg: '#F5F0FF', Logo: InstaPayLogo },
]

const MANUAL_PAYMENT_DETAILS = {
  vodafone_cash: { holder: 'Mahmoud A**** S***', number: '01*********' },
  instapay:      { holder: 'Mahmoud A**** S***', number: '01*********' },
}

const MODAL_T = {
  ar: {
    title: 'سجّل في الكورس', sub: 'أدخل بياناتك وسنتواصل معك قريباً',
    name: 'الاسم الكامل', namePh: 'مثال: محمد أحمد',
    phone: 'رقم الهاتف', sameWa: 'واتساب نفس رقم الهاتف',
    whatsapp: 'رقم واتساب',
    email: 'البريد الإلكتروني', emailPh: 'example@email.com',
    submit: 'إرسال الطلب →', submitting: 'جارٍ الإرسال...',
    successTitle: 'شكراً لك! 🎉', successSub: 'تم استلام طلبك بنجاح.',
    successManual: 'تم استلام طلبك وإيصال الدفع. سيقوم فريقنا بمراجعة دفعتك وتأكيد تسجيلك خلال 24 ساعة — ستصلك رسالة تأكيد بالبريد الإلكتروني.',
    nextTitle: 'الخطوات التالية',
    nextEmail: 'انتظر رسالة التأكيد على بريدك بعد مراجعة الإيصال.',
    nextContact: 'سيتواصل معك فريقنا لتأكيد موعد بدء الكورس.',
    nextSpam: 'تحقق من مجلد Spam إذا لم تصلك الرسالة.',
    close: 'تم، شكراً!', required: 'هذا الحقل مطلوب',
    payDetailsTitle: '٤ — أكمل الدفع وارفع الإيصال',
    payDetailsHolder: 'اسم الحساب', payDetailsNumber: 'الرقم',
    payDetailsInstruction: 'حوّل المبلغ المطلوب، ثم ارفع صورة الإيصال أدناه.',
    receiptBtn: 'اضغط لرفع الصورة',
    receiptHint: 'JPG, PNG, HEIC, PDF — حتى 5 ميغابايت',
    receiptUploading: 'جارٍ رفع الصورة...', receiptUploaded: '✓ تم رفع الإيصال',
    receiptRequired: 'يجب رفع إيصال الدفع قبل إرسال الطلب',
    receiptError: 'حدث خطأ أثناء رفع الصورة، حاول مرة أخرى',
  },
  en: {
    title: 'Register for this Course', sub: "Fill in your details and we'll be in touch soon",
    name: 'Full Name', namePh: 'e.g. Mohamed Ahmed',
    phone: 'Phone Number', sameWa: 'WhatsApp is same as phone',
    whatsapp: 'WhatsApp Number',
    email: 'Email Address', emailPh: 'example@email.com',
    submit: 'Submit Registration', submitting: 'Submitting...',
    successTitle: 'Thank You! 🎉', successSub: 'Your registration has been received successfully.',
    successManual: "Your registration and receipt have been received. Our team will review your payment and confirm your registration within 24 hours.",
    nextTitle: "What's next",
    nextEmail: 'Wait for a confirmation email after your receipt is reviewed.',
    nextContact: 'Our team will reach out to confirm your course start date.',
    nextSpam: "Check your Spam folder if the confirmation email doesn't show up.",
    close: 'Got it, thank you!', required: 'This field is required',
    payDetailsTitle: '4 — Complete Payment & Upload Receipt',
    payDetailsHolder: 'Account Name', payDetailsNumber: 'Number',
    payDetailsInstruction: 'Send the required amount, then upload your payment screenshot below.',
    receiptBtn: 'Click to upload screenshot',
    receiptHint: 'JPG, PNG, HEIC, PDF — up to 5 MB',
    receiptUploading: 'Uploading...', receiptUploaded: '✓ Receipt uploaded',
    receiptRequired: 'Please upload a payment receipt before submitting',
    receiptError: 'Upload failed, please try again',
  },
}

// ── Shared INPUT style ────────────────────────────────────────────────────────
const INPUT_BASE = { width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px', fontFamily: 'Cairo, sans-serif', color: '#111827', outline: 'none', border: '1.5px solid #E5E7EB', background: '#F9FAFB', direction: 'ltr', boxSizing: 'border-box' }
function onFocusIn(e)  { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.12)'; e.target.style.background = '#FFFFFF' }
function onFocusOut(e) { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }

// ── ModalField ────────────────────────────────────────────────────────────────
function ModalField({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.2px', fontFamily: 'Cairo, sans-serif', marginBottom: '6px' }}>{label}</label>
      {children}
      {error && <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#EF4444', fontFamily: 'Cairo, sans-serif' }}>{error}</p>}
    </div>
  )
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
      <button type="button" onClick={() => setOpen(o => !o)} style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px', padding: '0 10px', borderRadius: '10px', border: '1.5px solid #E5E7EB', background: '#F9FAFB', cursor: 'pointer', fontFamily: 'Cairo, sans-serif', fontSize: '12px', fontWeight: 600, color: '#111827', boxSizing: 'border-box' }}>
        <span>{selected.flag} {selected.code}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '44px', left: 0, zIndex: 9999, background: '#FFFFFF', border: '1.5px solid #FFE4D4', borderRadius: '12px', boxShadow: '0 8px 28px rgba(0,0,0,0.14)', width: '230px', maxHeight: '260px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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

// ── Registration Form (exact same design as landing page modal) ───────────────
function RegistrationForm({ course, lang }) {
  const isRTL = lang === 'ar'
  const mt    = MODAL_T[lang]
  const [form, setForm]               = useState({ name: '', phonePrefix: '+20', phoneLocal: '', email: '', sameWhatsapp: true, whatsappPrefix: '+20', whatsappLocal: '', paymentMethod: 'vodafone_cash' })
  const [errors, setErrors]           = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [serverError, setServerError] = useState('')
  const [receiptFile, setReceiptFile]           = useState(null)
  const [receiptUrl, setReceiptUrl]             = useState('')
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [receiptError, setReceiptError]         = useState('')

  const isManual = form.paymentMethod === 'vodafone_cash' || form.paymentMethod === 'instapay'

  const handleChange = useCallback((e) => {
    const key   = e.target.dataset.formkey
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }, [])

  const setPayment = useCallback((key) => () => {
    setForm((f) => ({ ...f, paymentMethod: key }))
    setReceiptFile(null); setReceiptUrl(''); setReceiptError('')
  }, [])

  async function handleReceiptChange(e) {
    const file = e.target.files?.[0]; if (!file) return; e.target.value = ''
    if (file.size > 5 * 1024 * 1024) { setReceiptError(mt.receiptError); return }
    setReceiptFile(file); setReceiptError(''); setUploadingReceipt(true); setReceiptUrl('')
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const urlRes  = await fetch(`/api/public/get-receipt-upload-url?ext=${ext}`)
      const urlData = await urlRes.json()
      if (!urlRes.ok || urlData.error) { setReceiptError(mt.receiptError); setUploadingReceipt(false); return }
      const uploadRes = await fetch(urlData.signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type, 'x-upsert': 'false' } })
      if (!uploadRes.ok) { setReceiptError(mt.receiptError); setUploadingReceipt(false); return }
      setReceiptUrl(urlData.publicUrl)
    } catch { setReceiptError(mt.receiptError) }
    setUploadingReceipt(false)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = mt.required
    const digits = form.phoneLocal.replace(/\D/g, '')
    if (!form.phoneLocal.trim()) e.phone = mt.required
    else if (digits.length < 4 || digits.length > 13) e.phone = isRTL ? 'رقم الهاتف غير صحيح' : 'Invalid phone number'
    if (!form.email.trim()) e.email = mt.required
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = isRTL ? 'البريد الإلكتروني غير صحيح' : 'Invalid email'
    if (!form.sameWhatsapp && !form.whatsappLocal.trim()) e.whatsapp = mt.required
    if (isManual && !receiptUrl) e.receipt = mt.receiptRequired
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
        body: JSON.stringify({ name: form.name, phone: form.phonePrefix + form.phoneLocal, email: form.email, whatsapp: form.sameWhatsapp ? (form.phonePrefix + form.phoneLocal) : (form.whatsappPrefix + form.whatsappLocal), courseId: course.id, paymentMethod: form.paymentMethod, receiptUrl: receiptUrl || null }),
      })
      const data = await res.json()
      if (!res.ok) { setServerError(data.error || 'Something went wrong'); setSubmitting(false); return }
      setSubmitted(true)
    } catch { setServerError('Network error. Please try again.'); setSubmitting(false) }
  }

  const accentColor  = form.paymentMethod === 'vodafone_cash' ? '#E60000' : '#6B2FA0'
  const accentBg     = form.paymentMethod === 'vodafone_cash' ? '#FFF1F1' : '#F5F0FF'
  const accentBorder = form.paymentMethod === 'vodafone_cash' ? '#FECACA' : '#DDD6FE'
  const details      = MANUAL_PAYMENT_DETAILS[form.paymentMethod]

  return (
    <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', border: '1px solid #FFE4D4', display: 'flex', direction: isRTL ? 'rtl' : 'ltr' }}>

      {/* ── Left brand panel ── */}
      <div style={{ width: '200px', flexShrink: 0, background: 'linear-gradient(165deg,#FF5C1A 0%,#C73D08 100%)', padding: '28px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.18)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', padding: '5px' }}>
            <img src="/logo_mark_blue.png" alt="Art Smart Academy" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
          </div>
          <h3 style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '15px', lineHeight: 1.3, marginBottom: '8px', fontFamily: 'Cairo, sans-serif' }}>Art Smart Academy</h3>
          <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: '12px', lineHeight: 1.6, fontFamily: 'Cairo, sans-serif', margin: 0 }}>
            {isRTL ? 'انضم إلى أكثر من ٥٠٠ طالب وطوّر مهاراتك الإبداعية.' : 'Join 500+ students and develop your creative skills.'}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(isRTL
            ? ['مدربون خبراء متخصصون', 'شهادات معتمدة', 'مجتمع إبداعي متميز']
            : ['Expert certified trainers', 'Accredited certificates', 'Creative community']
          ).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontFamily: 'Cairo, sans-serif' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, background: '#FFFFFF', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
          <h2 style={{ fontWeight: 800, fontSize: '17px', color: '#111827', fontFamily: 'Cairo, sans-serif', margin: 0 }}>{mt.title}</h2>
          <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Cairo, sans-serif', margin: '2px 0 0' }}>{mt.sub}</p>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto' }}>
          {submitted ? (
            /* ── Success ── */
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 28px rgba(255,92,26,0.35)' }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '20px', color: '#111827', fontFamily: 'Cairo, sans-serif', margin: '0 0 6px' }}>{mt.successTitle}</h3>
              <p style={{ fontSize: '13px', color: '#6B7280', fontFamily: 'Cairo, sans-serif', margin: '0 0 20px' }}>{mt.successSub}</p>
              <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '12px', padding: '14px 16px', marginBottom: '14px', textAlign: isRTL ? 'right' : 'left' }}>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#C2410C', fontFamily: 'Cairo, sans-serif', margin: '0 0 4px' }}>✅ {isRTL ? 'تم استلام طلبك وإيصال الدفع!' : 'Registration & receipt received!'}</p>
                <p style={{ fontSize: '12px', color: '#78350F', fontFamily: 'Cairo, sans-serif', lineHeight: 1.6, margin: 0 }}>{mt.successManual}</p>
              </div>
              <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '14px 16px', textAlign: isRTL ? 'right' : 'left' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', margin: '0 0 10px' }}>{mt.nextTitle}</p>
                {[mt.nextEmail, mt.nextContact, mt.nextSpam].map((txt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flexDirection: 'row', marginBottom: i < 2 ? '6px' : 0 }}>
                    <span style={{ fontSize: '13px', flexShrink: 0 }}>{['📬','📞','📁'][i]}</span>
                    <p style={{ fontSize: '12px', color: '#374151', fontFamily: 'Cairo, sans-serif', lineHeight: 1.5, margin: 0 }}>{txt}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Section 1 — Personal info */}
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                  {isRTL ? '١ — بياناتك الشخصية' : '1 — Your Information'}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <ModalField label={mt.name} error={errors.name}>
                    <input data-formkey="name" type="text" value={form.name} onChange={handleChange} placeholder={mt.namePh} style={INPUT_BASE} onFocus={onFocusIn} onBlur={onFocusOut} />
                  </ModalField>
                  <ModalField label={mt.phone} error={errors.phone}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <CountryDropdown value={form.phonePrefix} onSelect={(code) => setForm(f => ({ ...f, phonePrefix: code }))} />
                      <input data-formkey="phoneLocal" type="tel" inputMode="numeric" value={form.phoneLocal} onChange={handleChange} placeholder="XXXXXXXXXX" style={{ ...INPUT_BASE, flex: 1 }} onFocus={onFocusIn} onBlur={onFocusOut} />
                    </div>
                  </ModalField>
                </div>
                <ModalField label={mt.email} error={errors.email}>
                  <input data-formkey="email" type="email" value={form.email} onChange={handleChange} placeholder={mt.emailPh} style={INPUT_BASE} onFocus={onFocusIn} onBlur={onFocusOut} />
                </ModalField>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px', flexDirection: 'row' }}>
                  <input data-formkey="sameWhatsapp" type="checkbox" checked={form.sameWhatsapp} onChange={handleChange} style={{ width: '15px', height: '15px', accentColor: '#FF5C1A', cursor: 'pointer' }} />
                  <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>{mt.sameWa}</span>
                </label>
                {!form.sameWhatsapp && (
                  <div style={{ marginTop: '10px' }}>
                    <ModalField label={mt.whatsapp} error={errors.whatsapp}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <CountryDropdown value={form.whatsappPrefix} onSelect={(code) => setForm(f => ({ ...f, whatsappPrefix: code }))} />
                        <input data-formkey="whatsappLocal" type="tel" inputMode="numeric" value={form.whatsappLocal} onChange={handleChange} placeholder="XXXXXXXXXX" style={{ ...INPUT_BASE, flex: 1 }} onFocus={onFocusIn} onBlur={onFocusOut} />
                      </div>
                    </ModalField>
                  </div>
                )}
              </div>

              <div style={{ borderTop: '1px solid #F3F4F6' }} />

              {/* Section 2 — Course (pre-selected, read-only display) */}
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                  {isRTL ? '٢ — الكورس المختار' : '2 — Selected Course'}
                </p>
                <div style={{ ...INPUT_BASE, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF8F4', border: '1.5px solid #FFE4D4', color: '#FF5C1A', fontWeight: 700 }}>
                  <span>{lang === 'ar' ? course.name_ar : (course.name_en || course.name_ar)}</span>
                  <span style={{ fontSize: '12px', color: '#FF7A40' }}>{course.price} {isRTL ? 'جنيه' : 'EGP'}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #F3F4F6' }} />

              {/* Section 3 — Payment method */}
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                  {isRTL ? '٣ — طريقة الدفع' : '3 — Payment Method'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {PAYMENT_OPTIONS.map(({ key, ar, en, noteAr, noteEn, color, bg, Logo }) => {
                    const sel      = form.paymentMethod === key
                    const disabled = key === 'fawry'
                    return (
                      <button key={key} type="button" onClick={disabled ? undefined : setPayment(key)} disabled={disabled}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '12px', border: disabled ? '2px solid #E5E7EB' : sel ? `2px solid ${color}` : '2px solid #E5E7EB', background: disabled ? '#F3F4F6' : sel ? bg : '#F9FAFB', cursor: disabled ? 'not-allowed' : 'pointer', textAlign: isRTL ? 'right' : 'left', transition: 'all 0.15s', boxShadow: (!disabled && sel) ? `0 2px 12px ${color}20` : 'none', flexDirection: 'row', opacity: disabled ? 0.55 : 1 }}>
                        <div style={{ width: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Logo /></div>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', fontFamily: 'Cairo, sans-serif', color: disabled ? '#9CA3AF' : sel ? color : '#111827' }}>{lang === 'ar' ? ar : en}</p>
                          <p style={{ margin: '2px 0 0', fontSize: '11px', fontFamily: 'Cairo, sans-serif', color: '#9CA3AF' }}>{disabled ? (isRTL ? 'قريباً — اختر طريقة دفع أخرى' : 'Coming soon — please choose another method') : (lang === 'ar' ? noteAr : noteEn)}</p>
                        </div>
                        {disabled
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          : <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: sel ? `5px solid ${color}` : '2px solid #D1D5DB', background: sel ? '#FFFFFF' : 'transparent', flexShrink: 0, transition: 'all 0.15s' }} />
                        }
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Section 4 — Payment details + receipt */}
              {isManual && (
                <>
                  <div style={{ borderTop: '1px solid #F3F4F6' }} />
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>{mt.payDetailsTitle}</p>
                    <div style={{ background: accentBg, border: `1.5px solid ${accentBorder}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                          <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>{mt.payDetailsHolder}</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color: accentColor, fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>{details.holder}</span>
                        </div>
                        <div style={{ height: '1px', background: accentBorder }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                          <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>{mt.payDetailsNumber}</span>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: accentColor, fontFamily: 'monospace', letterSpacing: '1px', direction: 'ltr' }}>{details.number}</span>
                        </div>
                      </div>
                      <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#4B5563', fontFamily: 'Cairo, sans-serif', lineHeight: 1.6, textAlign: isRTL ? 'right' : 'left' }}>{mt.payDetailsInstruction}</p>
                    </div>
                    <label style={{ display: 'block', cursor: 'pointer' }}>
                      <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleReceiptChange} disabled={uploadingReceipt} />
                      <div style={{ border: `2px dashed ${errors.receipt ? '#EF4444' : receiptUrl ? '#10B981' : '#D1D5DB'}`, borderRadius: '12px', padding: '16px', textAlign: 'center', background: receiptUrl ? 'rgba(16,185,129,0.05)' : '#FAFAFA', cursor: 'pointer' }}>
                        {uploadingReceipt ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                            <span style={{ fontSize: '13px', color: accentColor, fontFamily: 'Cairo, sans-serif' }}>{mt.receiptUploading}</span>
                          </div>
                        ) : receiptUrl ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#10B981', fontFamily: 'Cairo, sans-serif' }}>{mt.receiptUploaded}</span>
                            <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>({receiptFile?.name})</span>
                          </div>
                        ) : (
                          <>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#374151', fontFamily: 'Cairo, sans-serif' }}>{mt.receiptBtn}</p>
                            <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9CA3AF', fontFamily: 'Cairo, sans-serif' }}>{mt.receiptHint}</p>
                          </>
                        )}
                      </div>
                    </label>
                    {receiptError  && <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#EF4444', fontFamily: 'Cairo, sans-serif' }}>{receiptError}</p>}
                    {errors.receipt && !receiptError && <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#EF4444', fontFamily: 'Cairo, sans-serif' }}>{errors.receipt}</p>}
                  </div>
                </>
              )}

              {serverError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <p style={{ margin: 0, fontSize: '13px', color: '#DC2626', fontFamily: 'Cairo, sans-serif' }}>{serverError}</p>
                </div>
              )}

              <button type="submit" disabled={submitting || uploadingReceipt}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: (submitting || uploadingReceipt) ? '#FCA587' : 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', fontWeight: 800, fontSize: '15px', fontFamily: 'Cairo, sans-serif', cursor: (submitting || uploadingReceipt) ? 'not-allowed' : 'pointer', boxShadow: (submitting || uploadingReceipt) ? 'none' : '0 4px 20px rgba(255,92,26,0.40)', transition: 'all 0.2s' }}>
                {submitting
                  ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                      {mt.submitting}
                    </span>
                  : mt.submit
                }
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
function getInitials(name) {
  if (!name) return 'AS'
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('')
}

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF8F4' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5C1A" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
  if (!course) return null

  const enriched    = COURSE_ENRICHMENT[course.name_ar] || {}
  const icon        = enriched.icon || '📚'
  const title       = isAr ? course.name_ar : (course.name_en || course.name_ar)
  const description = isAr ? (course.description_ar || enriched.description_ar || '') : (course.description_en || enriched.description_en || '')
  const instructor  = isAr ? (course.instructor_ar || enriched.instructor_ar || '') : (course.instructor_en || enriched.instructor_en || '')
  const instructorBio = isAr ? (course.instructor_bio_ar || '') : (course.instructor_bio_en || '')
  const goals       = (isAr ? course.goals_ar : course.goals_en) || []
  const audience    = isAr ? (course.audience_ar || '') : (course.audience_en || '')
  const schedule    = isAr ? (course.schedule_ar || '') : (course.schedule_en || '')
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

      {/* Hero */}
      {course.image_url ? (
        <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
          <img src={course.image_url} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', padding: '24px', textAlign: 'center' }}>
            <h1 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '24px', lineHeight: 1.3, marginBottom: '10px', fontFamily: 'Cairo, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>{title}</h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {course.duration && <span style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>{course.duration}</span>}
              {seatsLeft && <span style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>{seatsLeft} {isAr ? 'مقعد' : 'seats'}</span>}
              <span style={{ background: 'rgba(255,92,26,0.85)', color: '#FFFFFF', padding: '4px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 900, fontFamily: 'Cairo, sans-serif' }}>{course.price} {isAr ? 'جنيه' : 'EGP'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: 'linear-gradient(135deg,#FF5C1A 0%,#C73D08 100%)', padding: '44px 24px 52px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{icon}</div>
          <h1 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '24px', lineHeight: 1.3, marginBottom: '10px', fontFamily: 'Cairo, sans-serif' }}>{title}</h1>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {course.duration && <span style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>{course.duration}</span>}
            {seatsLeft && <span style={{ background: 'rgba(255,255,255,0.18)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, fontFamily: 'Cairo, sans-serif' }}>{seatsLeft} {isAr ? 'مقعد' : 'seats'}</span>}
            <span style={{ background: 'rgba(255,255,255,0.25)', color: '#FFFFFF', padding: '4px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 900, fontFamily: 'Cairo, sans-serif' }}>{course.price} {isAr ? 'جنيه' : 'EGP'}</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px 80px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {(audience || schedule) && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)', overflow: 'hidden' }}>
            {audience && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 22px', borderBottom: schedule ? '1px solid #FFF0E8' : 'none' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>👥</span>
                <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                  <p style={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Cairo, sans-serif', margin: '0 0 2px' }}>{isAr ? 'لمن هذا الكورس' : "Who It's For"}</p>
                  <p style={{ color: '#111827', fontSize: '14px', fontWeight: 700, fontFamily: 'Cairo, sans-serif', margin: 0 }}>{audience}</p>
                </div>
              </div>
            )}
            {schedule && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 22px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>📅</span>
                <div style={{ textAlign: isAr ? 'right' : 'left' }}>
                  <p style={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Cairo, sans-serif', margin: '0 0 2px' }}>{isAr ? 'الموعد' : 'Schedule'}</p>
                  <p style={{ color: '#111827', fontSize: '14px', fontWeight: 700, fontFamily: 'Cairo, sans-serif', margin: 0 }}>{schedule}</p>
                </div>
              </div>
            )}
          </div>
        )}
        {description && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '22px 24px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}>
            <h2 style={{ color: '#FF5C1A', fontWeight: 800, fontSize: '14px', marginBottom: '10px', fontFamily: 'Cairo, sans-serif' }}>{isAr ? '📋 عن الكورس' : '📋 About This Course'}</h2>
            <p style={{ color: '#374151', fontSize: '14px', lineHeight: 1.8, fontFamily: 'Cairo, sans-serif' }}>{description}</p>
          </div>
        )}
        {goals.length > 0 && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '22px 24px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}>
            <h2 style={{ color: '#FF5C1A', fontWeight: 800, fontSize: '14px', marginBottom: '14px', fontFamily: 'Cairo, sans-serif' }}>{isAr ? '🎯 أهداف الكورس' : '🎯 Course Goals'}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {goals.map((goal, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,92,26,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="#FF5C1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <p style={{ color: '#374151', fontSize: '14px', lineHeight: 1.6, fontFamily: 'Cairo, sans-serif', margin: 0 }}>{goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {instructor && (
          <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '18px 22px', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)', display: 'flex', alignItems: 'center', gap: '12px', flexDirection: 'row' }}>
            {course.instructor_photo_url ? (
              <img src={course.instructor_photo_url} alt={instructor} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800, fontFamily: 'Cairo, sans-serif', flexShrink: 0 }}>{getInitials(instructor)}</div>
            )}
            <div style={{ textAlign: isAr ? 'right' : 'left' }}>
              <p style={{ color: '#9CA3AF', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'Cairo, sans-serif', marginBottom: '2px' }}>{isAr ? 'المدرب / المدربة' : 'Instructor'}</p>
              <p style={{ color: '#111827', fontSize: '15px', fontWeight: 800, fontFamily: 'Cairo, sans-serif' }}>{instructor}</p>
              {instructorBio && <p style={{ color: '#6B7280', fontSize: '12px', fontFamily: 'Cairo, sans-serif', margin: '2px 0 0' }}>{instructorBio}</p>}
            </div>
          </div>
        )}

        {/* Registration form — same design as landing page modal */}
        <RegistrationForm course={course} lang={lang} />
      </div>

      <div style={{ background: '#111827', padding: '16px 24px', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '12px', fontFamily: 'Cairo, sans-serif' }}>© 2026 Art Smart Academy</p>
      </div>
    </div>
  )
}
