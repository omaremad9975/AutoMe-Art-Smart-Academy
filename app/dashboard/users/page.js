'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

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

function RoleBadge({ role }) {
  const isSuperAdmin = role === 'super_admin'
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-cairo"
      style={{
        background: isSuperAdmin ? 'rgba(255,92,26,0.10)' : 'rgba(99,102,241,0.10)',
        color: isSuperAdmin ? '#FF5C1A' : '#6366F1',
        border: `1px solid ${isSuperAdmin ? 'rgba(255,92,26,0.20)' : 'rgba(99,102,241,0.20)'}`,
      }}
    >
      {isSuperAdmin ? '⭐ Super Admin' : '👤 Admin'}
    </span>
  )
}

export default function UsersPage() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [form, setForm] = useState({ email: '', role: 'admin' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [currentUserEmail, setCurrentUserEmail] = useState('')

  const fetchAdmins = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('admins').select('*').order('created_at', { ascending: false })
    setAdmins(data || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAdmins()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUserEmail(data.user.email)
    })
  }, [fetchAdmins])

  const handleAdd = async () => {
    if (!form.email) { setError('Email is required'); return }
    setSaving(true)
    setError('')

    // Check if already exists
    const { data: existing } = await supabase.from('admins').select('id').eq('email', form.email).single()
    if (existing) { setError('This email is already an admin'); setSaving(false); return }

    const { error: insertError } = await supabase
      .from('admins')
      .insert([{ email: form.email, role: form.role }])

    if (insertError) { setError(insertError.message); setSaving(false); return }
    setSaving(false)
    setModal(false)
    setForm({ email: '', role: 'admin' })
    fetchAdmins()
  }

  const handleDelete = async () => {
    setSaving(true)
    await supabase.from('admins').delete().eq('id', deleteTarget.id)
    setSaving(false)
    setDeleteTarget(null)
    fetchAdmins()
  }

  return (
    <div className="space-y-6" style={{ direction: 'ltr' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">Users & Permissions</h1>
          <p className="text-[#6B6B6B] text-sm font-cairo mt-1">{admins.length} admins — إدارة المستخدمين</p>
        </div>
        <button
          onClick={() => { setForm({ email: '', role: 'admin' }); setError(''); setModal(true) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo"
          style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)', boxShadow: '0 4px 16px rgba(255,92,26,0.30)' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          + Add Admin
        </button>
      </div>

      {/* Info banner */}
      <div
        className="rounded-[12px] px-5 py-4 flex items-start gap-3"
        style={{ background: 'rgba(255,92,26,0.06)', border: '1px solid rgba(255,92,26,0.15)' }}
      >
        <span className="text-xl">ℹ️</span>
        <div>
          <p className="text-sm font-bold text-[#1A1A1A] font-cairo">Admin Access</p>
          <p className="text-xs text-[#6B6B6B] font-cairo mt-0.5">
            Admins must be added to this table AND have a Supabase Auth account. 
            Adding to this list alone does not create an Auth account — invite them via Supabase Dashboard → Authentication.
          </p>
        </div>
      </div>

      {/* Admins Table */}
      <div
        className="rounded-[16px] overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 24px rgba(255,92,26,0.06)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FFF8F4', borderBottom: '1px solid #FFE4D4' }}>
                {['Admin', 'Email', 'Role', 'Joined', 'Action'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo">
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
                    No admins yet — لا توجد حسابات إدارية
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
                    <td className="px-5 py-4">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm font-cairo"
                        style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}
                      >
                        {admin.email?.[0]?.toUpperCase()}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1A1A1A] font-cairo">{admin.email}</span>
                        {admin.email === currentUserEmail && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full font-cairo" style={{ background: '#FFF0E8', color: '#FF5C1A' }}>You</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4"><RoleBadge role={admin.role} /></td>
                    <td className="px-5 py-4 text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">
                      {new Date(admin.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      {admin.email !== currentUserEmail ? (
                        <button
                          onClick={() => setDeleteTarget(admin)}
                          className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo transition-all duration-200"
                          style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626', border: '1px solid rgba(239,68,68,0.20)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.14)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        >
                          Remove
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

      {/* ── Add Admin Modal ── */}
      {modal && (
        <Modal title="Add Admin" onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@artsmartacademy.com"
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }}
                onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
                onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1.5 font-cairo">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }}
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            {error && (
              <p className="text-xs font-semibold font-cairo py-2 px-3 rounded-[8px]" style={{ background: 'rgba(239,68,68,0.08)', color: '#DC2626' }}>
                {error}
              </p>
            )}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setModal(false)}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-[#6B6B6B] font-cairo"
                style={{ border: '1.5px solid #FFE4D4' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo"
                style={{ background: saving ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}
              >
                {saving ? 'Adding...' : 'Add Admin'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <Modal title="Remove Admin" onClose={() => setDeleteTarget(null)}>
          <div className="space-y-5">
            <div className="rounded-[12px] p-4 text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-2xl mb-2">⚠️</p>
              <p className="font-semibold text-[#1A1A1A] font-cairo text-sm">
                Remove <strong>{deleteTarget.email}</strong> from admin access?
              </p>
              <p className="text-xs text-[#A0A0A0] font-cairo mt-1">Their Supabase Auth account will not be deleted.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-[#6B6B6B] font-cairo" style={{ border: '1.5px solid #FFE4D4' }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={saving} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold text-white font-cairo" style={{ background: saving ? '#FCA5A5' : '#DC2626' }}>
                {saving ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
