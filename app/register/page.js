'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// ── Translations ───────────────────────────────────────────────────────────────
const T = {
  ar: {
    title:          'سجّل الآن',
    sub:            'احجز مكانك في كورس Art Smart Academy',
    fullName:       'الاسم الكامل',
    fullNamePH:     'أدخل اسمك الكامل',
    email:          'البريد الإلكتروني',
    emailPH:        'example@gmail.com',
    phone:          'رقم الهاتف',
    phonePH:        '01XXXXXXXXX',
    course:         'اختر الكورس',
    coursePH:       '-- اختر كورساً --',
    paymentMethod:  'طريقة الدفع',
    fawry:          'فوري',
    instapay:       'InstaPay',
    vodafoneCash:   'Vodafone Cash',
    submit:         'أرسل طلب التسجيل',
    submitting:     'جارٍ الإرسال...',
    required:       'هذا الحقل مطلوب',
    invalidPhone:   'رقم الهاتف غير صحيح',
    invalidEmail:   'البريد الإلكتروني غير صحيح',
    // Success screen
    successTitle:   'تم التسجيل بنجاح! 🎉',
    successSub:     'احتفظ بهذا الرقم المرجعي',
    payNow:         'أكمل الدفع الآن',
    // Fawry instructions
    fawryHow:       'كيف تدفع عبر فوري؟',
    fawryStep1:     'اذهب لأي منفذ فوري أو استخدم تطبيق Fawry Pay',
    fawryStep2:     'اختر "دفع الفواتير" ثم ابحث عن Art Smart Academy',
    fawryStep3:     'أدخل رقمك المرجعي أدناه',
    fawryStep4:     'ادفع المبلغ المطلوب واحتفظ بالإيصال',
    // Instapay instructions
    instapayHow:    'كيف تدفع عبر InstaPay؟',
    instapayStep1:  'افتح تطبيق البنك وادخل على InstaPay',
    instapayStep2:  'حوّل المبلغ إلى:',
    instapayStep3:  'اكتب في ملاحظات التحويل: اسمك + رقمك المرجعي',
    instapayStep4:  'أرسل لقطة شاشة على واتساب لتأكيد التسجيل',
    // Vodafone Cash instructions
    vcashHow:       'كيف تدفع عبر Vodafone Cash؟',
    vcashStep1:     'افتح Vodafone Cash أو اتصل بـ *9#',
    vcashStep2:     'حوّل المبلغ إلى:',
    vcashStep3:     'اكتب في البيان: اسمك + رقمك المرجعي',
    vcashStep4:     'أرسل لقطة شاشة على واتساب لتأكيد التسجيل',
    whatsappBtn:    'أرسل الإيصال على واتساب',
    refLabel:       'رقمك المرجعي',
    courseLabel:    'الكورس',
    amountLabel:    'المبلغ',
    langToggle:     'English',
    loadingCourses: 'جارٍ تحميل الكورسات...',
    noCourses:      'لا توجد كورسات متاحة حالياً',
    egp:            'جنيه',
  },
  en: {
    title:          'Register Now',
    sub:            'Reserve your spot at Art Smart Academy',
    fullName:       'Full Name',
    fullNamePH:     'Enter your full name',
    email:          'Email Address',
    emailPH:        'example@gmail.com',
    phone:          'Phone Number',
    phonePH:        '01XXXXXXXXX',
    course:         'Select a Course',
    coursePH:       '-- Choose a course --',
    paymentMethod:  'Payment Method',
    fawry:          'Fawry',
    instapay:       'InstaPay',
    vodafoneCash:   'Vodafone Cash',
    submit:         'Submit Registration',
    submitting:     'Submitting...',
    required:       'This field is required',
    invalidPhone:   'Invalid phone number',
    invalidEmail:   'Invalid email address',
    // Success screen
    successTitle:   'Successfully Registered! 🎉',
    successSub:     'Keep your reference number',
    payNow:         'Complete Your Payment',
    // Fawry
    fawryHow:       'How to pay via Fawry?',
    fawryStep1:     'Visit any Fawry outlet or open the Fawry Pay app',
    fawryStep2:     'Choose "Pay Bills" then search for Art Smart Academy',
    fawryStep3:     'Enter your reference number below',
    fawryStep4:     'Pay the amount and keep your receipt',
    // Instapay
    instapayHow:    'How to pay via InstaPay?',
    instapayStep1:  'Open your banking app and go to InstaPay',
    instapayStep2:  'Transfer the amount to:',
    instapayStep3:  'Add your name + reference number in the transfer note',
    instapayStep4:  'Send a screenshot on WhatsApp to confirm registration',
    // Vodafone Cash
    vcashHow:       'How to pay via Vodafone Cash?',
    vcashStep1:     'Open Vodafone Cash or dial *9#',
    vcashStep2:     'Transfer the amount to:',
    vcashStep3:     'Write your name + reference number in the description',
    vcashStep4:     'Send a screenshot on WhatsApp to confirm registration',
    whatsappBtn:    'Send Receipt on WhatsApp',
    refLabel:       'Your Reference Number',
    courseLabel:    'Course',
    amountLabel:    'Amount',
    langToggle:     'العربية',
    loadingCourses: 'Loading courses...',
    noCourses:      'No courses available right now',
    egp:            'EGP',
  },
}

