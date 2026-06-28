'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

const MODAL_T = {
  ar: {
    title: 'سجّل في الكورس', sub: 'أدخل بياناتك وسنتواصل معك قريباً',
    name: 'الاسم الكامل', namePh: 'مثال: محمد أحمد',
    phone: 'رقم الهاتف', phonePh: '+20 / +1 / ...',
    email: 'البريد الإلكتروني', emailPh: 'example@email.com',
    sameWa: 'واتساب نفس رقم الهاتف',
    whatsapp: 'رقم واتساب', whatsappPh: '+20 / +1 / ...',
    course: 'الكورس المطلوب', selectCourse: '— اختر الكورس —',
    payment: 'طريقة الدفع',
    submit: 'إرسال الطلب', submitting: 'جارٍ الإرسال...',
    successTitle: 'شكراً لك! 🎉',
    successSub: 'تم استلام طلب تسجيلك بنجاح.',
    successCard: 'سيصلك إيميل تأكيد قريباً يحتوي على تعليمات الدفع بالبطاقة. بمجرد الدفع سيتم تأكيد تسجيلك تلقائياً.',
    successManual: 'تم استلام طلبك وإيصال الدفع بنجاح. سيقوم فريق الأكاديمية بمراجعة الإيصال وتأكيد تسجيلك خلال 24 ساعة — ستصلك رسالة تأكيد على بريدك الإلكتروني.',
    nextTitle: 'الخطوات القادمة',
    nextEmail: 'انتظر رسالة التأكيد على بريدك الإلكتروني بعد مراجعة الإيصال.',
    nextContact: 'سيتواصل معك فريقنا لتأكيد موعد بدء الكورس.',
    nextSpam: 'تحقق من مجلد Spam إذا لم تصلك رسالة التأكيد.',
    close: 'رائع، شكراً!', required: 'هذا الحقل مطلوب',
    loadingCourses: 'جارٍ تحميل الكورسات...',
    noCourses: 'لا توجد كورسات متاحة حالياً',
    spamNote: 'تحقق من مجلد الرسائل غير المرغوب فيها إذا لم يصلك الإيميل.',
    // Card details
    cardDetailsTitle: '٤ — بيانات البطاقة',
    cardName: 'الاسم على البطاقة', cardNamePh: 'مثال: MOHAMED AHMED',
    cardNumber: 'رقم البطاقة', cardNumberPh: 'XXXX  XXXX  XXXX  XXXX',
    cardExpiry: 'تاريخ الانتهاء', cardExpiryPh: 'MM/YY',
    cardCvv: 'CVV', cardCvvPh: '•••',
    cardNote: 'سيتواصل معك فريقنا لإتمام الدفع بالبطاقة عبر بوابة فوري الآمنة.',
    cardComingSoon: '🔒 بوابة الدفع الإلكتروني قيد الإعداد — سيتواصل معك فريقنا لإتمام العملية.',
    // Receipt upload
    payDetailsTitle: '٤ — أكمل الدفع وارفع الإيصال',
    payDetailsHolder: 'اسم الحساب',
    payDetailsNumber: 'الرقم',
    payDetailsInstruction: 'حوّل المبلغ المطلوب ثم ارفع صورة الإيصال أدناه.',
    receiptLabel: 'صورة إيصال الدفع',
    receiptBtn: 'اضغط لرفع الصورة',
    receiptHint: 'JPG, PNG, HEIC, PDF — حتى 5 ميغابايت',
    receiptUploading: 'جارٍ رفع الصورة...',
    receiptUploaded: '✓ تم رفع الإيصال',
    receiptRequired: 'يجب رفع إيصال الدفع قبل إرسال الطلب',
    receiptError: 'حدث خطأ أثناء رفع الصورة، حاول مرة أخرى',
  },
  en: {
    title: 'Register for a Course', sub: "Fill in your details and we'll be in touch soon",
    name: 'Full Name', namePh: 'e.g. Mohamed Ahmed',
    phone: 'Phone Number', phonePh: '+20 / +1 / ...',
    email: 'Email Address', emailPh: 'example@email.com',
    sameWa: 'WhatsApp is same as phone',
    whatsapp: 'WhatsApp Number', whatsappPh: '+20 / +1 / ...',
    course: 'Course', selectCourse: '— Select a course —',
    payment: 'Payment Method',
    submit: 'Submit Registration', submitting: 'Submitting...',
    successTitle: 'Thank You! 🎉',
    successSub: 'Your registration has been received successfully.',
    successCard: "A confirmation email is on its way with your card payment instructions. Once paid, your registration will be auto-confirmed.",
    successManual: "Your registration and receipt have been received. Our team will review your payment and confirm your registration within 24 hours — you'll receive a confirmation email once done.",
    nextTitle: "What's next",
    nextEmail: 'Wait for a confirmation email after your receipt is reviewed.',
    nextContact: 'Our team will reach out to confirm your course start date.',
    nextSpam: "Check your Spam folder if the confirmation email doesn't show up.",
    close: 'Got it, thank you!', required: 'This field is required',
    loadingCourses: 'Loading courses...',
    noCourses: 'No courses available right now',
    spamNote: "Check your spam folder too if the email doesn't arrive within a few minutes.",
    // Card details
    cardDetailsTitle: '4 — Card Details',
    cardName: 'Name on Card', cardNamePh: 'e.g. MOHAMED AHMED',
    cardNumber: 'Card Number', cardNumberPh: 'XXXX  XXXX  XXXX  XXXX',
    cardExpiry: 'Expiry Date', cardExpiryPh: 'MM/YY',
    cardCvv: 'CVV', cardCvvPh: '•••',
    cardNote: 'Our team will contact you to complete card payment via Fawry secure gateway.',
    cardComingSoon: '🔒 Online card payment gateway is being set up — our team will contact you to complete the payment.',
    // Receipt upload
    payDetailsTitle: '4 — Complete Payment & Upload Receipt',
    payDetailsHolder: 'Account Name',
    payDetailsNumber: 'Number',
    payDetailsInstruction: 'Send the required amount, then upload your payment screenshot below.',
    receiptLabel: 'Payment Receipt Screenshot',
    receiptBtn: 'Click to upload screenshot',
    receiptHint: 'JPG, PNG, HEIC, PDF — up to 5 MB',
    receiptUploading: 'Uploading...',
    receiptUploaded: '✓ Receipt uploaded',
    receiptRequired: 'Please upload a payment receipt before submitting',
    receiptError: 'Upload failed, please try again',
  },
}

