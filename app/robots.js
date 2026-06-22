export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/verify/'],
      },
    ],
    sitemap: 'https://artsmart-academy.com/sitemap.xml',
  }
}
