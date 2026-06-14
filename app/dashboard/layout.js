'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../../lib/supabase'

// ── Icons ─────────────────────────────────────────────────────────────────────
function Icon({ name, className = 'w-5 h-5' }) {
  const icons = {
    overview: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    registrations: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
      </svg>
    ),
    courses: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    payments: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
      </svg>
    ),
    users: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
    logout: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
      </svg>
    ),
    menu: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    close: (
      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  }
  return icons[name] || null
}

// ── Nav items ──────────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Overview',          labelAr: 'نظرة عامة',        href: '/dashboard',               icon: 'overview' },
  { label: 'Registrations',     labelAr: 'التسجيلات',         href: '/dashboard/registrations', icon: 'registrations' },
  { label: 'Courses',           labelAr: 'الكورسات',          href: '/dashboard/courses',       icon: 'courses' },
  { label: 'Payments',          labelAr: 'المدفوعات',         href: '/dashboard/payments',      icon: 'payments' },
  { label: 'Users',             labelAr: 'المستخدمون',        href: '/dashboard/users',         icon: 'users' },
  { label: 'Settings',          labelAr: 'الإعدادات',         href: '/dashboard/settings',      icon: 'settings' },
]

// ── Sidebar Component ──────────────────────────────────────────────────────────
function Sidebar({ pathname, onNavigate }) {
  return (
    <aside
      className="flex flex-col h-full"
      style={{ background: '#FFFFFF', borderRight: '1px solid #FFE4D4' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid #FFE4D4' }}
      >
        <img
          src="/logo_mark_blue.png"
          alt="Art Smart Academy"
          className="h-8 w-auto object-contain"
          style={{ filter: 'brightness(0) saturate(100%)' }}
        />
        <div className="flex flex-col">
          <span className="font-extrabold text-xs tracking-widest uppercase text-[#1A1A1A] font-cairo leading-tight">
            SMART ACADEMY
          </span>
          <span className="text-[10px] font-semibold text-[#A0A0A0] font-cairo">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest px-3 mb-3 font-cairo">
          Navigation
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); onNavigate(item.href) }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-semibold font-cairo transition-all duration-200 group"
                  style={{
                    background: isActive ? 'rgba(255,92,26,0.10)' : 'transparent',
                    color: isActive ? '#FF5C1A' : '#6B6B6B',
                    border: isActive ? '1px solid rgba(255,92,26,0.20)' : '1px solid transparent',
                  }}
                >
                  <span
                    className="transition-colors duration-200"
                    style={{ color: isActive ? '#FF5C1A' : '#A0A0A0' }}
                  >
                    <Icon name={item.icon} className="w-5 h-5" />
                  </span>
                  <span className="flex-1">{item.label}</span>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: isActive ? '#FF5C1A' : '#C0C0C0' }}
                  >
                    {item.labelAr}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Orange accent bar at bottom */}
      <div
        className="h-1 w-full"
        style={{ background: 'linear-gradient(to right, #FF5C1A, #FF7A40, #FF5C1A)' }}
      />
    </aside>
  )
}

// ── Dashboard Layout ───────────────────────────────────────────────────────────
export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
        return
      }
      setUser(session.user)
      setAuthChecked(true)
    }
    checkAuth()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/login')
      else setUser(session.user)
    })
    return () => listener.subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.replace('/login')
  }

  const handleNavigate = useCallback((href) => {
    setSidebarOpen(false)
    router.push(href)
  }, [router])

  // Current section label
  const currentSection = navItems.find(
    (item) => item.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(item.href)
  )

  if (!authChecked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#FFF8F4' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-full border-4 border-[#FFE4D4] border-t-[#FF5C1A] animate-spin"
          />
          <p className="text-[#6B6B6B] text-sm font-semibold font-cairo">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#FFF8F4', direction: 'ltr' }}>
      {/* ── Desktop Sidebar ── */}
      <div className="hidden lg:block w-64 flex-shrink-0 h-full">
        <Sidebar pathname={pathname} onNavigate={handleNavigate} />
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 h-full z-10">
            <Sidebar pathname={pathname} onNavigate={handleNavigate} />
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header
          className="flex-shrink-0 h-16 flex items-center justify-between px-6"
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #FFE4D4',
            boxShadow: '0 2px 8px rgba(255,92,26,0.06)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-[8px] text-[#6B6B6B] hover:bg-[#FFF0E8] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo leading-tight">
                {currentSection?.label || 'Dashboard'}
              </h2>
              <p className="text-[11px] text-[#A0A0A0] font-cairo">
                {currentSection?.labelAr || 'لوحة التحكم'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Admin info */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-[#1A1A1A] font-cairo">Admin</span>
              <span className="text-[11px] text-[#A0A0A0] font-cairo truncate max-w-[160px]">
                {user?.email}
              </span>
            </div>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm font-cairo"
              style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}
            >
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-[8px] text-xs font-semibold font-cairo transition-all duration-200"
              style={{ color: '#6B6B6B', border: '1px solid #FFE4D4' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFF0E8'
                e.currentTarget.style.color = '#FF5C1A'
                e.currentTarget.style.borderColor = 'rgba(255,92,26,0.30)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#6B6B6B'
                e.currentTarget.style.borderColor = '#FFE4D4'
              }}
              title="Logout"
            >
              <Icon name="logout" className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
