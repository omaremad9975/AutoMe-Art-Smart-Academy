'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDashboardLang } from '@/lib/dashboard-lang'
import { formatDateTime, exportToXLSX, exportToPDF } from '@/lib/export'
import { supabase } from '@/lib/supabase'

function CertBadge({ issued, isRTL }) {
  if (issued) return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-cairo whitespace-nowrap"
      style={{ background: 'rgba(16,185,129,0.10)', color: '#059669', border: '1px solid rgba(16,185,129,0.20)' }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
      {isRTL ? 'صدرت' : 'Issued'}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-cairo whitespace-nowrap"
      style={{ background: 'rgba(156,163,175,0.10)', color: '#9CA3AF', border: '1px solid rgba(156,163,175,0.20)' }}>
      — {isRTL ? 'لم تصدر' : 'Not issued'}
    </span>
  )
}

const METHOD_COLORS = {
  fawry:         { bg: 'rgba(99,102,241,0.10)',  color: '#6366F1', border: 'rgba(99,102,241,0.20)', label: 'Fawry' },
  vodafone_cash: { bg: 'rgba(220,38,38,0.10)',   color: '#DC2626', border: 'rgba(220,38,38,0.20)',  label: 'Vodafone Cash' },
  instapay:      { bg: 'rgba(16,185,129,0.10)',  color: '#059669', border: 'rgba(16,185,129,0.20)', label: 'InstaPay' },
}

function StatusBadge({ status, t }) {
  const isConfirmed = status === 'confirmed'
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-cairo"
      style={{ background: isConfirmed ? 'rgba(16,185,129,0.10)' : 'rgba(255,92,26,0.10)', color: isConfirmed ? '#059669' : '#FF5C1A', border: `1px solid ${isConfirmed ? 'rgba(16,185,129,0.20)' : 'rgba(255,92,26,0.20)'}` }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: isConfirmed ? '#059669' : '#FF5C1A' }} />
      {isConfirmed ? t.confirmed : t.pending}
    </span>
  )
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

