import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://comprardiamantesff.shop'
  const currentDate = new Date()

  return [
    // Página Principal (White Page)
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Loja
    {
      url: `${baseUrl}/loja`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Produtos Free Fire
    {
      url: `${baseUrl}/produto/ff-5600`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produto/ff-2180`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produto/ff-1060`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produto/ff-calca`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Produtos Roblox
    {
      url: `${baseUrl}/produto/rbx-10000`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produto/rbx-4500`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produto/rbx-3600`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/produto/rbx-2700`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/produto/rbx-1500`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/produto/rbx-800`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Unsubscribe
    {
      url: `${baseUrl}/unsubscribe`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
