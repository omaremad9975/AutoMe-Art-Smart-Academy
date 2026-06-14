'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const methodColors = {
  fawry:         { bg: 'rgba(99,102,241,0.10)',  color: '#6366F1', border: 'rgba(99,102,241,0.20)' },
  vodafone_cash: { bg: 'rgba(239,68,68,0.10)',   color: '#DC2626', border: 'rgba(239,68,68,0.20)' },
  instapay:      { bg: 'rgba(16,185,129,0.10)',  color: '#059669', border: 'rgba(16,185,129,0.20)' },
}
const methodLabels = { fawry: 'Fawry', vodafone_cash: 'Vodafone Cash', instapay: 'InstaPay' }

function MethodBadge({ method }) {
  const c = methodColors[method] || methodColors.fawry
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold font-cairo" style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {methodLabels[method] || method}
    </span>
  )
}

function StatusBadge({ status }) {
  const map = {
    confirmed: { bg: 'rgba(16,185,129,0.10)', color: '#059669', border: 'rgba(16,185,129,0.20)', label: 'Confirmed' },
    pending:   { bg: 'rgba(255,92,26,0.10)',  color: '#FF5C1A', border: 'rgba(255,92,26,0.20)',  label: 'Pending' },
    rejected:  { bg: 'rgba(239,68,68,0.10)',  color: '#DC2626', border: 'rgba(239,68,68,0.20)',  label: 'Rejected' },
  }
  const s = map[status] || map.pending
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-cairo" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterMethod, setFilterMethod] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('payments')
      .select(`
        id, amount, method, reference, status, created_at,
        registrations(student_name)
      `)
      .order('created_at', { ascending: false })
    setPayments(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchPayments() }, [fetchPayments])

  const filtered = payments.filter((p) => {
    const matchMethod = filterMethod === 'all' || p.method === filterMethod
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchMethod && matchStatus
  })

  const totalFiltered = filtered.reduce((s, p) => s + (p.amount || 0), 0)

  return (
    <div className="space-y-6" style={{ direction: 'ltr' }}>
      {/* Header */}
      <div>
        <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">Payments</h1>
        <p className="text-[#6B6B6B] text-sm font-cairo mt-1">
          {filtered.length} records — EGP {totalFiltered.toLocaleString()} total
        </p>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Method filter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo self-center">Method:</span>
          {['all', 'fawry', 'vodafone_cash', 'instapay'].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMethod(m)}
              className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo capitalize transition-all duration-200"
              style={{
                background: filterMethod === m ? 'rgba(255,92,26,0.10)' : '#FFFFFF',
                color: filterMethod === m ? '#FF5C1A' : '#6B6B6B',
                border: filterMethod === m ? '1.5px solid rgba(255,92,26,0.30)' : '1.5px solid #FFE4D4',
              }}
            >
              {m === 'all' ? 'All' : methodLabels[m]}
            </button>
          ))}
        </div>
        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo self-center">Status:</span>
          {['all', 'pending', 'confirmed', 'rejected'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo capitalize transition-all duration-200"
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
                {['Student', 'Amount', 'Method', 'Reference', 'Status', 'Date'].map((h) => (
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
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 rounded animate-pulse" style={{ background: '#FFE4D4', width: j === 0 ? '120px' : '80px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-[#A0A0A0] font-cairo text-sm">
                    No payments found — لا توجد مدفوعات
                  </td>
                </tr>
              ) : (
                filtered.map((payment, i) => (
                  <tr
                    key={payment.id}
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
                          {payment.registrations?.student_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="font-semibold text-sm text-[#1A1A1A] font-cairo whitespace-nowrap">
                          {payment.registrations?.student_name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-sm font-cairo text-[#1A1A1A]">
                        EGP {Number(payment.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-4"><MethodBadge method={payment.method} /></td>
                    <td className="px-5 py-4 text-sm font-mono text-[#6B6B6B]">
                      {payment.reference || <span className="text-[#C0C0C0] font-cairo text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={payment.status} /></td>
                    <td className="px-5 py-4 text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">
                      {new Date(payment.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        {filtered.length > 0 && (
          <div
            className="px-5 py-3 flex justify-end"
            style={{ borderTop: '1px solid #FFE4D4', background: '#FFF8F4' }}
          >
            <span className="text-sm font-bold font-cairo text-[#1A1A1A]">
              Total: <span style={{ color: '#FF5C1A' }}>EGP {totalFiltered.toLocaleString()}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
