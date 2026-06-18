'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useDashboardLang } from '@/lib/dashboard-lang'

function Field({ label, sublabel, id, type = 'text', value, onChange, placeholder, helpText, isRTL, currentValue }) {
  const isDirty = currentValue !== undefined && value !== currentValue
  return (
    <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
      <label htmlFor={id} className="block text-[#1A1A1A] font-bold text-sm mb-1 font-cairo" style={{ display: 'block', textAlign: isRTL ? 'right' : 'left' }}>
        {label}
        {sublabel && <span className="text-[#A0A0A0] font-normal mx-2 text-xs">{sublabel}</span>}
      </label>
      {helpText && <p className="text-xs text-[#A0A0A0] font-cairo mb-2" style={{ textAlign: isRTL ? 'right' : 'left' }}>{helpText}</p>}
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
        <p className="text-xs font-cairo mt-1.5 flex items-center gap-1.5" style={{ textAlign: isRTL ? 'right' : 'left', direction: 'ltr' }}>
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

// Fixed-position toast banner
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
        <p style={{ fontWeight: 700, fontSize: '14px', margin: 0 }}>
          {toast.title}
        </p>
        {toast.description && (
          <p style={{ fontWeight: 400, fontSize: '12px', margin: '2px 0 0', opacity: 0.88 }}>
            {toast.description}
          </p>
        )}
      </div>
    </div>
  )
}

const DEFAULT_SETTINGS = {
  academy_name: 'Art Smart Academy | أرت سمارت اكاديمي',
  phone: '+20 100 000 0000',
  email: 'info@artsmartacademy.com',
  whatsapp: '+20 100 000 0000',
  cert_id_format: 'ASA-[COURSE]-[YEAR]-[NUMBER]',
}

export default function SettingsPage() {
  const { t, isRTL } = useDashboardLang()
  const [settings, setSettings]           = useState(DEFAULT_SETTINGS)
  const [savedSettings, setSavedSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading]             = useState(true)
  const [saving, setSaving]               = useState(false)
  const [toast, setToast]                 = useState(null)
  const toastTimer                        = useRef(null)

  const showToast = (type, title, description) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ type, title, description })
    toastTimer.current = setTimeout(() => setToast(null), 4500)
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setLoading(false); return }

        const res = await fetch('/api/admin/settings', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const result = await res.json()
        if (result.settings && Object.keys(result.settings).length > 0) {
          setSettings((prev) => ({ ...prev, ...result.settings }))
          setSavedSettings((prev) => ({ ...prev, ...result.settings }))
        }
      } catch {
        // silently fall back to defaults
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        showToast('error',
          isRTL ? 'خطأ في المصادقة' : 'Authentication Error',
          isRTL ? 'يرجى تسجيل الدخول مرة أخرى' : 'Please sign in again'
        )
        setSaving(false)
        return
      }

      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(settings),
      })
      const result = await res.json()

      if (!res.ok || result.error) {
        showToast('error',
          isRTL ? 'فشل الحفظ' : 'Save Failed',
          result.error || (isRTL ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred')
        )
      } else {
        setSavedSettings(settings)
        showToast('success',
          isRTL ? 'تم الحفظ بنجاح' : 'Changes Saved Successfully',
          isRTL ? 'تم تحديث الإعدادات وستظهر في الموقع فوراً' : 'Settings updated and will reflect on the site immediately'
        )
      }
    } catch (err) {
      showToast('error',
        isRTL ? 'خطأ في الشبكة' : 'Network Error',
        err?.message || (isRTL ? 'تعذّر الاتصال بالخادم' : 'Could not reach the server')
      )
    }
    setSaving(false)
  }

  const setField = (key) => (e) => setSettings((s) => ({ ...s, [key]: e.target.value }))

  if (loading) {
    return (
      <div className="space-y-6" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        <div>
          <div className="h-8 w-48 rounded-lg animate-pulse" style={{ background: '#FFE4D4' }} />
          <div className="h-4 w-32 rounded mt-2 animate-pulse" style={{ background: '#FFE4D4' }} />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
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

        {/* ── Section: Academy Info ── */}
        <div
          className="rounded-[16px] overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}
        >
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #FFE4D4', background: '#FFF8F4', textAlign: isRTL ? 'right' : 'left' }}>
            <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">{t.sectionAcademy}</h2>
            <p className="text-xs text-[#A0A0A0] font-cairo">{t.sectionAcademySub}</p>
          </div>
          <div className="p-6 space-y-5">
            <Field
              id="academy_name"
              label={t.academyName}
              value={settings.academy_name}
              onChange={setField('academy_name')}
              placeholder="Art Smart Academy | أرت سمارت اكاديمي"
              isRTL={isRTL}
              currentValue={savedSettings.academy_name}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                id="phone"
                label={t.phone}
                type="tel"
                value={settings.phone}
                onChange={setField('phone')}
                placeholder="+20 100 000 0000"
                isRTL={isRTL}
                currentValue={savedSettings.phone}
              />
              <Field
                id="whatsapp"
                label={t.whatsapp}
                type="tel"
                value={settings.whatsapp}
                onChange={setField('whatsapp')}
                placeholder="+20 100 000 0000"
                isRTL={isRTL}
                currentValue={savedSettings.whatsapp}
              />
            </div>
            <Field
              id="email"
              label={t.email}
              type="email"
              value={settings.email}
              onChange={setField('email')}
              placeholder="info@artsmartacademy.com"
              isRTL={isRTL}
              currentValue={savedSettings.email}
            />
          </div>
        </div>

        {/* ── Section: Certificate Format ── */}
        <div
          className="rounded-[16px] overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}
        >
          <div className="px-6 py-4" style={{ borderBottom: '1px solid #FFE4D4', background: '#FFF8F4', textAlign: isRTL ? 'right' : 'left' }}>
            <h2 className="font-bold text-[#1A1A1A] text-sm font-cairo">{t.sectionCert}</h2>
            <p className="text-xs text-[#A0A0A0] font-cairo">{t.sectionCertSub}</p>
          </div>
          <div className="p-6 space-y-4">
            <Field
              id="cert_id_format"
              label={t.certFormat}
              value={settings.cert_id_format}
              onChange={setField('cert_id_format')}
              placeholder="ASA-[COURSE]-[YEAR]-[NUMBER]"
              helpText={t.certHelp}
              isRTL={isRTL}
              currentValue={savedSettings.cert_id_format}
            />
            {/* Preview */}
            <div className="rounded-[10px] p-4 flex items-center gap-4" style={{ background: '#FFF8F4', border: '1px solid #FFE4D4' }}>
              <div>
                <p className="text-xs font-bold text-[#A0A0A0] uppercase tracking-wider font-cairo mb-1">{t.certPreview}</p>
                <p className="font-bold text-lg font-mono text-[#FF5C1A]">
                  {settings.cert_id_format
                    .replace('[COURSE]', 'CREATIVE')
                    .replace('[YEAR]', new Date().getFullYear())
                    .replace('[NUMBER]', '001')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4" style={{ justifyContent: isRTL ? 'flex-end' : 'flex-start' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-[10px] text-sm font-bold text-white font-cairo transition-all duration-200"
            style={{
              background: saving ? '#FFB89A' : 'linear-gradient(135deg, #FF5C1A, #FF7A40)',
              boxShadow: saving ? 'none' : '0 4px 16px rgba(255,92,26,0.30)',
            }}
            onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,92,26,0.40)' } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = saving ? 'none' : '0 4px 16px rgba(255,92,26,0.30)' }}
          >
            {saving ? t.savingSettings : t.saveSettings}
          </button>
        </div>
      </div>
    </>
  )
}
