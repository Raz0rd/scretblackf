"use client"

import { useEffect } from 'react'

export default function GoogleAds() {
  useEffect(() => {
    // Pegar as variáveis que foram injetadas no build
    const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''
    const adsEnabled = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true'
    
    console.log('[GoogleAds] Componente montado')
    console.log('[GoogleAds] ID:', adsId)
    console.log('[GoogleAds] Enabled:', adsEnabled)
    
    if (!adsEnabled) {
      console.warn('[GoogleAds] ⚠️ NEXT_PUBLIC_GOOGLE_ADS_ENABLED não está "true"')
      return
    }
    if (!adsId) {
      console.error('[GoogleAds] ❌ NEXT_PUBLIC_GOOGLE_ADS_ID não está definido no .env!')
      return
    }

    // Verificar se já foi carregado
    if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
      console.log('[GoogleAds] ✅ Tag já carregada')
      return
    }

    console.log('[GoogleAds] 🚀 Carregando tag...')

    // Criar e adicionar o script do gtag.js
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${adsId}`
    document.head.appendChild(script1)

    // Criar e adicionar o script de inicialização
    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${adsId}');
    `
    document.head.appendChild(script2)

    console.log('[GoogleAds] ✅ Tag carregada com sucesso!')
  }, [])

  return null
}
