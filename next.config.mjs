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
        source: '/:path*',
        headers: [
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
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Cross-Origin-Opener-Policy (COOP)
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://googleads.g.doubleclick.net https://www.googleadservices.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://www.google.com https://googleads.g.doubleclick.net https://www.googleadservices.com https://viacep.com.br",
              "frame-src 'self' https://www.google.com https://www.googletagmanager.com https://streamable.com",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join('; '),
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