// ── Payment Logos ────────────────────────────────────────────────────────────

function CardLogo() {
  // Visa + Mastercard side by side
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', height: '28px' }}>
      {/* Visa */}
      <svg width="38" height="12" viewBox="0 0 216 68" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#1A1F71" d="M87.5 1.4L58.6 66.6H38.8L24.5 17.1c-.9-3.4-1.6-4.7-4.3-6.1C14.6 8.7 5.8 6.5.9 5.1L1.4 1.4h33.1c4.2 0 8 2.8 9 7.4l8.2 43.5L76.2 1.4h11.3zm44.3 43.9c.1-18.8-26-19.8-25.8-28.2.1-2.6 2.5-5.3 7.8-6 2.7-.3 10-.5 18.4 3.2l3.3-15.2C131.8.5 127-.6 121.1 0 101.9 0 88.4 11 88.3 26.7c-.1 12.5 11.2 19.4 19.7 23.5 8.8 4.3 11.7 7 11.7 10.9 0 5.9-7 8.5-13.5 8.6-11.3.2-17.8-3-23-5.5l-4.1 19C83.5 85.5 91 87.2 100 87.3c20.3 0 33.5-10 33.5-25.6l.3-16.4zm73.7 21.3H188l-19.3-65.2h-16c-3.7 0-6.8 2.1-8.2 5.4L116.4 66.6H136l4.1-11.4h24.5l2.3 11.4zm-21-30.5l10-27.5 5.8 27.5h-15.8zM94.7 1.4L79.3 66.6H60.5L75.9 1.4h18.8z"/>
      </svg>
      {/* Mastercard */}
      <svg width="30" height="19" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="12" r="12" fill="#EB001B"/>
        <circle cx="24" cy="12" r="12" fill="#F79E1B"/>
        <path fill="#FF5F00" d="M19 3.5A12 12 0 0 1 23.2 12 12 12 0 0 1 19 20.5 12 12 0 0 1 14.8 12 12 12 0 0 1 19 3.5z"/>
      </svg>
    </div>
  )
}

function VodafoneCashLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {/* Vodafone red circle with official speech-bubble mark */}
      <svg width="28" height="28" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#E60000"/>
        {/* Vodafone speech bubble shape — open at bottom-left */}
        <path fill="white" d="
          M 65,22
          C 81,22 81,42 65,42
          C 59,42 54,39 51,36
          L 44,44 L 47.5,35.5
          C 33,33 33,22 50,22 Z
        "/>
        <circle cx="50" cy="32" r="6" fill="#E60000"/>
      </svg>
      <span style={{ fontWeight: 800, fontSize: '13px', color: '#E60000', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.3px' }}>Cash</span>
    </div>
  )
}

