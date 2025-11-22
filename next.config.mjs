/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSR + APIs habilitados, não usamos export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // evita erro com o otimizador de imagens do Next
  },
  trailingSlash: true,
  
  // Sem redirects - www e sem www retornam 200 OK
  skipTrailingSlashRedirect: true,

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path((?!.*\\.).*)', // Apenas para rotas HTML (sem extensão)
        headers: [
          // UTF-8 Encoding para HTML
          {
            key: 'Content-Type',
            value: 'text/html; charset=utf-8',
          },
          // Clickjacking Protection
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Content Type Sniffing Protection
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // HSTS - Force HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // XSS Protection
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    }

    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          default: false,
          vendors: false,
          ui: {
            name: 'ui',
            chunks: 'all',
            test: /[\\/]components[\\/]/,
            priority: 20,
          },
          hooks: {
            name: 'hooks',
            chunks: 'all',
            test: /[\\/]hooks[\\/]/,
            priority: 10,
          },
        },
      },
    }

    return config
  },

  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-switch',
      '@radix-ui/react-dialog'
    ],
  },
}

export default nextConfig
