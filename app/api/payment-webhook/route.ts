import { NextRequest, NextResponse } from "next/server"
import { orderStorageService } from "@/lib/order-storage"
import { adminLogger } from "@/lib/admin-logger"

// Interface para webhook do BlackCat (estrutura real)
interface BlackCatWebhookData {
  id: string
  type: string
  url: string
  objectId: string
  data: {
    id: number
    tenantId: string
    companyId: number
    amount: number
    currency: string
    paymentMethod: string
    status: string
    metadata: string
    customer: {
      id: number
      name: string
      email: string
      phone: string
      document: {
        number: string
        type: string
      }
    }
    pix?: {
      qrcode: string
      expirationDate: string
    }
    createdAt: string
    updatedAt: string
  }
}

// Interface legacy (manter para compatibilidade)
interface PaymentWebhookData {
  orderId: string
  transactionId?: string
  status: "pending" | "paid" | "cancelled" | "waiting_payment"
  amount?: number
  customerData?: {
    name: string
    email: string
    phone: string
    document: string
  }
  trackingParameters?: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚨 [DEBUG WEBHOOK] Webhook foi chamado!")
    console.log("🚨 [DEBUG WEBHOOK] URL:", request.url)
    console.log("🚨 [DEBUG WEBHOOK] Method:", request.method)
    console.log("🚨 [DEBUG WEBHOOK] Headers:", Object.fromEntries(request.headers.entries()))
    
    const rawData = await request.json()
    console.log("🚨 [DEBUG WEBHOOK] Raw data recebido:", JSON.stringify(rawData, null, 2))
    
    // Detectar se é estrutura BlackCat ou legacy
    let webhookData: PaymentWebhookData
    let isBlackCatFormat = false
    
    if (rawData.type === 'transaction' && rawData.data) {
      // Estrutura BlackCat
      isBlackCatFormat = true
      const blackcatData = rawData as BlackCatWebhookData
      
      console.log("🚨 [DEBUG WEBHOOK] Detectado formato BlackCat")
      console.log("🚨 [DEBUG WEBHOOK] Transaction ID:", blackcatData.data.id)
      console.log("🚨 [DEBUG WEBHOOK] Status:", blackcatData.data.status)
      
      // Parsear metadata para obter UTMs
      let utmParams = {}
      try {
        const metadata = JSON.parse(blackcatData.data.metadata || '{}')
        utmParams = metadata.utmParams || {}
        console.log("🚨 [DEBUG WEBHOOK] UTMs do metadata:", utmParams)
      } catch (e) {
        console.warn("🚨 [DEBUG WEBHOOK] Erro ao parsear metadata:", e)
      }
      
      // Mapear status BlackCat para nosso formato
      let mappedStatus: "pending" | "paid" | "cancelled" | "waiting_payment" = "pending"
      if (blackcatData.data.status === "waiting_payment") {
        mappedStatus = "pending"
      } else if (blackcatData.data.status === "paid") {
        mappedStatus = "paid"
      } else if (blackcatData.data.status === "cancelled") {
        mappedStatus = "cancelled"
      }
      
      // Converter para formato interno
      webhookData = {
        orderId: blackcatData.data.id.toString(),
        transactionId: blackcatData.data.id.toString(),
        status: mappedStatus,
        amount: blackcatData.data.amount || 0,
        customerData: {
          name: blackcatData.data.customer.name,
          email: blackcatData.data.customer.email,
          phone: blackcatData.data.customer.phone,
          document: blackcatData.data.customer.document.number
        },
        trackingParameters: utmParams as Record<string, string>
      }
    } else {
      // Estrutura legacy
      console.log("🚨 [DEBUG WEBHOOK] Detectado formato legacy")
      webhookData = rawData as PaymentWebhookData
    }
    
    console.log("[v0] Payment Webhook - Processed data:", webhookData)
    console.log("🚨 [DEBUG WEBHOOK] Status processado:", webhookData.status)
    console.log("🚨 [DEBUG WEBHOOK] Order ID processado:", webhookData.orderId)