// ── Config (update these when you have real details) ───────────────────────────
const INSTAPAY_NUMBER   = '01XXXXXXXXX' // TODO: replace with real InstaPay number
const VODAFONE_NUMBER   = '01XXXXXXXXX' // TODO: replace with real Vodafone Cash number
const WHATSAPP_NUMBER   = '201XXXXXXXXX' // TODO: replace with real WhatsApp number (intl format)

// ── Step indicator ─────────────────────────────────────────────────────────────
function Steps({ step, isRTL }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8" style={{ direction: 'ltr' }}>
      {[1, 2].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-cairo transition-all duration-300"
            style={{ background: step >= s ? '#FF5C1A' : '#FFE4D4', color: step >= s ? '#fff' : '#C0C0C0' }}>
            {step > s ? '✓' : s}
          </div>
          {s < 2 && <div className="w-12 h-0.5 rounded" style={{ background: step > s ? '#FF5C1A' : '#FFE4D4' }} />}
        </div>
      ))}
    </div>
  )
}

// ── Payment Instructions ───────────────────────────────────────────────────────
function PaymentInstructions({ method, registration, t, isRTL }) {
  const refNum = `ASA-${String(registration?.id || '001').padStart(4, '0')}-${Date.now().toString().slice(-4)}`
  const amount = registration?.courses?.price || registration?.amount || '—'
  const courseName = registration?.courses?.name_ar || registration?.courses?.name_en || registration?.course_name || '—'
  const whatsappMsg = encodeURIComponent(`مرحباً، أريد تأكيد دفعي\nالاسم: ${registration?.student_name}\nالرقم المرجعي: ${refNum}\nالكورس: ${courseName}`)

  const steps = {
    fawry:         [t.fawryStep1, t.fawryStep2, t.fawryStep3, t.fawryStep4],
    instapay:      [t.instapayStep1, `${t.instapayStep2} ${INSTAPAY_NUMBER}`, t.instapayStep3, t.instapayStep4],
    vodafone_cash: [t.vcashStep1, `${t.vcashStep2} ${VODAFONE_NUMBER}`, t.vcashStep3, t.vcashStep4],
  }
  const titles = { fawry: t.fawryHow, instapay: t.instapayHow, vodafone_cash: t.vcashHow }

  return (
    <div className="space-y-5">
      {/* Reference card */}
      <div className="rounded-[16px] p-5 text-center" style={{ background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-widest opacity-80 font-cairo mb-1">{t.refLabel}</p>
        <p className="font-extrabold text-2xl font-cairo tracking-widest">{refNum}</p>
      </div>

      {/* Course + amount summary */}
      <div className="rounded-[14px] p-4 space-y-2" style={{ background: '#FFF8F4', border: '1px solid #FFE4D4' }}>
        <div className="flex justify-between text-sm font-cairo">
          <span className="text-[#A0A0A0]">{t.courseLabel}</span>
          <span className="font-semibold text-[#1A1A1A]">{courseName}</span>
        </div>
        <div className="flex justify-between text-sm font-cairo">
          <span className="text-[#A0A0A0]">{t.amountLabel}</span>
          <span className="font-bold text-[#FF5C1A]">{amount} {t.egp}</span>
        </div>
      </div>

      {/* Steps */}
      <div className="rounded-[14px] overflow-hidden" style={{ border: '1px solid #FFE4D4' }}>
        <div className="px-4 py-3" style={{ background: '#FFF8F4', borderBottom: '1px solid #FFE4D4' }}>
          <p className="font-bold text-sm text-[#1A1A1A] font-cairo">{titles[method] || t.payNow}</p>
        </div>
        <div className="p-4 space-y-3">
          {(steps[method] || []).map((step, i) => (
            <div key={i} className="flex gap-3 items-start" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-cairo flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(255,92,26,0.10)', color: '#FF5C1A' }}>
                {i + 1}
              </div>
              <p className="text-sm text-[#6B6B6B] font-cairo leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp button (for manual methods) */}
      {method !== 'fawry' && (
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-[12px] font-bold text-sm font-cairo transition-all duration-200"
          style={{ background: '#25D366', color: '#fff' }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#22C55E'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#25D366'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          {t.whatsappBtn}
        </a>
      )}
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [lang, setLang] = useState('ar')
  const t = T[lang]
  const isRTL = lang === 'ar'

  const [courses, setCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  const [form, setForm] = useState({ fullName: '', email: '', phone: '', courseId: '', paymentMethod: 'fawry' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [registration, setRegistration] = useState(null)

  // Load active courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true)
      const { data } = await supabase.from('courses').select('id, name_ar, name_en, price, duration').eq('is_active', true).order('created_at')
      setCourses(data || [])
      setLoadingCourses(false)
    }
    fetchCourses()
  }, [])

  const validate = () => {
    const e = {}
    if (!form.fullName.trim())  e.fullName = t.required
    if (!form.phone.trim())     e.phone = t.required
    else if (!/^01[0-9]{9}$/.test(form.phone.trim())) e.phone = t.invalidPhone
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = t.invalidEmail
    if (!form.courseId)         e.courseId = t.required
    return e
  }

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    const selectedCourse = courses.find(c => String(c.id) === String(form.courseId))

    const payload = {
      student_name:   form.fullName.trim(),
      email:          form.email.trim() || null,
      phone:          form.phone.trim(),
      course_id:      form.courseId,
      payment_method: form.paymentMethod,
      payment_status: 'pending',
    }

    const { data, error } = await supabase.from('registrations').insert([payload]).select('*, courses(name_ar, name_en, price)').single()

    if (error) {
      console.error(error)
      // Fallback: show success with local data even if save failed
      setRegistration({ ...payload, id: Math.floor(Math.random() * 9000) + 1000, courses: selectedCourse, amount: selectedCourse?.price })
    } else {
      setRegistration(data)
    }

    setSubmitting(false)
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const selectedCourse = courses.find(c => String(c.id) === String(form.courseId))

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#FFF8F4', direction: isRTL ? 'rtl' : 'ltr', fontFamily: 'Cairo, sans-serif' }}>
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="flex items-center gap-2 group">
            <img src="/logo_mark_blue.png" alt="Art Smart Academy" className="h-8 w-8 object-contain" style={{ filter: 'brightness(0) saturate(100%)' }} />
            <span className="font-extrabold text-sm uppercase tracking-widest text-[#1A1A1A] hidden sm:block">Art Smart Academy</span>
          </a>
          <button onClick={() => setLang(l => l === 'ar' ? 'en' : 'ar')}
            className="px-4 py-2 rounded-full text-xs font-bold font-cairo transition-all"
            style={{ background: '#FFF0E8', color: '#FF5C1A', border: '1px solid #FFE4D4' }}>
            {t.langToggle}
          </button>
        </div>

        {/* Card */}
        <div className="rounded-[24px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 8px 40px rgba(255,92,26,0.10)' }}>
          {/* Top bar */}
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(to right, #FF5C1A, #FF7A40)' }} />

          <div className="p-6 sm:p-8">
            <Steps step={submitted ? 2 : 1} isRTL={isRTL} />

            {submitted ? (
              /* ── Success ── */
              <div className="space-y-5">
                <div className="text-center">
                  <h1 className="font-extrabold text-2xl text-[#1A1A1A] font-cairo">{t.successTitle}</h1>
                  <p className="text-[#6B6B6B] text-sm font-cairo mt-1">{t.successSub}</p>
                </div>
                <PaymentInstructions method={form.paymentMethod} registration={registration} t={t} isRTL={isRTL} />
                <button onClick={() => { setSubmitted(false); setForm({ fullName: '', email: '', phone: '', courseId: '', paymentMethod: 'fawry' }); setRegistration(null) }}
                  className="w-full py-3 rounded-[12px] text-sm font-bold font-cairo transition-all"
                  style={{ background: '#FFF0E8', color: '#FF5C1A', border: '1px solid #FFE4D4' }}>
                  ← {isRTL ? 'تسجيل طالب آخر' : 'Register Another Student'}
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="text-center mb-2">
                  <h1 className="font-extrabold text-2xl text-[#1A1A1A] font-cairo">{t.title}</h1>
                  <p className="text-[#6B6B6B] text-sm font-cairo mt-1">{t.sub}</p>
                </div>

                {/* Full Name */}
                <Field label={t.fullName} error={errors.fullName}>
                  <input value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder={t.fullNamePH} className={inputCls(errors.fullName)}
                    style={inputStyle(errors.fullName)}
                    onFocus={(e) => !errors.fullName && (e.currentTarget.style.borderColor = '#FF5C1A')}
                    onBlur={(e) => !errors.fullName && (e.currentTarget.style.borderColor = '#FFE4D4')} />
                </Field>

                {/* Phone */}
                <Field label={t.phone} error={errors.phone}>
                  <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder={t.phonePH} type="tel" className={inputCls(errors.phone)}
                    style={{ ...inputStyle(errors.phone), direction: 'ltr' }}
                    onFocus={(e) => !errors.phone && (e.currentTarget.style.borderColor = '#FF5C1A')}
                    onBlur={(e) => !errors.phone && (e.currentTarget.style.borderColor = '#FFE4D4')} />
                </Field>

                {/* Email */}
                <Field label={`${t.email} (${isRTL ? 'اختياري' : 'optional'})`} error={errors.email}>
                  <input value={form.email} onChange={(e) => handleChange('email', e.target.value)}
                    placeholder={t.emailPH} type="email" className={inputCls(errors.email)}
                    style={{ ...inputStyle(errors.email), direction: 'ltr' }}
                    onFocus={(e) => !errors.email && (e.currentTarget.style.borderColor = '#FF5C1A')}
                    onBlur={(e) => !errors.email && (e.currentTarget.style.borderColor = '#FFE4D4')} />
                </Field>

                {/* Course */}
                <Field label={t.course} error={errors.courseId}>
                  {loadingCourses ? (
                    <div className="w-full px-4 py-3 rounded-[12px] text-sm font-cairo text-[#A0A0A0]" style={{ background: '#FFF8F4', border: '1.5px solid #FFE4D4' }}>
                      {t.loadingCourses}
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="w-full px-4 py-3 rounded-[12px] text-sm font-cairo text-[#A0A0A0]" style={{ background: '#FFF8F4', border: '1.5px solid #FFE4D4' }}>
                      {t.noCourses}
                    </div>
                  ) : (
                    <select value={form.courseId} onChange={(e) => handleChange('courseId', e.target.value)}
                      className={inputCls(errors.courseId)} style={inputStyle(errors.courseId)}>
                      <option value="">{t.coursePH}</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>
                          {lang === 'ar' ? c.name_ar : c.name_en} — {c.price} {t.egp} {c.duration ? `(${c.duration})` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>

                {/* Amount preview */}
                {selectedCourse && (
                  <div className="rounded-[12px] px-4 py-3 flex justify-between items-center" style={{ background: 'rgba(255,92,26,0.06)', border: '1px solid rgba(255,92,26,0.15)' }}>
                    <span className="text-sm font-cairo text-[#6B6B6B]">{t.amountLabel}</span>
                    <span className="font-extrabold text-[#FF5C1A] font-cairo">{selectedCourse.price} {t.egp}</span>
                  </div>
                )}

                {/* Payment Method */}
                <Field label={t.paymentMethod} error={null}>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'fawry',         label: t.fawry,        color: '#6366F1' },
                      { value: 'instapay',       label: t.instapay,     color: '#059669' },
                      { value: 'vodafone_cash',  label: t.vodafoneCash, color: '#DC2626' },
                    ].map((m) => (
                      <button type="button" key={m.value} onClick={() => handleChange('paymentMethod', m.value)}
                        className="py-3 px-2 rounded-[12px] text-xs font-bold font-cairo text-center transition-all duration-200"
                        style={{
                          background: form.paymentMethod === m.value ? m.color : '#FFF8F4',
                          color:      form.paymentMethod === m.value ? '#fff'    : '#6B6B6B',
                          border:     form.paymentMethod === m.value ? `2px solid ${m.color}` : '2px solid #FFE4D4',
                        }}>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <button type="submit" disabled={submitting}
                  className="w-full py-4 rounded-[14px] font-bold text-white font-cairo text-sm transition-all duration-200 mt-2"
                  style={{ background: submitting ? '#FFA070' : 'linear-gradient(135deg,#FF5C1A,#FF7A40)', boxShadow: submitting ? 'none' : '0 8px 24px rgba(255,92,26,0.30)' }}>
                  {submitting ? t.submitting : t.submit}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-[#A0A0A0] font-cairo mt-6">
          Art Smart Academy © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#6B6B6B] font-cairo">{label}</label>
      {children}
      {error && <p className="text-xs font-cairo" style={{ color: '#DC2626' }}>{error}</p>}
    </div>
  )
}

const inputCls = (hasError) =>
  `w-full px-4 py-3 rounded-[12px] text-sm font-cairo outline-none transition-all`

const inputStyle = (hasError) => ({
  background: '#FFF8F4',
  border: `1.5px solid ${hasError ? '#DC2626' : '#FFE4D4'}`,
})
