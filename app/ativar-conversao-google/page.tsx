'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
  }
}

export default function TestAdsPage() {
  const searchParams = useSearchParams()
  const testParam = searchParams.get('testeconversao')
  
  const [gtagLoaded, setGtagLoaded] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // Pegar do .env
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || ''
  const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || ''

  // Função para disparar conversão
  const gtag_report_conversion = () => {
    // Gerar transaction ID aleatório
    const transactionId = `TEST_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    // Gerar valor aleatório entre 1.00 e 20.00
    const randomValue = parseFloat((Math.random() * 19 + 1).toFixed(2))
    
    console.log('🧪 [TEST CONVERSION] Disparando conversão')
    console.log('   - Transaction ID:', transactionId)
    console.log('   - Valor:', randomValue, 'BRL')
    console.log('   - Send To:', `${googleAdsId}/${conversionLabel}`)
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        'send_to': `${googleAdsId}/${conversionLabel}`,
        'value': randomValue,
        'currency': 'BRL',
        'transaction_id': transactionId
      })
      
      setResult(`✅ Conversão enviada!\n\nTransaction ID: ${transactionId}\nValor: R$ ${randomValue.toFixed(2)}`)
    } else {
      setResult('❌ Erro: gtag não está carregado')
    }
    
    return false
  }

  // Verificar se gtag já está carregado (vem do layout)
  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && window.gtag) {
        setGtagLoaded(true)
        console.log('✅ Google Ads tag detectada (do layout)')
        clearInterval(checkGtag)
      }
    }, 100)
    
    // Limpar após 5 segundos
    setTimeout(() => clearInterval(checkGtag), 5000)
    
    return () => clearInterval(checkGtag)
  }, [])

  // Aceitar 'sim', 'true', ou '1'
  const isAuthorized = testParam === 'sim' || testParam === 'true' || testParam === '1'
  
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">🚫 Acesso Negado</h1>
          <p className="text-gray-400">Use: ?testeconversao=true ou ?testeconversao=sim</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">🧪 Teste de Conversão Google Ads</h1>
          
          {/* Status */}
          <div className="bg-slate-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Status</h2>
            <div className="space-y-2">
              <p className={gtagLoaded ? 'text-green-400' : 'text-yellow-400'}>
                {gtagLoaded ? '✅ Google Ads Tag Carregada' : '⏳ Carregando...'}
              </p>
              <p className="text-sm text-gray-400">
                Google Ads ID: <span className="text-cyan-400">{googleAdsId || 'Não configurado'}</span>
              </p>
              <p className="text-sm text-gray-400">
                Conversion Label: <span className="text-cyan-400">{conversionLabel || 'Não configurado'}</span>
              </p>
            </div>
          </div>

          {/* Botão de Teste */}
          <div className="bg-slate-800 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">Disparar Conversão</h2>
            <p className="text-gray-400 mb-4">
              Clique no botão para enviar uma conversão de teste para o Google Ads.
              <br />
              Será gerado um Transaction ID aleatório e valor entre R$ 1,00 e R$ 20,00.
            </p>
            <button
              onClick={gtag_report_conversion}
              disabled={!gtagLoaded}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                gtagLoaded
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 cursor-pointer'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {gtagLoaded ? '🚀 Testar Conversão' : '⏳ Aguarde...'}
            </button>
          </div>

          {/* Resultado */}
          {result && (
            <div className="bg-slate-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Resultado</h2>
              <pre className="bg-slate-900 p-4 rounded text-sm whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}

          {/* Instruções */}
          <div className="bg-slate-800 p-6 rounded-lg mt-6">
            <h2 className="text-xl font-bold mb-4">📋 Como Verificar</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Clique no botão "Testar Conversão"</li>
              <li>Abra o Google Ads → Ferramentas → Conversões</li>
              <li>Verifique se a conversão apareceu (pode levar alguns minutos)</li>
              <li>Ou use o Google Tag Assistant para verificar em tempo real</li>
            </ol>
          </div>
        </div>
      </div>
  )
}
