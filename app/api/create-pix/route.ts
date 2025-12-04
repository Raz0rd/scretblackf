import { NextRequest, NextResponse } from 'next/server'
import { orderStorageService } from '@/lib/order-storage'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PixPaymentData {
  nome: string
  email: string
  cpf: string
  telefone: string
  items: Array<{
    id: string
    name: string
    price: number
    category: string
  }>
  totalPrice: number
  gameId?: string
  playerNickname?: string
  trackingParams?: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    const data: PixPaymentData = await request.json()

    // Validações
    if (!data.nome || !data.email || !data.cpf || !data.telefone) {
      return NextResponse.json({
        success: false,
        error: 'Dados incompletos'
      }, { status: 400 })
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Carrinho vazio'
      }, { status: 400 })
    }

    // Verificar credenciais do GhostPay
    const secretKey = process.env.GHOSTPAY_API_KEY
    const companyId = process.env.GHOSTPAY_COMPANY_ID
    
    if (!secretKey || !companyId) {
      console.error('❌ [GHOSTPAY] Credenciais não configuradas')
      return NextResponse.json({
        success: false,
        error: 'Configuração de pagamento não encontrada'
      }, { status: 500 })
    }

    // Formatar dados conforme especificação
    const cleanPhone = data.telefone.replace(/\D/g, '')
    const cleanCpf = data.cpf.replace(/\D/g, '')
    const cleanName = data.nome.trim()

    // Arredondar para 2 casas decimais antes de converter para centavos
    const totalPriceRounded = Math.round(data.totalPrice * 100) / 100
    const amountInCents = Math.round(totalPriceRounded * 100)

    // Gerar email fake baseado no nome (padrão do generate-pix)
    const generateFakeEmail = (name: string): string => {
      const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
      return `${cleanName}@gmail.com`
    }

    // Preparar dados para GhostPay API (mesmo formato do generate-pix que funciona)
    const ghostpayPayload = {
      amount: amountInCents,
      paymentMethod: 'pix',
      customer: {
        name: cleanName,
        email: generateFakeEmail(cleanName),
        phone: cleanPhone,
        document: {
          number: cleanCpf,
          type: 'cpf'
        }
      },
      items: [
        {
          title: 'Produto Digital',
          unitPrice: amountInCents,
          quantity: 1,
          tangible: false
        }
      ]
    }

    console.log('🔐 [GHOSTPAY] Criando cobrança PIX...', {
      amount: totalPriceRounded,
      amountInCents: amountInCents,
      customer: data.email,
      secretKey: secretKey ? '✓ Configurada' : '✗ Não configurada',
      companyId: companyId ? '✓ Configurada' : '✗ Não configurada'
    })

    console.log('📦 [GHOSTPAY] Payload:', JSON.stringify(ghostpayPayload, null, 2))

    // Criar auth Basic (SECRET_KEY:COMPANY_ID) - MESMO PADRÃO DO GENERATE-PIX
    const authString = Buffer.from(`${secretKey}:${companyId}`).toString('base64')
    console.log('🔐 [GHOSTPAY] Auth Basic gerado (SECRET_KEY:COMPANY_ID)')

    // URL da API do GhostPay (MESMA DO GENERATE-PIX QUE FUNCIONA)
    const apiUrl = 'https://api.ghostspaysv2.com/functions/v1/transactions'
    console.log('🔗 [GHOSTPAY] Chamando API:', apiUrl)

    // Chamar API real do GhostPay
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ghostpayPayload)
    })

    console.log('📡 [GHOSTPAY] Response status:', response.status)
    
    // Verificar content-type ANTES de fazer parse
    const contentType = response.headers.get('content-type')
    console.log('📄 [GHOSTPAY] Content-Type:', contentType)

    if (!response.ok) {
      let errorData: any = {}
      
      if (contentType?.includes('application/json')) {
        errorData = await response.json().catch(() => ({}))
      } else {
        const textError = await response.text()
        console.error('❌ [GHOSTPAY] Resposta não-JSON:', textError.substring(0, 200))
        errorData = { message: 'Erro na API de pagamento' }
      }
      
      console.error('❌ [GHOSTPAY] Erro na API:', errorData)
      return NextResponse.json({
        success: false,
        error: errorData.message || 'Erro ao criar cobrança'
      }, { status: response.status })
    }

    // ✅ CRÍTICO: Verificar se resposta é JSON mesmo com status 200
    if (!contentType?.includes('application/json')) {
      const htmlResponse = await response.text()
      console.error('❌ [GHOSTPAY] API retornou HTML em vez de JSON!')
      console.error('🔗 [GHOSTPAY] URL chamada: https://api.ghostpay.com.br/v1/charges')
      console.error('📄 [GHOSTPAY] Resposta HTML:', htmlResponse.substring(0, 500))
      
      return NextResponse.json({
        success: false,
        error: 'API de pagamento retornou resposta inválida. Verifique a URL e credenciais.'
      }, { status: 500 })
    }

    const ghostpayResponse = await response.json()

    console.log('✅ [GHOSTPAY] Cobrança criada com sucesso!')
    console.log('📋 [GHOSTPAY] Resposta COMPLETA:', JSON.stringify(ghostpayResponse, null, 2))

    // Extrair informações da resposta (mesmo padrão do generate-pix)
    const transactionId = ghostpayResponse.id || ghostpayResponse.transaction_id || ghostpayResponse.transactionId
    const pixCode = ghostpayResponse.pix?.qrcode || ghostpayResponse.pixCode || ghostpayResponse.pix_code || ghostpayResponse.code
    const qrCodeImage = ghostpayResponse.qrCode || ghostpayResponse.qr_code || ghostpayResponse.qr_code_url || ghostpayResponse.pix?.qr_code_url

    console.log('🔍 [GHOSTPAY] Dados extraídos:', {
      transactionId,
      hasPixCode: !!pixCode,
      hasQrCodeImage: !!qrCodeImage,
      pixCodeLength: pixCode?.length || 0
    })

    // Formatar resposta para o frontend
    const pixData = {
      transactionId,
      qrCode: qrCodeImage,
      qrCodeText: pixCode,
      amount: totalPriceRounded,
      expiresAt: ghostpayResponse.expires_at || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      status: ghostpayResponse.status || 'pending'
    }

    console.log('📤 [GHOSTPAY] Dados enviados ao frontend:', {
      transactionId: pixData.transactionId,
      hasQrCode: !!pixData.qrCode,
      qrCodeLength: pixData.qrCode?.length || 0,
      hasQrCodeText: !!pixData.qrCodeText,
      qrCodeTextLength: pixData.qrCodeText?.length || 0,
      amount: pixData.amount,
      expiresAt: pixData.expiresAt,
      status: pixData.status
    })

    // 💾 SALVAR NO ORDER STORAGE (para UTMify e check-transaction-status)
    try {
      const generateProductName = (items: any[]): string => {
        if (items.length === 1) {
          return items[0].name
        }
        return `${items.length} itens`
      }

      const orderData = {
        orderId: transactionId,
        transactionId: transactionId,
        amount: amountInCents,
        customerData: {
          name: cleanName,
          email: data.email,
          phone: cleanPhone,
          document: cleanCpf
        },
        trackingParameters: data.trackingParams as any || {},
        productName: generateProductName(data.items),
        gateway: 'ghostpay',
        createdAt: new Date().toISOString(),
        status: 'pending' as const
      }

      orderStorageService.saveOrder(orderData)
      console.log('💾 [LOJA] Pedido salvo no orderStorage:', transactionId)
    } catch (storageError) {
      console.error('❌ [LOJA] Erro ao salvar no orderStorage:', storageError)
      // Não falhar a requisição por causa disso
    }

    return NextResponse.json({
      success: true,
      data: pixData
    })

  } catch (error) {
    console.error('❌ [PIX] Erro ao criar pagamento:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro ao processar pagamento'
    }, { status: 500 })
  }
}
