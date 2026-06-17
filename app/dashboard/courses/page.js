'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

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

const EMPTY_FORM = { name_ar: '', name_en: '', price: '', duration: '', seats: '', is_active: true }

// ── Courses Page ───────────────────────────────────────────────────────────────
export default function CoursesPage() {
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
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setCourses(data || [])
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
    const payload = {
      name_ar: form.name_ar,
      name_en: form.name_en,
      price: parseFloat(form.price) || 0,
      duration: form.duration,
      seats: parseInt(form.seats) || 0,
      is_active: form.is_active,
    }

    let error
    if (modal === 'add') {
      ({ error } = await supabase.from('courses').insert([payload]))
    } else {
      ({ error } = await supabase.from('courses').update(payload).eq('id', selectedCourse.id))
    }

    if (error) setError(error.message)
    else { await fetchCourses(); setModal(null) }
    setSaving(false)
  }

  const handleDelete = async () => {
    setSaving(true)
    const { error } = await supabase.from('courses').delete().eq('id', selectedCourse.id)
    if (error) setError(error.message)
    else { await fetchCourses(); setModal(null) }
    setSaving(false)
  }

  const toggleActive = async (course) => {
    setTogglingId(course.id)
    const { error } = await supabase
      .from('courses')
      .update({ is_active: !course.is_active })
      .eq('id', course.id)
    if (!error) setCourses((prev) => prev.map((c) => c.id === course.id ? { ...c, is_active: !c.is_active } : c))
    setTogglingId(null)
  }

  return (
    <div className="space-y-6" style={{ direction: 'ltr' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">Courses</h1>
          <p className="text-[#6B6B6B] text-sm font-cairo mt-1">{courses.length} courses — الكورسات</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)', boxShadow: '0 4px 16px rgba(255,92,26,0.30)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,92,26,0.40)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,92,26,0.30)' }}
        >
          + Add Course
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-[12px] p-4 text-sm font-cairo text-red-700" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.20)' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 rounded-[16px] animate-pulse" style={{ background: '#FFE4D4' }} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div
          className="rounded-[16px] flex flex-col items-center justify-center py-20 gap-4"
          style={{ background: '#FFFFFF', border: '1px solid #FFE4D4' }}
        >
          <div className="text-5xl">📚</div>
          <p className="text-[#A0A0A0] font-cairo text-sm">No courses yet. Add your first course!</p>
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-sm font-bold text-white font-cairo" style={{ background: '#FF5C1A' }}>
            + Add Course
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
                  {course.is_active ? '● Active' : '○ Inactive'}
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
                  { label: 'Price', value: `EGP ${Number(course.price).toLocaleString()}` },
                  { label: 'Duration', value: course.duration },
                  { label: 'Seats', value: course.seats },
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
                  ✏️ Edit
                </button>
                <button
                  onClick={() => openDelete(course)}
                  className="flex-1 py-2 rounded-[8px] text-xs font-bold font-cairo transition-all duration-200"
                  style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.20)' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add New Course' : 'Edit Course'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Field label="Course Name (Arabic) — الاسم بالعربية" value={form.name_ar} onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))} placeholder="التفكير الإبداعي" />
            <Field label="Course Name (English)" value={form.name_en} onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value }))} placeholder="Creative Thinking" />
            <div className="grid grid-cols-3 gap-3">
              <Field label="Price (EGP)" type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="2500" />
              <Field label="Duration" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} placeholder="8 weeks" />
              <Field label="Seats" type="number" min="0" value={form.seats} onChange={(e) => setForm((f) => ({ ...f, seats: e.target.value }))} placeholder="20" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm((f) => ({ ...f, is_active: !f.is_active }))}
                className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200"
                style={{ background: form.is_active ? '#FF5C1A' : '#E5E7EB' }}
              >
                <span
                  className="inline-block w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
                  style={{ transform: form.is_active ? 'translateX(24px)' : 'translateX(4px)' }}
                />
              </button>
              <span className="text-sm font-semibold text-[#6B6B6B] font-cairo">Active / فعّال</span>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-[#6B6B6B] font-cairo"
                style={{ border: '1.5px solid #FFE4D4' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name_ar || !form.name_en}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo transition-all duration-200"
                style={{ background: saving ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)', opacity: (!form.name_ar || !form.name_en) ? 0.6 : 1 }}
              >
                {saving ? 'Saving...' : modal === 'add' ? 'Add Course' : 'Save Changes'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm Modal ── */}
      {modal === 'delete' && (
        <Modal title="Delete Course" onClose={() => setModal(null)}>
          <div className="space-y-5">
            <div className="rounded-[12px] p-4 text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-2xl mb-2">⚠️</p>
              <p className="font-semibold text-[#1A1A1A] font-cairo text-sm">
                Are you sure you want to delete <strong>&ldquo;{selectedCourse?.name_en}&rdquo;</strong>?
              </p>
              <p className="text-xs text-[#A0A0A0] font-cairo mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-[#6B6B6B] font-cairo"
                style={{ border: '1.5px solid #FFE4D4' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo"
                style={{ background: saving ? '#FCA5A5' : '#DC2626' }}
              >
                {saving ? 'Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
