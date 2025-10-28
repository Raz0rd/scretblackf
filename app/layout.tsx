import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import Script from "next/script"
import "./globals.css"
import HeadManager from "@/components/HeadManager"
import ClickTracker from "@/components/ClickTracker"
import PWAInstaller from "@/components/PWAInstaller"
import DynamicTheme from "@/components/DynamicTheme"
import VerificationWrapper from "@/components/VerificationWrapper"
import { DevToolsBlocker } from "@/components/DevToolsBlocker"

export const metadata: Metadata = {
  title: "SpeedRepair - Portal Digital | Tecnologia e Serviços Online",
  description: "Portal digital com informações sobre tecnologia, jogos e produtos selecionados. Conteúdo informativo e dicas úteis. Site confiável desde 2015.",
  keywords: [
    "speedrepair",
    "portal digital",
    "tecnologia",
    "serviços online",
    "conteúdo digital",
    "informações tecnologia",
    "dicas tecnologia",
    "produtos digitais",
    "site confiável",
    "pagamento pix",
    "serviços digitais"
  ],
  authors: [{ name: "SpeedRepair" }],
  generator: "Next.js",
  applicationName: "SpeedRepair",
  referrer: "origin-when-cross-origin",
  creator: "SpeedRepair",
  publisher: "SpeedRepair - LUIZ ANTONIO SOUZA DOS SANTOS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SpeedRepair - Portal Digital | Tecnologia e Serviços Online",
    description: "Portal digital com informações sobre tecnologia, jogos e produtos selecionados. Conteúdo informativo e dicas úteis. Site confiável desde 2015.",
    url: "/",
    siteName: "SpeedRepair",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SpeedRepair - Portal Digital"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedRepair - Portal Digital | Tecnologia e Serviços Online",
    description: "Portal digital com informações sobre tecnologia, jogos e produtos selecionados. Conteúdo informativo e dicas úteis.",
    images: ["/images/twitter-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SpeedRepair - Recarga de Jogos"
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17681471168'
  const googleAdsEnabled = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true'

  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Google Ads - Global Site Tag */}
        {googleAdsEnabled && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAdsId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="font-sans">
        <HeadManager />
        <DynamicTheme />
        <PWAInstaller />
        <DevToolsBlocker />
        <VerificationWrapper>
          <ClickTracker>
            <Suspense fallback={null}>{children}</Suspense>
          </ClickTracker>
        </VerificationWrapper>
      </body>
    </html>
  )
}
