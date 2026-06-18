'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDashboardLang } from '@/lib/dashboard-lang'
import { formatDateTime, exportToXLSX, exportToPDF } from '@/lib/export'
import { supabase } from '@/lib/supabase'


const METHOD_COLORS = {
  fawry:         { bg: 'rgba(99,102,241,0.10)',  color: '#6366F1', border: 'rgba(99,102,241,0.20)', label: 'Fawry' },
  vodafone_cash: { bg: 'rgba(220,38,38,0.10)',   color: '#DC2626', border: 'rgba(220,38,38,0.20)',  label: 'Vodafone Cash' },
  instapay:      { bg: 'rgba(16,185,129,0.10)',  color: '#059669', border: 'rgba(16,185,129,0.20)', label: 'InstaPay' },
}

const TYPE_COLORS = {
  course:      { bg: 'rgba(255,92,26,0.08)',  color: '#FF5C1A'  },
  workshop:    { bg: 'rgba(139,92,246,0.08)', color: '#7C3AED'  },
  certificate: { bg: 'rgba(234,179,8,0.10)',  color: '#CA8A04'  },
  event:       { bg: 'rgba(59,130,246,0.08)', color: '#2563EB'  },
}

function MethodBadge({ method }) {
  const c = METHOD_COLORS[method] || METHOD_COLORS.fawry
  return (
    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold font-cairo whitespace-nowrap"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
      {c.label}
    </span>
  )
}

function StatusBadge({ status }) {
  const map = {
    paid:    { bg: 'rgba(16,185,129,0.10)', color: '#059669', border: 'rgba(16,185,129,0.20)' },
    pending: { bg: 'rgba(255,92,26,0.10)',  color: '#FF5C1A', border: 'rgba(255,92,26,0.20)'  },
    failed:  { bg: 'rgba(220,38,38,0.10)',  color: '#DC2626', border: 'rgba(220,38,38,0.20)'  },
  }
  const s = map[status] || map.pending
  const label = { paid: 'Paid', pending: 'Pending', failed: 'Failed' }[status] || status
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-cairo whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
      {label}
    </span>
  )
}

function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS.course
  const label = { course: 'Course', workshop: 'Workshop', certificate: 'Certificate', event: 'Event' }[type] || type
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold font-cairo uppercase tracking-wide"
      style={{ background: c.bg, color: c.color }}>
      {label}
    </span>
  )
}

