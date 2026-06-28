'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { DashboardLangProvider, useDashboardLang } from '@/lib/dashboard-lang'

// ── Role-based nav config ──────────────────────────────────────────────────────
// What each role can access
const ROLE_PERMISSIONS = {
  super_admin: ['overview', 'registrations', 'landing', 'payments', 'users', 'settings'],
  admin:       ['overview', 'registrations', 'landing', 'payments', 'users', 'settings'],
  marketing:   ['registrations'],
}

const NAV_ITEMS = [
  { key: 'overview',      href: '/dashboard',              icon: 'overview' },
  { key: 'registrations', href: '/dashboard/registrations', icon: 'registrations' },
  { key: 'payments',      href: '/dashboard/payments',      icon: 'payments' },
  { key: 'landing',       href: '/dashboard/landing',       icon: 'landing' },
  { key: 'users',         href: '/dashboard/users',         icon: 'users' },
  { key: 'settings',      href: '/dashboard/settings',      icon: 'settings' },
]

// Default redirect per role if they land on a forbidden page
const ROLE_HOME = {
  super_admin: '/dashboard',
  admin:       '/dashboard',
  marketing:   '/dashboard/registrations',
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function Icon({ name, className = 'w-5 h-5' }) {
  const icons = {
    overview:      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
    registrations: <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z"/></svg>,
    landing:       <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M12 17v4"/></svg>,
    payments:      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"/></svg>,
    users:         <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/></svg>,
    settings:      <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>,
    logout:        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"/></svg>,
    menu:          <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  }
  return icons[name] || null
}

function PinIcon({ pinned }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22"/>
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/>
    </svg>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ pathname, onNavigate, user, userRole, onLogout, isExpanded, pinned, onTogglePin, onMouseEnter, onMouseLeave }) {
  const { t } = useDashboardLang()

  const allowedKeys = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.admin
  const visibleNav = NAV_ITEMS.filter((item) => allowedKeys.includes(item.key))

  return (
    <aside
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="flex flex-col h-full flex-shrink-0"
      style={{
        width: isExpanded ? '256px' : '64px',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        background: '#FFFFFF',
        borderRight: '1px solid #FFE4D4',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-4 py-5 gap-3 flex-shrink-0"
        style={{ borderBottom: '1px solid #FFE4D4', minHeight: '72px' }}
      >
        <Image
          src="/logo_mark_black.png"
          alt="Art Smart Academy"
          width={50}
          height={24}
          className="flex-shrink-0 object-contain"
          style={{ height: '24px', width: 'auto' }}
        />
        <div className="flex items-center flex-1 min-w-0" style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.15s', pointerEvents: isExpanded ? 'auto' : 'none' }}>
          <div className="flex flex-col overflow-hidden">
            <span className="font-extrabold text-xs tracking-widest uppercase text-[#1A1A1A] font-cairo leading-tight whitespace-nowrap">SMART ACADEMY</span>
            <span className="text-[10px] font-semibold text-[#A0A0A0] font-cairo whitespace-nowrap">{t.adminPanel}</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden" style={{ padding: isExpanded ? '16px 12px' : '16px 8px' }}>
        {isExpanded && (
          <p className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest px-3 mb-3 font-cairo whitespace-nowrap">
            {t.navigation}
          </p>
        )}
        <ul className="space-y-1">
          {visibleNav.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); onNavigate(item.href) }}
                  title={!isExpanded ? t.nav[item.key] : undefined}
                  className="flex items-center rounded-[10px] text-sm font-semibold font-cairo transition-all duration-200"
                  style={{
                    gap: isExpanded ? '12px' : '0',
                    padding: isExpanded ? '10px 12px' : '10px',
                    justifyContent: isExpanded ? 'flex-start' : 'center',
                    background: isActive ? 'rgba(255,92,26,0.10)' : 'transparent',
                    color: isActive ? '#FF5C1A' : '#6B6B6B',
                    border: isActive ? '1px solid rgba(255,92,26,0.20)' : '1px solid transparent',
                  }}
                >
                  <span style={{ color: isActive ? '#FF5C1A' : '#A0A0A0', flexShrink: 0 }}>
                    <Icon name={item.icon} className="w-5 h-5" />
                  </span>
                  {isExpanded && (
                    <span className="whitespace-nowrap overflow-hidden" style={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.15s' }}>
                      {t.nav[item.key]}
                    </span>
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Bottom: user info + logout */}
      <div className="flex-shrink-0 py-3" style={{ borderTop: '1px solid #FFE4D4', padding: isExpanded ? '12px' : '12px 8px' }}>
        {isExpanded ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded-[10px]" style={{ background: '#FFF8F4', border: '1px solid #FFE4D4', opacity: isExpanded ? 1 : 0, transition: 'opacity 0.15s' }}>
            <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm font-cairo" style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#1A1A1A] font-cairo">{t.admin}</p>
              <p className="text-[10px] text-[#A0A0A0] font-cairo truncate">{user?.email}</p>
            </div>
            {/* Pin button */}
            <button
              onClick={onTogglePin}
              title={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
              className="p-1.5 rounded-[6px] transition-all duration-200 flex-shrink-0"
              style={{ color: pinned ? '#FF5C1A' : '#C0C0C0' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,92,26,0.08)'; e.currentTarget.style.color = '#FF5C1A' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = pinned ? '#FF5C1A' : '#C0C0C0' }}
            >
              <PinIcon pinned={pinned} />
            </button>
            {/* Logout button */}
            <button
              onClick={onLogout}
              title={t.logout}
              className="p-1.5 rounded-[6px] transition-all duration-200 flex-shrink-0"
              style={{ color: '#A0A0A0' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,92,26,0.10)'; e.currentTarget.style.color = '#FF5C1A' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0A0A0' }}
            >
              <Icon name="logout" className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm font-cairo" style={{ background: 'linear-gradient(135deg, #FF5C1A, #FF7A40)' }}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            {/* Pin button (collapsed) */}
            <button
              onClick={onTogglePin}
              title={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
              className="p-1.5 rounded-[6px] transition-all duration-200"
              style={{ color: pinned ? '#FF5C1A' : '#C0C0C0' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,92,26,0.08)'; e.currentTarget.style.color = '#FF5C1A' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = pinned ? '#FF5C1A' : '#C0C0C0' }}
            >
              <PinIcon pinned={pinned} />
            </button>
            {/* Logout button (collapsed) */}
            <button
              onClick={onLogout}
              title={t.logout}
              className="p-1.5 rounded-[6px] transition-all duration-200"
              style={{ color: '#A0A0A0' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,92,26,0.10)'; e.currentTarget.style.color = '#FF5C1A' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A0A0A0' }}
            >
              <Icon name="logout" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="h-1 w-full flex-shrink-0" style={{ background: 'linear-gradient(to right, #FF5C1A, #FF7A40, #FF5C1A)' }} />
    </aside>
  )
}

// ── Inner Layout ───────────────────────────────────────────────────────────────
function DashboardInner({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { t, lang, toggleLang } = useDashboardLang()

  const [user, setUser]               = useState(null)
  const [userRole, setUserRole]       = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [pinned, setPinned]           = useState(false)
  const [hovered, setHovered]         = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const isExpanded = pinned || hovered

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
        return
      }

      setUser(session.user)

      // Fetch role via service-role API (bypasses RLS — always reliable)
      try {
        const res = await fetch('/api/admin/my-role', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (!res.ok) {
          // Role fetch failed — sign out and redirect, do NOT grant fallback access
          await supabase.auth.signOut()
          await fetch('/api/auth/logout', { method: 'POST' })
          router.replace('/login')
          return
        }
        const result = await res.json()
        if (!result.role) {
          await supabase.auth.signOut()
          await fetch('/api/auth/logout', { method: 'POST' })
          router.replace('/login')
          return
        }
        setUserRole(result.role)
      } catch {
        // Network error — do NOT grant fallback access
        await supabase.auth.signOut()
        router.replace('/login')
        return
      }
      setAuthChecked(true)
    }
    checkAuth()
  }, [router])

  // Redirect if current path is not allowed for this role
  useEffect(() => {
    if (!authChecked || !userRole) return
    const allowedKeys = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.admin
    const allowedHrefs = NAV_ITEMS
      .filter((item) => allowedKeys.includes(item.key))
      .map((item) => item.href)

    const isAllowed = allowedHrefs.some((href) =>
      href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
    )

    if (!isAllowed) {
      router.replace(ROLE_HOME[userRole] || '/dashboard/registrations')
    }
  }, [authChecked, userRole, pathname, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    await fetch('/api/auth/logout', { method: 'POST' }) // clears HttpOnly cookie
    router.replace('/login')
  }

  const handleNavigate = useCallback((href) => {
    setMobileSidebarOpen(false)
    router.push(href)
  }, [router])

  const currentSection = NAV_ITEMS.find((item) =>
    item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
  )

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFF8F4' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-[#FFE4D4] border-t-[#FF5C1A] animate-spin" />
          <p className="text-[#6B6B6B] text-sm font-semibold font-cairo">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#FFF8F4', direction: 'ltr' }}>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full flex-shrink-0">
        <Sidebar
          pathname={pathname}
          onNavigate={handleNavigate}
          user={user}
          userRole={userRole}
          onLogout={handleLogout}
          isExpanded={isExpanded}
          pinned={pinned}
          onTogglePin={() => setPinned((p) => !p)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        />
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative h-full z-10">
            <Sidebar
              pathname={pathname}
              onNavigate={handleNavigate}
              user={user}
              userRole={userRole}
              onLogout={handleLogout}
              isExpanded={true}
              pinned={true}
              onTogglePin={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header
          className="flex-shrink-0 h-16 flex items-center justify-between px-6"
          style={{ background: '#FFFFFF', borderBottom: '1px solid #FFE4D4', boxShadow: '0 2px 8px rgba(255,92,26,0.06)' }}
        >
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-[8px] text-[#6B6B6B] hover:bg-[#FFF0E8] transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Icon name="menu" className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">
                {currentSection ? t.nav[currentSection.key] : t.adminPanel}
              </h2>
            </div>
          </div>

          {/* Language Toggle — top right */}
          <button
            onClick={toggleLang}
            className="flex items-center rounded-full overflow-hidden border border-[#FFE4D4] text-xs font-bold font-cairo"
            style={{ background: '#FFF0E8' }}
          >
            <span
              className="px-4 py-2 transition-all duration-200"
              style={{ background: lang === 'ar' ? '#FF5C1A' : 'transparent', color: lang === 'ar' ? '#fff' : '#A0A0A0' }}
            >
              عربي
            </span>
            <span
              className="px-4 py-2 transition-all duration-200"
              style={{ background: lang === 'en' ? '#FF5C1A' : 'transparent', color: lang === 'en' ? '#fff' : '#A0A0A0' }}
            >
              English
            </span>
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// ── Export ─────────────────────────────────────────────────────────────────────
export default function DashboardLayout({ children }) {
  return (
    <DashboardLangProvider>
      <DashboardInner>{children}</DashboardInner>
    </DashboardLangProvider>
  )
}
