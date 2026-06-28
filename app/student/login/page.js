'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function StudentLogin() {
  const router = useRouter()
  const [step, setStep]         = useState('email') // 'email' | 'otp'
  const [email, setEmail]       = useState('')
  const [code, setCode]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [notice, setNotice]     = useState('')

  // Show session-expired notice if redirected from portal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reason = params.get('reason')
    if (reason === 'expired') setNotice('انتهت صلاحية جلستك. من فضلك سجّل دخولك مجدداً.')
    if (reason === 'session') setNotice('يرجى تسجيل الدخول للمتابعة.')
    if (reason) window.history.replaceState({}, '', '/student/login')
  }, [])

  // Redirect if already logged in with a valid new-format token
  useEffect(() => {
    try {
      const token = localStorage.getItem('student_token')
      if (!token) return
      const payload = JSON.parse(atob(token))
      if (!payload.sig) { localStorage.removeItem('student_token'); return } // old format
      if (payload.exp > Date.now()) router.replace('/student/my-certificates')
    } catch {}
  }, [router])

  async function handleEmailSubmit(e) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/student/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim() }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong'); setLoading(false); return }
      setStep('otp')
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  async function handleOtpSubmit(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true); setError('')
    try {
      const res  = await fetch('/api/student/verify-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), code: code.trim() }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Invalid code'); setLoading(false); return }
      localStorage.setItem('student_token', data.token)
      localStorage.setItem('student_email', data.email)
      router.replace('/student/my-certificates')
    } catch { setError('Network error. Please try again.') }
    setLoading(false)
  }

  const INPUT = { width: '100%', padding: '13px 16px', borderRadius: '12px', fontSize: '15px', fontFamily: 'Cairo, sans-serif', color: '#111827', outline: 'none', border: '1.5px solid #E5E7EB', background: '#F9FAFB', boxSizing: 'border-box', direction: 'ltr' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#FFF8F4 0%,#FFE4D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Cairo, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/logo_mark_black.png" alt="Art Smart Academy" style={{ height: '48px', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto 12px' }} />
          <h1 style={{ color: '#111827', fontWeight: 900, fontSize: '22px', margin: '0 0 4px', fontFamily: 'Cairo, sans-serif' }}>بوابة الشهادات</h1>
          <p style={{ color: '#9CA3AF', fontSize: '13px', margin: 0, fontFamily: 'Cairo, sans-serif' }}>Student Certificate Portal</p>
        </div>

        {/* Session notice */}
        {notice && (
          <div style={{ background: '#FFF7ED', border: '1px solid #FDBA74', borderRadius: '12px', padding: '12px 16px', marginBottom: '16px', color: '#9A3412', fontSize: '14px', fontFamily: 'Cairo, sans-serif', textAlign: 'center', direction: 'rtl' }}>
            {notice}
          </div>
        )}

        {/* Card */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #FFE4D4', boxShadow: '0 20px 60px rgba(255,92,26,0.12)' }}>

          {step === 'email' ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '22px' }}>📧</div>
                <h2 style={{ color: '#111827', fontWeight: 800, fontSize: '18px', margin: '0 0 6px', fontFamily: 'Cairo, sans-serif' }}>أدخل بريدك الإلكتروني</h2>
                <p style={{ color: '#9CA3AF', fontSize: '13px', margin: 0, lineHeight: 1.6, fontFamily: 'Cairo, sans-serif' }}>سنرسل لك رمز تحقق للوصول إلى شهاداتك</p>
              </div>
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontFamily: 'Cairo, sans-serif' }}>البريد الإلكتروني</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" required style={INPUT}
                    onFocus={e => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.12)'; e.target.style.background = '#FFFFFF' }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }} />
                </div>
                {error && <p style={{ color: '#EF4444', fontSize: '13px', fontFamily: 'Cairo, sans-serif', margin: 0, textAlign: 'center' }}>{error}</p>}
                <button type="submit" disabled={loading}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: loading ? '#FCA587' : 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', fontWeight: 800, fontSize: '15px', fontFamily: 'Cairo, sans-serif', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 20px rgba(255,92,26,0.35)', transition: 'all 0.2s' }}>
                  {loading ? 'جارٍ الإرسال...' : 'إرسال رمز التحقق →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '22px' }}>🔐</div>
                <h2 style={{ color: '#111827', fontWeight: 800, fontSize: '18px', margin: '0 0 6px', fontFamily: 'Cairo, sans-serif' }}>أدخل رمز التحقق</h2>
                <p style={{ color: '#9CA3AF', fontSize: '13px', margin: 0, lineHeight: 1.6, fontFamily: 'Cairo, sans-serif' }}>تم إرسال رمز مكون من 6 أرقام إلى<br/><strong style={{ color: '#FF5C1A' }}>{email}</strong></p>
              </div>
              <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px', fontFamily: 'Cairo, sans-serif' }}>رمز التحقق</label>
                  <input type="text" inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} placeholder="● ● ● ● ● ●" required
                    style={{ ...INPUT, textAlign: 'center', letterSpacing: '8px', fontSize: '22px', fontWeight: 900, color: '#FF5C1A' }}
                    onFocus={e => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.12)'; e.target.style.background = '#FFFFFF' }}
                    onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; e.target.style.background = '#F9FAFB' }} />
                </div>
                {error && <p style={{ color: '#EF4444', fontSize: '13px', fontFamily: 'Cairo, sans-serif', margin: 0, textAlign: 'center' }}>{error}</p>}
                <button type="submit" disabled={loading || code.length < 6}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: (loading || code.length < 6) ? '#FCA587' : 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', fontWeight: 800, fontSize: '15px', fontFamily: 'Cairo, sans-serif', cursor: (loading || code.length < 6) ? 'not-allowed' : 'pointer', boxShadow: (loading || code.length < 6) ? 'none' : '0 4px 20px rgba(255,92,26,0.35)', transition: 'all 0.2s' }}>
                  {loading ? 'جارٍ التحقق...' : 'دخول إلى شهاداتي 🎓'}
                </button>
                <button type="button" onClick={() => { setStep('email'); setCode(''); setError('') }}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: '13px', fontFamily: 'Cairo, sans-serif', cursor: 'pointer', textAlign: 'center' }}>
                  ← تغيير البريد الإلكتروني
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', color: '#C0C0C0', fontSize: '12px', marginTop: '20px', fontFamily: 'Cairo, sans-serif' }}>
          © 2026 Art Smart Academy
        </p>
      </div>
    </div>
  )
}
