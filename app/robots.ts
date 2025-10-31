import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://buxfire.shop'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin-simple/',
          '/debug/',
          '/_next/',
          '/private/',
        ],
      },
      // Otimização para bots de busca principais
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin-simple/', '/debug/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/admin-simple/', '/debug/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
