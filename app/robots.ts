import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://speedrepair.sbs'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/$', '/images/', '/_next/static/', '/_next/image'],
        disallow: [
          '/api/',
          '/quest',
          '/checkout',
          '/success',
          '/cupons',
          '/termos',
          '/privacidade',
          '/admin-simple/',
          '/debug/',
          '/analytics',
          '/x9f2w8k5',
        ],
      },
      // Bots de busca - apenas whitepage
      {
        userAgent: 'Googlebot',
        allow: ['/$', '/images/'],
        disallow: ['/api/', '/quest', '/checkout', '/success'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/$', '/images/'],
        disallow: ['/api/', '/quest', '/checkout', '/success'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
