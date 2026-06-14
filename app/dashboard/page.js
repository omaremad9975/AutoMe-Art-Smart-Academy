'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ icon, label, labelAr, value, sub, color = '#FF5C1A', loading }) {
  return (
    <div
      className="relative overflow-hidden rounded-[16px] p-6 flex flex-col gap-4 transition-all duration-300"
      style={{
        background: '#FFFFFF',
        border: '1px solid #FFE4D4',
        boxShadow: '0 4px 24px rgba(255,92,26,0.08)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,92,26,0.15)'
        e.currentTarget.style.borderColor = 'rgba(255,92,26,0.30)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,92,26,0.08)'
        e.currentTarget.style.borderColor = '#FFE4D4'
      }}
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(to right, ${color}, ${color}88)` }}
      />

      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-[12px] flex items-center justify-center text-xl"
          style={{ background: `rgba(255,92,26,0.08)`, color }}
        >
          {icon}
        </div>
        {sub && (
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full font-cairo"
            style={{ background: 'rgba(255,92,26,0.08)', color: '#FF5C1A' }}
          >
            {sub}
          </span>
        )}
      </div>

      <div>
        {loading ? (
          <div className="h-8 w-20 rounded-lg animate-pulse" style={{ background: '#FFE4D4' }} />
        ) : (
          <p className="text-[#1A1A1A] font-extrabold text-3xl font-cairo leading-none">
            {value}
          </p>
        )}
        <p className="text-[#6B6B6B] text-sm font-semibold font-cairo mt-1">{label}</p>
        <p className="text-[#A0A0A0] text-xs font-cairo">{labelAr}</p>
      </div>
    </div>
  )
}

// ── Recent Registrations Table ─────────────────────────────────────────────────
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
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: isConfirmed ? '#059669' : '#FF5C1A' }}
      />
      {isConfirmed ? 'Confirmed' : 'Pending'}
    </span>
  )
}

// ── Main Overview Page ─────────────────────────────────────────────────────────
export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalRevenue: 0,
    activeCourses: 0,
    pendingPayments: 0,
  })
  const [recentRegs, setRecentRegs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    try {
      // Total registrations
      const { count: totalRegs } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })

      // Pending payments count
      const { count: pendingCount } = await supabase
        .from('registrations')
        .select('*', { count: 'exact', head: true })
        .eq('payment_status', 'pending')

      // Active courses
      const { count: activeCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Total revenue (sum of confirmed payments)
      const { data: revenueData } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'confirmed')

      const totalRevenue = revenueData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      // Recent registrations (last 5)
      const { data: recent } = await supabase
        .from('registrations')
        .select(`
          id, student_name, phone, payment_method, payment_status, created_at,
          courses(name_en)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalRegistrations: totalRegs || 0,
        totalRevenue,
        activeCourses: activeCourses || 0,
        pendingPayments: pendingCount || 0,
      })
      setRecentRegs(recent || [])
    } catch (err) {
      console.error('Stats fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (n) =>
    `EGP ${Number(n).toLocaleString('en-EG', { minimumFractionDigits: 0 })}`

  return (
    <div className="space-y-8" style={{ direction: 'ltr' }}>
      {/* Page Header */}
      <div>
        <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">Dashboard Overview</h1>
        <p className="text-[#6B6B6B] text-sm font-cairo mt-1">نظرة عامة على أداء الأكاديمية</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          icon="📋"
          label="Total Registrations"
          labelAr="إجمالي التسجيلات"
          value={stats.totalRegistrations}
          loading={loading}
        />
        <StatCard
          icon="💰"
          label="Total Revenue"
          labelAr="إجمالي الإيرادات"
          value={formatCurrency(stats.totalRevenue)}
          sub="Confirmed"
          loading={loading}
        />
        <StatCard
          icon="📚"
          label="Active Courses"
          labelAr="الكورسات الفعّالة"
          value={stats.activeCourses}
          loading={loading}
        />
        <StatCard
          icon="⏳"
          label="Pending Payments"
          labelAr="مدفوعات معلّقة"
          value={stats.pendingPayments}
          sub={stats.pendingPayments > 0 ? 'Action needed' : 'All clear'}
          loading={loading}
        />
      </div>

      {/* ── Recent Registrations ── */}
      <div
        className="rounded-[16px] overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 24px rgba(255,92,26,0.06)' }}
      >
        {/* Table Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #FFE4D4' }}
        >
          <div>
            <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">Recent Registrations</h2>
            <p className="text-xs text-[#A0A0A0] font-cairo">آخر التسجيلات</p>
          </div>
          <a
            href="/dashboard/registrations"
            className="text-xs font-bold font-cairo px-3 py-1.5 rounded-full transition-all duration-200"
            style={{ color: '#FF5C1A', background: 'rgba(255,92,26,0.08)' }}
          >
            View All →
          </a>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FFF8F4' }}>
                {['Student', 'Course', 'Method', 'Status', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo"
                    style={{ borderBottom: '1px solid #FFE4D4' }}
                  >
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
                  <td colSpan={5} className="px-6 py-12 text-center text-[#A0A0A0] text-sm font-cairo">
                    No registrations yet — لا توجد تسجيلات بعد
                  </td>
                </tr>
              ) : (
                recentRegs.map((reg, i) => (
                  <tr
                    key={reg.id}
                    className="transition-colors duration-150"
                    style={{ borderBottom: i < recentRegs.length - 1 ? '1px solid #FFF0E8' : 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FFF8F4'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs font-cairo flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}
                        >
                          {reg.student_name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-[#1A1A1A] font-cairo">{reg.student_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B6B6B] font-cairo">
                      {reg.courses?.name_en || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B6B6B] font-cairo capitalize">
                      {reg.payment_method?.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={reg.payment_status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-[#A0A0A0] font-cairo whitespace-nowrap">
                      {new Date(reg.created_at).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })}
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
