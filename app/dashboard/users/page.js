'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useDashboardLang } from '@/lib/dashboard-lang'
import { formatDateTime } from '@/lib/export'

// ── Modal ──────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-[20px] p-6 z-10"
        style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 20px 60px rgba(255,92,26,0.20)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-[#1A1A1A] text-lg font-cairo">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#A0A0A0]"
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

// ── Role Badge ─────────────────────────────────────────────────────────────────
function RoleBadge({ role, isRTL }) {
  const styles = {
    super_admin: { bg: 'rgba(99,102,241,0.10)', color: '#6366F1', border: 'rgba(99,102,241,0.20)', label: isRTL ? 'أدمن' : 'Admin' },
    admin:       { bg: 'rgba(99,102,241,0.10)', color: '#6366F1', border: 'rgba(99,102,241,0.20)', label: isRTL ? 'أدمن' : 'Admin' },
    marketing:   { bg: 'rgba(16,185,129,0.10)', color: '#059669', border: 'rgba(16,185,129,0.20)', label: isRTL ? 'تسويق' : 'Marketing' },
  }
  const s = styles[role] || styles.admin
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-cairo"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {s.label}
    </span>
  )
}

// ── Password Input ─────────────────────────────────────────────────────────────
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder || '••••••••'}
        className="w-full px-4 py-2.5 pr-12 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
        style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }}
        onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
        onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
        style={{ color: '#A0A0A0' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#FF5C1A'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#A0A0A0'}
      >
        {show ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const { t, isRTL } = useDashboardLang()
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' })
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [currentUserEmail, setCurrentUserEmail] = useState('')

  const fetchAdmins = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setAdmins([]); setLoading(false); return }

      const res = await fetch('/api/admin/admins', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const result = await res.json()
      setAdmins(result.admins || [])
    } catch {
      setAdmins([])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAdmins()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUserEmail(data.user.email)
    })
  }, [fetchAdmins])

  // ── Add User via API route ─────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!form.email)    { setError('Email is required'); return }
    if (!form.password) { setError('Password is required'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }

    setSaving(true)
    setError('')

    try {
      // Get the current session token to pass to the API
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setError('Your session expired — please log in again'); setSaving(false); return }

      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ email: form.email, password: form.password, role: form.role }),
      })

      const result = await res.json()

      if (!res.ok) {
        setError(result.error || 'Something went wrong')
        setSaving(false)
        return
      }

      setSaving(false)
      setModal(false)
      setForm({ email: '', password: '', role: 'admin' })
      fetchAdmins()

    } catch (err) {
      setError('Network error — please try again')
      setSaving(false)
    }
  }

  // ── Delete User via API route ──────────────────────────────────────────────
  const handleDelete = async () => {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ adminId: deleteTarget.id, authId: deleteTarget.auth_id || null }),
      })

      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'Failed to delete user')
        setSaving(false)
        return
      }
    } catch {
      // Fallback: just remove from admins table directly
      await supabase.from('admins').delete().eq('id', deleteTarget.id)
    }

    setSaving(false)
    setDeleteTarget(null)
    fetchAdmins()
  }

  const COLUMNS = [t.colUser, t.colEmail2, t.colRole, t.colJoined, t.colActions]

  return (
    <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">{t.usersTitle}</h1>
          <p className="text-[#6B6B6B] text-sm font-cairo mt-1">{admins.length} — {t.usersSub}</p>
        </div>
        <button
          onClick={() => { setForm({ email: '', password: '', role: 'admin' }); setError(''); setModal(true) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo"
          style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)', boxShadow: '0 4px 16px rgba(255,92,26,0.30)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {t.addUser}
        </button>
      </div>

      {/* Role Legend */}
      <div className="flex flex-wrap gap-3 p-4 rounded-[12px]" style={{ background: 'rgba(255,92,26,0.04)', border: '1px solid rgba(255,92,26,0.12)' }}>
        <div className="flex items-start gap-2.5">
          <div className="text-xs font-cairo text-[#6B6B6B] space-y-1">
            <p><strong className="text-[#6366F1]">Admin</strong> — {isRTL ? 'وصول كامل لجميع الصفحات' : 'Full access to all pages'}</p>
            <p><strong className="text-[#059669]">Marketing</strong> — {isRTL ? 'التسجيلات فقط' : 'Registrations page only'}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-[16px] overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 24px rgba(255,92,26,0.06)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FFF8F4', borderBottom: '1px solid #FFE4D4' }}>
                {COLUMNS.map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo whitespace-nowrap"
                    style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #FFF0E8' }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded animate-pulse" style={{ background: '#FFE4D4', width: j === 0 ? '40px' : '120px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-[#A0A0A0] font-cairo text-sm">
                    {t.noUsers}
                  </td>
                </tr>
              ) : (
                admins.map((admin, i) => (
                  <tr
                    key={admin.id}
                    className="transition-colors duration-150"
                    style={{ borderBottom: i < admins.length - 1 ? '1px solid #FFF0E8' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FFF8F4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Avatar */}
                    <td className="px-5 py-4">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm font-cairo"
                        style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}
                      >
                        {admin.email?.[0]?.toUpperCase()}
                      </div>
                    </td>
                    {/* Email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1A1A1A] font-cairo">{admin.email}</span>
                        {admin.email === currentUserEmail && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-cairo" style={{ background: '#FFF0E8', color: '#FF5C1A' }}>{t.youLabel}</span>
                        )}
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-5 py-4"><RoleBadge role={admin.role} isRTL={isRTL} /></td>
                    {/* Joined */}
                    <td className="px-5 py-4 text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">
                      {formatDateTime(admin.created_at)}
                    </td>
                    {/* Action */}
                    <td className="px-5 py-4">
                      {admin.email !== currentUserEmail ? (
                        <button
                          onClick={() => setDeleteTarget(admin)}
                          className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo transition-all duration-200"
                          style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.20)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        >
                          {t.removeConfirm}
                        </button>
                      ) : (
                        <span className="text-xs text-[#C0C0C0] font-cairo">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add User Modal ── */}
      {modal && (
        <Modal title={t.addUserTitle} onClose={() => setModal(false)}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">{t.fieldEmail}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="user@artsmartacademy.com"
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }}
                onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
                onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">{t.fieldPassword}</label>
              <PasswordInput
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              <p className="text-[10px] text-[#A0A0A0] font-cairo mt-1">{isRTL ? 'الحد الأدنى 6 أحرف' : 'Minimum 6 characters'}</p>
            </div>
            {/* Role */}
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">{t.fieldRole}</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }}
                onFocus={(e) => { e.target.style.borderColor = '#FF5C1A' }}
                onBlur={(e) => { e.target.style.borderColor = '#FFE4D4' }}
              >
                <option value="admin">{isRTL ? 'أدمن' : 'Admin'}</option>
                <option value="marketing">{isRTL ? 'تسويق' : 'Marketing'}</option>
              </select>
              {/* Role description */}
              <p className="text-[10px] text-[#A0A0A0] font-cairo mt-1.5 leading-relaxed">
                {form.role === 'marketing'
                  ? (isRTL ? 'التسجيلات فقط — لا يمكن الوصول للإعدادات أو المستخدمين أو الموقع' : 'Registrations only — no access to Settings, Users, or Landing Page')
                  : (isRTL ? 'وصول كامل لجميع الصفحات' : 'Full access to all pages')}
              </p>
            </div>

            {error && (
              <p className="text-xs font-semibold font-cairo py-2 px-3 rounded-[8px]" style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626' }}>
                ⚠️ {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setModal(false)}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-[#6B6B6B] font-cairo"
                style={{ border: '1.5px solid #FFE4D4' }}
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo"
                style={{ background: saving ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}
              >
                {saving ? t.adding : t.addBtn}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <Modal title={t.removeUser} onClose={() => setDeleteTarget(null)}>
          <div className="space-y-5">
            <div className="rounded-[12px] p-4 text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-2xl mb-2">⚠️</p>
              <p className="font-semibold text-[#1A1A1A] font-cairo text-sm">
                {isRTL ? 'هل تريد إزالة' : 'Remove'} <strong>{deleteTarget.email}</strong>?
              </p>
              <p className="text-xs text-[#A0A0A0] font-cairo mt-1">
                {isRTL ? 'سيتم حذف حساب الدخول بالكامل.' : 'Their login account will be permanently deleted.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-[#6B6B6B] font-cairo" style={{ border: '1.5px solid #FFE4D4' }}>
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={handleDelete} disabled={saving} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo" style={{ background: saving ? '#FCA5A5' : '#DC2626' }}>
                {saving ? t.removing : t.removeConfirm}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
