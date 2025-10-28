import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import HeadManager from "@/components/HeadManager"
import ClickTracker from "@/components/ClickTracker"
import PWAInstaller from "@/components/PWAInstaller"
import DynamicTheme from "@/components/DynamicTheme"
import VerificationWrapper from "@/components/VerificationWrapper"
import { DevToolsBlocker } from "@/components/DevToolsBlocker"

export const metadata: Metadata = {
  title: "Recarga FF - Diamantes Free Fire | Site Confiável desde 2015",
  description: "Recarga de diamantes Free Fire com segurança! Site confiável desde 2015. Recarga FF rápida, diamantes FF baratos e entrega imediata. Pagamento via PIX.",
  keywords: [
    // Free Fire - Termos Principais
    "recarga ff",
    "diamantes ff",
    "recarga de diamantes ff",
    "recarga free fire",
    "diamantes free fire",
    "recarga diamantes free fire",
    "site confiavel recarga ff",
    "recarga jogo",
    "recarga de jogo",
    
    // Variações de busca
    "comprar diamantes ff",
    "diamantes ff barato",
    "recarga ff com id",
    "site recarga free fire",
    "recarga ff segura",
    "recarga ff confiavel",
    "diamantes free fire barato",
    "recarga free fire id",
    
    // Termos relacionados
    "recarga de jogos",
    "recarga jogo mobile",
    "site de recarga",
    "recarga rapida ff",
    "recarga instantanea ff",
    "webshop kia",
    "pagamento pix",
    "recarga com pix"
  ],
  authors: [{ name: "WebShop KIA" }],
  generator: "Next.js",
  applicationName: "WebShop KIA",
  referrer: "origin-when-cross-origin",
  creator: "WebShop KIA",
  publisher: "WebShop KIA - Bronze Eletro",
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
    title: "Recarga FF - Diamantes Free Fire | Site Confiável desde 2015",
    description: "🔥 Recarga de diamantes Free Fire com segurança! Site confiável desde 2015. Recarga FF rápida, diamantes FF baratos e entrega imediata. Pagamento PIX!",
    url: "/",
    siteName: "WebShop KIA",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Recarga FF - Diamantes Free Fire - Site Confiável"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Recarga FF - Diamantes Free Fire | Site Confiável desde 2015",
    description: "🔥 Recarga de diamantes Free Fire com segurança! Site confiável desde 2015. Recarga FF rápida e diamantes FF baratos. Pagamento PIX!",
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
    title: "WebShop KIA - Recarga de Jogos"
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
  return (
    <html lang="pt-BR" className="dark">
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