function InstaPayLogo() {
  return (
    <svg width="80" height="26" viewBox="0 0 200 65" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B2FC9"/>
          <stop offset="100%" stopColor="#5B0FA8"/>
        </linearGradient>
      </defs>
      <rect width="200" height="65" rx="10" fill="url(#ip-grad)"/>
      {/* instaPay wordmark */}
      <text x="100" y="27" textAnchor="middle" fill="white" fontSize="16" fontWeight="400" fontFamily="Arial, sans-serif" letterSpacing="0.5">insta</text>
      <text x="100" y="48" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" letterSpacing="-0.5">Pay</text>
    </svg>
  )
}

const PAYMENT_OPTIONS = [
  { key: 'fawry',         ar: 'بطاقة',          en: 'Card',           noteAr: 'تأكيد تلقائي',  noteEn: 'Auto-confirmed', color: '#1A1F71', bg: '#EEF2FF', Logo: CardLogo },
  { key: 'vodafone_cash', ar: 'فودافون كاش',    en: 'Vodafone Cash',  noteAr: '',               noteEn: '',               color: '#E60000', bg: '#FFF1F1', Logo: VodafoneCashLogo },
  { key: 'instapay',      ar: 'إنستاباي',       en: 'InstaPay',       noteAr: '',               noteEn: '',               color: '#6B2FA0', bg: '#F5F0FF', Logo: InstaPayLogo },
]

