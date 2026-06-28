/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevents the site from being embedded in an iframe (clickjacking protection)
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Stops browser from guessing content type (MIME sniffing protection)
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Controls how much referrer info is sent
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restricts access to powerful browser features
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Forces HTTPS for 1 year
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Content Security Policy — controls what resources the browser can load
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://*.supabase.in",
      "connect-src 'self' https://*.supabase.co https://*.supabase.in wss://*.supabase.co",
      "object-src 'none'",
      "frame-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
