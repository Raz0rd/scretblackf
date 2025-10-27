import { NextRequest, NextResponse } from "next/server"
import { orderStorageService } from "@/lib/order-storage"
import { getBrazilTimestamp } from "@/lib/brazil-time"

// Função para consultar status no BlackCat
async function checkStatusBlackCat(transactionId: string) {
  const blackcatUrl = `https://api.blackcatpagamentos.com/v1/transactions/${transactionId}`
  const blackcatAuth = process.env.BLACKCAT_API_AUTH

  if (!blackcatAuth) {
    throw new Error("BLACKCAT_API_AUTH não configurado")
  }

  console.log(`[BlackCat] Consultando: ${blackcatUrl}`)

  const response = await fetch(blackcatUrl, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "authorization": blackcatAuth
    }
  })

  if (!response.ok) {
    console.error(`[BlackCat] Erro na API: ${response.status}`)
    throw new Error(`Erro na API BlackCat: ${response.status}`)
  }

  const transactionData = await response.json()
  console.log(`[BlackCat] Status atual: ${transactionData.status}`)
  
  return transactionData
}

// Função para consultar status no GhostPay
async function checkStatusGhostPay(transactionId: string) {
  const ghostpayUrl = `https://api.ghostspaysv2.com/functions/v1/transactions/${transactionId}`
  const secretKey = process.env.GHOSTPAY_API_KEY

  if (!secretKey) {
    throw new Error("GHOSTPAY_API_KEY não configurado")
  }

  console.log(`[GhostPay] Consultando: ${ghostpayUrl}`)

  // Criar auth Basic com base64
  const authString = Buffer.from(`${secretKey}:x`).toString('base64')

  const response = await fetch(ghostpayUrl, {
    method: "GET",
    headers: {
      "Authorization": `Basic ${authString}`,
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    console.error(`[GhostPay] Erro na API: ${response.status}`)
    throw new Error(`Erro na API GhostPay: ${response.status}`)
  }

  const transactionData = await response.json()
  console.log(`[GhostPay] Status atual: ${transactionData.status}`)
  
  return transactionData
}

// Função para consultar status no Umbrela
async function checkStatusUmbrela(transactionId: string) {
  const umbrelaUrl = `https://api-gateway.umbrellapag.com/api/user/transactions/${transactionId}`
  const apiKey = process.env.UMBRELA_API_KEY

  if (!apiKey) {
    throw new Error("UMBRELA_API_KEY não configurado")
  }

  console.log(`[Umbrela] Consultando: ${umbrelaUrl}`)

  const response = await fetch(umbrelaUrl, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      "User-Agent": "UMBRELLAB2B/1.0"
    }
  })

  if (!response.ok) {
    console.error(`[Umbrela] Erro na API: ${response.status}`)
    throw new Error(`Erro na API Umbrela: ${response.status}`)
  }

  const result = await response.json()
  const transactionData = result.data
  console.log(`[Umbrela] Status atual: ${transactionData.status}`)
  
  return transactionData
}