const COUNTRY_CODES = [
  { code: '+20',  flag: '🇪🇬', name: 'Egypt' },
  { code: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: '+973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+968', flag: '🇴🇲', name: 'Oman' },
  { code: '+962', flag: '🇯🇴', name: 'Jordan' },
  { code: '+961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+963', flag: '🇸🇾', name: 'Syria' },
  { code: '+964', flag: '🇮🇶', name: 'Iraq' },
  { code: '+218', flag: '🇱🇾', name: 'Libya' },
  { code: '+216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+213', flag: '🇩🇿', name: 'Algeria' },
  { code: '+212', flag: '🇲🇦', name: 'Morocco' },
  { code: '+249', flag: '🇸🇩', name: 'Sudan' },
  { code: '+1',   flag: '🇺🇸', name: 'USA / Canada' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+33',  flag: '🇫🇷', name: 'France' },
  { code: '+49',  flag: '🇩🇪', name: 'Germany' },
  { code: '+39',  flag: '🇮🇹', name: 'Italy' },
  { code: '+34',  flag: '🇪🇸', name: 'Spain' },
  { code: '+31',  flag: '🇳🇱', name: 'Netherlands' },
  { code: '+46',  flag: '🇸🇪', name: 'Sweden' },
  { code: '+47',  flag: '🇳🇴', name: 'Norway' },
  { code: '+45',  flag: '🇩🇰', name: 'Denmark' },
  { code: '+32',  flag: '🇧🇪', name: 'Belgium' },
  { code: '+41',  flag: '🇨🇭', name: 'Switzerland' },
  { code: '+90',  flag: '🇹🇷', name: 'Turkey' },
  { code: '+7',   flag: '🇷🇺', name: 'Russia' },
  { code: '+86',  flag: '🇨🇳', name: 'China' },
  { code: '+81',  flag: '🇯🇵', name: 'Japan' },
  { code: '+82',  flag: '🇰🇷', name: 'South Korea' },
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+92',  flag: '🇵🇰', name: 'Pakistan' },
  { code: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+27',  flag: '🇿🇦', name: 'South Africa' },
  { code: '+55',  flag: '🇧🇷', name: 'Brazil' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+65',  flag: '🇸🇬', name: 'Singapore' },
]

// ── Searchable Country Dropdown ───────────────────────────────────────────────
function CountryDropdown({ value, onSelect }) {
  const [open, setOpen]     = useState(false)
  const [search, setSearch] = useState('')
  const ref                 = useRef(null)
  const searchRef           = useRef(null)

  const selected = COUNTRY_CODES.find(c => c.code === value) || COUNTRY_CODES[0]
  const filtered = COUNTRY_CODES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.code.includes(search)
  )

  useEffect(() => {
    function outside(e) { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setSearch('') } }
    document.addEventListener('mousedown', outside)
    return () => document.removeEventListener('mousedown', outside)
  }, [])

  useEffect(() => { if (open) setTimeout(() => searchRef.current?.focus(), 50) }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0, width: '120px' }}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '4px', padding: '0 10px', borderRadius: '10px', border: '1.5px solid #E5E7EB',
          background: '#F9FAFB', cursor: 'pointer', fontFamily: 'Cairo, sans-serif',
          fontSize: '13px', fontWeight: 600, color: '#111827',
        }}
      >
        <span>{selected.flag} {selected.code}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute', top: '46px', left: 0, zIndex: 9999,
          background: '#FFFFFF', border: '1.5px solid #FFE4D4', borderRadius: '12px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.14)', width: '240px',
          maxHeight: '280px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* Search input */}
          <div style={{ padding: '8px 8px 4px', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F9FAFB', borderRadius: '8px', padding: '6px 10px', border: '1px solid #E5E7EB' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search country..."
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', fontFamily: 'Cairo, sans-serif', color: '#111827', width: '100%' }}
              />
            </div>
          </div>
          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 ? (
              <p style={{ padding: '12px', fontSize: '12px', color: '#9CA3AF', textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>No results</p>
            ) : filtered.map(c => (
              <button
                key={c.code}
                type="button"
                onClick={() => { onSelect(c.code); setOpen(false); setSearch('') }}
                style={{
                  width: '100%', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: '8px',
                  background: value === c.code ? '#FFF8F4' : 'transparent',
                  border: 'none', borderBottom: '1px solid #F9FAFB', cursor: 'pointer',
                  fontFamily: 'Cairo, sans-serif', fontSize: '13px', color: '#111827',
                }}
              >
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

const EMPTY_FORM = { name: '', phonePrefix: '+20', phoneLocal: '', email: '', sameWhatsapp: true, whatsappPrefix: '+20', whatsappLocal: '', courseId: '', paymentMethod: 'vodafone_cash' }

// Payment details for manual methods
const MANUAL_PAYMENT_DETAILS = {
  vodafone_cash: { holder: 'Mahmoud A**** S***', number: '01*********' },
  instapay:      { holder: 'Mahmoud A**** S***', number: '01*********' },
}

// ── ModalField — defined outside so React never remounts inputs ──────────────
function ModalField({ label, error, children, required = true }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 font-cairo">
        {label}{required && <span style={{ color: '#FF5C1A' }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1 font-cairo flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </p>
      )}
    </div>
  )
}

const INPUT_BASE = {
  width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '14px',
  fontFamily: 'Cairo, sans-serif', color: '#111827', outline: 'none',
  border: '1.5px solid #E5E7EB', background: '#F9FAFB', direction: 'ltr',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}
function onFocusIn(e)  { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.12)'; e.target.style.background = '#FFFFFF' }
function onFocusOut(e) { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }

function RegistrationModal({ onClose, lang, isRTL, courses, coursesLoading }) {
  const mt = MODAL_T[lang]
  const [form, setForm]               = useState(EMPTY_FORM)
  const [errors, setErrors]           = useState({})
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [serverError, setServerError] = useState('')

  // Receipt upload state
  const [receiptFile, setReceiptFile]           = useState(null)
  const [receiptUrl, setReceiptUrl]             = useState('')
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [receiptError, setReceiptError]         = useState('')

  // Card details state (UI only until Fawry merchant account is ready)
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })

  const isManual = form.paymentMethod === 'vodafone_cash' || form.paymentMethod === 'instapay'
  const isCard   = form.paymentMethod === 'fawry'

  const handleChange = useCallback((e) => {
    const key   = e.target.dataset.formkey
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }, [])

  const setPayment = useCallback((key) => () => {
    setForm((f) => ({ ...f, paymentMethod: key }))
    // Reset receipt + card when switching payment method
    setReceiptFile(null)
    setReceiptUrl('')
    setReceiptError('')
    setCard({ name: '', number: '', expiry: '', cvv: '' })
  }, [])

  const hasCourses = !coursesLoading && courses.length > 0

  async function handleReceiptChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    const MAX = 5 * 1024 * 1024 // 5MB
    if (file.size > MAX) {
      setReceiptError(isRTL ? 'حجم الملف أكبر من 5 ميغابايت' : 'File exceeds 5 MB limit')
      return
    }

    setReceiptFile(file)
    setReceiptError('')
    setUploadingReceipt(true)
    setReceiptUrl('')

    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const urlRes = await fetch(`/api/public/get-receipt-upload-url?ext=${ext}`)
      const urlData = await urlRes.json()
      if (!urlRes.ok || urlData.error) { setReceiptError(mt.receiptError); setUploadingReceipt(false); return }

      const uploadRes = await fetch(urlData.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type, 'x-upsert': 'false' },
      })
      if (!uploadRes.ok) { setReceiptError(mt.receiptError); setUploadingReceipt(false); return }

      setReceiptUrl(urlData.publicUrl)
    } catch {
      setReceiptError(mt.receiptError)
    }
    setUploadingReceipt(false)
  }

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = mt.required
    const phoneDigits = form.phoneLocal.replace(/\D/g, '')
    if (!form.phoneLocal.trim()) {
      e.phone = mt.required
    } else if (phoneDigits.length < 4 || phoneDigits.length > 13) {
      e.phone = isRTL ? 'رقم الهاتف غير صحيح' : 'Invalid phone number'
    }
    if (!form.email.trim()) {
      e.email = mt.required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = isRTL ? 'البريد الإلكتروني غير صحيح (مثال: name@gmail.com)' : 'Invalid email (e.g. name@gmail.com)'
    }
    if (hasCourses && !form.courseId) e.courseId = mt.required
    if (!form.sameWhatsapp && !form.whatsappLocal.trim()) e.whatsapp = mt.required
    if (isManual && !receiptUrl) e.receipt = mt.receiptRequired
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)
    setServerError('')
    try {
      const res = await fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          form.name,
          phone:         form.phonePrefix + form.phoneLocal,
          email:         form.email,
          whatsapp:      form.sameWhatsapp ? (form.phonePrefix + form.phoneLocal) : (form.whatsappPrefix + form.whatsappLocal),
          courseId:      form.courseId || null,
          paymentMethod: form.paymentMethod,
          receiptUrl:    receiptUrl || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setServerError(data.error || 'Something went wrong'); setSubmitting(false); return }
      setSubmitted(true)
    } catch {
      setServerError('Network error. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-3 md:p-6"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal shell — two-panel */}
      <div className="relative z-10 w-full flex overflow-hidden"
        style={{ maxWidth: '760px', maxHeight: '95vh', borderRadius: '16px', boxShadow: '0 40px 100px rgba(0,0,0,0.40)', background: '#FFFFFF' }}>

        {/* ── Left brand panel (hidden on small screens) ── */}
        <div className="hidden md:flex flex-col justify-between flex-shrink-0"
          style={{ width: '220px', background: 'linear-gradient(165deg, #FF5C1A 0%, #C73D08 100%)', padding: '32px 24px' }}>
          {/* Logo area */}
          <div>
            <div style={{ width: '44px', height: '44px', background: 'rgba(255,255,255,0.18)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', padding: '6px' }}>
              <Image src="/logo_mark_white.png" alt="Art Smart Academy" width={44} height={21} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
            </div>
            <h3 style={{ color: '#FFFFFF', fontWeight: 800, fontSize: '17px', lineHeight: 1.3, marginBottom: '8px', fontFamily: 'Cairo, sans-serif' }}>
              Art Smart Academy
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: '12px', lineHeight: 1.6, fontFamily: 'Cairo, sans-serif' }}>
              {isRTL ? 'انضم إلى أكثر من ٥٠٠ طالب وطوّر مهاراتك الإبداعية.' : 'Join 500+ students and develop your creative skills.'}
            </p>
          </div>
          {/* Trust bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(isRTL
              ? ['مدربون خبراء متخصصون', 'شهادات معتمدة', 'مجتمع إبداعي متميز']
              : ['Expert certified trainers', 'Accredited certificates', 'Creative community']
            ).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><polyline points="2 6 5 9 10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '11px', fontFamily: 'Cairo, sans-serif' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '18px', color: '#111827', fontFamily: 'Cairo, sans-serif', margin: 0 }}>{mt.title}</h2>
              <p style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'Cairo, sans-serif', margin: '2px 0 0' }}>{mt.sub}</p>
            </div>
            <button onClick={onClose}
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#F3F4F6', color: '#6B7280', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              ✕
            </button>
          </div>

          {/* Scrollable form/success body */}
          <div style={{ overflowY: 'auto', flex: 1, padding: 'clamp(14px, 4vw, 24px)' }}>

            {submitted ? (
              /* ── SUCCESS STATE ── */
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                {/* Animated check */}
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 28px rgba(255,92,26,0.35)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '22px', color: '#111827', fontFamily: 'Cairo, sans-serif', margin: '0 0 6px' }}>{mt.successTitle}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', fontFamily: 'Cairo, sans-serif', margin: '0 0 24px' }}>{mt.successSub}</p>

                {/* Email highlight */}
                <div style={{ background: '#FFF7ED', border: '1.5px solid #FED7AA', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', textAlign: isRTL ? 'right' : 'left' }}>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: '#C2410C', fontFamily: 'Cairo, sans-serif', margin: '0 0 4px' }}>
                    {isCard
                      ? (isRTL ? '📧 إيميل تأكيد في طريقه إليك!' : '📧 Confirmation email is on its way!')
                      : (isRTL ? '✅ تم استلام طلبك وإيصال الدفع!' : '✅ Registration & receipt received!')}
                  </p>
                  <p style={{ fontSize: '12px', color: '#78350F', fontFamily: 'Cairo, sans-serif', lineHeight: 1.6, margin: 0 }}>
                    {isCard ? mt.successCard : mt.successManual}
                  </p>
                </div>

                {/* Next steps */}
                <div style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', textAlign: isRTL ? 'right' : 'left' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', margin: '0 0 12px' }}>{mt.nextTitle}</p>
                  {[
                    { icon: '📬', text: mt.nextEmail },
                    { icon: '📞', text: mt.nextContact },
                    { icon: '📁', text: mt.nextSpam },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexDirection: isRTL ? 'row' : 'row', marginBottom: i < 2 ? '8px' : 0 }}>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>{s.icon}</span>
                      <p style={{ fontSize: '12px', color: '#374151', fontFamily: 'Cairo, sans-serif', lineHeight: 1.5, margin: 0 }}>{s.text}</p>
                    </div>
                  ))}
                </div>

                <button onClick={onClose}
                  style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', fontFamily: 'Cairo, sans-serif', cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,92,26,0.35)' }}>
                  {mt.close}
                </button>
              </div>
            ) : (
              /* ── FORM ── */
              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

                {/* Section 1 — Personal info */}
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                    {isRTL ? '١ — بياناتك الشخصية' : '1 — Your Information'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <ModalField label={mt.name} error={errors.name}>
                      <input data-formkey="name" type="text" value={form.name} onChange={handleChange}
                        placeholder={mt.namePh} style={INPUT_BASE} onFocus={onFocusIn} onBlur={onFocusOut} />
                    </ModalField>
                    <ModalField label={mt.phone} error={errors.phone}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <CountryDropdown value={form.phonePrefix} onSelect={(code) => setForm(f => ({ ...f, phonePrefix: code }))} />
                        <input data-formkey="phoneLocal" type="tel" inputMode="numeric" value={form.phoneLocal} onChange={handleChange}
                          placeholder="XXXXXXXXXX" style={{ ...INPUT_BASE, flex: 1, minWidth: 0 }} onFocus={onFocusIn} onBlur={onFocusOut} />
                      </div>
                    </ModalField>
                  </div>
                  <ModalField label={mt.email} error={errors.email}>
                    <input data-formkey="email" type="email" value={form.email} onChange={handleChange}
                      placeholder={mt.emailPh} style={INPUT_BASE} onFocus={onFocusIn} onBlur={onFocusOut} />
                  </ModalField>

                  {/* WhatsApp toggle */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '10px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                    <input data-formkey="sameWhatsapp" type="checkbox" checked={form.sameWhatsapp} onChange={handleChange}
                      style={{ width: '15px', height: '15px', accentColor: '#FF5C1A', cursor: 'pointer' }} />
                    <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>{mt.sameWa}</span>
                  </label>
                  {!form.sameWhatsapp && (
                    <div style={{ marginTop: '10px' }}>
                      <ModalField label={mt.whatsapp} error={errors.whatsapp}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <CountryDropdown value={form.whatsappPrefix} onSelect={(code) => setForm(f => ({ ...f, whatsappPrefix: code }))} />
                          <input data-formkey="whatsappLocal" type="tel" inputMode="numeric" value={form.whatsappLocal} onChange={handleChange}
                            placeholder="XXXXXXXXXX" style={{ ...INPUT_BASE, flex: 1 }} onFocus={onFocusIn} onBlur={onFocusOut} />
                        </div>
                      </ModalField>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #F3F4F6' }} />

                {/* Section 2 — Course */}
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                    {isRTL ? '٢ — اختر الكورس' : '2 — Select Course'}
                  </p>
                  <ModalField label={mt.course} error={errors.courseId} required={hasCourses}>
                    {coursesLoading ? (
                      <div style={{ ...INPUT_BASE, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF5C1A" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                        {mt.loadingCourses}
                      </div>
                    ) : courses.length === 0 ? (
                      <div style={{ ...INPUT_BASE, color: '#9CA3AF', fontSize: '12px' }}>
                        {mt.noCourses}
                      </div>
                    ) : (
                      <select data-formkey="courseId" value={form.courseId} onChange={handleChange}
                        style={{ ...INPUT_BASE, cursor: 'pointer', appearance: 'auto' }}
                        onFocus={onFocusIn} onBlur={onFocusOut}>
                        <option value="">{mt.selectCourse}</option>
                        {courses.map((c) => (
                          <option key={c.id} value={c.id}>
                            {lang === 'ar' ? c.name_ar : c.name_en} ({Number(c.price).toLocaleString()} {lang === 'ar' ? 'جنيه' : 'EGP'})
                          </option>
                        ))}
                      </select>
                    )}
                  </ModalField>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid #F3F4F6' }} />

                {/* Section 3 — Payment */}
                <div>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                    {isRTL ? '٣ — طريقة الدفع' : '3 — Payment Method'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {PAYMENT_OPTIONS.map(({ key, ar, en, noteAr, noteEn, color, bg, Logo }) => {
                      const sel      = form.paymentMethod === key
                      const disabled = key === 'fawry'
                      return (
                        <div key={key} style={{ position: 'relative' }}>
                          <button type="button"
                            onClick={disabled ? undefined : setPayment(key)}
                            disabled={disabled}
                            style={{
                              width: '100%',
                              display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px',
                              borderRadius: '12px',
                              border: disabled ? '2px solid #E5E7EB' : sel ? `2px solid ${color}` : '2px solid #E5E7EB',
                              background: disabled ? '#F3F4F6' : sel ? bg : '#F9FAFB',
                              cursor: disabled ? 'not-allowed' : 'pointer',
                              textAlign: isRTL ? 'right' : 'left',
                              transition: 'all 0.15s',
                              boxShadow: (!disabled && sel) ? `0 2px 12px ${color}20` : 'none',
                              flexDirection: isRTL ? 'row-reverse' : 'row',
                              opacity: disabled ? 0.55 : 1,
                            }}>
                            {/* Logo */}
                            <div style={{ width: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Logo />
                            </div>
                            {/* Label */}
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', fontFamily: 'Cairo, sans-serif', color: disabled ? '#9CA3AF' : sel ? color : '#111827' }}>
                                {lang === 'ar' ? ar : en}
                              </p>
                              <p style={{ margin: '2px 0 0', fontSize: '11px', fontFamily: 'Cairo, sans-serif', color: '#9CA3AF' }}>
                                {disabled
                                  ? (isRTL ? 'قريباً — اختر طريقة دفع أخرى' : 'Coming soon — please choose another method')
                                  : (lang === 'ar' ? noteAr : noteEn)
                                }
                              </p>
                            </div>
                            {/* Radio dot or lock icon */}
                            {disabled ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C0C0C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                              </svg>
                            ) : (
                              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: sel ? `5px solid ${color}` : '2px solid #D1D5DB', background: sel ? '#FFFFFF' : 'transparent', flexShrink: 0, transition: 'all 0.15s' }} />
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Section 4a — Card details (Fawry/card payment) */}
                {isCard && (
                  <>
                    <div style={{ borderTop: '1px solid #F3F4F6' }} />
                    <div>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                        {mt.cardDetailsTitle}
                      </p>

                      {/* Visa/MC logos */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div style={{ background: '#F3F4F6', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center' }}>
                          <CardLogo />
                        </div>
                        <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '8px', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#4F46E5', fontFamily: 'Cairo, sans-serif' }}>Fawry Secure</span>
                        </div>
                      </div>

                      {/* Card number */}
                      <div style={{ marginBottom: '10px' }}>
                        <ModalField label={mt.cardNumber} error={null}>
                          <input
                            type="text" inputMode="numeric" maxLength={19}
                            placeholder={mt.cardNumberPh}
                            value={card.number}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
                              const fmt = raw.replace(/(.{4})/g, '$1 ').trim()
                              setCard((c) => ({ ...c, number: fmt }))
                            }}
                            style={{ ...INPUT_BASE, letterSpacing: '2px', fontSize: '15px', fontWeight: 600 }}
                            onFocus={onFocusIn} onBlur={onFocusOut}
                          />
                        </ModalField>
                      </div>

                      {/* Name on card */}
                      <div style={{ marginBottom: '10px' }}>
                        <ModalField label={mt.cardName} error={null}>
                          <input
                            type="text"
                            placeholder={mt.cardNamePh}
                            value={card.name}
                            onChange={(e) => setCard((c) => ({ ...c, name: e.target.value.toUpperCase() }))}
                            style={{ ...INPUT_BASE, textTransform: 'uppercase', letterSpacing: '1px' }}
                            onFocus={onFocusIn} onBlur={onFocusOut}
                          />
                        </ModalField>
                      </div>

                      {/* Expiry + CVV */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <ModalField label={mt.cardExpiry} error={null}>
                          <input
                            type="text" inputMode="numeric" maxLength={5}
                            placeholder={mt.cardExpiryPh}
                            value={card.expiry}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, '').slice(0, 4)
                              const fmt = raw.length > 2 ? raw.slice(0,2) + '/' + raw.slice(2) : raw
                              setCard((c) => ({ ...c, expiry: fmt }))
                            }}
                            style={{ ...INPUT_BASE, letterSpacing: '2px', textAlign: 'center' }}
                            onFocus={onFocusIn} onBlur={onFocusOut}
                          />
                        </ModalField>
                        <ModalField label={mt.cardCvv} error={null}>
                          <input
                            type="password" inputMode="numeric" maxLength={3}
                            placeholder={mt.cardCvvPh}
                            value={card.cvv}
                            onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) }))}
                            style={{ ...INPUT_BASE, letterSpacing: '4px', textAlign: 'center' }}
                            onFocus={onFocusIn} onBlur={onFocusOut}
                          />
                        </ModalField>
                      </div>

                      {/* Coming soon notice */}
                      <div style={{ marginTop: '12px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontSize: '13px', flexShrink: 0 }}>🔒</span>
                        <p style={{ margin: 0, fontSize: '11px', color: '#4338CA', fontFamily: 'Cairo, sans-serif', lineHeight: 1.6, textAlign: isRTL ? 'right' : 'left' }}>
                          {isRTL ? mt.cardComingSoon?.replace('🔒 ', '') : mt.cardComingSoon?.replace('🔒 ', '')}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Section 4b — Payment details + receipt upload (manual methods only) */}
                {isManual && (() => {
                  const details = MANUAL_PAYMENT_DETAILS[form.paymentMethod]
                  const accentColor = form.paymentMethod === 'vodafone_cash' ? '#E60000' : '#6B2FA0'
                  const accentBg    = form.paymentMethod === 'vodafone_cash' ? '#FFF1F1' : '#F5F0FF'
                  const accentBorder = form.paymentMethod === 'vodafone_cash' ? '#FECACA' : '#DDD6FE'
                  const selectedCoursePrice = courses.find(c => String(c.id) === String(form.courseId))?.price
                  const priceLabel = selectedCoursePrice ? `${Number(selectedCoursePrice).toLocaleString()} ${lang === 'ar' ? 'جنيه' : 'EGP'}` : null
                  const payInstruction = lang === 'ar'
                    ? (priceLabel ? `حوّل ${priceLabel} ثم ارفع صورة الإيصال أدناه.` : mt.payDetailsInstruction)
                    : (priceLabel ? `Send ${priceLabel}, then upload your payment screenshot below.` : mt.payDetailsInstruction)
                  return (
                    <>
                      <div style={{ borderTop: '1px solid #F3F4F6' }} />
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: 'Cairo, sans-serif', marginBottom: '12px' }}>
                          {mt.payDetailsTitle}
                        </p>

                        {/* Account details box */}
                        <div style={{ background: accentBg, border: `1.5px solid ${accentBorder}`, borderRadius: '12px', padding: '14px 16px', marginBottom: '14px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>{mt.payDetailsHolder}</span>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: accentColor, fontFamily: 'Cairo, sans-serif', direction: 'ltr' }}>{details.holder}</span>
                            </div>
                            <div style={{ height: '1px', background: accentBorder }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                              <span style={{ fontSize: '11px', color: '#6B7280', fontFamily: 'Cairo, sans-serif' }}>{mt.payDetailsNumber}</span>
                              <span style={{ fontSize: '15px', fontWeight: 800, color: accentColor, fontFamily: 'monospace', letterSpacing: '1px', direction: 'ltr' }}>{details.number}</span>
                            </div>
                          </div>
                          <p style={{ margin: '12px 0 0', fontSize: '11px', color: '#4B5563', fontFamily: 'Cairo, sans-serif', lineHeight: 1.6, textAlign: isRTL ? 'right' : 'left' }}>
                            {payInstruction}
                          </p>
                        </div>

                        {/* Receipt upload area */}
                        <label style={{ display: 'block', cursor: 'pointer' }}>
                          <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={handleReceiptChange} disabled={uploadingReceipt} />
                          <div style={{
                            border: `2px dashed ${errors.receipt ? '#EF4444' : receiptUrl ? '#10B981' : '#D1D5DB'}`,
                            borderRadius: '12px', padding: '16px', textAlign: 'center',
                            background: receiptUrl ? 'rgba(16,185,129,0.05)' : '#FAFAFA',
                            transition: 'all 0.15s', cursor: 'pointer',
                          }}>
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
                        {receiptError && (
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#EF4444', fontFamily: 'Cairo, sans-serif' }}>{receiptError}</p>
                        )}
                        {errors.receipt && !receiptError && (
                          <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#EF4444', fontFamily: 'Cairo, sans-serif' }}>{errors.receipt}</p>
                        )}
                      </div>
                    </>
                  )
                })()}

                {/* Server error */}
                {serverError && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <p style={{ margin: 0, fontSize: '13px', color: '#DC2626', fontFamily: 'Cairo, sans-serif' }}>{serverError}</p>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={submitting || uploadingReceipt}
                  style={{
                    width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                    background: (submitting || uploadingReceipt) ? '#FCA587' : 'linear-gradient(135deg,#FF5C1A,#FF7A40)',
                    color: '#FFFFFF', fontWeight: 800, fontSize: '15px', fontFamily: 'Cairo, sans-serif',
                    cursor: (submitting || uploadingReceipt) ? 'not-allowed' : 'pointer',
                    boxShadow: (submitting || uploadingReceipt) ? 'none' : '0 4px 20px rgba(255,92,26,0.40)',
                    transition: 'all 0.2s',
                  }}>
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

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export { MODAL_T, PAYMENT_OPTIONS, COUNTRY_CODES, CountryDropdown, RegistrationModal }
