import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/produto/',
          '/unsubscribe',
          '/images/',
          '/_next/static/',
          '/_next/image',
        ],
        disallow: [
          '/api/',
          '/promo',
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
        allow: ['/', '/produto/', '/images/'],
        disallow: ['/api/', '/promo', '/checkout', '/success', '/testxxadsantihack'],
      },
      {
        userAgent: 'Bingbot',
        allow: ['/', '/produto/', '/images/'],
        disallow: ['/api/', '/promo', '/checkout', '/success', '/testxxadsantihack'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
