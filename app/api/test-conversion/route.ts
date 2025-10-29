import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gclid, transactionId, conversionValue } = body

    // Pegar ID e Label do .env
    const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
    const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🧪 [TEST CONVERSION] Testando conversão')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📋 Dados recebidos:')
    console.log('   - gclid:', gclid || 'N/A')
    console.log('   - Transaction ID:', transactionId || 'N/A')
    console.log('   - Valor:', conversionValue || 'N/A')
    console.log('📋 Configuração (.env):')
    console.log('   - Google Ads ID:', googleAdsId || 'N/A')
    console.log('   - Conversion Label:', conversionLabel || 'N/A')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    if (!gclid) {
      return NextResponse.json({
        success: false,
        message: 'gclid é obrigatório'
      }, { status: 400 })
    }

    if (!googleAdsId || !conversionLabel) {
      return NextResponse.json({
        success: false,
        message: 'Google Ads ID ou Conversion Label não configurados no .env'
      }, { status: 500 })
    }

    const conversionData = {
      send_to: `${googleAdsId}/${conversionLabel}`,
      value: conversionValue || 0,
      currency: 'BRL',
      transaction_id: transactionId
    }

    console.log('✅ Dados de conversão preparados:', conversionData)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    return NextResponse.json({
      success: true,
      message: 'Teste de conversão executado com sucesso',
      data: conversionData,
      config: {
        googleAdsId,
        conversionLabel
      }
    })

  } catch (error) {
    console.error('❌ Erro no teste de conversão:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno'
    }, { status: 500 })
  }
}
