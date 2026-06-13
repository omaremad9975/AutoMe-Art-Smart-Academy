import { Cairo } from 'next/font/google'
import './globals.css'

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata = {
  title: 'Art Smart Academy | أرت سمارت اكاديمي',
  description: 'أكاديمية متخصصة في الكورسات العلمية والفنية والرياضية واللغات وتنمية المهارات — Specialized courses in arts, sciences, sports, languages, and human development',
  keywords: 'art smart academy, أرت سمارت, كورسات, لغات, فنون, موسيقى, رياضة, علوم, ابتكار, مصر',
  openGraph: {
    title: 'Art Smart Academy | أرت سمارت اكاديمي',
    description: 'اكتشف · تعلّم · ابدع — أكاديمية متخصصة للكورسات التدريبية في مصر',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.className}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
