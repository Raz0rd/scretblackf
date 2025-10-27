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
import GoogleAds from "@/components/GoogleAds"

export const metadata: Metadata = {
  title: "BlueShift Games - Plataforma Gaming | Dicas, Cupons e Jogos",
  description: "BlueShift Games: sua plataforma gaming completa. Dicas exclusivas, cupons para jogos, informações sobre recarga de diamantes FF, dimas FF e muito mais. Operado por EASYCOM.",
  keywords: [
    // Free Fire - Principal
    "diamantes ff",
    "dimas ff",
    "recarga diamantes ff",
    "recarga free fire",
    "comprar diamantes free fire",
    "diamantes free fire barato",
    "recarga ff com id",
    "site recarga free fire",
    "diamantes free fire pix",
    
    // Recarga de Jogos
    "recarga de jogos",
    "recarga jogo com id",
    "recarga jogos mobile",
    "recarga pubg mobile",
    "recarga mobile legends",
    "recarga genshin impact",
    "recarga cod mobile",
    "site de recarga",
    "recarga segura jogos",
    
    // Gaming e Cupons
    "cupons jogos",
    "cupons free fire",
    "cupons pubg",
    "cupons mobile legends",
    "dicas jogos mobile",
    "dicas free fire",
    "dicas gamer",
    "melhorar mira jogos",
    
    // Empresa
    "blueshift games",
    "easycom",
    "plataforma gaming",
    "portal gaming",
    "jogos online",
    "loja de jogos",
    "recarga rápida",
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
    title: "WebShop KIA - Recarga Diamantes FF, Dimas FF e PC Gamer",
    description: "🔥 Recarga de diamantes Free Fire com ID! Dimas FF, recarga de jogos e dicas para montar PC gamer. Pagamento seguro via PIX. Recarga rápida e confiável!",
    url: "/",
    siteName: "WebShop KIA",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "WebShop KIA - Recarga Diamantes FF e PC Gamer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "WebShop KIA - Recarga Diamantes FF e Dimas FF",
    description: "🔥 Recarga de diamantes Free Fire com ID! Dimas FF, recarga de jogos e dicas PC gamer. Pagamento PIX seguro!",
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
    title: "BlueShift Games - Sua Plataforma Gaming Completa"
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
        <GoogleAds />
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