// ── Mark as Paid Modal ─────────────────────────────────────────────────────────
function MarkPaidModal({ payment, onClose, onConfirm }) {
  const [reference, setReference] = useState('')
  const [saving, setSaving] = useState(false)

  const handleConfirm = async () => {
    setSaving(true)
    await onConfirm(payment.id, reference)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-[20px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 24px 64px rgba(255,92,26,0.15)' }}>
        <div className="px-6 py-5" style={{ borderBottom: '1px solid #FFE4D4' }}>
          <h3 className="font-bold text-[#1A1A1A] font-cairo text-base">Mark as Paid</h3>
          <p className="text-xs text-[#A0A0A0] font-cairo mt-1">{payment.student_name} — EGP {payment.amount.toLocaleString()}</p>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#6B6B6B] font-cairo mb-2">Payment Reference / Screenshot Code</label>
            <input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={payment.payment_method === 'instapay' ? 'e.g. INS-20260615-XXX' : 'VCH-20260615-XXX'}
              className="w-full px-4 py-3 rounded-[10px] text-sm font-cairo outline-none transition-all"
              style={{ background: '#FFF8F4', border: '1.5px solid #FFE4D4' }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#FF5C1A'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#FFE4D4'}
            />
          </div>
          <p className="text-xs text-[#A0A0A0] font-cairo">
            Via <strong>{METHOD_COLORS[payment.payment_method]?.label}</strong> — enter the transfer reference or leave blank if confirmed by screenshot only.
          </p>
        </div>
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #FFE4D4' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold font-cairo transition-all"
            style={{ background: '#FFF0E8', color: '#FF5C1A', border: '1px solid #FFE4D4' }}>
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={saving} className="flex-1 py-2.5 rounded-[10px] text-sm font-bold font-cairo text-white transition-all"
            style={{ background: saving ? '#FFA070' : '#FF5C1A' }}>
            {saving ? 'Saving...' : '✓ Confirm Paid'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function PaymentsPage() {
  const { t, isRTL } = useDashboardLang()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterMethod, setFilterMethod]     = useState('all')
  const [filterStatus, setFilterStatus]     = useState('all')
  const [filterType, setFilterType]         = useState('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo,   setFilterDateTo]   = useState('')
  const [search, setSearch]                 = useState('')
  const [markingPayment, setMarkingPayment] = useState(null)

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      const res = await fetch('/api/admin/registrations', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const result = await res.json()
      if (result.registrations) {
        // Map registrations → payment rows
        const mapped = result.registrations.map((r) => ({
          id:                r.id,
          student_name:      r.student_name,
          email:             r.email,
          phone:             r.phone,
          product_name:      r.courses?.name_ar || r.courses?.name_en || '—',
          product_type:      'course',
          amount:            Number(r.courses?.price || 0),
          payment_method:    r.payment_method,
          // map confirmed→paid for the payments view
          payment_status:    r.payment_status === 'confirmed' ? 'paid' : r.payment_status,
          transaction_id:    r.transaction_id || null,
          payment_reference: r.payment_reference || null,
          receipt_url:       r.receipt_url || null,
          payment_date:      r.created_at,
        }))
        setPayments(mapped)
      }
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchPayments() }, [fetchPayments])

  const filtered = payments.filter((p) => {
    if (filterMethod !== 'all' && p.payment_method !== filterMethod) return false
    if (filterStatus !== 'all' && p.payment_status !== filterStatus) return false
    if (filterType !== 'all' && p.product_type !== filterType) return false
    if (filterDateFrom) {
      const from = new Date(filterDateFrom + 'T00:00:00')
      if (new Date(p.payment_date) < from) return false
    }
    if (filterDateTo) {
      const to = new Date(filterDateTo + 'T23:59:59')
      if (new Date(p.payment_date) > to) return false
    }
    if (search) {
      const q = search.toLowerCase()
      if (!p.student_name?.toLowerCase().includes(q) &&
          !p.email?.toLowerCase().includes(q) &&
          !p.phone?.includes(q) &&
          !p.product_name?.toLowerCase().includes(q) &&
          !p.transaction_id?.toLowerCase().includes(q) &&
          !p.payment_reference?.includes(q)) return false
    }
    return true
  })

  const hasActiveFilter = filterMethod !== 'all' || filterStatus !== 'all' || filterType !== 'all' || filterDateFrom || filterDateTo || search
  const clearFilters = () => { setSearch(''); setFilterMethod('all'); setFilterStatus('all'); setFilterType('all'); setFilterDateFrom(''); setFilterDateTo('') }

  const totalAmount = filtered.reduce((s, p) => s + (p.amount || 0), 0)
  const paidAmount  = filtered.filter(p => p.payment_status === 'paid').reduce((s, p) => s + (p.amount || 0), 0)

  const handleMarkPaid = async (id, reference) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/admin/confirm-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ registrationId: id, paymentReference: reference || null }),
      })
      if (res.ok) {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, payment_status: 'paid', payment_reference: reference || p.payment_reference } : p))
      }
    } catch {}
  }

  const PDF_COLUMNS = [
    { header: 'Student',        key: 'student_name',      width: 32 },
    { header: 'Email',          key: 'email',             width: 38 },
    { header: 'Phone',          key: 'phone',             width: 24 },
    { header: 'Product',        key: 'product_name',      width: 36 },
    { header: 'Type',           key: 'product_type',      width: 18 },
    { header: 'Amount (EGP)',   key: 'amount',            width: 20 },
    { header: 'Method',         key: 'payment_method',    width: 22 },
    { header: 'Transaction ID', key: 'transaction_id',    width: 36 },
    { header: 'Reference',      key: 'payment_reference', width: 24 },
    { header: 'Status',         key: 'payment_status',    width: 16 },
    { header: 'Date',           key: '_date_fmt',         width: 24 },
  ]

  const handleExportXLSX = () => {
    const rows = filtered.map(p => ({
      'Student Name':   p.student_name,
      'Email':          p.email || '',
      'Phone':          p.phone || '',
      'Product Name':   p.product_name,
      'Product Type':   p.product_type,
      'Amount (EGP)':   p.amount,
      'Currency':       p.currency,
      'Payment Method': p.payment_method,
      'Transaction ID': p.transaction_id || '',
      'Reference':      p.payment_reference || '',
      'Status':         p.payment_status,
      'Date':           formatDateTime(p.payment_date),
    }))
    exportToXLSX(rows, `payments_${new Date().toISOString().slice(0,10)}`)
  }

  const handleExportPDF = () => {
    const rows = filtered.map(p => ({
      ...p,
      payment_method: METHOD_COLORS[p.payment_method]?.label || p.payment_method,
      _date_fmt: formatDateTime(p.payment_date),
    }))
    exportToPDF(rows, PDF_COLUMNS, `payments_${new Date().toISOString().slice(0,10)}`, 'Payments Report')
  }

  const TABLE_COLUMNS = ['Student', 'Email', 'Phone', 'Product', 'Type', 'Amount', 'Method', 'Tx ID', 'Ref', '🧾', 'Status', 'Date', '✓']

  return (
    <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">{t.paymentsTitle}</h1>
          <p className="text-[#6B6B6B] text-sm font-cairo mt-1">
            {filtered.length} records · EGP {paidAmount.toLocaleString()} collected of EGP {totalAmount.toLocaleString()} total
          </p>
        </div>
        {/* Export buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={handleExportXLSX} disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs font-bold font-cairo transition-all duration-200"
            style={{ background: '#E8F5E9', color: '#2E7D32', border: '1.5px solid #A5D6A7' }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#C8E6C9'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#E8F5E9'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            XLSX ({filtered.length})
          </button>
          <button onClick={handleExportPDF} disabled={filtered.length === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-xs font-bold font-cairo transition-all duration-200"
            style={{ background: 'rgba(255,92,26,0.08)', color: '#FF5C1A', border: '1.5px solid rgba(255,92,26,0.25)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,92,26,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,92,26,0.08)'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            PDF ({filtered.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-[14px] p-4 space-y-3" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4' }}>
        {/* Row 1: Search + Date range */}
        <div className="flex flex-wrap gap-3">
          <div className="relative" style={{ flex: '1 1 260px' }}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, product, transaction ID..."
              className="w-full pl-9 pr-4 py-2.5 rounded-[10px] text-sm font-cairo outline-none"
              style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }}
              onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
              onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">From</span>
            <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
              className="px-3 py-2.5 rounded-[10px] text-sm font-cairo outline-none"
              style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr' }}
              onFocus={(e) => e.target.style.borderColor = '#FF5C1A'}
              onBlur={(e) => e.target.style.borderColor = '#FFE4D4'} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">To</span>
            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
              className="px-3 py-2.5 rounded-[10px] text-sm font-cairo outline-none"
              style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr' }}
              onFocus={(e) => e.target.style.borderColor = '#FF5C1A'}
              onBlur={(e) => e.target.style.borderColor = '#FFE4D4'} />
          </div>
        </div>

        {/* Row 2: Method + Status + Type + Clear */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Method */}
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'fawry', 'instapay', 'vodafone_cash'].map((m) => (
              <button key={m} onClick={() => setFilterMethod(m)}
                className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo transition-all duration-200"
                style={{ background: filterMethod === m ? 'rgba(255,92,26,0.10)' : '#F9FAFB', color: filterMethod === m ? '#FF5C1A' : '#6B6B6B', border: filterMethod === m ? '1.5px solid rgba(255,92,26,0.30)' : '1.5px solid #E5E7EB' }}>
                {m === 'all' ? 'All Methods' : METHOD_COLORS[m]?.label}
              </button>
            ))}
          </div>

          <div style={{ width: '1px', height: '20px', background: '#FFE4D4', flexShrink: 0 }} />

          {/* Status */}
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'paid', 'pending', 'failed'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo capitalize transition-all duration-200"
                style={{ background: filterStatus === s ? 'rgba(255,92,26,0.10)' : '#F9FAFB', color: filterStatus === s ? '#FF5C1A' : '#6B6B6B', border: filterStatus === s ? '1.5px solid rgba(255,92,26,0.30)' : '1.5px solid #E5E7EB' }}>
                {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          <div style={{ width: '1px', height: '20px', background: '#FFE4D4', flexShrink: 0 }} />

          {/* Type */}
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'course', 'workshop', 'certificate', 'event'].map((type) => (
              <button key={type} onClick={() => setFilterType(type)}
                className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo capitalize transition-all duration-200"
                style={{ background: filterType === type ? 'rgba(255,92,26,0.10)' : '#F9FAFB', color: filterType === type ? '#FF5C1A' : '#6B6B6B', border: filterType === type ? '1.5px solid rgba(255,92,26,0.30)' : '1.5px solid #E5E7EB' }}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {hasActiveFilter && (
            <button onClick={clearFilters}
              className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo transition-all ml-auto"
              style={{ background: 'rgba(220,38,38,0.07)', color: '#DC2626', border: '1.5px solid rgba(220,38,38,0.20)' }}>
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[16px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 24px rgba(255,92,26,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '900px' }}>
            <thead>
              <tr style={{ background: '#FFF8F4', borderBottom: '1px solid #FFE4D4' }}>
                {TABLE_COLUMNS.map((h) => (
                  <th key={h} className="px-3 py-3 text-[11px] font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo whitespace-nowrap"
                    style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    {h}
                  </th>
                ))}

              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #FFF0E8' }}>
                    {TABLE_COLUMNS.map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 rounded animate-pulse" style={{ background: '#FFE4D4', width: j === 0 ? '120px' : '70px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length} className="px-6 py-14 text-center text-[#A0A0A0] font-cairo text-sm">
                    {t.noPayments}
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p.id} className="transition-colors duration-150"
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #FFF0E8' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FFF8F4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Student */}
                    <td className="px-3 py-3">
                      <span className="font-semibold text-sm text-[#1A1A1A] font-cairo whitespace-nowrap">{p.student_name}</span>
                    </td>
                    {/* Email */}
                    <td className="px-3 py-3 text-xs text-[#6B6B6B] font-cairo">{p.email || '—'}</td>
                    {/* Phone */}
                    <td className="px-3 py-3 text-xs text-[#6B6B6B] font-cairo whitespace-nowrap">{p.phone || '—'}</td>
                    {/* Product — name only */}
                    <td className="px-3 py-3">
                      <span className="text-sm font-semibold text-[#1A1A1A] font-cairo whitespace-nowrap">{p.product_name}</span>
                    </td>
                    {/* Type — badge only */}
                    <td className="px-3 py-3"><TypeBadge type={p.product_type} /></td>
                    {/* Amount */}
                    <td className="px-3 py-3">
                      <span className="font-bold text-sm font-cairo text-[#1A1A1A] whitespace-nowrap">
                        {Number(p.amount).toLocaleString()}
                      </span>
                    </td>
                    {/* Method */}
                    <td className="px-3 py-3"><MethodBadge method={p.payment_method} /></td>
                    {/* Transaction ID */}
                    <td className="px-3 py-3 text-xs font-mono text-[#6B6B6B] whitespace-nowrap">
                      {p.transaction_id || <span className="text-[#C0C0C0]">—</span>}
                    </td>
                    {/* Reference */}
                    <td className="px-3 py-3 text-xs font-mono text-[#6B6B6B] whitespace-nowrap">
                      {p.payment_reference || <span className="text-[#C0C0C0]">—</span>}
                    </td>
                    {/* Receipt — eye icon only */}
                    <td className="px-3 py-3 text-center">
                      {p.receipt_url ? (
                        <a href={p.receipt_url} target="_blank" rel="noopener noreferrer"
                          title="View receipt"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-[8px] transition-all duration-200"
                          style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.20)', textDecoration: 'none' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.22)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.08)'}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </a>
                      ) : (
                        <span className="text-[#C0C0C0] text-xs">—</span>
                      )}
                    </td>
                    {/* Status */}
                    <td className="px-3 py-3"><StatusBadge status={p.payment_status} /></td>
                    {/* Date */}
                    <td className="px-3 py-3 text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">
                      {formatDateTime(p.payment_date)}
                    </td>
                    {/* Action — checkmark icon only */}
                    <td className="px-3 py-3 text-center">
                      {p.payment_status === 'pending' && p.payment_method !== 'fawry' ? (
                        <button onClick={() => setMarkingPayment(p)} title="Mark as paid"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-[8px] transition-all duration-200"
                          style={{ background: 'rgba(16,185,129,0.10)', color: '#059669', border: '1px solid rgba(16,185,129,0.20)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.22)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.10)'}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </button>
                      ) : (
                        <span className="text-[#C0C0C0] text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-2"
            style={{ borderTop: '1px solid #FFE4D4', background: '#FFF8F4' }}>
            <span className="text-xs text-[#A0A0A0] font-cairo">{filtered.length} payments shown</span>
            <div className="flex gap-4">
              <span className="text-sm font-bold font-cairo text-[#6B6B6B]">
                Paid: <span style={{ color: '#059669' }}>EGP {paidAmount.toLocaleString()}</span>
              </span>
              <span className="text-sm font-bold font-cairo text-[#6B6B6B]">
                Total: <span style={{ color: '#FF5C1A' }}>EGP {totalAmount.toLocaleString()}</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mark Paid Modal */}
      {markingPayment && (
        <MarkPaidModal
          payment={markingPayment}
          onClose={() => setMarkingPayment(null)}
          onConfirm={handleMarkPaid}
        />
      )}
    </div>
  )
}
