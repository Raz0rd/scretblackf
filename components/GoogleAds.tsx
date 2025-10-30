"use client"

import Script from 'next/script'

export default function GoogleAds() {
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const googleAdsEnabled = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true'

  if (!googleAdsEnabled || !googleAdsId) return null

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
