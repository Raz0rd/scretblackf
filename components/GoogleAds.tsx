"use client"

import Script from 'next/script'
import { useEffect, useState } from 'react'

export default function GoogleAds() {
  // IMPORTANTE: Em client components, process.env só funciona se as variáveis
  // forem injetadas em build time. Vamos garantir que sempre temos os valores.
  const [googleAdsId, setGoogleAdsId] = useState<string>('')
  const [googleAdsEnabled, setGoogleAdsEnabled] = useState<boolean>(false)

  useEffect(() => {
    // Pegar as variáveis que foram injetadas no build
    const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17688179906'
    const adsEnabled = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true'
    
    setGoogleAdsId(adsId)
    setGoogleAdsEnabled(adsEnabled)
    
    console.log('[GoogleAds] Componente montado')
    console.log('[GoogleAds] ID:', adsId)
    console.log('[GoogleAds] Enabled:', adsEnabled)
    console.log('[GoogleAds] Vai carregar:', adsEnabled && adsId ? 'SIM' : 'NÃO')
  }, [])

  if (!googleAdsEnabled || !googleAdsId) {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
      />
      <Script
        id="google-ads-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAdsId}');
          `,
        }}
      />
    </>
  )
}
