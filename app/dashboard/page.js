'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useDashboardLang } from '@/lib/dashboard-lang'

function StatCard({ icon, label, value, sub, loading }) {
  return (
    <div
      className="relative overflow-hidden rounded-[16px] p-6 flex flex-col gap-4 transition-all duration-300 cursor-default"
      style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 24px rgba(255,92,26,0.08)' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,92,26,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,92,26,0.30)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,92,26,0.08)'; e.currentTarget.style.borderColor = '#FFE4D4' }}
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: 'linear-gradient(to right, #FF5C1A, #FF7A4088)' }} />
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-[12px] flex items-center justify-center text-xl" style={{ background: 'rgba(255,92,26,0.08)' }}>
          {icon}
        </div>
        {sub && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full font-cairo" style={{ background: 'rgba(255,92,26,0.08)', color: '#FF5C1A' }}>
            {sub}
          </span>
        )}
      </div>
      <div>
        {loading
          ? <div className="h-8 w-20 rounded-lg animate-pulse" style={{ background: '#FFE4D4' }} />
          : <p className="text-[#1A1A1A] font-extrabold text-3xl font-cairo leading-none">{value}</p>
        }
        <p className="text-[#6B6B6B] text-sm font-semibold font-cairo mt-1">{label}</p>
      </div>
    </div>
  )
}

function StatusBadge({ status, t }) {
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
      {isConfirmed ? t.confirmed : t.pending}
    </span>
  )
}

export default function DashboardOverview() {
  const { t, lang, isRTL } = useDashboardLang()
  const [stats, setStats] = useState({ totalRegistrations: 0, totalRevenue: 0, activeCourses: 0, pendingPayments: 0 })
  const [recentRegs, setRecentRegs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setLoading(false); return }

        // Fetch registrations + active courses in parallel
        const [regRes, courseRes] = await Promise.all([
          fetch('/api/admin/registrations', { headers: { Authorization: `Bearer ${session.access_token}` } }),
          fetch('/api/public/courses'),
        ])
        const { registrations = [] } = await regRes.json()
        const { courses = [] }       = await courseRes.json()

        const confirmed     = registrations.filter((r) => r.payment_status === 'confirmed')
        const totalRevenue  = confirmed.reduce((sum, r) => sum + Number(r.courses?.price || 0), 0)
        const pendingCount  = registrations.filter((r) => r.payment_status !== 'confirmed').length

        setStats({
          totalRegistrations: registrations.length,
          totalRevenue,
          activeCourses:  courses.length,
          pendingPayments: pendingCount,
        })
        setRecentRegs(registrations.slice(0, 5))
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const formatCurrency = (n) => `EGP ${Number(n).toLocaleString('en-EG')}`

  const methodLabel = (method) => {
    const map = { fawry: 'Fawry', vodafone_cash: 'Vodafone Cash', instapay: 'Instapay' }
    return map[method] || method
  }

  return (
    <div className="space-y-8" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div>
        <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">{t.overviewTitle}</h1>
        <p className="text-[#6B6B6B] text-sm font-cairo mt-1">{t.overviewSub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon="📋" label={t.totalReg}        value={stats.totalRegistrations}           loading={loading} />
        <StatCard icon="💰" label={t.totalRevenue}    value={formatCurrency(stats.totalRevenue)} sub={t.confirmed} loading={loading} />
        <StatCard icon="📚" label={t.activeCourses}   value={stats.activeCourses}                loading={loading} />
        <StatCard icon="⏳" label={t.pendingPayments} value={stats.pendingPayments}
          sub={stats.pendingPayments > 0 ? t.actionNeeded : t.allClear} loading={loading} />
      </div>

      <div className="rounded-[16px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 24px rgba(255,92,26,0.06)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #FFE4D4' }}>
          <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">{t.recentReg}</h2>
          <a href="/dashboard/registrations" className="text-xs font-bold font-cairo px-3 py-1.5 rounded-full" style={{ color: '#FF5C1A', background: 'rgba(255,92,26,0.08)' }}>
            {t.viewAll}
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FFF8F4' }}>
                {[t.colStudent, t.colCourse, t.colMethod, t.colStatus, t.colDate].map((h) => (
                  <th key={h} className="px-6 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo" style={{ borderBottom: '1px solid #FFE4D4', textAlign: isRTL ? 'right' : 'left' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 rounded animate-pulse" style={{ background: '#FFE4D4', width: j === 0 ? '120px' : '80px' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentRegs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#A0A0A0] text-sm font-cairo">{t.noRegYet}</td>
                </tr>
              ) : (
                recentRegs.map((reg, i) => (
                  <tr key={reg.id} className="transition-colors duration-150" style={{ borderBottom: i < recentRegs.length - 1 ? '1px solid #FFF0E8' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FFF8F4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold text-sm text-[#1A1A1A] font-cairo">{reg.student_name}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B6B6B] font-cairo">
                      {lang === 'ar' ? reg.courses?.name_ar : reg.courses?.name_en}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B6B6B] font-cairo">{methodLabel(reg.payment_method)}</td>
                    <td className="px-6 py-4"><StatusBadge status={reg.payment_status} t={t} /></td>
                    <td className="px-6 py-4 text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">
                      {new Date(reg.created_at).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
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
