'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Script from 'next/script'

export default function TestAdsPage() {
  const searchParams = useSearchParams()
  const testParam = searchParams.get('testeconversao')
  
  const [gclid, setGclid] = useState('')
  const [result, setResult] = useState<any>(null)
  const [utmParams, setUtmParams] = useState<any>({})
  const [gtagLoaded, setGtagLoaded] = useState(false)

  useEffect(() => {
    const params: any = {}
    const urlParams = new URLSearchParams(window.location.search)
    
    const paramsToCapture = [
      'gclid', 'gbraid', 'wbraid', 'gad_source',
      'utm_source', 'utm_medium', 'utm_campaign'
    ]
    
    paramsToCapture.forEach(param => {
      const value = urlParams.get(param) || localStorage.getItem(param)
      if (value) {
        params[param] = value
      }
    })
    
    setUtmParams(params)
    if (params.gclid) setGclid(params.gclid)
  }, [])

  const handleTest = async () => {
    const randomValue = (Math.random() * 9 + 1).toFixed(2)
    const randomTransactionId = `test-${Math.random().toString(36).substring(2, 15)}`
    
    const response = await fetch('/api/test-conversion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gclid,
        transactionId: randomTransactionId,
        conversionValue: parseFloat(randomValue)
      })
    })
    
    const data = await response.json()
    setResult(data)
  }

  if (testParam !== 'sim') {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Acesso negado</div>
  }

  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''
  const conversionLabel = process.env.NEXT_PUBLIC_GTAG_CONVERSION_COMPRA || ''

  return (
    <>
      {/* Google Ads Tag */}
      {googleAdsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
            strategy="afterInteractive"
            onLoad={() => setGtagLoaded(true)}
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

      <div className="min-h-screen bg-slate-900 p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Teste de Conversão Google Ads</h1>
          
          {/* Status do GTM */}
          <div className="bg-slate-800 p-4 rounded-lg mb-6">
            <h2 className="text-lg font-bold mb-2">Status Google Ads</h2>
            <p className={gtagLoaded ? 'text-green-400' : 'text-yellow-400'}>
              {gtagLoaded ? '✅ GTM Carregado' : '⏳ Carregando GTM...'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Google Ads ID: {googleAdsId || 'Não configurado'}
            </p>
            <p className="text-sm text-gray-400">
              Conversion Label: {conversionLabel || 'Não configurado'}
            </p>
          </div>
        
        <div className="bg-slate-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Parâmetros Capturados</h2>
          <pre className="bg-slate-900 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(utmParams, null, 2)}
          </pre>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Testar Conversão</h2>
          <input
            type="text"
            value={gclid}
            onChange={(e) => setGclid(e.target.value)}
            placeholder="gclid"
            className="w-full px-4 py-2 bg-slate-900 rounded mb-4"
          />
          <button
            onClick={handleTest}
            className="px-6 py-3 bg-cyan-500 rounded font-bold"
          >
            Testar Conversão
          </button>
        </div>

        {result && (
          <div className="bg-slate-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Resultado</h2>
            <pre className="bg-slate-900 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        </div>
      </div>
    </>
  )
}
