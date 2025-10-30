"use client"

import Script from 'next/script'
import { useEffect } from 'react'

export default function GoogleAds() {
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const googleAdsEnabled = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true'

  useEffect(() => {
    console.log('[GoogleAds] Componente montado')
    console.log('[GoogleAds] ID:', googleAdsId)
    console.log('[GoogleAds] Enabled:', googleAdsEnabled)
    console.log('[GoogleAds] Vai carregar:', googleAdsEnabled && googleAdsId ? 'SIM' : 'NÃO')
  }, [googleAdsId, googleAdsEnabled])

  if (!googleAdsEnabled || !googleAdsId) {
    console.warn('[GoogleAds] Tag NÃO carregada - Enabled:', googleAdsEnabled, 'ID:', googleAdsId)
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
