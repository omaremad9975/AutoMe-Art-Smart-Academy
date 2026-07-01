'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useDashboardLang } from '@/lib/dashboard-lang'

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null
  const isSuccess = toast.type === 'success'
  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '560px',
        padding: '14px 20px',
        borderRadius: '12px',
        background: isSuccess ? '#059669' : '#DC2626',
        color: '#FFFFFF',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        fontFamily: 'Cairo, sans-serif',
        animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <span style={{ fontSize: '18px', lineHeight: 1.2, flexShrink: 0 }}>
        {isSuccess ? '✓' : '✕'}
      </span>
      <div>
        <p style={{ fontWeight: 700, fontSize: '14px', margin: 0 }}>{toast.title}</p>
        {toast.description && (
          <p style={{ fontWeight: 400, fontSize: '12px', margin: '2px 0 0', opacity: 0.88 }}>
            {toast.description}
          </p>
        )}
      </div>
    </div>
  )
}

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-lg rounded-[20px] z-10 flex flex-col"
        style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 20px 60px rgba(255,92,26,0.20)', maxHeight: '90vh' }}
      >
        <div className="flex items-center justify-between p-6 pb-4 flex-shrink-0">
          <h3 className="font-bold text-[#1A1A1A] text-lg font-cairo">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-[#1A1A1A] transition-colors"
            style={{ background: '#FFF0E8' }}
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 pb-6" style={{ minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Form Field ─────────────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, min }) {
  return (
    <div>
      <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
        style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }}
        onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
        onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }}
      />
    </div>
  )
}

// ── Settings Field (with current-value indicator) ──────────────────────────────
function SettingsField({ label, id, type = 'text', value, onChange, placeholder, isRTL, currentValue }) {
  const isDirty = currentValue !== undefined && value !== currentValue
  return (
    <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
      <label htmlFor={id} className="block text-[#1A1A1A] font-bold text-sm mb-1 font-cairo">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
        style={{ border: isDirty ? '1.5px solid #F59E0B' : '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr', textAlign: 'left' }}
        onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
        onBlur={(e) => { e.target.style.borderColor = isDirty ? '#F59E0B' : '#FFE4D4'; e.target.style.boxShadow = 'none' }}
      />
      {currentValue && (
        <p className="text-xs font-cairo mt-1.5 flex items-center gap-1.5" style={{ direction: 'ltr' }}>
          <span style={{ color: '#A0A0A0' }}>{isRTL ? 'الحالي:' : 'Current:'}</span>
          <span style={{ color: isDirty ? '#F59E0B' : '#6B6B6B', fontWeight: isDirty ? 600 : 400, textDecoration: isDirty ? 'line-through' : 'none' }}>
            {currentValue}
          </span>
          {isDirty && <span style={{ color: '#FF5C1A', fontWeight: 600 }}>→ {value}</span>}
        </p>
      )}
    </div>
  )
}

const COURSE_ICONS = [
  { key: 'art',       labelEn: 'Art',       emoji: '🎨', bg: '#F3E8FF', color: '#9333EA' },
  { key: 'ai',        labelEn: 'AI',        emoji: '🤖', bg: '#DBEAFE', color: '#3B82F6' },
  { key: 'languages', labelEn: 'Languages', emoji: '🌐', bg: '#D1FAE5', color: '#059669' },
  { key: 'sports',    labelEn: 'Sports',    emoji: '🏆', bg: '#FFE4E6', color: '#E11D48' },
  { key: 'other',     labelEn: 'Other',     emoji: '⭐', bg: '#FFF0E8', color: '#FF5C1A' },
]

const EMPTY_FORM = { name_ar: '', name_en: '', price: '', duration_number: '', duration_unit: 'weeks', seats: '', is_active: true, whatsapp_group_url: '', description_ar: '', description_en: '', instructor_ar: '', instructor_en: '', image_url: '', icon_key: 'other' }

const SOCIAL_DEFAULTS = {
  social_facebook:  '',
  social_instagram: '',
  social_tiktok:    '',
  social_youtube:   '',
}

const ACADEMY_DEFAULTS = {
  academy_name: 'Art Smart Academy | أرت سمارت اكاديمي',
  phone:        '+20 100 000 0000',
  email:        'info@artsmartacademy.com',
  whatsapp:     '+20 100 000 0000',
}

// ── Helper ─────────────────────────────────────────────────────────────────────
async function getToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || ''
}

