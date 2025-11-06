import { NextRequest, NextResponse } from "next/server"
import { orderStorageService } from "@/lib/order-storage"
import { getConfig, getEnvVar } from "./config"

// Forçar Node.js runtime
export const runtime = 'nodejs'

// Função para obter o IP real do cliente
function getClientIp(req: NextRequest): string {
  const headers = [
    'cf-connecting-ip',        // Cloudflare
    'x-real-ip',              // Nginx
    'x-forwarded-for',        // Proxy padrão
    'x-client-ip',            // Apache
  ];
  
  for (const header of headers) {
    const value = req.headers.get(header);
    if (value) {
      const ip = value.split(',')[0].trim();
      if (ip && ip !== 'unknown') {
        return ip;
      }
    }
  }
  
  return req.ip || 'unknown';
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// Função para gerar PIX via BlackCat
async function generatePixBlackCat(body: any, baseUrl: string) {
  const authToken = process.env.BLACKCAT_API_AUTH
  console.log("\n🐈 [BlackCat] Verificando autenticação:", authToken ? "✓ Token presente" : "✗ Token ausente")
  
  if (!authToken) {
    console.error("❌ [BlackCat] BLACKCAT_API_AUTH não configurado")
    throw new Error("Configuração de API não encontrada")
  }

  console.log("📤 [BlackCat] REQUEST BODY:", JSON.stringify(body, null, 2))
  
  // Log dos parâmetros UTM recebidos para análise
  console.log("🔗 [UTM PARAMS] Parâmetros recebidos para PIX:")
  console.log("📊 [UTM PARAMS] UTM Source:", body.utmParams?.utm_source || 'N/A')
  console.log("📊 [UTM PARAMS] UTM Medium:", body.utmParams?.utm_medium || 'N/A')
  console.log("📊 [UTM PARAMS] UTM Campaign:", body.utmParams?.utm_campaign || 'N/A')
  console.log("📊 [UTM PARAMS] UTM Term:", body.utmParams?.utm_term || 'N/A')
  console.log("📊 [UTM PARAMS] UTM Content:", body.utmParams?.utm_content || 'N/A')
  console.log("📊 [UTM PARAMS] GCLID:", body.utmParams?.gclid || 'N/A')
  console.log("📊 [UTM PARAMS] FBCLID:", body.utmParams?.fbclid || 'N/A')
  console.log("📊 [UTM PARAMS] Todos os UTMs:", JSON.stringify(body.utmParams || {}, null, 2))
  
  console.log("🌐 [BlackCat] URL dinâmica detectada:", baseUrl)

  // Gerar email fake baseado no nome do usuário
  const generateFakeEmail = (name: string): string => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return `${cleanName}@gmail.com`
  }

  const blackcatPayload = {
    amount: body.amount,
    currency: "BRL",
    paymentMethod: "pix",
    postbackUrl: `${baseUrl}/api/webhook`,
    metadata: null,
    items: [
      {
        title: body.itemType === "recharge" ? "eBook eSport Digital Premium" : "eBook eSport Gold Edition",
        unitPrice: body.amount,
        tangible: false,
        quantity: 1,
      },
    ],
    customer: {
      ...body.customer,
      email: generateFakeEmail(body.customer.name)
    },
  }
  
  console.log("📦 [BlackCat] PAYLOAD ENVIADO:", JSON.stringify(blackcatPayload, null, 2))
  console.log("🎯 [BlackCat] URL:", "https://api.blackcatpagamentos.com/v1/transactions")
  console.log("🔑 [BlackCat] Auth Token:", authToken.substring(0, 10) + "...")
  
  const response = await fetch("https://api.blackcatpagamentos.com/v1/transactions", {
    method: "POST",
    headers: {
      accept: "application/json",
      authorization: authToken,
      "content-type": "application/json",
    },
    body: JSON.stringify(blackcatPayload),
  })

  console.log("📡 [BlackCat] RESPONSE STATUS:", response.status)
  console.log("📊 [BlackCat] RESPONSE HEADERS:", Object.fromEntries(response.headers.entries()))

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ [BlackCat] ERROR RESPONSE:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    throw new Error(`Erro na API de pagamento: ${response.status}`)
  }

  const data = await response.json()
  console.log("✅ [BlackCat] SUCCESS RESPONSE:", JSON.stringify(data, null, 2))

  // Extrair informações importantes da resposta
  const transactionId = data.id || data.transaction_id || data.transactionId || data.payment_id
  const pixCode = data.pix?.qrcode || data.pixCode || data.pix_code || data.code || data.qr_code_text || data.payment_code
  const qrCodeImage = data.qrCode || data.qr_code || data.qr_code_url || data.pix?.qr_code_url
  
  console.log("🔍 [BlackCat] DADOS EXTRAÍDOS:", {
    transactionId,
    pixCode: pixCode ? `${pixCode.substring(0, 50)}...` : null,
    qrCodeImage: qrCodeImage ? "Presente" : "Ausente"
  })

  // Retornar dados normalizados
  try {
    console.log('✅ [PIX] QR Code gerado com sucesso')
  } catch (error) {
    console.error('[PIX] Erro ao registrar conversão QR:', error)
  }
  
  const normalizedResponse = {
    ...data,
    transactionId,
    pixCode,
    qrCode: qrCodeImage,
    success: true
  }
  
  console.log("🎉 [BlackCat] RESPOSTA NORMALIZADA:", JSON.stringify(normalizedResponse, null, 2))
  return normalizedResponse
}

