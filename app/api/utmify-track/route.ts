import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const utmifyData = await request.json()

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 [UTMIFY] Recebendo conversão')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 Dados recebidos:')
    console.log('   - Order ID:', utmifyData.orderId)
    console.log('   - Status:', utmifyData.status)
    console.log('   - Valor:', utmifyData.products?.[0]?.priceInCents / 100, 'BRL')
    console.log('   - Cliente:', utmifyData.customer?.name)
    console.log('   - Email:', utmifyData.customer?.email)
    console.log('   - Tracking:')
    console.log('     • gclid:', utmifyData.trackingParameters?.gclid || 'N/A')
    console.log('     • gbraid:', utmifyData.trackingParameters?.gbraid || 'N/A')
    console.log('     • utm_source:', utmifyData.trackingParameters?.utm_source || 'N/A')
    console.log('     • utm_campaign:', utmifyData.trackingParameters?.utm_campaign || 'N/A')

    // Verificar se UTMify está habilitado
    const utmifyEnabled = process.env.UTMIFY_ENABLED === 'true'
    const utmifyToken = process.env.UTMIFY_API_TOKEN
    const whitepageUrl = process.env.UTMIFY_WHITEPAGE_URL

    if (!utmifyEnabled || !utmifyToken) {
      console.log('❌ [UTMIFY] UTMify não configurado ou desabilitado')
      console.log('   - UTMIFY_ENABLED:', utmifyEnabled)
      console.log('   - Token presente:', !!utmifyToken)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return NextResponse.json({ success: false, message: 'UTMify não configurado' })
    }

    console.log('✅ [UTMIFY] Configuração OK')
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
      console.log('✅ [UTMIFY] Conversão enviada com sucesso!')
      console.log('   - Response:', JSON.stringify(result, null, 2))
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      // Log especial para Google Ads
      if (utmifyData.trackingParameters?.gclid) {
        console.log('🎯 [GOOGLE ADS] Conversão com gclid detectada!')
        console.log('   - gclid:', utmifyData.trackingParameters.gclid)
        console.log('   - Valor:', utmifyData.products?.[0]?.priceInCents / 100, 'BRL')
        console.log('   - Order ID:', utmifyData.orderId)
        console.log('   ⏳ Aguarde 24-48h para aparecer no Google Ads')
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
