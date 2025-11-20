import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

type CloakerStatus = 'new' | 'approve' | 'cancel'

interface PostbackRequest {
  status: CloakerStatus
  payout?: number
}

// Extrair configurações do Filter ID (formato: 969-8f076e082dbcb1d080037ec2c216d589-15311)
function getCloakerConfig() {
  const CLOAKER_FILTER_ID = process.env.CLOAKER_FILTER_ID
  if (!CLOAKER_FILTER_ID) {
    throw new Error('❌ CLOAKER_FILTER_ID não configurado no .env')
  }

  // Separar o UID (último elemento) do Campaign ID (todo o resto)
  const parts = CLOAKER_FILTER_ID.split('-')
  const uid = parts[parts.length - 1]
  const campaignId = parts.slice(0, -1).join('-')

  return {
    apiUrl: 'https://www.altercpa.one/api/filter/postback.json',
    campaignId,
    uid
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar se está habilitado
    if (process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED !== 'true') {
      return NextResponse.json({ success: false, message: 'Tracking desabilitado' })
    }

    const body: PostbackRequest = await request.json()
    const config = getCloakerConfig()

    // Construir URL do postback
    const url = new URL(config.apiUrl)
    url.searchParams.set('id', config.campaignId)
    url.searchParams.set('uid', config.uid)
    url.searchParams.set('status', body.status)

    if (body.status === 'approve' && body.payout) {
      url.searchParams.set('payout', body.payout.toFixed(2))
    }

    console.log(`[Cloaker API] 📤 Enviando postback: ${body.status}`)
    console.log(`   - Campaign ID: ${config.campaignId}`)
    console.log(`   - UID: ${config.uid}`)
    if (body.payout) {
      console.log(`   - Payout: R$ ${body.payout.toFixed(2)}`)
    }

    // Enviar postback
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'CloakerTracking/1.0'
      }
    })

    if (response.ok) {
      console.log(`[Cloaker API] ✅ Postback enviado com sucesso: ${body.status}`)
      return NextResponse.json({ success: true })
    } else {
      console.error(`[Cloaker API] ❌ Erro ao enviar postback: ${response.status}`)
      return NextResponse.json({ success: false, error: response.status }, { status: 500 })
    }
  } catch (error) {
    console.error('[Cloaker API] ❌ Erro:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