export async function POST(request: NextRequest) {
  try {
    const { transactionId } = await request.json()
    
    if (!transactionId) {
      return NextResponse.json({
        success: false,
        error: "transactionId é obrigatório"
      }, { status: 400 })
    }

    // Escolher gateway baseado na variável de ambiente
    const gateway = process.env.PAYMENT_GATEWAY || 'blackcat'
    console.log(`[CHECK-STATUS] Gateway selecionado: ${gateway.toUpperCase()}`)
    console.log(`[CHECK-STATUS] Verificando status da transação: ${transactionId}`)

    // Verificar se já processamos esta transação como paid
    const storedOrder = orderStorageService.getOrder(transactionId.toString())
    if (storedOrder && storedOrder.status === 'paid') {
      console.log(`[CHECK-STATUS] Transação ${transactionId} já processada como paid`)
      return NextResponse.json({
        success: true,
        status: 'paid',
        message: 'Transação já processada como paid',
        alreadyProcessed: true
      })
    }

    // Consultar API do gateway configurado
    let transactionData
    
    try {
      if (gateway === 'ghostpay') {
        transactionData = await checkStatusGhostPay(transactionId)
      } else if (gateway === 'umbrela') {
        transactionData = await checkStatusUmbrela(transactionId)
      } else {
        transactionData = await checkStatusBlackCat(transactionId)
      }
    } catch (error) {
      console.error(`[CHECK-STATUS] Erro ao consultar gateway:`, error)
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao consultar gateway',
        status: 500
      }, { status: 500 })
    }

    const currentStatus = transactionData.status
    const isNowPaid = currentStatus === 'paid' || currentStatus === 'PAID' // Umbrela usa PAID (maiúsculo)
    const isWaitingPayment = currentStatus === 'waiting_payment' || currentStatus === 'WAITING_PAYMENT'

    // Se status é paid, verificar se já foi processado pelo webhook
    if (isNowPaid) {
      console.log(`[CHECK-STATUS] Status é PAID!`)
      
      // IMPORTANTE: Verificar se já foi enviado para UTMify pelo webhook
      // Evita duplicação de conversões
      if (storedOrder && storedOrder.utmifySent) {
        console.log(`[CHECK-STATUS] ⚠️ Conversão JÁ foi enviada para UTMify pelo webhook`)
        console.log(`[CHECK-STATUS] ✅ Retornando sem reenviar (evitando duplicação)`)
        return NextResponse.json({
          success: true,
          status: 'paid',
          message: 'Pagamento já processado e enviado para UTMify',
          alreadyProcessed: true,
          utmifySent: true
        })
      }

      console.log(`[CHECK-STATUS] Primeira vez processando PAID - enviando para UTMify...`)

      // Recuperar UTMs do storage ou usar fallback
      let trackingParameters = {}
      if (storedOrder && storedOrder.trackingParameters) {
        trackingParameters = storedOrder.trackingParameters
        console.log(`[CHECK-STATUS] UTMs recuperados do storage:`, trackingParameters)
      } else {
        console.warn(`[CHECK-STATUS] Nenhum UTM encontrado no storage para ${transactionId}`)
      }

      // Atualizar status no storage
      if (storedOrder) {
        orderStorageService.saveOrder({
          ...storedOrder,
          status: 'paid',
          paidAt: transactionData.paidAt || new Date().toISOString()
        })
      }

      // Enviar para UTMify
      const utmifyEnabled = process.env.UTMIFY_ENABLED === 'true'
      const utmifyToken = process.env.UTMIFY_API_TOKEN
      let utmifySuccess = false
      console.log(`[CHECK-STATUS] 🔍 DEBUG UTMify: ENABLED=${utmifyEnabled}, TOKEN=${!!utmifyToken}`)
      
      if (utmifyEnabled && utmifyToken) {
        try {
          console.log(`[CHECK-STATUS] Enviando status PAID para UTMify`)

          // Extrair dados do cliente com fallback
          const customerData = transactionData.customer || {}
          const documentNumber = customerData.document?.number || customerData.document || 'N/A'
          
          const utmifyData = {
            orderId: transactionId.toString(),
            platform: "RecarGames",
            paymentMethod: "pix",
            status: "paid", // Status UTMify para paid
            createdAt: getBrazilTimestamp(new Date(transactionData.createdAt)),
            approvedDate: getBrazilTimestamp(new Date(transactionData.paidAt)),
            refundedAt: null,
            customer: {
              name: customerData.name || 'Cliente',
              email: customerData.email || 'nao-informado@email.com',
              phone: customerData.phone || null,
              document: documentNumber,
              country: "BR",
              ip: transactionData.ip || "unknown"
            },
            products: [
              {
                id: `recarga-${transactionId}`,
                name: "Recarga Free Fire",
                planId: null,
                planName: null,
                quantity: 1,
                priceInCents: transactionData.amount
              }
            ],
            trackingParameters: {
              src: (trackingParameters as any)?.src || null,
              sck: (trackingParameters as any)?.sck || null,
              utm_source: (trackingParameters as any)?.utm_source || null,
              utm_campaign: (trackingParameters as any)?.utm_campaign || null,
              utm_medium: (trackingParameters as any)?.utm_medium || null,
              utm_content: (trackingParameters as any)?.utm_content || null,
              utm_term: (trackingParameters as any)?.utm_term || null,
              gclid: (trackingParameters as any)?.gclid || null,
              xcod: (trackingParameters as any)?.xcod || null,
              keyword: (trackingParameters as any)?.keyword || null,
              device: (trackingParameters as any)?.device || null,
              network: (trackingParameters as any)?.network || null,
              gad_source: (trackingParameters as any)?.gad_source || null,
              gbraid: (trackingParameters as any)?.gbraid || null
            },
            commission: {
              totalPriceInCents: transactionData.amount,
              gatewayFeeInCents: transactionData.amount,
              userCommissionInCents: transactionData.amount
            },
            isTest: process.env.UTMIFY_TEST_MODE === 'true'
          }

          console.log(`[CHECK-STATUS] 📤 Dados sendo enviados para UTMify:`, JSON.stringify(utmifyData, null, 2))

          // Detectar URL base automaticamente
          const protocol = request.headers.get('x-forwarded-proto') || 'https'
          const host = request.headers.get('host')
          const baseUrl = `${protocol}://${host}`
          
          // Usar a mesma API que usamos para pending
          const utmifyResponse = await fetch(`${baseUrl}/api/utmify-track`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(utmifyData),
          })

          if (utmifyResponse.ok) {
            const utmifyResult = await utmifyResponse.json()
            console.log(`[CHECK-STATUS] ✅ UTMify notificado com sucesso (PAID)`)
            console.log(`[CHECK-STATUS] 📊 Resposta UTMify:`, JSON.stringify(utmifyResult, null, 2))
            utmifySuccess = true
            
            // Marcar como enviado no storage para evitar duplicação futura
            if (storedOrder) {
              orderStorageService.saveOrder({
                ...storedOrder,
                utmifySent: true,
                utmifyPaidSent: true,
                status: 'paid',
                paidAt: transactionData.paidAt || new Date().toISOString()
              })
              console.log(`[CHECK-STATUS] 🔒 Marcado como enviado para UTMify no storage`)
            }
          } else {
            const errorText = await utmifyResponse.text()
            console.error(`[CHECK-STATUS] ❌ Erro ao notificar UTMify:`, utmifyResponse.status)
            console.error(`[CHECK-STATUS] 📄 Detalhes do erro:`, errorText)
          }
        } catch (error) {
          console.error(`[CHECK-STATUS] Erro ao enviar para UTMify:`, error)
        }
      }

      return NextResponse.json({
        success: true,
        status: 'paid',
        message: 'Pagamento confirmado via fallback',
        transactionData: {
          id: transactionData.id,
          status: transactionData.status,
          amount: transactionData.amount,
          paidAt: transactionData.paidAt,
          customer: transactionData.customer.name
        },
        utmifySent: utmifySuccess,
        utmifyPaidSent: utmifySuccess
      })
    }

    // Retornar status atual (sem processar)
    return NextResponse.json({
      success: true,
      status: currentStatus,
      message: `Status atual: ${currentStatus}`,
      transactionData: {
        id: transactionData.id,
        status: transactionData.status,
        amount: transactionData.amount,
        paidAt: transactionData.paidAt,
        customer: transactionData.customer.name
      },
      needsProcessing: false
    })

  } catch (error) {
    console.error("[CHECK-STATUS] Erro:", error)
    return NextResponse.json({
      success: false,
      error: "Erro ao verificar status da transação",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
