'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../../../lib/supabase'

// ── Status Badge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const isConfirmed = status === 'confirmed'
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-cairo"
      style={{
        background: isConfirmed ? 'rgba(16,185,129,0.10)' : 'rgba(255,92,26,0.10)',
        color: isConfirmed ? '#059669' : '#FF5C1A',
        border: `1px solid ${isConfirmed ? 'rgba(16,185,129,0.20)' : 'rgba(255,92,26,0.20)'}`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: isConfirmed ? '#059669' : '#FF5C1A' }} />
      {isConfirmed ? 'Confirmed' : 'Pending'}
    </span>
  )
}

// ── Method Badge ───────────────────────────────────────────────────────────────
const methodColors = {
  fawry: { bg: 'rgba(99,102,241,0.10)', color: '#6366F1', border: 'rgba(99,102,241,0.20)' },
  vodafone_cash: { bg: 'rgba(239,68,68,0.10)', color: '#DC2626', border: 'rgba(239,68,68,0.20)' },
  instapay: { bg: 'rgba(16,185,129,0.10)', color: '#059669', border: 'rgba(16,185,129,0.20)' },
}

function MethodBadge({ method }) {
  const c = methodColors[method] || methodColors.fawry
  const labels = { fawry: 'Fawry', vodafone_cash: 'Vodafone Cash', instapay: 'InstaPay' }
  return (
    <span
      className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold font-cairo"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
    >
      {labels[method] || method}
    </span>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [updating, setUpdating] = useState(null)

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        id, student_name, phone, email, payment_method, payment_status, created_at,
        courses(name_en, name_ar)
      `)
      .order('created_at', { ascending: false })

    if (!error) setRegistrations(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchRegistrations() }, [fetchRegistrations])

  const toggleStatus = async (reg) => {
    const newStatus = reg.payment_status === 'confirmed' ? 'pending' : 'confirmed'
    setUpdating(reg.id)
    const { error } = await supabase
      .from('registrations')
      .update({ payment_status: newStatus })
      .eq('id', reg.id)

    if (!error) {
      setRegistrations((prev) =>
        prev.map((r) => r.id === reg.id ? { ...r, payment_status: newStatus } : r)
      )
    }
    setUpdating(null)
  }

  const filtered = registrations.filter((r) => {
    const matchSearch =
      !search ||
      r.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search)

    const matchStatus =
      filterStatus === 'all' || r.payment_status === filterStatus

    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6" style={{ direction: 'ltr' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">Registrations</h1>
          <p className="text-[#6B6B6B] text-sm font-cairo mt-1">
            {registrations.length} total — إجمالي التسجيلات
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none"
            style={{ border: '1.5px solid #FFE4D4', background: '#FFFFFF' }}
            onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
            onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-4 py-2.5 rounded-[10px] text-xs font-bold font-cairo capitalize transition-all duration-200"
              style={{
                background: filterStatus === s ? 'rgba(255,92,26,0.10)' : '#FFFFFF',
                color: filterStatus === s ? '#FF5C1A' : '#6B6B6B',
                border: filterStatus === s ? '1.5px solid rgba(255,92,26,0.30)' : '1.5px solid #FFE4D4',
              }}
            >
              {s}
            </button>
          ))}
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
                {['Student', 'Phone', 'Email', 'Course', 'Method', 'Status', 'Date', 'Action'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #FFF0E8' }}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded animate-pulse" style={{ background: '#FFE4D4', width: j === 0 ? '120px' : '80px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-14 text-center text-[#A0A0A0] font-cairo text-sm">
                    No registrations found — لا توجد نتائج
                  </td>
                </tr>
              ) : (
                filtered.map((reg, i) => (
                  <tr
                    key={reg.id}
                    className="transition-colors duration-150"
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #FFF0E8' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FFF8F4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs font-cairo flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}
                        >
                          {reg.student_name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-[#1A1A1A] font-cairo whitespace-nowrap">{reg.student_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6B6B6B] font-cairo whitespace-nowrap">{reg.phone}</td>
                    <td className="px-5 py-4 text-sm text-[#6B6B6B] font-cairo">{reg.email || '—'}</td>
                    <td className="px-5 py-4 text-sm text-[#6B6B6B] font-cairo whitespace-nowrap">
                      {reg.courses?.name_en || '—'}
                    </td>
                    <td className="px-5 py-4">
                      <MethodBadge method={reg.payment_method} />
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={reg.payment_status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">
                      {new Date(reg.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(reg)}
                        disabled={updating === reg.id}
                        className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo transition-all duration-200"
                        style={{
                          background: reg.payment_status === 'confirmed' ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                          color: reg.payment_status === 'confirmed' ? '#DC2626' : '#059669',
                          border: `1px solid ${reg.payment_status === 'confirmed' ? 'rgba(239,68,68,0.20)' : 'rgba(16,185,129,0.20)'}`,
                          opacity: updating === reg.id ? 0.6 : 1,
                        }}
                      >
                        {updating === reg.id ? '...' : reg.payment_status === 'confirmed' ? '↩ Unconfirm' : '✓ Confirm'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
