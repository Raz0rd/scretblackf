import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json({
        success: false,
        error: 'Transaction ID é obrigatório'
      }, { status: 400 })
    }

    console.log(`🔍 [GHOSTPAY] Verificando status: ${transactionId}`)

    // Chamar API real do GhostPay
    const response = await fetch(`https://api.ghostpay.com.br/v1/charges/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GHOSTPAY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('❌ [GHOSTPAY] Erro ao verificar status:', errorData)
      return NextResponse.json({
        success: false,
        error: errorData.message || 'Erro ao verificar status'
      }, { status: response.status })
    }

    const ghostpayResponse = await response.json()

    // Mapear status do GhostPay para nosso formato
    const statusMap: Record<string, string> = {
      'paid': 'paid',
      'pending': 'pending',
      'expired': 'expired',
      'canceled': 'expired'
    }

    const paymentData = {
      transactionId,
      status: statusMap[ghostpayResponse.status] || 'pending',
      paidAt: ghostpayResponse.paid_at || null,
      amount: ghostpayResponse.amount ? ghostpayResponse.amount / 100 : null
    }

    console.log(`✅ [GHOSTPAY] Status: ${transactionId} - ${paymentData.status}`)

    return NextResponse.json({
      success: true,
      data: paymentData
    })

  } catch (error) {
    console.error('❌ [PIX] Erro ao verificar status:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao verificar status'
    }, { status: 500 })
  }
}
