"use client"

import { useState, useEffect } from 'react'

export default function GoogleAdsTest() {
  const [showButton, setShowButton] = useState(false)
  const [conversionSent, setConversionSent] = useState(false)

  useEffect(() => {
    // Verificar se tem o parâmetro na URL
    const params = new URLSearchParams(window.location.search)
    if (params.get('adstestloja') === 'sim') {
      setShowButton(true)
    }
  }, [])

  const sendTestConversion = () => {
    // Enviar conversão de teste para o Google Ads
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL', // Substituir pelos IDs reais
        'value': 1.0,
        'currency': 'BRL',
        'transaction_id': 'TEST_' + Date.now()
      })
      
      setConversionSent(true)
      
      setTimeout(() => {
        setConversionSent(false)
      }, 3000)
      
      console.log('✅ Conversão de teste enviada para Google Ads')
    } else {
      console.error('❌ Google Tag não encontrado')
      alert('Google Tag não encontrado. Verifique se o script está instalado.')
    }
  }

  if (!showButton) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-2xl p-4 border-2 border-red-500">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🧪</span>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Modo Teste Google Ads</h3>
            <p className="text-xs text-slate-600">Enviar conversão de teste</p>
          </div>
        </div>
        
        {!conversionSent ? (
          <button
            onClick={sendTestConversion}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm"
          >
            🎯 Enviar Conversão Teste
          </button>
        ) : (
          <div className="text-center py-2">
            <div className="text-green-600 font-bold text-sm">
              ✅ Conversão Enviada!
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Verifique o console do navegador
            </p>
          </div>
        )}
        
        <p className="text-xs text-slate-500 mt-2 text-center">
          URL: /?adstestloja=sim
        </p>
      </div>
    </div>
  )
}
