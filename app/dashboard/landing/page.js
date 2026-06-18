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
        className="relative w-full max-w-lg rounded-[20px] p-6 z-10"
        style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 20px 60px rgba(255,92,26,0.20)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#1A1A1A] text-lg font-cairo">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-[#1A1A1A] transition-colors"
            style={{ background: '#FFF0E8' }}
          >
            ✕
          </button>
        </div>
        {children}
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

const EMPTY_FORM = { name_ar: '', name_en: '', price: '', duration: '', seats: '', is_active: true }

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
    setForm({ name_ar: c.name_ar, name_en: c.name_en, price: c.price, duration: c.duration, seats: c.seats, is_active: c.is_active })
    setSelectedCourse(c)
    setModal('edit')
  }
  const openDelete = (c) => { setSelectedCourse(c); setModal('delete') }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const token = await getToken()
      const body = modal === 'add'
        ? { name_ar: form.name_ar, name_en: form.name_en, price: form.price, duration: form.duration, seats: form.seats, is_active: form.is_active }
        : { id: selectedCourse.id, name_ar: form.name_ar, name_en: form.name_en, price: form.price, duration: form.duration, seats: form.seats, is_active: form.is_active }
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

  return (
    <div className="space-y-5">
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
                  className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200"
                  style={{ background: course.is_active ? '#FF5C1A' : '#E5E7EB' }}
                >
                  <span
                    className="inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                    style={{ transform: course.is_active ? 'translateX(24px)' : 'translateX(4px)' }}
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
            </div>
          ))}
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? t.addNewCourse : t.editCourse} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label={t.fieldNameAr} value={form.name_ar} onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))} placeholder="التفكير الإبداعي" />
            <Field label={t.fieldNameEn} value={form.name_en} onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))} placeholder="Creative Thinking" />
            <div className="grid grid-cols-3 gap-3">
              <Field label={t.fieldPrice} type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="2500" />
              <Field label={t.fieldDuration} value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="8 weeks" />
              <Field label={t.fieldSeats} type="number" min="0" value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} placeholder="20" />
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
          setLinks((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(SOCIAL_DEFAULTS).filter((k) => result.settings[k] !== undefined).map((k) => [k, result.settings[k]])) }))
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
  ]

  return (
    <>
      <Toast toast={toast} />

      <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
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
      </div>
    </>
  )
}
