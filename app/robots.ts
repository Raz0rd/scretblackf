import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://comprardiamantesff.shop'

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/loja',
          '/produto/',
          '/unsubscribe',
          '/images/',
          '/_next/static/',
          '/_next/image',
        ],
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
          '/testxxadsantihack',
          '/test-ads',
        ],
      },
      // Bots de busca - whitepage completa
      {
        userAgent: 'Googlebot',
        allow: ['/', '/loja', '/produto/', '/images/'],
        disallow: ['/api/', '/quest', '/checkout', '/success', '/testxxadsantihack'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/loja', '/produto/', '/images/'],
        disallow: ['/api/', '/quest', '/checkout', '/success', '/testxxadsantihack'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