// ── Courses Section ─────────────────────────────────────────────────────────────
function CoursesSection() {
  const { t } = useDashboardLang()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [saving, setSaving] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [uploadingCertFor, setUploadingCertFor] = useState(null) // course id being uploaded
  const [uploadingCourseImage, setUploadingCourseImage] = useState(false)
  const certInputRef = useRef(null)
  const courseImageInputRef = useRef(null)
  const [pendingCertCourseId, setPendingCertCourseId] = useState(null)

  const fetchCourses = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/courses', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) setError(data.error)
      else setCourses(data.courses || [])
    } catch {
      setError('Failed to load courses')
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchCourses() }, [fetchCourses])

  const openAdd = () => { setForm(EMPTY_FORM); setSelectedCourse(null); setModal('add') }
  const openEdit = (c) => {
    // Parse existing duration string (e.g. "8 أسابيع" or "4 Weeks") into number + unit
    const durMatch = (c.duration || '').match(/^(\d+)/)
    const durNum = durMatch ? durMatch[1] : ''
    const durLower = (c.duration || '').toLowerCase()
    const durUnit = durLower.includes('day') || durLower.includes('يوم') || durLower.includes('أيام') ? 'days'
                  : durLower.includes('month') || durLower.includes('شهر') || durLower.includes('أشهر') ? 'months'
                  : 'weeks'
    setForm({ name_ar: c.name_ar, name_en: c.name_en, price: c.price, duration_number: durNum, duration_unit: durUnit, seats: c.seats, is_active: c.is_active, whatsapp_group_url: c.whatsapp_group_url || '', description_ar: c.description_ar || '', description_en: c.description_en || '', instructor_ar: c.instructor_ar || '', instructor_en: c.instructor_en || '', image_url: c.image_url || '', icon_key: c.icon_key || 'other' })
    setSelectedCourse(c)
    setModal('edit')
  }
  const openDelete = (c) => { setSelectedCourse(c); setModal('delete') }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const token = await getToken()
      const UNIT_LABELS = { weeks: 'أسابيع', days: 'أيام', months: 'أشهر' }
      const duration = form.duration_number ? `${form.duration_number} ${UNIT_LABELS[form.duration_unit] || 'أسابيع'}` : ''
      const commonFields = {
        name_ar: form.name_ar, name_en: form.name_en, price: form.price, duration, seats: form.seats,
        is_active: form.is_active, whatsapp_group_url: form.whatsapp_group_url || null,
        description_ar: form.description_ar || null, description_en: form.description_en || null,
        instructor_ar: form.instructor_ar || null, instructor_en: form.instructor_en || null,
        image_url: form.image_url || null, icon_key: form.icon_key || 'other',
      }
      const body = modal === 'add' ? commonFields : { id: selectedCourse.id, ...commonFields }
      const res = await fetch('/api/admin/courses', {
        method: modal === 'add' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setSaving(false); return }
      await fetchCourses()
      setModal(null)
    } catch {
      setError('Failed to save course')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: selectedCourse.id }),
      })
      if (res.ok) { await fetchCourses(); setModal(null) }
      else { const d = await res.json(); setError(d.error) }
    } catch { setError('Failed to delete') }
    setSaving(false)
  }

  const toggleActive = async (course) => {
    setTogglingId(course.id)
    try {
      const token = await getToken()
      await fetch('/api/admin/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: course.id, is_active: !course.is_active }),
      })
      setCourses((prev) => prev.map((c) => c.id === course.id ? { ...c, is_active: !c.is_active } : c))
    } catch {}
    setTogglingId(null)
  }

  const triggerCertUpload = (courseId) => {
    setPendingCertCourseId(courseId)
    certInputRef.current?.click()
  }

  const handleCertFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !pendingCertCourseId) return
    e.target.value = ''

    setUploadingCertFor(pendingCertCourseId)
    const courseId = pendingCertCourseId
    setPendingCertCourseId(null)

    try {
      const token = await getToken()
      const ext = file.name.split('.').pop().toLowerCase()

      // 1. Get signed upload URL (avoids Vercel 4.5MB body limit)
      const urlRes = await fetch(`/api/admin/get-upload-url?bucket=certificate-templates&ext=${ext}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const urlData = await urlRes.json()
      if (!urlRes.ok || urlData.error) { setError(urlData.error || 'Upload failed'); setUploadingCertFor(null); return }

      // 2. Upload directly to Supabase Storage
      const uploadRes = await fetch(urlData.signedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type, 'x-upsert': 'false' },
      })
      if (!uploadRes.ok) { setError(`Storage error: ${uploadRes.status}`); setUploadingCertFor(null); return }

      // 3. Save URL to course
      const patchRes = await fetch('/api/admin/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: courseId, certificate_template_url: urlData.publicUrl }),
      })
      if (patchRes.ok) {
        setCourses((prev) => prev.map((c) => c.id === courseId ? { ...c, certificate_template_url: urlData.publicUrl } : c))
      }
    } catch (err) {
      setError(err?.message || 'Upload failed')
    }
    setUploadingCertFor(null)
  }

  const removeCert = async (courseId) => {
    try {
      const token = await getToken()
      await fetch('/api/admin/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: courseId, certificate_template_url: null }),
      })
      setCourses((prev) => prev.map((c) => c.id === courseId ? { ...c, certificate_template_url: null } : c))
    } catch {}
  }

  const handleCourseImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setUploadingCourseImage(true)
    try {
      const token = await getToken()
      const ext = file.name.split('.').pop().toLowerCase()
      const urlRes = await fetch(`/api/admin/get-upload-url?bucket=course-images&ext=${ext}`, { headers: { Authorization: `Bearer ${token}` } })
      const urlData = await urlRes.json()
      if (!urlRes.ok || urlData.error) { setUploadingCourseImage(false); return }
      const uploadRes = await fetch(urlData.signedUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type, 'x-upsert': 'false' } })
      if (uploadRes.ok) setForm((f) => ({ ...f, image_url: urlData.publicUrl }))
    } catch {}
    setUploadingCourseImage(false)
  }

  return (
    <div className="space-y-5">
      {/* Hidden inputs */}
      <input ref={certInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf" style={{ display: 'none' }} onChange={handleCertFileChange} />
      <input ref={courseImageInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: 'none' }} onChange={handleCourseImageUpload} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B6B6B] font-cairo">
          {courses.length} {t.courses}
        </p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)', boxShadow: '0 4px 16px rgba(255,92,26,0.30)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,92,26,0.40)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,92,26,0.30)' }}
        >
          {t.addCourse}
        </button>
      </div>

      {error && (
        <div className="rounded-[12px] p-4 text-sm font-cairo text-red-700" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 rounded-[16px] animate-pulse" style={{ background: '#FFE4D4' }} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-[16px] flex flex-col items-center justify-center py-20 gap-4" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4' }}>
          <div className="text-5xl">📚</div>
          <p className="text-[#A0A0A0] font-cairo text-sm">{t.noCoursesYet}</p>
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-sm font-bold text-white font-cairo" style={{ background: '#FF5C1A' }}>
            {t.addCourse}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="relative overflow-hidden rounded-[16px] p-5 flex flex-col gap-4 transition-all duration-200"
              style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: course.is_active ? 'linear-gradient(to right, #FF5C1A, #FF7A40)' : '#E5E7EB' }} />
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full font-cairo"
                  style={{
                    background: course.is_active ? 'rgba(16,185,129,0.10)' : 'rgba(156,163,175,0.15)',
                    color: course.is_active ? '#059669' : '#9CA3AF',
                  }}
                >
                  {course.is_active ? `● ${t.active}` : `○ ${t.inactive}`}
                </span>
                <button
                  onClick={() => toggleActive(course)}
                  disabled={togglingId === course.id}
                  style={{ background: course.is_active ? '#FF5C1A' : '#E5E7EB', width: '44px', height: '24px', borderRadius: '999px', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s', padding: 0, overflow: 'hidden' }}
                >
                  <span
                    style={{ display: 'block', width: '16px', height: '16px', borderRadius: '50%', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', position: 'absolute', top: '4px', transition: 'left 0.2s', left: course.is_active ? '24px' : '4px' }}
                  />
                </button>
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A1A] text-base font-cairo leading-tight">{course.name_ar}</h3>
                <p className="text-[#6B6B6B] text-sm font-cairo mt-0.5">{course.name_en}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t.price,    value: `EGP ${Number(course.price).toLocaleString()}` },
                  { label: t.duration, value: course.duration },
                  { label: t.seats,    value: course.seats },
                ].map((m) => (
                  <div key={m.label} className="rounded-[8px] p-2.5 text-center" style={{ background: '#FFF8F4' }}>
                    <p className="text-[#1A1A1A] font-bold text-sm font-cairo">{m.value}</p>
                    <p className="text-[#A0A0A0] text-[10px] font-cairo">{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => openEdit(course)}
                  className="flex-1 py-2 rounded-[8px] text-xs font-bold font-cairo transition-all duration-200"
                  style={{ background: 'rgba(255,92,26,0.08)', color: '#FF5C1A', border: '1px solid rgba(255,92,26,0.20)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,92,26,0.14)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,92,26,0.08)'}
                >
                  {t.edit}
                </button>
                <button
                  onClick={() => openDelete(course)}
                  className="flex-1 py-2 rounded-[8px] text-xs font-bold font-cairo transition-all duration-200"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.20)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                >
                  {t.delete}
                </button>
              </div>

              {/* Certificate Template */}
              <div className="rounded-[10px] p-3" style={{ background: '#FFF8F4', border: '1px dashed #FFD0B0' }}>
                <p className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo mb-2">
                  📜 Certificate Template
                </p>
                {course.certificate_template_url ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={course.certificate_template_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-xs font-semibold font-cairo truncate"
                      style={{ color: '#FF5C1A' }}
                    >
                      ↗ View Template
                    </a>
                    <button
                      onClick={() => triggerCertUpload(course.id)}
                      disabled={uploadingCertFor === course.id}
                      className="text-xs font-bold font-cairo px-2 py-1 rounded-[6px]"
                      style={{ background: 'rgba(255,92,26,0.10)', color: '#FF5C1A' }}
                    >
                      {uploadingCertFor === course.id ? '...' : 'Replace'}
                    </button>
                    <button
                      onClick={() => removeCert(course.id)}
                      className="text-xs font-bold font-cairo px-2 py-1 rounded-[6px]"
                      style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626' }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => triggerCertUpload(course.id)}
                    disabled={uploadingCertFor === course.id}
                    className="w-full text-xs font-bold font-cairo py-1.5 rounded-[6px] transition-all"
                    style={{ background: 'rgba(255,92,26,0.08)', color: '#FF5C1A', border: '1px solid rgba(255,92,26,0.20)' }}
                  >
                    {uploadingCertFor === course.id ? 'Uploading...' : '+ Upload Certificate Design'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? t.addNewCourse : t.editCourse} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label={t.fieldNameAr} value={form.name_ar} onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))} placeholder="التفكير الإبداعي" />
            <Field label={t.fieldNameEn} value={form.name_en} onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))} placeholder="Creative Thinking" />

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#6B6B6B] font-cairo mb-1.5">📝 الوصف (عربي)</label>
              <textarea rows={Math.max(3, Math.min(12, Math.ceil((form.description_ar || '').length / 50)))} value={form.description_ar} onChange={(e) => setForm((f) => ({ ...f, description_ar: e.target.value }))} placeholder="وصف مختصر للكورس بالعربية..." className="w-full px-3 py-2.5 rounded-[10px] text-sm font-cairo outline-none resize-y" style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'rtl', minHeight: '72px' }} onFocus={(e) => e.target.style.borderColor = '#FF5C1A'} onBlur={(e) => e.target.style.borderColor = '#FFE4D4'} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6B6B6B] font-cairo mb-1.5">📝 Description (English)</label>
              <textarea rows={Math.max(3, Math.min(12, Math.ceil((form.description_en || '').length / 55)))} value={form.description_en} onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))} placeholder="Brief course description in English..." className="w-full px-3 py-2.5 rounded-[10px] text-sm font-cairo outline-none resize-y" style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', minHeight: '72px' }} onFocus={(e) => e.target.style.borderColor = '#FF5C1A'} onBlur={(e) => e.target.style.borderColor = '#FFE4D4'} />
            </div>

            {/* Instructor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#6B6B6B] font-cairo mb-1.5">👤 اسم المدرب (عربي)</label>
                <input value={form.instructor_ar} onChange={(e) => setForm((f) => ({ ...f, instructor_ar: e.target.value }))} placeholder="د. محمد أحمد" className="w-full px-3 py-2.5 rounded-[10px] text-sm font-cairo outline-none" style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'rtl' }} onFocus={(e) => e.target.style.borderColor = '#FF5C1A'} onBlur={(e) => e.target.style.borderColor = '#FFE4D4'} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B6B6B] font-cairo mb-1.5">👤 Instructor Name (EN)</label>
                <input value={form.instructor_en} onChange={(e) => setForm((f) => ({ ...f, instructor_en: e.target.value }))} placeholder="Dr. Mohamed Ahmed" className="w-full px-3 py-2.5 rounded-[10px] text-sm font-cairo outline-none" style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }} onFocus={(e) => e.target.style.borderColor = '#FF5C1A'} onBlur={(e) => e.target.style.borderColor = '#FFE4D4'} />
              </div>
            </div>

            {/* Price / Duration / Seats */}
            <div className="grid grid-cols-3 gap-3">
              <Field label={t.fieldPrice} type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="2500" />
              <div>
                <label className="block text-xs font-bold text-[#6B6B6B] font-cairo mb-1.5">{t.fieldDuration}</label>
                <div className="flex gap-1">
                  <input type="number" min="1" value={form.duration_number} onChange={(e) => setForm((f) => ({ ...f, duration_number: e.target.value }))} placeholder="8" className="w-16 px-2 py-2.5 rounded-[10px] text-sm font-cairo outline-none text-center" style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }} onFocus={(e) => e.target.style.borderColor = '#FF5C1A'} onBlur={(e) => e.target.style.borderColor = '#FFE4D4'} />
                  <select value={form.duration_unit} onChange={(e) => setForm((f) => ({ ...f, duration_unit: e.target.value }))} className="flex-1 px-2 py-2.5 rounded-[10px] text-xs font-cairo outline-none" style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', color: '#1A1A1A' }}>
                    <option value="weeks">أسابيع</option>
                    <option value="days">أيام</option>
                    <option value="months">أشهر</option>
                  </select>
                </div>
              </div>
              <Field label={t.fieldSeats} type="number" min="0" value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} placeholder="20" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#6B6B6B] font-cairo mb-1.5">
                💬 WhatsApp Group Link
              </label>
              <input
                type="url"
                value={form.whatsapp_group_url}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp_group_url: e.target.value }))}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full px-3 py-2.5 rounded-[10px] text-sm font-cairo outline-none transition-all duration-200"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', color: '#1A1A1A' }}
                onFocus={(e) => e.target.style.borderColor = '#FF5C1A'}
                onBlur={(e) => e.target.style.borderColor = '#FFE4D4'}
              />
              <p className="text-[10px] text-[#A0A0A0] font-cairo mt-1">اختياري — يُضاف تلقائياً لإيميل التأكيد إذا كان موجوداً</p>
            </div>
            {/* Course Hero Image */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#6B6B6B] font-cairo">🖼️ صورة الهيرو / Hero Image</label>
                <span className="text-[10px] text-[#A0A0A0] font-cairo">الأبعاد المثالية: 1200 × 400px</span>
              </div>
              {form.image_url ? (
                <div className="relative rounded-[10px] overflow-hidden" style={{ height: '90px', border: '1.5px solid #FFE4D4' }}>
                  <img src={form.image_url} alt="hero" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                    <button type="button" onClick={() => courseImageInputRef.current?.click()} disabled={uploadingCourseImage} className="px-3 py-1.5 rounded-[8px] text-xs font-bold text-white font-cairo" style={{ background: 'rgba(255,92,26,0.85)' }}>
                      {uploadingCourseImage ? '...' : 'استبدال'}
                    </button>
                    <button type="button" onClick={() => setForm((f) => ({ ...f, image_url: '' }))} className="px-3 py-1.5 rounded-[8px] text-xs font-bold text-white font-cairo" style={{ background: 'rgba(220,38,38,0.85)' }}>
                      حذف
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => courseImageInputRef.current?.click()} disabled={uploadingCourseImage}
                  className="w-full py-4 rounded-[10px] text-xs font-bold font-cairo transition-all"
                  style={{ border: '2px dashed #FFE4D4', background: '#FFF8F4', color: uploadingCourseImage ? '#A0A0A0' : '#FF5C1A' }}>
                  {uploadingCourseImage ? 'جارٍ الرفع...' : '+ رفع صورة هيرو'}
                </button>
              )}
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-bold text-[#6B6B6B] font-cairo mb-2">🎯 Course Category Icon</label>
              <div className="flex gap-2 flex-wrap">
                {COURSE_ICONS.map((ic) => (
                  <button
                    key={ic.key}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, icon_key: ic.key }))}
                    className="flex flex-col items-center gap-1 px-3 py-2 rounded-[10px] transition-all duration-200 font-cairo"
                    style={{
                      background: form.icon_key === ic.key ? ic.bg : '#FFF8F4',
                      border: form.icon_key === ic.key ? `2px solid ${ic.color}` : '2px solid #FFE4D4',
                      minWidth: '60px',
                    }}
                  >
                    <span style={{ fontSize: '22px' }}>{ic.emoji}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: form.icon_key === ic.key ? ic.color : '#9CA3AF' }}>{ic.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200"
                style={{ background: form.is_active ? '#FF5C1A' : '#E5E7EB' }}
              >
                <span className="inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200" style={{ transform: form.is_active ? 'translateX(24px)' : 'translateX(4px)' }} />
              </button>
              <span className="text-sm font-semibold text-[#6B6B6B] font-cairo">{t.fieldActive} / Active</span>
            </div>
            {error && <p className="text-xs font-semibold font-cairo py-2 px-3 rounded-[8px]" style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626' }}>{error}</p>}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-[#6B6B6B] font-cairo" style={{ border: '1.5px solid #FFE4D4' }}>{t.cancel}</button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name_ar || !form.name_en}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo"
                style={{ background: saving ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)', opacity: (!form.name_ar || !form.name_en) ? 0.6 : 1 }}
              >
                {saving ? t.saving : modal === 'add' ? t.addCourse : t.save}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && (
        <Modal title={t.deleteCourse} onClose={() => setModal(null)}>
          <div className="space-y-5">
            <div className="rounded-[12px] p-4 text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-2xl mb-2">⚠️</p>
              <p className="font-semibold text-[#1A1A1A] font-cairo text-sm">
                {t.deleteConfirm} <strong>&ldquo;{selectedCourse?.name_en}&rdquo;</strong>?
              </p>
              <p className="text-xs text-[#A0A0A0] font-cairo mt-1">{t.deleteWarning}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-[#6B6B6B] font-cairo" style={{ border: '1.5px solid #FFE4D4' }}>{t.cancel}</button>
              <button onClick={handleDelete} disabled={saving} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo" style={{ background: saving ? '#FCA5A5' : '#DC2626' }}>
                {saving ? t.deleting : t.delete}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── Social Media Section ───────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  { key: 'social_facebook',  label: 'Facebook',  icon: '📘', color: '#1877F2', placeholder: 'https://facebook.com/...' },
  { key: 'social_instagram', label: 'Instagram', icon: '📸', color: '#E1306C', placeholder: 'https://instagram.com/...' },
  { key: 'social_tiktok',    label: 'TikTok',    icon: '🎵', color: '#000000', placeholder: 'https://tiktok.com/...' },
  { key: 'social_youtube',   label: 'YouTube',   icon: '▶️', color: '#FF0000', placeholder: 'https://youtube.com/...' },
]

function SocialSection({ showToast }) {
  const { t, isRTL } = useDashboardLang()
  const [links, setLinks] = useState(SOCIAL_DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        const res = await fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
        const result = await res.json()
        if (result.settings) {
          setLinks({
            social_facebook:  result.settings.social_facebook  || '',
            social_instagram: result.settings.social_instagram || '',
            social_tiktok:    result.settings.social_tiktok    || '',
            social_youtube:   result.settings.social_youtube   || '',
          })
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(links),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        showToast('error', isRTL ? 'فشل الحفظ' : 'Save Failed', result.error)
      } else {
        showToast('success', isRTL ? 'تم الحفظ بنجاح' : 'Links Saved', isRTL ? 'تم تحديث روابط التواصل' : 'Social links updated successfully')
      }
    } catch (err) {
      showToast('error', isRTL ? 'خطأ في الشبكة' : 'Network Error', err?.message)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-[12px] animate-pulse" style={{ background: '#FFE4D4' }} />)}</div>
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[16px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #FFE4D4', background: '#FFF8F4' }}>
          <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">{t.socialTitle}</h2>
          <p className="text-xs text-[#A0A0A0] font-cairo mt-0.5">{t.socialSub}</p>
        </div>
        <div className="p-6 space-y-5">
          {SOCIAL_LINKS.map((social) => (
            <div key={social.key}>
              <label className="flex items-center gap-2 text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">
                <span>{social.icon}</span>
                <span>{social.label}</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={links[social.key] || ''}
                  onChange={(e) => setLinks((l) => ({ ...l, [social.key]: e.target.value }))}
                  placeholder={social.placeholder}
                  className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
                  style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr' }}
                  onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }}
                />
                {links[social.key] && (
                  <a
                    href={links[social.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold font-cairo px-2 py-1 rounded-[6px] transition-all"
                    style={{ color: social.color, background: `${social.color}14`, border: `1px solid ${social.color}30` }}
                  >
                    ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-[10px] text-sm font-bold text-white font-cairo transition-all duration-200"
          style={{ background: saving ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)', boxShadow: saving ? 'none' : '0 4px 16px rgba(255,92,26,0.30)' }}
          onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,92,26,0.40)' } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = saving ? 'none' : '0 4px 16px rgba(255,92,26,0.30)' }}
        >
          {saving ? t.saving : t.saveSocial}
        </button>
      </div>
    </div>
  )
}

// ── Gallery Section ────────────────────────────────────────────────────────────
function GallerySection({ showToast }) {
  const { isRTL } = useDashboardLang()
  const [photos, setPhotos]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [uploading, setUploading]     = useState(false)
  const [captionModal, setCaptionModal] = useState(null) // { id, caption_ar, caption_en }
  const fileInputRef = useRef(null)

  const [galleryError, setGalleryError] = useState(null)
  const [videoModal, setVideoModal]   = useState(false)
  const [videoUrl, setVideoUrl]       = useState('')
  const [videoAdding, setVideoAdding] = useState(false)
  const [dragSrc, setDragSrc]         = useState(null)
  const [dragOver, setDragOver]       = useState(null)

  const fetchPhotos = useCallback(async () => {
    setLoading(true)
    setGalleryError(null)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/gallery', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) { setGalleryError(data.error || `Error ${res.status}`); setLoading(false); return }
      setPhotos(data.photos || [])
    } catch (err) {
      setGalleryError(err?.message || 'Network error')
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchPhotos() }, [fetchPhotos])

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    e.target.value = ''
    setUploading(true)
    try {
      const token = await getToken()
      for (const file of files) {
        const ext = file.name.split('.').pop().toLowerCase()

        // 1. Get a signed upload URL from the server (file never passes through serverless function)
        const urlRes = await fetch(`/api/admin/get-upload-url?bucket=gallery&ext=${ext}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const urlData = await urlRes.json()
        if (!urlRes.ok || urlData.error) { showToast('error', 'Upload Failed', urlData.error); continue }

        // 2. Upload DIRECTLY to Supabase Storage (bypasses Vercel 4.5MB body limit)
        const uploadRes = await fetch(urlData.signedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type, 'x-upsert': 'false' },
        })
        if (!uploadRes.ok) { showToast('error', 'Upload Failed', `Storage error: ${uploadRes.status}`); continue }

        // 3. Save URL to gallery_photos table
        const addRes = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ url: urlData.publicUrl, sort_order: photos.length }),
        })
        const addData = await addRes.json()
        if (addData.photo) setPhotos((prev) => [...prev, addData.photo])
      }
      showToast('success', isRTL ? 'تم الرفع بنجاح' : 'Photos Uploaded', isRTL ? 'تمت إضافة الصور إلى المعرض' : 'Photos added to the gallery')
    } catch (err) {
      showToast('error', 'Error', err?.message)
    }
    setUploading(false)
  }

  const handleAddVideo = async () => {
    const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (!ytMatch) { showToast('error', 'Invalid URL', isRTL ? 'رابط يوتيوب غير صحيح' : 'Please enter a valid YouTube URL'); return }
    setVideoAdding(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ url: videoUrl.trim(), video_url: videoUrl.trim(), sort_order: photos.length }),
      })
      const data = await res.json()
      if (data.photo) setPhotos((prev) => [...prev, data.photo])
      showToast('success', isRTL ? 'تمت الإضافة' : 'Video Added', isRTL ? 'تمت إضافة الفيديو إلى المعرض' : 'Video added to the gallery')
      setVideoModal(false)
      setVideoUrl('')
    } catch (err) {
      showToast('error', 'Error', err?.message)
    }
    setVideoAdding(false)
  }

  const handleDrop = async (dropIndex) => {
    if (dragSrc === null || dragSrc === dropIndex) { setDragSrc(null); setDragOver(null); return }
    const reordered = [...photos]
    const [moved] = reordered.splice(dragSrc, 1)
    reordered.splice(dropIndex, 0, moved)
    setPhotos(reordered)
    setDragSrc(null)
    setDragOver(null)
    try {
      const token = await getToken()
      await Promise.all(reordered.map((p, i) =>
        fetch('/api/admin/gallery', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: p.id, sort_order: i }),
        })
      ))
      showToast('success', isRTL ? 'تم حفظ الترتيب' : 'Order Saved', '')
    } catch (err) {
      showToast('error', 'Error', err?.message)
    }
  }

  const handleDelete = async (photo) => {
    try {
      const token = await getToken()
      // Delete from DB
      await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: photo.id }),
      })
      // Try to delete from storage too (best effort — extract filename from URL)
      try {
        const url = new URL(photo.url)
        const pathParts = url.pathname.split('/object/public/gallery/')
        if (pathParts[1]) {
          await fetch('/api/admin/upload-to-storage', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ bucket: 'gallery', path: pathParts[1] }),
          })
        }
      } catch {}
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
      showToast('success', isRTL ? 'تم الحذف' : 'Photo Deleted', '')
    } catch (err) {
      showToast('error', 'Error', err?.message)
    }
  }

  const handleSaveCaptions = async () => {
    if (!captionModal) return
    try {
      const token = await getToken()
      await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: captionModal.id, caption_ar: captionModal.caption_ar, caption_en: captionModal.caption_en }),
      })
      setPhotos((prev) => prev.map((p) => p.id === captionModal.id ? { ...p, caption_ar: captionModal.caption_ar, caption_en: captionModal.caption_en } : p))
      showToast('success', isRTL ? 'تم الحفظ' : 'Caption Saved', '')
      setCaptionModal(null)
    } catch (err) {
      showToast('error', 'Error', err?.message)
    }
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleUpload} />

      <div className="rounded-[16px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #FFE4D4', background: '#FFF8F4', direction: isRTL ? 'rtl' : 'ltr' }}>
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">
              {isRTL ? 'معرض الصور' : 'Event Gallery'}
            </h2>
            <p className="text-xs text-[#A0A0A0] font-cairo mt-0.5">
              {isRTL ? 'صور المؤتمر والفعاليات التي تظهر في الصفحة الرئيسية' : 'Conference and event photos shown in the home page carousel'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVideoModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-bold font-cairo transition-all"
              style={{ background: '#FFF0EB', color: '#FF5C1A', border: '1.5px solid #FFD0B8' }}
            >
              ▶ {isRTL ? '+ إضافة فيديو' : '+ Add Video'}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-bold text-white font-cairo transition-all"
              style={{ background: uploading ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)', boxShadow: uploading ? 'none' : '0 4px 12px rgba(255,92,26,0.25)' }}
            >
              {uploading ? (isRTL ? 'جارٍ الرفع...' : 'Uploading...') : (isRTL ? '+ رفع صور' : '+ Upload Photos')}
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-video rounded-[12px] animate-pulse" style={{ background: '#FFE4D4' }} />
              ))}
            </div>
          ) : galleryError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="text-4xl">⚠️</div>
              <p className="text-xs font-semibold font-cairo text-center px-4" style={{ color: '#DC2626' }}>Gallery load error: {galleryError}</p>
              <button onClick={fetchPhotos} className="px-4 py-2 rounded-full text-xs font-bold text-white font-cairo" style={{ background: '#FF5C1A' }}>Retry</button>
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="text-5xl">🖼️</div>
              <p className="text-[#A0A0A0] font-cairo text-sm">
                {isRTL ? 'لا توجد صور بعد. ارفع صور لتظهر في القائمة الدوارة.' : 'No photos yet. Upload photos to show in the carousel.'}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2 rounded-full text-sm font-bold text-white font-cairo"
                style={{ background: '#FF5C1A' }}
              >
                {isRTL ? 'رفع الصور' : 'Upload Photos'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, idx) => {
                const ytId = photo.video_url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]
                const thumbSrc = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : photo.url
                return (
                <div
                  key={photo.id}
                  className="relative rounded-[12px] overflow-hidden"
                  style={{ aspectRatio: '16/9', outline: dragOver === idx ? '2.5px solid #FF5C1A' : '2.5px solid transparent', opacity: dragSrc === idx ? 0.45 : 1, transition: 'opacity 0.15s, outline 0.15s', userSelect: 'none' }}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; setDragSrc(idx) }}
                  onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOver(idx) }}
                  onDrop={(e) => { e.preventDefault(); handleDrop(idx) }}
                  onDragEnd={() => { setDragSrc(null); setDragOver(null) }}
                >
                  {/* Drag handle — grab to reorder */}
                  <div style={{ position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, cursor: 'grab', background: 'rgba(0,0,0,0.50)', borderRadius: '6px', padding: '4px 10px', display: 'flex', gap: '3px', alignItems: 'center' }}>
                    {[0,1,2].map(r => <div key={r} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>{[0,1].map(d => <div key={d} style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#fff' }} />)}</div>)}
                  </div>
                  <img src={thumbSrc} alt={photo.caption_en || ''} className="w-full h-full object-cover" />
                  {ytId && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.25)' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,92,26,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px', paddingLeft: '3px' }}>▶</div>
                    </div>
                  )}
                  {/* Edit caption button */}
                  <button
                    onClick={() => setCaptionModal({ id: photo.id, caption_ar: photo.caption_ar || '', caption_en: photo.caption_en || '' })}
                    title={isRTL ? 'تعديل التسمية' : 'Edit Caption'}
                    style={{ position: 'absolute', top: '6px', left: '6px', width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,92,26,0.88)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10 }}
                  >✏️</button>
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(photo)}
                    title={isRTL ? 'حذف' : 'Delete'}
                    style={{ position: 'absolute', top: '6px', right: '6px', width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(220,38,38,0.88)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', zIndex: 10 }}
                  >🗑️</button>
                  {/* Caption badge */}
                  {(photo.caption_ar || photo.caption_en) && (
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/50">
                      <p className="text-white text-[10px] font-cairo truncate">
                        {isRTL ? photo.caption_ar : photo.caption_en}
                      </p>
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Video modal */}
      {videoModal && (
        <Modal title={isRTL ? 'إضافة فيديو يوتيوب' : 'Add YouTube Video'} onClose={() => { setVideoModal(false); setVideoUrl('') }}>
          <div className="space-y-4">
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">
                {isRTL ? 'رابط الفيديو' : 'YouTube Video URL'}
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr' }}
                onFocus={(e) => { e.target.style.borderColor = '#FF5C1A' }}
                onBlur={(e) => { e.target.style.borderColor = '#FFE4D4' }}
              />
              <p className="text-xs text-[#A0A0A0] font-cairo mt-1">
                {isRTL ? 'ادعم: youtube.com/watch?v=... أو youtu.be/...' : 'Supports: youtube.com/watch?v=... or youtu.be/...'}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setVideoModal(false); setVideoUrl('') }}
                className="px-4 py-2 rounded-[10px] text-sm font-bold font-cairo"
                style={{ background: '#F9FAFB', color: '#6B7280', border: '1.5px solid #E5E7EB' }}
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleAddVideo}
                disabled={videoAdding || !videoUrl.trim()}
                className="px-4 py-2 rounded-[10px] text-sm font-bold text-white font-cairo"
                style={{ background: (videoAdding || !videoUrl.trim()) ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}
              >
                {videoAdding ? (isRTL ? 'جارٍ الإضافة...' : 'Adding...') : (isRTL ? 'إضافة الفيديو' : 'Add Video')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Video modal */}
      {videoModal && (
        <Modal title={isRTL ? 'إضافة فيديو يوتيوب' : 'Add YouTube Video'} onClose={() => { setVideoModal(false); setVideoUrl('') }}>
          <div className="space-y-4">
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">
                {isRTL ? 'رابط الفيديو' : 'YouTube Video URL'}
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr' }}
                onFocus={(e) => { e.target.style.borderColor = '#FF5C1A' }}
                onBlur={(e) => { e.target.style.borderColor = '#FFE4D4' }}
              />
              <p className="text-xs text-[#A0A0A0] font-cairo mt-1">
                {isRTL ? 'ادعم: youtube.com/watch?v=... أو youtu.be/...' : 'Supports: youtube.com/watch?v=... or youtu.be/...'}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setVideoModal(false); setVideoUrl('') }} className="px-4 py-2 rounded-[10px] text-sm font-bold font-cairo" style={{ background: '#F9FAFB', color: '#6B7280', border: '1.5px solid #E5E7EB' }}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleAddVideo} disabled={videoAdding || !videoUrl.trim()} className="px-4 py-2 rounded-[10px] text-sm font-bold text-white font-cairo" style={{ background: (videoAdding || !videoUrl.trim()) ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}>
                {videoAdding ? (isRTL ? 'جارٍ الإضافة...' : 'Adding...') : (isRTL ? 'إضافة الفيديو' : 'Add Video')}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Caption edit modal */}
      {captionModal && (
        <Modal title={isRTL ? 'تعديل التسمية التوضيحية' : 'Edit Caption'} onClose={() => setCaptionModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">Caption (Arabic)</label>
              <input
                type="text"
                value={captionModal.caption_ar}
                onChange={(e) => setCaptionModal((m) => ({ ...m, caption_ar: e.target.value }))}
                placeholder="وصف الصورة بالعربية"
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'rtl' }}
                onFocus={(e) => { e.target.style.borderColor = '#FF5C1A' }}
                onBlur={(e) => { e.target.style.borderColor = '#FFE4D4' }}
              />
            </div>
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">Caption (English)</label>
              <input
                type="text"
                value={captionModal.caption_en}
                onChange={(e) => setCaptionModal((m) => ({ ...m, caption_en: e.target.value }))}
                placeholder="Photo caption in English"
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr' }}
                onFocus={(e) => { e.target.style.borderColor = '#FF5C1A' }}
                onBlur={(e) => { e.target.style.borderColor = '#FFE4D4' }}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setCaptionModal(null)} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-[#6B6B6B] font-cairo" style={{ border: '1.5px solid #FFE4D4' }}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleSaveCaptions} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo" style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}>
                {isRTL ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── Academy Info Section ────────────────────────────────────────────────────────
function AcademyInfoSection({ showToast }) {
  const { isRTL } = useDashboardLang()
  const [info, setInfo]             = useState(ACADEMY_DEFAULTS)
  const [savedInfo, setSavedInfo]   = useState(ACADEMY_DEFAULTS)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken()
        const res = await fetch('/api/admin/settings', { headers: { Authorization: `Bearer ${token}` } })
        const result = await res.json()
        if (result.settings) {
          const patch = Object.fromEntries(
            Object.keys(ACADEMY_DEFAULTS)
              .filter((k) => result.settings[k] !== undefined)
              .map((k) => [k, result.settings[k]])
          )
          setInfo((prev) => ({ ...prev, ...patch }))
          setSavedInfo((prev) => ({ ...prev, ...patch }))
        }
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(info),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        showToast('error',
          isRTL ? 'فشل الحفظ' : 'Save Failed',
          result.error || (isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred')
        )
      } else {
        setSavedInfo(info)
        showToast('success',
          isRTL ? 'تم الحفظ بنجاح' : 'Changes Saved',
          isRTL ? 'تم تحديث معلومات الأكاديمية وستظهر في الموقع فوراً' : 'Academy info updated and will reflect on the site immediately'
        )
      }
    } catch (err) {
      showToast('error',
        isRTL ? 'خطأ في الشبكة' : 'Network Error',
        err?.message || (isRTL ? 'تعذّر الاتصال بالخادم' : 'Could not reach the server')
      )
    }
    setSaving(false)
  }

  const set = (key) => (e) => setInfo((s) => ({ ...s, [key]: e.target.value }))

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-14 rounded-[12px] animate-pulse" style={{ background: '#FFE4D4' }} />)}
      </div>
    )
  }

  return (
    <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="rounded-[16px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #FFE4D4', background: '#FFF8F4', textAlign: isRTL ? 'right' : 'left' }}>
          <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">{isRTL ? 'معلومات الأكاديمية' : 'Academy Information'}</h2>
          <p className="text-xs text-[#A0A0A0] font-cairo">{isRTL ? 'هذه المعلومات تظهر في الموقع مباشرةً بعد الحفظ' : 'These details appear live on the website after saving'}</p>
        </div>
        <div className="p-6 space-y-5">
          <SettingsField
            id="academy_name"
            label={isRTL ? 'اسم الأكاديمية' : 'Academy Name'}
            value={info.academy_name}
            onChange={set('academy_name')}
            placeholder="Art Smart Academy | أرت سمارت اكاديمي"
            isRTL={isRTL}
            currentValue={savedInfo.academy_name}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SettingsField
              id="phone"
              label={isRTL ? 'رقم الهاتف' : 'Phone Number'}
              type="tel"
              value={info.phone}
              onChange={set('phone')}
              placeholder="+20 100 000 0000"
              isRTL={isRTL}
              currentValue={savedInfo.phone}
            />
            <SettingsField
              id="whatsapp"
              label={isRTL ? 'واتساب' : 'WhatsApp'}
              type="tel"
              value={info.whatsapp}
              onChange={set('whatsapp')}
              placeholder="+20 100 000 0000"
              isRTL={isRTL}
              currentValue={savedInfo.whatsapp}
            />
          </div>
          <SettingsField
            id="email"
            label={isRTL ? 'البريد الإلكتروني' : 'Email Address'}
            type="email"
            value={info.email}
            onChange={set('email')}
            placeholder="info@artsmartacademy.com"
            isRTL={isRTL}
            currentValue={savedInfo.email}
          />
        </div>
      </div>

      <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 rounded-[10px] text-sm font-bold text-white font-cairo transition-all duration-200"
          style={{ background: saving ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)', boxShadow: saving ? 'none' : '0 4px 16px rgba(255,92,26,0.30)' }}
          onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,92,26,0.40)' } }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = saving ? 'none' : '0 4px 16px rgba(255,92,26,0.30)' }}
        >
          {saving ? (isRTL ? 'جارٍ الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
        </button>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { t, isRTL } = useDashboardLang()
  const [activeTab, setActiveTab] = useState('courses')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const showToast = (type, title, description) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ type, title, description })
    toastTimer.current = setTimeout(() => setToast(null), 4500)
  }

  const tabs = [
    { key: 'courses', label: t.tabCourses },
    { key: 'social',  label: t.tabSocial },
    { key: 'academy', label: isRTL ? 'معلومات الأكاديمية' : 'Academy Info' },
    { key: 'gallery', label: isRTL ? 'معرض الصور' : 'Gallery' },
  ]

  return (
    <>
      <Toast toast={toast} />

      <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
        <div>
          <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">{t.landingTitle}</h1>
          <p className="text-[#6B6B6B] text-sm font-cairo mt-1">{t.landingSub}</p>
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 p-1 rounded-[12px] w-fit" style={{ background: '#FFF0E8', border: '1px solid #FFE4D4' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="px-5 py-2.5 rounded-[10px] text-sm font-bold font-cairo transition-all duration-200"
              style={{
                background: activeTab === tab.key ? '#FFFFFF' : 'transparent',
                color: activeTab === tab.key ? '#FF5C1A' : '#6B6B6B',
                boxShadow: activeTab === tab.key ? '0 2px 8px rgba(255,92,26,0.12)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'courses' && <CoursesSection />}
        {activeTab === 'social'  && <SocialSection showToast={showToast} />}
        {activeTab === 'academy' && <AcademyInfoSection showToast={showToast} />}
        {activeTab === 'gallery' && <GallerySection showToast={showToast} />}
      </div>
    </>
  )
}
