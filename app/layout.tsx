import type React from "react"
import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import "./globals.css"
import HeadManager from "@/components/HeadManager"
import ClickTracker from "@/components/ClickTracker"
import DynamicTheme from "@/components/DynamicTheme"
import VerificationWrapper from "@/components/VerificationWrapper"
import { DevToolsBlocker } from "@/components/DevToolsBlocker"

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: "Diamantes Free Fire Baratos - Recarga Rápida via PIX | Entrega Imediata",
  description: "Compre diamantes Free Fire com os melhores preços do Brasil! Entrega imediata, pagamento via PIX, 100% seguro. Promoção especial de diamantes FF com desconto. Recarga rápida e confiável.",
  keywords: [
    "diamantes free fire baratos",
    "comprar diamantes free fire",
    "recarga diamantes ff",
    "diamantes ff promoção",
    "free fire diamantes pix",
    "recarga free fire barata",
    "diamantes free fire desconto",
    "comprar diamantes ff",
    "loja diamantes free fire",
    "recarga ff rapida",
    "diamantes free fire entrega imediata",
    "free fire recarga segura",
    "pagamento pix diamantes",
    "promoção diamantes ff"
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://booyahstrikeforce.store'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DeltaForce - Recarga de Diamantes Free Fire",
    description: "Compre diamantes para Free Fire com segurança. Entrega em até 5 minutos via PIX. Loja oficial de recargas.",
    url: "/",
    siteName: "DeltaForce",
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
    title: "DeltaForce - Recarga de Diamantes Free Fire",
    description: "Compre diamantes para Free Fire com segurança. Entrega em até 5 minutos via PIX.",
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
