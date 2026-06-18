'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useDashboardLang } from '@/lib/dashboard-lang'

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null
  const isSuccess = toast.type === 'success'
  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        minWidth: '320px',
        maxWidth: '560px',
        padding: '14px 20px',
        borderRadius: '12px',
        background: isSuccess ? '#059669' : '#DC2626',
        color: '#FFFFFF',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        fontFamily: 'Cairo, sans-serif',
        animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-16px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
      <span style={{ fontSize: '18px', lineHeight: 1.2, flexShrink: 0 }}>
        {isSuccess ? '✓' : '✕'}
      </span>
      <div>
        <p style={{ fontWeight: 700, fontSize: '14px', margin: 0 }}>{toast.title}</p>
        {toast.description && (
          <p style={{ fontWeight: 400, fontSize: '12px', margin: '2px 0 0', opacity: 0.88 }}>
            {toast.description}
          </p>
        )}
      </div>
    </div>
  )
}

function Field({ label, id, type = 'text', value, onChange, placeholder, helpText, isRTL, currentValue }) {
  const isDirty = currentValue !== undefined && value !== currentValue
  return (
    <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
      <label htmlFor={id} className="block text-[#1A1A1A] font-bold text-sm mb-1 font-cairo">
        {label}
      </label>
      {helpText && <p className="text-xs text-[#A0A0A0] font-cairo mb-2">{helpText}</p>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
        style={{ border: isDirty ? '1.5px solid #F59E0B' : '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr', textAlign: 'left' }}
        onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
        onBlur={(e) => { e.target.style.borderColor = isDirty ? '#F59E0B' : '#FFE4D4'; e.target.style.boxShadow = 'none' }}
      />
      {currentValue && (
        <p className="text-xs font-cairo mt-1.5 flex items-center gap-1.5" style={{ direction: 'ltr' }}>
          <span style={{ color: '#A0A0A0' }}>{isRTL ? 'الحالي:' : 'Current:'}</span>
          <span style={{ color: isDirty ? '#F59E0B' : '#6B6B6B', fontWeight: isDirty ? 600 : 400, textDecoration: isDirty ? 'line-through' : 'none' }}>
            {currentValue}
          </span>
          {isDirty && <span style={{ color: '#FF5C1A', fontWeight: 600 }}>→ {value}</span>}
        </p>
      )}
    </div>
  )
}

const DEFAULT_CERT = { cert_id_format: 'ASA-[COURSE]-[YEAR]-[NUMBER]' }

export default function SettingsPage() {
  const { t, isRTL } = useDashboardLang()

  // ── Certificate state ──────────────────────────────────────────────────────
  const [certFormat, setCertFormat]       = useState(DEFAULT_CERT.cert_id_format)
  const [savedCertFormat, setSavedCert]   = useState(DEFAULT_CERT.cert_id_format)
  const [loadingCert, setLoadingCert]     = useState(true)
  const [savingCert, setSavingCert]       = useState(false)

  // ── Password state ─────────────────────────────────────────────────────────
  const [oldPassword, setOldPassword]     = useState('')
  const [newPassword, setNewPassword]     = useState('')
  const [confirmPw, setConfirmPw]         = useState('')
  const [savingPw, setSavingPw]           = useState(false)

  // ── Toast ──────────────────────────────────────────────────────────────────
  const [toast, setToast]   = useState(null)
  const toastTimer          = useRef(null)

  const showToast = (type, title, description) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ type, title, description })
    toastTimer.current = setTimeout(() => setToast(null), 4500)
  }

  // ── Load cert format ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setLoadingCert(false); return }
        const res = await fetch('/api/admin/settings', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const result = await res.json()
        if (result.settings?.cert_id_format) {
          setCertFormat(result.settings.cert_id_format)
          setSavedCert(result.settings.cert_id_format)
        }
      } catch {}
      setLoadingCert(false)
    }
    load()
  }, [])

  // ── Save cert format ────────────────────────────────────────────────────────
  const handleSaveCert = async () => {
    setSavingCert(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { showToast('error', isRTL ? 'خطأ في المصادقة' : 'Auth Error', ''); setSavingCert(false); return }
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ cert_id_format: certFormat }),
      })
      const result = await res.json()
      if (!res.ok || result.error) {
        showToast('error', isRTL ? 'فشل الحفظ' : 'Save Failed', result.error)
      } else {
        setSavedCert(certFormat)
        showToast('success', isRTL ? 'تم الحفظ بنجاح' : 'Saved Successfully', isRTL ? 'تم تحديث صيغة رقم الشهادة' : 'Certificate ID format updated')
      }
    } catch (err) {
      showToast('error', isRTL ? 'خطأ في الشبكة' : 'Network Error', err?.message)
    }
    setSavingCert(false)
  }

  // ── Change password ─────────────────────────────────────────────────────────
  const handleChangePassword = async () => {
    if (!oldPassword) {
      showToast('error',
        isRTL ? 'أدخل كلمة المرور الحالية' : 'Enter Current Password',
        isRTL ? 'يجب إدخال كلمة المرور الحالية للتحقق من هويتك' : 'You must enter your current password to verify your identity'
      )
      return
    }
    if (newPassword.length < 6) {
      showToast('error',
        isRTL ? 'كلمة المرور قصيرة' : 'Password Too Short',
        isRTL ? 'يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل' : 'New password must be at least 6 characters'
      )
      return
    }
    if (newPassword !== confirmPw) {
      showToast('error',
        isRTL ? 'كلمات المرور غير متطابقة' : 'Passwords Do Not Match',
        isRTL ? 'تأكد من أن كلمتَي المرور متطابقتان' : 'Make sure both passwords are identical'
      )
      return
    }
    setSavingPw(true)
    // Re-authenticate with old password first
    const { data: { user } } = await supabase.auth.getUser()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    })
    if (signInError) {
      setSavingPw(false)
      showToast('error',
        isRTL ? 'كلمة المرور الحالية خاطئة' : 'Incorrect Current Password',
        isRTL ? 'تأكد من كلمة المرور الحالية وحاول مجدداً' : 'Check your current password and try again'
      )
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setSavingPw(false)
    if (error) {
      showToast('error', isRTL ? 'فشل تغيير كلمة المرور' : 'Password Change Failed', error.message)
    } else {
      setOldPassword('')
      setNewPassword('')
      setConfirmPw('')
      showToast('success',
        isRTL ? 'تم تغيير كلمة المرور' : 'Password Changed',
        isRTL ? 'يمكنك استخدام كلمة المرور الجديدة في المرة القادمة' : 'Your new password is active immediately'
      )
    }
  }

  if (loadingCert) {
    return (
      <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <div className="h-8 w-48 rounded-lg animate-pulse" style={{ background: '#FFE4D4' }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 rounded-[12px] animate-pulse" style={{ background: '#FFE4D4' }} />
        ))}
      </div>
    )
  }

  return (
    <>
      <Toast toast={toast} />

      <div className="space-y-8" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        {/* Header */}
        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">{t.settingsTitle}</h1>
          <p className="text-[#6B6B6B] text-sm font-cairo mt-1">{t.settingsSub}</p>
        </div>

        {/* ── Certificate Format ── */}
        <div className="rounded-[16px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #FFE4D4', background: '#FFF8F4', textAlign: isRTL ? 'right' : 'left' }}>
            <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">{t.sectionCert}</h2>
            <p className="text-xs text-[#A0A0A0] font-cairo">{t.sectionCertSub}</p>
          </div>
          <div className="p-6 space-y-4">
            <Field
              id="cert_id_format"
              label={t.certFormat}
              value={certFormat}
              onChange={(e) => setCertFormat(e.target.value)}
              placeholder="ASA-[COURSE]-[YEAR]-[NUMBER]"
              helpText={t.certHelp}
              isRTL={isRTL}
              currentValue={savedCertFormat}
            />
            {/* Preview */}
            <div className="rounded-[10px] p-4" style={{ background: '#FFF8F4', border: '1px solid #FFE4D4' }}>
              <p className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo mb-1" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t.certPreview}</p>
              <p className="font-bold text-lg font-mono text-[#FF5C1A]" style={{ textAlign: isRTL ? 'right' : 'left', direction: 'ltr' }}>
                {certFormat
                  .replace('[COURSE]', 'CREATIVE')
                  .replace('[YEAR]', new Date().getFullYear())
                  .replace('[NUMBER]', '001')}
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <button
            onClick={handleSaveCert}
            disabled={savingCert}
            className="px-8 py-3 rounded-[10px] text-sm font-bold text-white font-cairo transition-all duration-200"
            style={{ background: savingCert ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)', boxShadow: savingCert ? 'none' : '0 4px 16px rgba(255,92,26,0.30)' }}
            onMouseEnter={(e) => { if (!savingCert) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,92,26,0.40)' } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = savingCert ? 'none' : '0 4px 16px rgba(255,92,26,0.30)' }}
          >
            {savingCert ? t.savingSettings : t.saveSettings}
          </button>
        </div>

        {/* ── Change Password ── */}
        <div className="rounded-[16px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}>
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #FFE4D4', background: '#FFF8F4', textAlign: isRTL ? 'right' : 'left' }}>
            <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">
              {isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
            </h2>
            <p className="text-xs text-[#A0A0A0] font-cairo">
              {isRTL ? 'يمكن لأي مستخدم تغيير كلمة مروره الخاصة' : 'Each user can change their own password'}
            </p>
          </div>
          <div className="p-6 space-y-4">
            {/* Old password */}
            <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
              <label className="block text-[#1A1A1A] font-bold text-sm mb-1 font-cairo">
                {isRTL ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={isRTL ? 'أدخل كلمة المرور الحالية' : 'Enter your current password'}
                className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
                style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr', textAlign: 'left' }}
                onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
                onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                <label className="block text-[#1A1A1A] font-bold text-sm mb-1 font-cairo">
                  {isRTL ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={isRTL ? '٦ أحرف على الأقل' : 'Minimum 6 characters'}
                  className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
                  style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr', textAlign: 'left' }}
                  onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
                  onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                <label className="block text-[#1A1A1A] font-bold text-sm mb-1 font-cairo">
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder={isRTL ? 'أعد كتابة كلمة المرور' : 'Repeat new password'}
                  className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
                  style={{
                    border: confirmPw && newPassword !== confirmPw ? '1.5px solid #DC2626' : '1.5px solid #FFE4D4',
                    background: '#FFF8F4',
                    direction: 'ltr',
                    textAlign: 'left',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
                  onBlur={(e) => {
                    e.target.style.borderColor = (confirmPw && newPassword !== confirmPw) ? '#DC2626' : '#FFE4D4'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {confirmPw && newPassword !== confirmPw && (
                  <p className="text-xs font-cairo mt-1" style={{ color: '#DC2626' }}>
                    {isRTL ? 'كلمتا المرور غير متطابقتان' : 'Passwords do not match'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <button
            onClick={handleChangePassword}
            disabled={savingPw || !oldPassword || !newPassword || !confirmPw}
            className="px-8 py-3 rounded-[10px] text-sm font-bold text-white font-cairo transition-all duration-200"
            style={{
              background: savingPw ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)',
              boxShadow: savingPw ? 'none' : '0 4px 16px rgba(255,92,26,0.30)',
              opacity: (!oldPassword || !newPassword || !confirmPw) ? 0.6 : 1,
            }}
            onMouseEnter={(e) => { if (!savingPw && oldPassword && newPassword && confirmPw) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,92,26,0.40)' } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = savingPw ? 'none' : '0 4px 16px rgba(255,92,26,0.30)' }}
          >
            {savingPw
              ? (isRTL ? 'جارٍ التغيير...' : 'Changing...')
              : (isRTL ? 'تغيير كلمة المرور' : 'Change Password')
            }
          </button>
        </div>
      </div>
    </>
  )
}
