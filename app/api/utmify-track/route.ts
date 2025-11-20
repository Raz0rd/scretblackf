import { NextRequest, NextResponse } from 'next/server'
import { orderStorageService } from '@/lib/order-storage'

export async function POST(request: NextRequest) {
  try {
    const utmifyData = await request.json()

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 [UTMIFY-TRACK] Enviando conversão')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 Dados recebidos:')
    console.log('   - Order ID:', utmifyData.orderId)
    console.log('   - Status:', utmifyData.status.toUpperCase())
    console.log('   - Valor: R$', (utmifyData.products?.[0]?.priceInCents / 100).toFixed(2))
    console.log('   - Cliente:', utmifyData.customer?.name)
    console.log('   - Email:', utmifyData.customer?.email)
    console.log('')
    console.log('📊 [TRACKING PARAMETERS - TODOS OS UTMs]:')
    console.log('   🎯 Google Ads:')
    console.log('      • gclid:', utmifyData.trackingParameters?.gclid || 'N/A')
    console.log('      • gad_source:', utmifyData.trackingParameters?.gad_source || 'N/A')
    console.log('      • gad_campaignid:', utmifyData.trackingParameters?.gad_campaignid || 'N/A')
    console.log('      • gbraid:', utmifyData.trackingParameters?.gbraid || 'N/A')
    console.log('      • wbraid:', utmifyData.trackingParameters?.wbraid || 'N/A')
    console.log('   📈 UTMs Padrão:')
    console.log('      • utm_source:', utmifyData.trackingParameters?.utm_source || 'N/A')
    console.log('      • utm_medium:', utmifyData.trackingParameters?.utm_medium || 'N/A')
    console.log('      • utm_campaign:', utmifyData.trackingParameters?.utm_campaign || 'N/A')
    console.log('      • utm_content:', utmifyData.trackingParameters?.utm_content || 'N/A')
    console.log('      • utm_term:', utmifyData.trackingParameters?.utm_term || 'N/A')
    console.log('   🔗 Outros:')
    console.log('      • fbclid:', utmifyData.trackingParameters?.fbclid || 'N/A')
    console.log('      • msclkid:', utmifyData.trackingParameters?.msclkid || 'N/A')
    console.log('      • src:', utmifyData.trackingParameters?.src || 'N/A')
    console.log('      • sck:', utmifyData.trackingParameters?.sck || 'N/A')
    console.log('      • xcod:', utmifyData.trackingParameters?.xcod || 'N/A')

    // PROTEÇÃO ANTI-DUPLICAÇÃO: Verificar se já foi enviado como PAID
    if (utmifyData.status === 'paid') {
      const storedOrder = orderStorageService.getOrder(utmifyData.orderId)
      
      if (storedOrder?.utmifyPaidSent) {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('⚠️ [UTMIFY-TRACK] DUPLICAÇÃO BLOQUEADA!')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('   - Order ID:', utmifyData.orderId)
        console.log('   - Status:', utmifyData.status)
        console.log('   - Motivo: UTMify PAID já foi enviado pelo WEBHOOK')
        console.log('   - Ação: BLOQUEADO - não será enviado novamente')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        
        return NextResponse.json({ 
          success: false, 
          message: 'UTMify PAID já enviado - duplicação bloqueada',
          alreadySent: true
        })
      }
      
      console.log('✅ [UTMIFY-TRACK] Primeira vez enviando PAID - prosseguindo...')
    }

    // Verificar se UTMify está habilitado
    const utmifyEnabled = process.env.UTMIFY_ENABLED === 'true'
    const utmifyToken = process.env.UTMIFY_API_TOKEN
    const whitepageUrl = process.env.UTMIFY_WHITEPAGE_URL

    if (!utmifyEnabled || !utmifyToken) {
      console.log('❌ [UTMIFY-TRACK] UTMify não configurado ou desabilitado')
      console.log('   - UTMIFY_ENABLED:', utmifyEnabled)
      console.log('   - Token presente:', !!utmifyToken)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return NextResponse.json({ success: false, message: 'UTMify não configurado' })
    }

    console.log('✅ [UTMIFY-TRACK] Configuração OK')
    console.log('   - Token presente:', !!utmifyToken)
    console.log('   - Whitepage URL:', whitepageUrl || 'N/A')

    // Preparar headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-token': utmifyToken
    }
    
    // Adicionar Referer apenas se whitepageUrl existir
    if (whitepageUrl) {
      headers['Referer'] = whitepageUrl
    }

    console.log('🚀 [UTMIFY] Enviando para API...')
    console.log('   - Endpoint: https://api.utmify.com.br/api-credentials/orders')

    // Enviar para UTMify usando o mesmo endpoint do webhook
    const utmifyResponse = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(utmifyData)
    })

    if (utmifyResponse.ok) {
      const result = await utmifyResponse.json()
      console.log('✅ [UTMIFY-TRACK] Conversão enviada com sucesso!')
      console.log('   - Response:', JSON.stringify(result, null, 2))
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      // Marcar como enviado no storage para evitar duplicação
      if (utmifyData.status === 'paid') {
        const storedOrder = orderStorageService.getOrder(utmifyData.orderId)
        if (storedOrder) {
          orderStorageService.saveOrder({
            ...storedOrder,
            utmifySent: true,
            utmifyPaidSent: true,
            status: 'paid',
            paidAt: storedOrder.paidAt || new Date().toISOString()
          })
          console.log('🔒 [UTMIFY-TRACK] Marcado como enviado no storage (evita duplicação futura)')
        }
      }
      
      // Log especial para Google Ads - APENAS para status PAID
      if (utmifyData.trackingParameters?.gclid && utmifyData.status === 'paid') {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('🎯 [GOOGLE ADS] Conversão PAID com gclid detectada!')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('📤 [ENVIANDO PARA GOOGLE ADS]:')
        console.log('   - Order ID:', utmifyData.orderId)
        console.log('   - Status:', utmifyData.status.toUpperCase())
        console.log('   - Valor: R$', (utmifyData.products?.[0]?.priceInCents / 100).toFixed(2))
        console.log('   - Moeda: BRL')
        console.log('   - Cliente:', utmifyData.customer?.name)
        console.log('   - Email:', utmifyData.customer?.email)
        console.log('')
        console.log('📊 [PARÂMETROS DE CONVERSÃO]:')
        console.log('   - gclid:', utmifyData.trackingParameters.gclid)
        console.log('   - gad_source:', utmifyData.trackingParameters.gad_source || 'N/A')
        console.log('   - gbraid:', utmifyData.trackingParameters.gbraid || 'N/A')
        console.log('   - wbraid:', utmifyData.trackingParameters.wbraid || 'N/A')
        console.log('   - utm_source:', utmifyData.trackingParameters.utm_source || 'N/A')
        console.log('   - utm_campaign:', utmifyData.trackingParameters.utm_campaign || 'N/A')
        console.log('   - utm_medium:', utmifyData.trackingParameters.utm_medium || 'N/A')
        console.log('')
        console.log('✅ [RESULTADO]:')
        console.log('   - UTMify processou e enviará para Google Ads')
        console.log('   - Conversão será visível no Google Ads em 24-48h')
        console.log('   - Verifique em: Google Ads > Conversões > Todas as conversões')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      } else if (utmifyData.trackingParameters?.gclid && utmifyData.status !== 'paid') {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log('ℹ️ [GOOGLE ADS] gclid detectado mas status não é PAID')
        console.log('   - Status atual:', utmifyData.status)
        console.log('   - gclid:', utmifyData.trackingParameters.gclid)
        console.log('   - Conversão será enviada ao Google Ads quando status = paid')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Lead enviado para UTMify',
        utmify_response: result
      })
    } else {
      const errorText = await utmifyResponse.text()
      console.error('❌ [UTMIFY] Erro na resposta da API')
      console.error('   - Status:', utmifyResponse.status)
      console.error('   - Erro:', errorText)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao enviar para UTMify',
        error: errorText
      }, { status: 400 })
    }

  } catch (error) {
    console.error('❌ UTMify: Erro interno', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'Erro interno do servidor',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
