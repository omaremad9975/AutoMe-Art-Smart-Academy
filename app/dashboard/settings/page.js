'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useDashboardLang } from '@/lib/dashboard-lang'

function Field({ label, sublabel, id, type = 'text', value, onChange, placeholder, helpText }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[#1A1A1A] font-bold text-sm mb-1 font-cairo">
        {label}
        {sublabel && <span className="text-[#A0A0A0] font-normal mx-2 text-xs">{sublabel}</span>}
      </label>
      {helpText && <p className="text-xs text-[#A0A0A0] font-cairo mb-2">{helpText}</p>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-[10px] text-sm font-cairo text-[#1A1A1A] outline-none transition-all duration-200"
        style={{ border: '1.5px solid #FFE4D4', background: '#FFF8F4', direction: 'ltr' }}
        onFocus={(e) => { e.target.style.borderColor = '#FF5C1A'; e.target.style.boxShadow = '0 0 0 3px rgba(255,92,26,0.10)' }}
        onBlur={(e) => { e.target.style.borderColor = '#FFE4D4'; e.target.style.boxShadow = 'none' }}
      />
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
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('key, value')
      if (data && data.length > 0) {
        const map = {}
        data.forEach((row) => { map[row.key] = row.value })
        setSettings((prev) => ({ ...prev, ...map }))
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    const rows = Object.entries(settings).map(([key, value]) => ({ key, value }))
    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' })
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
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
    <div className="space-y-8" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <div>
        <h1 className="text-[#1A1A1A] font-extrabold text-2xl font-cairo">{t.settingsTitle}</h1>
        <p className="text-[#6B6B6B] text-sm font-cairo mt-1">{t.settingsSub}</p>
      </div>

      {/* ── Section: Academy Info ── */}
      <div
        className="rounded-[16px] overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #FFE4D4', background: '#FFF8F4' }}>
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
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              id="phone"
              label={t.phone}
              type="tel"
              value={settings.phone}
              onChange={setField('phone')}
              placeholder="+20 100 000 0000"
            />
            <Field
              id="whatsapp"
              label={t.whatsapp}
              type="tel"
              value={settings.whatsapp}
              onChange={setField('whatsapp')}
              placeholder="+20 100 000 0000"
            />
          </div>
          <Field
            id="email"
            label={t.email}
            type="email"
            value={settings.email}
            onChange={setField('email')}
            placeholder="info@artsmartacademy.com"
          />
        </div>
      </div>

      {/* ── Section: Certificate Format ── */}
      <div
        className="rounded-[16px] overflow-hidden"
        style={{ background: '#FFFFFF', border: '1px solid #FFE4D4', boxShadow: '0 4px 20px rgba(255,92,26,0.06)' }}
      >
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #FFE4D4', background: '#FFF8F4' }}>
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

        {saved && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-sm font-bold font-cairo"
            style={{ background: 'rgba(16,185,129,0.10)', color: '#059669', border: '1px solid rgba(16,185,129,0.20)' }}
          >
            {t.saved}
          </div>
        )}
      </div>
    </div>
  )
}