// Função para gerar PIX via GhostPay
async function generatePixGhostPay(body: any, baseUrl: string) {
  const secretKey = process.env.GHOSTPAY_API_KEY
  console.log("\n👻 [GhostPay] Verificando autenticação:", secretKey ? "✓ Token presente" : "✗ Token ausente")
  
  if (!secretKey) {
    console.error("❌ [GhostPay] GHOSTPAY_API_KEY não configurado")
    throw new Error("Configuração de API não encontrada")
  }

  console.log("📤 [GhostPay] REQUEST BODY:", JSON.stringify(body, null, 2))
  
  // Log dos parâmetros UTM recebidos
  console.log("🔗 [UTM PARAMS] Parâmetros recebidos para PIX:")
  console.log("📊 [UTM PARAMS] UTM Source:", body.utmParams?.utm_source || 'N/A')
  console.log("📊 [UTM PARAMS] Todos os UTMs:", JSON.stringify(body.utmParams || {}, null, 2))
  
  console.log("🌐 [GhostPay] URL dinâmica detectada:", baseUrl)

  // Gerar email fake baseado no nome do usuário
  const generateFakeEmail = (name: string): string => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return `${cleanName}@gmail.com`
  }

  const ghostPayload = {
    amount: body.amount,
    paymentMethod: 'pix',
    customer: {
      name: body.customer.name,
      email: generateFakeEmail(body.customer.name),
      phone: body.customer.phone,
      document: {
        number: body.customer.document.number || body.customer.document,
        type: 'cpf'
      }
    },
    items: [
      {
        title: body.itemType === "recharge" ? "eBook eSport Digital Premium" : "eBook eSport Gold Edition",
        unitPrice: body.amount,
        quantity: 1,
        tangible: false
      }
    ]
  }
  
  // Criar auth Basic com base64
  const authString = Buffer.from(`${secretKey}:x`).toString('base64')
  
  console.log("📦 [GhostPay] PAYLOAD ENVIADO:", JSON.stringify(ghostPayload, null, 2))
  console.log("🎯 [GhostPay] URL:", "https://api.ghostspaysv2.com/functions/v1/transactions")
  console.log("🔑 [GhostPay] Auth Token:", authString.substring(0, 10) + "...")
  
  const response = await fetch("https://api.ghostspaysv2.com/functions/v1/transactions", {
    method: "POST",
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ghostPayload),
  })

  console.log("📡 [GhostPay] RESPONSE STATUS:", response.status)
  console.log("📊 [GhostPay] RESPONSE HEADERS:", Object.fromEntries(response.headers.entries()))

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ [GhostPay] ERROR RESPONSE:", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    throw new Error(`Erro na API de pagamento: ${response.status}`)
  }

  const data = await response.json()
  console.log("✅ [GhostPay] SUCCESS RESPONSE:", JSON.stringify(data, null, 2))

  // Extrair informações importantes da resposta GhostPay
  const transactionId = data.id || data.transaction_id || data.transactionId
  const pixCode = data.pix?.qrcode || data.pixCode || data.pix_code || data.code
  const qrCodeImage = data.qrCode || data.qr_code || data.qr_code_url || data.pix?.qr_code_url
  
  console.log("🔍 [GhostPay] DADOS EXTRAÍDOS:", {
    transactionId,
    pixCode: pixCode ? `${pixCode.substring(0, 50)}...` : null,
    qrCodeImage: qrCodeImage ? "Presente" : "Ausente"
  })

  const normalizedResponse = {
    ...data,
    transactionId,
    pixCode,
    qrCode: qrCodeImage,
    success: true
  }
  
  console.log("🎉 [GhostPay] RESPOSTA NORMALIZADA:", JSON.stringify(normalizedResponse, null, 2))
  return normalizedResponse
}

