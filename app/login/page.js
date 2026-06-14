'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFF8F4 0%, #FFE8D4 50%, #FFF8F4 100%)' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,92,26,0.12) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,92,26,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Card */}
        <div
          className="bg-white rounded-[20px] p-10 shadow-[0_8px_40px_rgba(255,92,26,0.12),0_2px_8px_rgba(0,0,0,0.06)]"
          style={{ border: '1px solid #FFE4D4' }}
        >
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="/logo_mark_blue.png"
              alt="Art Smart Academy"
              className="h-12 w-auto object-contain mb-4"
              style={{ filter: 'brightness(0) saturate(100%)' }}
            />
            <h1 className="text-[#1A1A1A] font-extrabold text-xl tracking-wide uppercase font-cairo text-center">
              SMART ACADEMY
            </h1>
            <p className="text-[#6B6B6B] text-sm font-semibold mt-1 font-cairo">لوحة التحكم — Admin</p>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#FFE4D4] to-transparent mb-8" />

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-2 font-cairo" htmlFor="email">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@artsmartacademy.com"
                className="w-full px-4 py-3 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
                style={{
                  border: '1.5px solid #FFE4D4',
                  background: '#FFF8F4',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF5C1A'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#FFE4D4'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            <div>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-2 font-cairo" htmlFor="password">
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
                style={{
                  border: '1.5px solid #FFE4D4',
                  background: '#FFF8F4',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#FF5C1A'
                  e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#FFE4D4'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {error && (
              <div
                className="text-sm font-semibold text-center py-2.5 px-4 rounded-[10px] font-cairo"
                style={{ background: 'rgba(255,92,26,0.08)', color: '#CC3D00', border: '1px solid rgba(255,92,26,0.20)' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-[10px] font-bold text-white text-sm font-cairo transition-all duration-300 mt-2"
              style={{
                background: loading ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A 0%, #FF7A40 100%)',
                boxShadow: loading ? 'none' : '0 8px 24px rgba(255,92,26,0.30)',
              }}
            >
              {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-[#A0A0A0] text-xs font-semibold mt-6 font-cairo">
          © 2026 Art Smart Academy — Admin Access Only
        </p>
      </div>
    </main>
  )
}