    // Processar webhook para status "pending" e "paid"
    if (webhookData.status === "paid" || webhookData.status === "pending") {
      console.log(`[v0] Payment Webhook - Processing ${webhookData.status} status for order:`, webhookData.orderId)
      
      // Buscar dados do pedido no storage
      let storedOrder = orderStorageService.getOrder(webhookData.orderId)
      if (!storedOrder && webhookData.transactionId) {
        storedOrder = orderStorageService.getOrder(webhookData.transactionId)
      }
      
      // VALIDAÇÃO: Se não encontrou no orderStorage
      if (!storedOrder) {
        // Verificar se é email @cliente.com
        const customerEmail = webhookData.customerData?.email || ''
        const isClienteEmail = customerEmail.includes('@cliente.com')
        
        if (isClienteEmail) {
          // Email @cliente.com: criar entrada no orderStorage para quando vier PAID
          console.log("📝 [WEBHOOK] Email @cliente.com - Criando entrada no orderStorage")
          console.log("   - Transaction ID:", webhookData.orderId)
          console.log("   - Email:", customerEmail)
          
          storedOrder = {
            orderId: webhookData.orderId,
            transactionId: webhookData.transactionId,
            amount: webhookData.amount || 0,
            customerData: webhookData.customerData!,
            trackingParameters: {
              src: null,
              sck: null,
              utm_source: null,
              utm_campaign: null,
              utm_medium: null,
              utm_content: null,
              utm_term: null,
              xcod: null,
              keyword: null,
              device: null,
              network: null,
              gclid: null,
              gad_source: null,
              gbraid: null,
              wbraid: null,
              ...webhookData.trackingParameters
            },
            createdAt: new Date().toISOString(),
            status: 'pending' as const
          }
          
          // Salvar no orderStorage
          orderStorageService.saveOrder(storedOrder)
          console.log("✅ [WEBHOOK] Entrada criada no orderStorage para @cliente.com")
        } else {
          // Email normal: é de outro servidor - IGNORAR
          console.log("⚠️ [WEBHOOK] Transação de outro servidor - IGNORANDO")
          console.log("   - Transaction ID:", webhookData.orderId)
          console.log("   - Email:", customerEmail)
          console.log("   - Motivo: Não encontrado no orderStorage deste servidor")
          console.log("   - Ação: Webhook ignorado, UTMify NÃO será chamado")
          
          return NextResponse.json({
            success: true,
            message: "Webhook de outro servidor - ignorado",
            orderId: webhookData.orderId,
            reason: "not_from_this_server"
          })
        }
      }

      // Atualizar status do pedido
      orderStorageService.updateOrderStatus(webhookData.orderId, webhookData.status)
      
      // Log detalhado para admin
      const logType = webhookData.status === "paid" ? 'order_paid' : 'webhook'
      const logMessage = webhookData.status === "paid" ? 
        `Pagamento confirmado - ID: ${webhookData.orderId}` : 
        `Pagamento pendente - ID: ${webhookData.orderId}`
      
      adminLogger.addLog({
        type: logType,
        message: logMessage,
        details: {
          orderId: webhookData.orderId,
          transactionId: webhookData.transactionId,
          amount: webhookData.amount,
          email: storedOrder.customerData?.email || 'N/A',
          gclid: storedOrder.trackingParameters?.gclid || null,
          utm_source: storedOrder.trackingParameters?.utm_source || null,
          utm_campaign: storedOrder.trackingParameters?.utm_campaign || null,
          status: webhookData.status
        }
      })
      
      // Usar dados do storage (mais completos) combinados com dados do webhook
      const orderData = {
        orderId: storedOrder.orderId,
        amount: storedOrder.amount,
        customerData: storedOrder.customerData,
        trackingParameters: storedOrder.trackingParameters,
        status: webhookData.status
      }

      // Obter URL atual dinamicamente (usado por UTMify e Ratoeira)
      const host = request.headers.get('host')
      const protocol = request.headers.get('x-forwarded-proto') || 'https'
      const baseUrl = `${protocol}://${host}`

      // ⚠️ IMPORTANTE: Webhook NÃO envia para UTMify
      // O envio para UTMify é feito pelo POLLING (check-transaction-status)
      // Webhook apenas armazena os dados no orderStorage
      console.log("📝 [WEBHOOK] Dados armazenados no orderStorage")
      console.log("📝 [WEBHOOK] UTMify será notificado pelo POLLING (check-transaction-status)")
      console.log("📝 [WEBHOOK] Status:", webhookData.status)

      // Enviar evento de conversão para Ratoeira ADS apenas se habilitado E pagamento confirmado
      const ratoeiraEnabled = process.env.RATOEIRA_ENABLED === 'true'
      if (ratoeiraEnabled && webhookData.status === "paid") {
        try {
          console.log('[v0] Payment Webhook - Sending conversion to Ratoeira ADS')
          
          const ratoeiraResponse = await fetch(`${baseUrl}/api/ratoeira-conversion`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: webhookData.orderId,
              amount: webhookData.amount,
              gclid: storedOrder?.trackingParameters?.gclid || null,
              utm_source: storedOrder?.trackingParameters?.utm_source || null,
              utm_campaign: storedOrder?.trackingParameters?.utm_campaign || null,
              utm_medium: storedOrder?.trackingParameters?.utm_medium || null,
              utm_term: storedOrder?.trackingParameters?.utm_term || null,
              utm_content: storedOrder?.trackingParameters?.utm_content || null,
              customerData: {
                name: storedOrder?.customerData?.name || 'N/A',
                email: storedOrder?.customerData?.email || 'N/A'
              }
            }),
          })

          if (ratoeiraResponse.ok) {
            const ratoeiraData = await ratoeiraResponse.json()
            console.log('[v0] Payment Webhook - Ratoeira ADS conversion sent successfully:', ratoeiraData)
          } else {
            const errorText = await ratoeiraResponse.text()
            console.error('[v0] Payment Webhook - Ratoeira ADS error:', ratoeiraResponse.status, errorText)
          }
        } catch (error) {
          console.error('[v0] Payment Webhook - Error sending to Ratoeira ADS:', error)
        }
      } else {
        console.log("[v0] Payment Webhook - Ratoeira ADS disabled, skipping conversion")
      }

      // Enviar notificação para o cliente via Server-Sent Events ou WebSocket seria ideal,
      // mas por simplicidade, vamos apenas logar detalhadamente
      console.log("🎉 [WEBHOOK SUCCESS] Processamento completo!")
      console.log("🎉 [WEBHOOK SUCCESS] Order ID:", webhookData.orderId)
      console.log("🎉 [WEBHOOK SUCCESS] Status:", webhookData.status)
      console.log("🎉 [WEBHOOK SUCCESS] UTMify: Será enviado pelo POLLING")

      return NextResponse.json({
        success: true,
        message: `Payment status ${webhookData.status} processed successfully`,
        orderId: webhookData.orderId,
        status: webhookData.status,
        utmifySent: false, // Webhook não envia mais para UTMify
        timestamp: new Date().toISOString()
      })
    } else {
      console.log("[v0] Payment Webhook - Payment not confirmed, status:", webhookData.status)
      
      return NextResponse.json({
        success: true,
        message: "Payment status updated but not paid",
        status: webhookData.status
      })
    }
  } catch (error) {
    console.error("[v0] Payment Webhook - Error processing webhook:", error)
    
    return NextResponse.json({
      success: false,
      error: "Error processing payment webhook",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
