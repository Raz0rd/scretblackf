import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import "./globals.css"
import HeadManager from "@/components/HeadManager"
import ClickTracker from "@/components/ClickTracker"
import DynamicTheme from "@/components/DynamicTheme"
import VerificationWrapper from "@/components/VerificationWrapper"
import { DevToolsBlocker } from "@/components/DevToolsBlocker"

export const metadata: Metadata = {
  title: "Dimbux - Recarga de Diamantes Free Fire e Robux | Entrega Rápida",
  description: "Compre diamantes para Free Fire e Robux com segurança e entrega em até 5 minutos. Pagamento via PIX, preços promocionais e suporte 24/7. Loja oficial de recargas.",
  keywords: [
    "comprar diamantes free fire",
    "recarga diamantes ff",
    "robux barato",
    "comprar robux",
    "dimbux",
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://comprardiamantesff.shop'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dimbux - Recarga de Diamantes Free Fire e Robux",
    description: "Compre diamantes para Free Fire e Robux com segurança. Entrega em até 5 minutos via PIX. Loja oficial de recargas.",
    url: "/",
    siteName: "Dimbux",
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
    title: "Dimbux - Recarga de Diamantes Free Fire e Robux",
    description: "Compre diamantes para Free Fire e Robux com segurança. Entrega em até 5 minutos via PIX.",
    images: ["/images/twitter-card.jpg"],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
