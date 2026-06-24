import { Cairo } from 'next/font/google'
import './globals.css'

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://artsmart-academy.com'),
  title: {
    default: 'Art Smart Academy | أرت سمارت اكاديمي',
    template: '%s | Art Smart Academy',
  },
  description: 'أرت سمارت اكاديمي — أكاديمية تدريب متخصصة في الكورسات الفنية والعلمية واللغات والرياضة وتنمية المهارات في مصر. سجّل الآن وابدأ رحلتك.',
  keywords: [
    'art smart academy', 'أرت سمارت اكاديمي', 'أكاديمية فنون', 'كورسات مصر',
    'تدريب مهني', 'لغات', 'فنون', 'موسيقى', 'رياضة', 'علوم', 'ابتكار',
    'تنمية مهارات', 'كورسات أطفال', 'تعليم مصر', 'أكاديمية تدريب القاهرة',
    'artsmart', 'courses egypt', 'training academy cairo'
  ],
  authors: [{ name: 'Art Smart Academy' }],
  creator: 'Art Smart Academy',
  publisher: 'Art Smart Academy',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: 'https://artsmart-academy.com',
  },
  openGraph: {
    title: 'Art Smart Academy | أرت سمارت اكاديمي',
    description: 'اكتشف · تعلّم · ابدع — أكاديمية متخصصة للكورسات التدريبية في مصر. سجّل الآن!',
    url: 'https://artsmart-academy.com',
    siteName: 'Art Smart Academy',
    locale: 'ar_EG',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Art Smart Academy | أرت سمارت اكاديمي',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Art Smart Academy | أرت سمارت اكاديمي',
    description: 'اكتشف · تعلّم · ابدع — أكاديمية متخصصة للكورسات التدريبية في مصر',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png', sizes: '790x790' }],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Art Smart Academy',
    alternateName: 'أرت سمارت اكاديمي',
    url: 'https://artsmart-academy.com',
    logo: 'https://artsmart-academy.com/logo_mark_black.png',
    description: 'أكاديمية تدريب متخصصة في الكورسات الفنية والعلمية واللغات والرياضة وتنمية المهارات في مصر',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EG',
      addressLocality: 'Cairo',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'info@artsmart-academy.com',
    },
    sameAs: [],
  }

  return (
    <html lang="ar" dir="rtl" className={cairo.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