// Função para gerar PIX via Umbrela
async function generatePixUmbrela(body: any, baseUrl: string) {
  const config = getConfig()
  const apiKey = config.umbrelaApiKey
  console.log("\n☂️ [Umbrela] Verificando autenticação:", apiKey ? "✓ Token presente" : "✗ Token ausente")
  console.log("🔧 [Umbrela] Config debug:", {
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    paymentGateway: config.paymentGateway,
    isNetlify: config.isNetlify,
    isProduction: config.isProduction
  })
  
  if (!apiKey) {
    console.error("❌ [Umbrela] UMBRELA_API_KEY não configurado")
    console.error("❌ [Umbrela] Env vars debug:", {
      processEnvKeys: Object.keys(process.env).length,
      hasProcessEnv: typeof process !== 'undefined',
      umbrelaDirect: process.env.UMBRELA_API_KEY ? 'present' : 'missing'
    })
    throw new Error("UMBRELA_API_KEY não configurado no servidor")
  }

  console.log("📤 [Umbrela] REQUEST BODY:", JSON.stringify(body, null, 2))
  console.log("🌐 [Umbrela] URL dinâmica detectada:", baseUrl)

  // Gerar email fake baseado no nome do usuário
  const generateFakeEmail = (name: string): string => {
    const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    return `${cleanName}@gmail.com`
  }

  // Gerar nome de produto IPTV variado
  const generateIptvProductName = (itemType: string, amount: number): string => {
    const variants = [200, 250, 300, 350, 400, 500, 600]
    const randomVariant = variants[Math.floor(Math.random() * variants.length)]
    
    if (itemType === "recharge") {
      return `IPTV Assinatura Premium ${randomVariant}`
    } else {
      return `IPTV Gold Premium ${randomVariant}`
    }
  }

  // Endereços para uso aleatório
  const ADDRESSES = [
    { cep: "12510516", cidade: "Guaratinguetá", estado: "SP", bairro: "Bosque dos Ipês", rua: "Rua Fábio Rangel Dinamarco" },
    { cep: "58400295", cidade: "Campina Grande", estado: "PB", bairro: "Centro", rua: "Rua Frei Caneca" },
    { cep: "66025660", cidade: "Belém", estado: "PA", bairro: "Jurunas", rua: "Rua dos Mundurucus" },
    { cep: "37206660", cidade: "Lavras", estado: "MG", bairro: "Jardim Floresta", rua: "Rua Tenente Fulgêncio" },
    { cep: "13150148", cidade: "Cosmópolis", estado: "SP", bairro: "Jardim Bela Vista", rua: "Rua Eurides de Godoi" },
    { cep: "89560190", cidade: "Videira", estado: "SC", bairro: "Centro", rua: "Rua Padre Anchieta" },
    { cep: "60331200", cidade: "Fortaleza", estado: "CE", bairro: "Barra do Ceará", rua: "Avenida Vinte de Janeiro" },
    { cep: "71065330", cidade: "Brasília", estado: "DF", bairro: "Guará II", rua: "Quadra QI 33" },
    { cep: "61932130", cidade: "Maracanaú", estado: "CE", bairro: "Pajuçara", rua: "Rua Senador Petrônio Portela" },
    { cep: "60331240", cidade: "Fortaleza", estado: "CE", bairro: "Barra do Ceará", rua: "Rua Estevão de Campos" },
    { cep: "29125036", cidade: "Vila Velha", estado: "ES", bairro: "Barra do Jucu", rua: "Rua das Andorinhas" },
    { cep: "85863000", cidade: "Foz do Iguaçu", estado: "PR", bairro: "Centro Cívico", rua: "Avenida Costa e Silva" },
    { cep: "35162087", cidade: "Ipatinga", estado: "MG", bairro: "Iguaçu", rua: "Rua Magnetita" }
  ]
  
  // Selecionar endereço aleatório
  const randomAddress = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)]
  
  // Endereço padrão (obrigatório para Umbrela)
  const defaultAddress = {
    street: randomAddress.rua || "Rua Digital",
    streetNumber: "123",
    complement: "",
    zipCode: randomAddress.cep || "01000000",
    neighborhood: randomAddress.bairro || "Centro",
    city: randomAddress.cidade || "São Paulo",
    state: randomAddress.estado || "SP",
    country: "br"
  }

  // Preparar metadata com dados do usuário para verificação
  const customerCPF = body.customer.document.number || body.customer.document
  const customerEmail = body.customer.email || generateFakeEmail(body.customer.name)
  const metadataObject = {
    usuario: {
      nome: body.customer.name,
      cpf: customerCPF,
      email: customerEmail,
      telefone: body.customer.phone,
      endereco: `${randomAddress.rua}, 123 - ${randomAddress.bairro}, ${randomAddress.cidade}/${randomAddress.estado} - CEP: ${randomAddress.cep}`
    },
    pedido: {
      valor_centavos: body.amount,
      valor_reais: (body.amount / 100).toFixed(2)
    }
  }
  
  console.log("📋 [Umbrela] METADATA ENVIADO:", JSON.stringify(metadataObject, null, 2))
  
  const metadata = JSON.stringify(metadataObject)

  const umbrelaPayload = {
    amount: body.amount,
    currency: "BRL",
    paymentMethod: "PIX",
    customer: {
      name: body.customer.name,
      email: customerEmail,
      document: {
        number: customerCPF,
        type: "CPF"
      },
      phone: body.customer.phone,
      externalRef: "",
      address: defaultAddress
    },
    shipping: {
      fee: 0,
      address: defaultAddress
    },
    items: [{
      title: generateIptvProductName(body.itemType, body.amount),
      unitPrice: body.amount,
      quantity: 1,
      tangible: false,
      externalRef: ""
    }],
    pix: {
      expiresInDays: 1
    },
    postbackUrl: `${baseUrl}/api/webhook`,
    metadata: metadata,
    traceable: true,
    ip: "0.0.0.0"
  }
  
  console.log("📦 [Umbrela] PAYLOAD ENVIADO:", JSON.stringify(umbrelaPayload, null, 2))
  console.log("🎯 [Umbrela] URL:", "https://api-gateway.umbrellapag.com/api/user/transactions")
  console.log("🔑 [Umbrela] API Key:", apiKey.substring(0, 10) + "...")
  
  // Salvar debug em storage para Netlify
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    baseUrl,
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey?.length || 0,
    payloadSize: JSON.stringify(umbrelaPayload).length
  }
  
  try {
    const response = await fetch("https://api-gateway.umbrellapag.com/api/user/transactions", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "User-Agent": "UMBRELLAB2B/1.0",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(umbrelaPayload),
    })

    console.log("📡 [Umbrela] RESPONSE STATUS:", response.status)
    console.log("📊 [Umbrela] RESPONSE HEADERS:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("❌ [Umbrela] ERROR RESPONSE:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      // Retornar erro estruturado para debug no Netlify
      return NextResponse.json({ 
        error: "Erro na API Umbrela",
        debug: {
          ...debugInfo,
          responseStatus: response.status,
          responseBody: errorText,
          apiUrl: "https://api-gateway.umbrellapag.com/api/user/transactions"
        }
      }, { status: 500 })
    }

    const data = await response.json()
    console.log("✅ [Umbrela] SUCCESS RESPONSE:", JSON.stringify(data, null, 2))

    // Extrair informações da resposta Umbrela
    const transactionId = data.data?.id
    const pixCode = data.data?.qrCode
    const qrCodeImage = data.data?.qrCode // Umbrela retorna QR Code direto no texto
    
    console.log("🔍 [Umbrela] DADOS EXTRAÍDOS:", {
      transactionId,
      pixCode: pixCode ? `${pixCode.substring(0, 50)}...` : null,
      status: data.data?.status
    })
    
    const normalizedResponse = {
      ...data.data,
      transactionId,
      pixCode,
      qrCode: qrCodeImage,
      success: true
    }
    
    console.log("🎉 [Umbrela] RESPOSTA NORMALIZADA:", JSON.stringify(normalizedResponse, null, 2))
    return normalizedResponse
    
  } catch (networkError) {
    console.error("❌ [Umbrela] NETWORK ERROR:", networkError)
    
    // Lançar erro para ser capturado pelo catch principal
    throw new Error(`Erro de rede Umbrela: ${networkError instanceof Error ? networkError.message : 'Unknown error'}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ler configurações das env vars
    const config = getConfig()
    const gateway = config.paymentGateway
    console.log("\n💳 [GATEWAY] Gateway selecionado:", gateway.toUpperCase())
    
    // Debug de variáveis de ambiente
    console.log("🔑 [ENV] PAYMENT_GATEWAY:", config.paymentGateway)
    console.log("🔑 [ENV] UMBRELA_API_KEY:", config.umbrelaApiKey ? "✓ Presente" : "❌ Ausente")
    console.log("🔑 [ENV] NODE_ENV:", getEnvVar('NODE_ENV'))
    console.log("🔧 [CONFIG] Debug completo:", {
      isNetlify: config.isNetlify,
      isProduction: config.isProduction,
      hasUmbrelaKey: !!config.umbrelaApiKey
    })
    
    const body = await request.json()
    
    // Obter URL atual dinamicamente
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')
    const baseUrl = `${protocol}://${host}`
    
    // Debug detalhado da URL
    console.log("🌐 [URL DEBUG] Headers recebidos:", {
      host: request.headers.get('host'),
      'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
      'x-real-ip': request.headers.get('x-real-ip'),
      'cf-connecting-ip': request.headers.get('cf-connecting-ip'),
      protocol,
      baseUrl
    })
    
    let result
    
    if (gateway === 'ghostpay') {
      result = await generatePixGhostPay(body, baseUrl)
    } else if (gateway === 'umbrela') {
      result = await generatePixUmbrela(body, baseUrl)
    } else {
      result = await generatePixBlackCat(body, baseUrl)
    }
    
    // SALVAR no order storage com tracking parameters
    console.log("💾 [STORAGE] Salvando pedido no order storage...")
    try {
      const orderData = {
        orderId: result.externalRef || result.transactionId,
        transactionId: result.transactionId,
        amount: body.amount,
        customerData: {
          name: body.customer?.name || '',
          email: body.customer?.email || '',
          phone: body.customer?.phone || '',
          document: body.customer?.document?.number || ''
        },
        trackingParameters: body.trackingParams || {},
        createdAt: new Date().toISOString(),
        status: 'pending' as const
      }
      
      orderStorageService.saveOrder(orderData)
      console.log("✅ [STORAGE] Pedido salvo com sucesso!")
      console.log("📋 [STORAGE] Dados salvos:", JSON.stringify(orderData, null, 2))
    } catch (storageError) {
      console.error("❌ [STORAGE] Erro ao salvar:", storageError)
    }
    
    // DEBUG: Verificar se dados foram salvos no storage
    console.log("🔍 [DEBUG] Verificando se dados foram salvos no storage...")
    const savedOrder = orderStorageService.getOrder(result.transactionId)
    if (savedOrder) {
      console.log("✅ [DEBUG] Dados salvos no storage:", JSON.stringify(savedOrder, null, 2))
    } else {
      console.error("❌ [DEBUG] ERRO: Dados NÃO foram salvos no storage!")
    }
    
    // ENVIAR para UTMify após gerar QR Code (status: waiting_payment)
    const utmifyEnabled = process.env.UTMIFY_ENABLED === 'true'
    console.log("🔍 [UTMIFY] UTMIFY_ENABLED:", utmifyEnabled)
    
    if (utmifyEnabled && savedOrder) {
      try {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        console.log("📤 [UTMIFY] Enviando status WAITING_PAYMENT após gerar QR Code")
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        
        const utmifyResponse = await fetch(`${baseUrl}/api/send-to-utmify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: savedOrder.orderId,
            transactionId: savedOrder.transactionId,
            amount: savedOrder.amount,
            customerData: savedOrder.customerData,
            trackingParameters: savedOrder.trackingParameters,
            status: "pending" // Será convertido para waiting_payment no send-to-utmify
          }),
        })

        if (utmifyResponse.ok) {
          const utmifyData = await utmifyResponse.json()
          console.log("✅ [UTMIFY] Status WAITING_PAYMENT enviado com sucesso!")
          console.log("📊 [UTMIFY] Resposta:", JSON.stringify(utmifyData, null, 2))
          
          // Marcar como enviado no storage
          orderStorageService.saveOrder({
            ...savedOrder,
            utmifySent: true,
            utmifyWaitingSent: true
          })
          console.log("🔒 [UTMIFY] Marcado como enviado no storage")
        } else {
          const errorText = await utmifyResponse.text()
          console.error("❌ [UTMIFY] Erro ao enviar:", utmifyResponse.status, errorText)
        }
        
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
      } catch (error) {
        console.error("❌ [UTMIFY] Erro ao enviar para UTMify:", error)
      }
    } else {
      console.log("ℹ️ [UTMIFY] Envio desabilitado ou pedido não encontrado")
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("💥 [GATEWAY] EXCEPTION:", error)
    console.error("🔍 [GATEWAY] Error details:", error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ error: "Erro ao gerar pagamento PIX" }, { status: 500 })
  }
}
