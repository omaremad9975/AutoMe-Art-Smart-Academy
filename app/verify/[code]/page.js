'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function VerifyCertificate() {
  const { code } = useParams()
  const [state, setState]   = useState('loading') // 'loading' | 'valid' | 'invalid'
  const [cert, setCert]     = useState(null)

  useEffect(() => {
    if (!code) { setState('invalid'); return }
    fetch(`/api/public/verify-certificate?code=${code.toUpperCase()}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid && data.certificate) { setCert(data.certificate); setState('valid') }
        else setState('invalid')
      })
      .catch(() => setState('invalid'))
  }, [code])

  const issuedDate = cert ? new Date(cert.issued_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#FFF8F4 0%,#FFE4D4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Cairo, sans-serif' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ width: '100%', maxWidth: '520px' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo_mark_black.png" alt="Art Smart Academy" style={{ height: '40px', objectFit: 'contain' }} />
        </div>

        {/* Loading */}
        {state === 'loading' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '60px', textAlign: 'center', border: '1px solid #FFE4D4' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5C1A" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px', display: 'block' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>
            <p style={{ color: '#9CA3AF', margin: 0, fontFamily: 'Cairo, sans-serif' }}>Verifying certificate...</p>
          </div>
        )}

        {/* Invalid */}
        {state === 'invalid' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '40px', textAlign: 'center', border: '1.5px solid #FECACA', boxShadow: '0 8px 32px rgba(220,38,38,0.08)' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(220,38,38,0.10)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '28px' }}>❌</div>
            <h2 style={{ color: '#DC2626', fontWeight: 900, fontSize: '20px', margin: '0 0 8px', fontFamily: 'Cairo, sans-serif' }}>Certificate Not Found</h2>
            <p style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: 1.7, margin: '0 0 20px', fontFamily: 'Cairo, sans-serif' }}>
              The verification code <strong style={{ color: '#374151', fontFamily: 'monospace', letterSpacing: '1px' }}>{code?.toUpperCase()}</strong> does not match any certificate in our records.
            </p>
            <p style={{ color: '#9CA3AF', fontSize: '12px', margin: 0, fontFamily: 'Cairo, sans-serif' }}>
              If you believe this is an error, please contact Art Smart Academy.
            </p>
          </div>
        )}

        {/* Valid */}
        {state === 'valid' && cert && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', border: '1.5px solid rgba(16,185,129,0.30)', boxShadow: '0 20px 60px rgba(16,185,129,0.12)' }}>
            {/* Green header */}
            <div style={{ background: 'linear-gradient(135deg,#059669,#10B981)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.20)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '26px' }}>✅</div>
              <h2 style={{ color: '#FFFFFF', fontWeight: 900, fontSize: '20px', margin: '0 0 4px', fontFamily: 'Cairo, sans-serif' }}>Certificate Verified</h2>
              <p style={{ color: 'rgba(255,255,255,0.80)', fontSize: '13px', margin: 0, fontFamily: 'Cairo, sans-serif' }}>This is an authentic Art Smart Academy certificate</p>
            </div>

            {/* Details */}
            <div style={{ padding: '28px' }}>
              {[
                { label: 'Student Name', value: cert.student_name },
                { label: 'Course (Arabic)', value: cert.course_name_ar },
                { label: 'Course (English)', value: cert.course_name_en },
                { label: 'Issue Date', value: issuedDate },
                { label: 'Verification Code', value: cert.verification_code, mono: true },
              ].map(({ label, value, mono }) => value ? (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: 'Cairo, sans-serif' }}>{label}</span>
                  <span style={{ color: '#111827', fontSize: '14px', fontWeight: 700, fontFamily: mono ? 'monospace' : 'Cairo, sans-serif', letterSpacing: mono ? '1px' : 'normal', color: mono ? '#059669' : '#111827' }}>{value}</span>
                </div>
              ) : null)}

              {cert.certificate_url && (
                <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', marginTop: '20px', padding: '13px', borderRadius: '12px', background: 'linear-gradient(135deg,#FF5C1A,#FF7A40)', color: '#FFFFFF', textAlign: 'center', textDecoration: 'none', fontWeight: 800, fontSize: '14px', fontFamily: 'Cairo, sans-serif', boxShadow: '0 4px 16px rgba(255,92,26,0.30)' }}>
                  📄 View Certificate PDF
                </a>
              )}
            </div>

            <div style={{ padding: '14px 28px', background: '#F9FAFB', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#C0C0C0', fontFamily: 'Cairo, sans-serif' }}>© 2026 Art Smart Academy · artsmart.edu.eg</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
