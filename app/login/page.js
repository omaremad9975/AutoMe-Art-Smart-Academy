'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

// 🔧 2FA temporarily disabled — re-enable when domain is ready

// ── Shared input style helpers ────────────────────────────────────────────────
const inputBase = {
  border: '1.5px solid #FFE4D4',
  background: '#FFF8F4',
}
function onFocus(e) { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }
function onBlur(e)  { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }

// ── Step 1: Email + Password ──────────────────────────────────────────────────
function PasswordStep({ onSuccess }) {
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/send-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة')
        setLoading(false)
        return
      }
      // Pass credentials to OTP step (kept in memory only, never stored)
      onSuccess({ email, password })
    } catch {
      setError('خطأ في الاتصال، حاول مرة أخرى')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[#1A1A1A] font-bold text-sm mb-2 font-cairo" htmlFor="email">
          البريد الإلكتروني
        </label>
        <input
          id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          required placeholder="admin@artsmartacademy.com"
          className="w-full px-4 py-3 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
          style={inputBase} onFocus={onFocus} onBlur={onBlur}
        />
      </div>

      <div>
        <label className="block text-[#1A1A1A] font-bold text-sm mb-2 font-cairo" htmlFor="password">
          كلمة المرور
        </label>
        <div className="relative">
          <input
            id="password" type={showPassword ? 'text' : 'password'}
            value={password} onChange={(e) => setPassword(e.target.value)}
            required placeholder="••••••••"
            className="w-full px-4 py-3 pr-12 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
            style={inputBase} onFocus={onFocus} onBlur={onBlur}
          />
          <button type="button" onClick={() => setShowPassword((v) => !v)} tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
            style={{ color: '#A0A0A0' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FF5C1A'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#A0A0A0'}>
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm font-semibold text-center py-2.5 px-4 rounded-[10px] font-cairo"
          style={{ background: 'rgba(255,92,26,0.08)', color: '#CC3D00', border: '1px solid rgba(255,92,26,0.20)' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full py-3.5 rounded-[10px] font-bold text-white text-sm font-cairo transition-all duration-300 mt-2"
        style={{ background: loading ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A 0%, #FF7A40 100%)', boxShadow: loading ? 'none' : '0 8px 24px rgba(255,92,26,0.30)' }}>
        {loading
          ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
              جارٍ التحقق...
            </span>
          : 'متابعة'
        }
      </button>
    </form>
  )
}

// ── Step 2: OTP entry ─────────────────────────────────────────────────────────
function OtpStep({ email, password, onBack }) {
  const router                      = useRouter()
  const [code, setCode]             = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [resendCooldown, setResendCooldown] = useState(60)
  const [resending, setResending]   = useState(false)
  const inputRef                    = useRef(null)

  // Focus input on mount
  useEffect(() => { inputRef.current?.focus() }, [])

  // 60-second resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      await fetch('/api/auth/send-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      setResendCooldown(60)
      setCode('')
    } catch {
      setError('تعذّر إعادة الإرسال، حاول مرة أخرى')
    }
    setResending(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (code.length !== 6) { setError('الرمز يجب أن يكون 6 أرقام'); return }
    setLoading(true)
    setError('')

    try {
      // 1. Verify OTP
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, code }),
      })
      const verifyData = await verifyRes.json()
      if (!verifyRes.ok) {
        setError(verifyData.error === 'Invalid or expired code'
          ? 'الرمز غير صحيح أو انتهت صلاحيته'
          : 'حدث خطأ، حاول مرة أخرى')
        setLoading(false)
        return
      }

      // 2. OTP valid — now actually sign in to create the Supabase session
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        setError('حدث خطأ أثناء تسجيل الدخول، حاول مرة أخرى')
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('خطأ في الاتصال، حاول مرة أخرى')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Info box */}
      <div className="rounded-[12px] p-4 text-center"
        style={{ background: '#FFF0E8', border: '1px solid #FFE4D4' }}>
        <p className="text-xs font-semibold text-[#6B6B6B] font-cairo mb-1">تم إرسال رمز التحقق إلى</p>
        <p className="text-sm font-bold text-[#FF5C1A] font-cairo break-all">{email}</p>
        <p className="text-xs text-[#A0A0A0] font-cairo mt-1">الرمز صالح لمدة 10 دقائق</p>
      </div>

      {/* 6-digit input */}
      <div>
        <label className="block text-[#1A1A1A] font-bold text-sm mb-2 font-cairo">
          رمز التحقق (6 أرقام)
        </label>
        <input
          ref={inputRef}
          type="text" inputMode="numeric" maxLength={6}
          value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
          placeholder="• • • • • •"
          className="w-full px-4 py-4 rounded-[10px] text-2xl font-bold font-mono text-center text-[#1A1A1A] outline-none transition-all duration-200 tracking-[12px]"
          style={{ ...inputBase, letterSpacing: '12px' }}
          onFocus={onFocus} onBlur={onBlur}
        />
      </div>

      {error && (
        <div className="text-sm font-semibold text-center py-2.5 px-4 rounded-[10px] font-cairo"
          style={{ background: 'rgba(255,92,26,0.08)', color: '#CC3D00', border: '1px solid rgba(255,92,26,0.20)' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={loading || code.length !== 6}
        className="w-full py-3.5 rounded-[10px] font-bold text-white text-sm font-cairo transition-all duration-300"
        style={{
          background: (loading || code.length !== 6) ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A 0%, #FF7A40 100%)',
          boxShadow:  (loading || code.length !== 6) ? 'none' : '0 8px 24px rgba(255,92,26,0.30)',
        }}>
        {loading
          ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
              جارٍ التحقق...
            </span>
          : 'تأكيد الدخول'
        }
      </button>

      {/* Resend + back */}
      <div className="flex items-center justify-between pt-1">
        <button type="button" onClick={onBack}
          className="text-xs text-[#A0A0A0] font-cairo hover:text-[#FF5C1A] transition-colors">
          ← تغيير البريد
        </button>
        {resendCooldown > 0 ? (
          <span className="text-xs text-[#A0A0A0] font-cairo">
            إعادة الإرسال بعد {resendCooldown}ث
          </span>
        ) : (
          <button type="button" onClick={handleResend} disabled={resending}
            className="text-xs font-bold font-cairo transition-colors"
            style={{ color: resending ? '#A0A0A0' : '#FF5C1A' }}>
            {resending ? 'جارٍ الإرسال...' : 'إعادة إرسال الرمز'}
          </button>
        )}
      </div>
    </form>
  )
}

// ── Main Login Page ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const router = useRouter()
  // step: 'password' | 'otp'
  const [step, setStep]         = useState('password')
  const [credentials, setCredentials] = useState(null) // { email, password } — in memory only

  const handlePasswordSuccess = (creds) => {
    setCredentials(creds)
    setStep('otp')
  }

  const handleBack = () => {
    setCredentials(null)
    setStep('password')
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FFF8F4 0%, #FFE8D4 50%, #FFF8F4 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,92,26,0.12) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,92,26,0.08) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white rounded-[20px] p-10 shadow-[0_8px_40px_rgba(255,92,26,0.12),0_2px_8px_rgba(0,0,0,0.06)]"
          style={{ border: '1px solid #FFE4D4' }}>

          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-8">
            <img src="/logo_mark_black.png" alt="Art Smart Academy"
              className="h-10 w-auto object-contain mb-4" />
            <h1 className="text-[#1A1A1A] font-extrabold text-xl tracking-wide uppercase font-cairo text-center">
              SMART ACADEMY
            </h1>
            <p className="text-[#6B6B6B] text-sm font-semibold mt-1 font-cairo">لوحة التحكم — Admin</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#FF5C1A', color: '#FFFFFF' }}>1</div>
              <span className="text-xs font-semibold font-cairo" style={{ color: '#FF5C1A' }}>كلمة المرور</span>
            </div>
            <div className="flex-1 h-px" style={{ background: step === 'otp' ? '#FF5C1A' : '#FFE4D4', transition: 'background 0.3s' }} />
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: step === 'otp' ? '#FF5C1A' : '#FFE4D4', color: step === 'otp' ? '#FFFFFF' : '#A0A0A0', transition: 'all 0.3s' }}>2</div>
              <span className="text-xs font-semibold font-cairo" style={{ color: step === 'otp' ? '#FF5C1A' : '#A0A0A0', transition: 'color 0.3s' }}>رمز التحقق</span>
            </div>
          </div>

          <div className="h-px w-full mb-6" style={{ background: 'linear-gradient(to right, transparent, #FFE4D4, transparent)' }} />

          {step === 'password'
            ? <PasswordStep onSuccess={handlePasswordSuccess} />
            : <OtpStep email={credentials.email} password={credentials.password} onBack={handleBack} />
          }
        </div>

        <p className="text-center text-[#A0A0A0] text-xs font-semibold mt-6 font-cairo">
          © 2026 Art Smart Academy — Admin Access Only
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  )
}