export default function RegistrationsPage() {
  const { t, lang, isRTL } = useDashboardLang()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus]   = useState('all')
  const [filterMethod, setFilterMethod]   = useState('all')
  const [filterCourse, setFilterCourse]   = useState('all')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo,   setFilterDateTo]   = useState('')
  const [issuingId,  setIssuingId]  = useState(null)    // registrationId being issued
  const [issuingAll, setIssuingAll] = useState(false)   // bulk issuing
  const [issueToast, setIssueToast] = useState(null)    // { type: 'success'|'error', msg }

  const showToast = (type, msg) => {
    setIssueToast({ type, msg })
    setTimeout(() => setIssueToast(null), 4000)
  }

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || ''
  }

  const handleIssue = async (registrationId) => {
    setIssuingId(registrationId)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/issue-certificate', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ registrationId }),
      })
      const data = await res.json()
      if (!res.ok) { showToast('error', data.error || 'Failed'); return }
      if (data.skipped) { showToast('success', isRTL ? 'الشهادة سبق إصدارها' : 'Certificate already issued') }
      else { showToast('success', isRTL ? 'تم إصدار الشهادة وإرسالها للطالب ✓' : 'Certificate issued & emailed ✓') }
      await fetchRegistrations()
    } catch { showToast('error', 'Network error') }
    setIssuingId(null)
  }

  const handleIssueAll = async (courseId) => {
    setIssuingAll(true)
    try {
      const token = await getToken()
      const res = await fetch('/api/admin/issue-certificate', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId }),
      })
      const data = await res.json()
      if (!res.ok) { showToast('error', data.error || 'Failed'); return }
      showToast('success', isRTL
        ? `تم إصدار ${data.issued} شهادة، ${data.skipped} مكررة`
        : `Issued ${data.issued} certificates, ${data.skipped} already existed`)
      await fetchRegistrations()
    } catch { showToast('error', 'Network error') }
    setIssuingAll(false)
  }

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      const res = await fetch('/api/admin/registrations', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const result = await res.json()
      if (result.registrations) setRegistrations(result.registrations)
    } catch {}
    setLoading(false)
  }, [])

  useEffect(() => { fetchRegistrations() }, [fetchRegistrations])

  // Unique courses derived from loaded data
  const uniqueCourses = Array.from(
    new Map(registrations.map(r => [r.course_id, r.courses])).entries()
  ).filter(([id, c]) => id && c).map(([id, c]) => ({ id, name_ar: c.name_ar, name_en: c.name_en }))

  const filtered = registrations.filter((r) => {
    if (filterStatus !== 'all' && r.payment_status !== filterStatus) return false
    if (filterMethod !== 'all' && r.payment_method !== filterMethod) return false
    if (filterCourse !== 'all' && r.course_id !== filterCourse) return false
    if (filterDateFrom) {
      const from = new Date(filterDateFrom + 'T00:00:00')
      if (new Date(r.created_at) < from) return false
    }
    if (filterDateTo) {
      const to = new Date(filterDateTo + 'T23:59:59')
      if (new Date(r.created_at) > to) return false
    }
    if (search) {
      const q = search.toLowerCase()
      if (!r.student_name?.toLowerCase().includes(q) && !r.email?.toLowerCase().includes(q) && !r.phone?.includes(q)) return false
    }
    return true
  })

  const hasActiveFilter = filterStatus !== 'all' || filterMethod !== 'all' || filterCourse !== 'all' || filterDateFrom || filterDateTo || search
  const clearFilters = () => { setSearch(''); setFilterStatus('all'); setFilterMethod('all'); setFilterCourse('all'); setFilterDateFrom(''); setFilterDateTo('') }

  const PDF_COLUMNS = [
    { header: 'Student',        key: 'student_name',   width: 36 },
    { header: 'Phone',          key: 'phone',          width: 24 },
    { header: 'Email',          key: 'email',          width: 40 },
    { header: 'Course',         key: '_course',        width: 40 },
    { header: 'Method',         key: '_method',        width: 22 },
    { header: 'Status',         key: 'payment_status', width: 18 },
    { header: 'Date',           key: '_date_fmt',      width: 24 },
  ]

  const handleExportXLSX = () => {
    const rows = filtered.map(r => ({
      'Student Name':    r.student_name,
      'Phone':           r.phone,
      'Email':           r.email || '',
      'Course (EN)':     r.courses?.name_en || '',
      'Course (AR)':     r.courses?.name_ar || '',
      'Payment Method':  METHOD_COLORS[r.payment_method]?.label || r.payment_method,
      'Payment Status':  r.payment_status,
      'Date':            formatDateTime(r.created_at),
    }))
    exportToXLSX(rows, `registrations_${new Date().toISOString().slice(0,10)}`)
  }

  const handleExportPDF = () => {
    const rows = filtered.map(r => ({
      ...r,
      _course:   lang === 'ar' ? r.courses?.name_ar : r.courses?.name_en,
      _method:   METHOD_COLORS[r.payment_method]?.label || r.payment_method,
      _date_fmt: formatDateTime(r.created_at),
    }))
    exportToPDF(rows, PDF_COLUMNS, `registrations_${new Date().toISOString().slice(0,10)}`, 'Registrations Report')
  }

  const confirmedCount = filtered.filter(r => r.payment_status === 'confirmed').length
  const pendingCount   = filtered.filter(r => r.payment_status === 'pending').length

  const certIssuedCount = filtered.filter(r => r.student_certificates?.length > 0).length

  return (
    <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>

      {/* Toast */}
      {issueToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-[12px] text-sm font-bold font-cairo shadow-lg flex items-center gap-2"
          style={{ background: issueToast.type === 'success' ? '#059669' : '#DC2626', color: '#FFFFFF', minWidth: '280px', justifyContent: 'center' }}>
          {issueToast.type === 'success' ? '✓' : '✕'} {issueToast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">{t.registrationsTitle}</h1>
          <p className="text-[#6B6B6B] text-sm font-cairo mt-1">
            {filtered.length} {isRTL ? 'إجمالي' : 'total'} · {confirmedCount} {isRTL ? 'مؤكد' : 'confirmed'} · {pendingCount} {isRTL ? 'معلّق' : 'pending'} · <span style={{ color: '#059669', fontWeight: 700 }}>{certIssuedCount} {isRTL ? 'شهادة صادرة' : 'certs issued'}</span>
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
          {/* Search */}
          <div className="relative" style={{ flex: '1 1 220px' }}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0A0A0]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder={t.searchPlaceholder} value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-[10px] text-sm font-cairo outline-none"
              style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4' }}
              onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
              onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }} />
          </div>
          {/* Date from */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">{isRTL ? 'من' : 'From'}</span>
            <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)}
              className="px-3 py-2.5 rounded-[10px] text-sm font-cairo outline-none"
              style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr' }}
              onFocus={(e) => { e.target.style.borderColor = '#FF5C1A' }}
              onBlur={(e) => { e.target.style.borderColor = '#FFE4D4' }} />
          </div>
          {/* Date to */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">{isRTL ? 'إلى' : 'To'}</span>
            <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)}
              className="px-3 py-2.5 rounded-[10px] text-sm font-cairo outline-none"
              style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr' }}
              onFocus={(e) => { e.target.style.borderColor = '#FF5C1A' }}
              onBlur={(e) => { e.target.style.borderColor = '#FFE4D4' }} />
          </div>
        </div>

        {/* Row 2: Status + Method + Course + Clear */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status */}
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'pending', 'confirmed'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo capitalize transition-all duration-200"
                style={{ background: filterStatus === s ? 'rgba(255,92,26,0.10)' : '#F9FAFB', color: filterStatus === s ? '#FF5C1A' : '#6B6B6B', border: filterStatus === s ? '1.5px solid rgba(255,92,26,0.30)' : '1.5px solid #E5E7EB' }}>
                {s === 'all' ? (isRTL ? 'الكل' : 'All Status') : s === 'pending' ? t.pending : t.confirmed}
              </button>
            ))}
          </div>

          <div style={{ width: '1px', height: '20px', background: '#FFE4D4', flexShrink: 0 }} />

          {/* Method */}
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'fawry', 'instapay', 'vodafone_cash'].map((m) => (
              <button key={m} onClick={() => setFilterMethod(m)}
                className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo transition-all duration-200"
                style={{ background: filterMethod === m ? 'rgba(255,92,26,0.10)' : '#F9FAFB', color: filterMethod === m ? '#FF5C1A' : '#6B6B6B', border: filterMethod === m ? '1.5px solid rgba(255,92,26,0.30)' : '1.5px solid #E5E7EB' }}>
                {m === 'all' ? (isRTL ? 'كل الطرق' : 'All Methods') : METHOD_COLORS[m]?.label}
              </button>
            ))}
          </div>

          {/* Course dropdown — only show if courses loaded */}
          {uniqueCourses.length > 0 && (
            <>
              <div style={{ width: '1px', height: '20px', background: '#FFE4D4', flexShrink: 0 }} />
              <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}
                className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo outline-none transition-all"
                style={{ border: filterCourse !== 'all' ? '1.5px solid rgba(255,92,26,0.30)' : '1.5px solid #E5E7EB', background: filterCourse !== 'all' ? 'rgba(255,92,26,0.08)' : '#F9FAFB', color: filterCourse !== 'all' ? '#FF5C1A' : '#6B6B6B', direction: 'ltr' }}>
                <option value="all">{isRTL ? 'كل الكورسات' : 'All Courses'}</option>
                {uniqueCourses.map((c) => (
                  <option key={c.id} value={c.id}>{lang === 'ar' ? c.name_ar : c.name_en}</option>
                ))}
              </select>
            </>
          )}

          {/* Issue to All button — only when a specific course is selected */}
          {filterCourse !== 'all' && (
            <button onClick={() => handleIssueAll(filterCourse)} disabled={issuingAll}
              className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo transition-all flex items-center gap-1.5"
              style={{ background: issuingAll ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.10)', color: '#059669', border: '1.5px solid rgba(16,185,129,0.30)' }}>
              {issuingAll
                ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>{isRTL ? 'جارٍ الإصدار...' : 'Issuing...'}</>
                : <>{isRTL ? '🎓 إصدار للجميع' : '🎓 Issue to All'}</>
              }
            </button>
          )}

          {/* Clear all */}
          {hasActiveFilter && (
            <button onClick={clearFilters}
              className="px-3 py-1.5 rounded-[8px] text-xs font-bold font-cairo transition-all ml-auto"
              style={{ background: 'rgba(220,38,38,0.07)', color: '#DC2626', border: '1.5px solid rgba(220,38,38,0.20)' }}>
              ✕ {isRTL ? 'مسح الفلاتر' : 'Clear filters'}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[16px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 24px rgba(255,92,26,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FFF8F4', borderBottom: '1px solid #FFE4D4' }}>
                {[t.colStudent, t.colPhone, 'WhatsApp', t.colEmail, t.colCourse, t.colMethod, t.colStatus, t.colDate, isRTL ? 'الشهادة' : 'Certificate'].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo whitespace-nowrap"
                    style={{ textAlign: isRTL ? 'right' : 'left' }}>
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
                  <td colSpan={9} className="px-6 py-14 text-center text-[#A0A0A0] font-cairo text-sm">{t.noResults}</td>
                </tr>
              ) : (
                filtered.map((reg, i) => (
                  <tr key={reg.id} className="transition-colors duration-150"
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #FFF0E8' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FFF8F4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    {/* Student */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-sm text-[#1A1A1A] font-cairo whitespace-nowrap">{reg.student_name}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6B6B6B] font-cairo whitespace-nowrap">{reg.phone}</td>
                    {/* WhatsApp — clickable link, shows icon if same as phone */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {reg.whatsapp ? (
                        <a
                          href={`https://wa.me/${reg.whatsapp.replace(/\D/g, '')}`}
                          target="_blank" rel="noopener noreferrer"
                          title={reg.whatsapp}
                          className="inline-flex items-center gap-1.5 text-xs font-cairo"
                          style={{ color: '#25D366', textDecoration: 'none' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                          {reg.whatsapp === reg.phone ? (
                            <span style={{ color: '#9CA3AF', fontSize: '10px' }}>= phone</span>
                          ) : (
                            reg.whatsapp
                          )}
                        </a>
                      ) : (
                        <span className="text-[#C0C0C0] text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#6B6B6B] font-cairo">{reg.email || '—'}</td>
                    <td className="px-5 py-4 text-sm text-[#6B6B6B] font-cairo whitespace-nowrap">
                      {lang === 'ar' ? reg.courses?.name_ar : reg.courses?.name_en}
                    </td>
                    <td className="px-5 py-4"><MethodBadge method={reg.payment_method} /></td>
                    <td className="px-5 py-4"><StatusBadge status={reg.payment_status} t={t} /></td>
                    <td className="px-5 py-4 text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">
                      {formatDateTime(reg.created_at)}
                    </td>
                    {/* Certificate column */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      {reg.student_certificates?.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <CertBadge issued={true} isRTL={isRTL} />
                          {reg.student_certificates[0].certificate_url && (
                            <a href={reg.student_certificates[0].certificate_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs font-bold font-cairo underline" style={{ color: '#FF5C1A' }}>
                              PDF
                            </a>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <CertBadge issued={false} isRTL={isRTL} />
                          {reg.payment_status === 'confirmed' && (
                            <button
                              onClick={() => handleIssue(reg.id)}
                              disabled={issuingId === reg.id}
                              className="px-2.5 py-1 rounded-[7px] text-xs font-bold font-cairo transition-all flex items-center gap-1"
                              style={{ background: issuingId === reg.id ? 'rgba(255,92,26,0.05)' : 'rgba(255,92,26,0.10)', color: '#FF5C1A', border: '1.5px solid rgba(255,92,26,0.25)' }}>
                              {issuingId === reg.id
                                ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
                                : '🎓'
                              }
                              {isRTL ? 'إصدار' : 'Issue'}
                            </button>
                          )}
                        </div>
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
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderTop: '1px solid #FFE4D4', background: '#FFF8F4' }}>
            <span className="text-xs text-[#A0A0A0] font-cairo">{filtered.length} {isRTL ? 'نتيجة' : 'results'}</span>
            <div className="flex gap-4 text-xs font-bold font-cairo">
              <span style={{ color: '#059669' }}>{confirmedCount} {isRTL ? 'مؤكد' : 'confirmed'}</span>
              <span style={{ color: '#FF5C1A' }}>{pendingCount} {isRTL ? 'معلّق' : 'pending'}</span>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
