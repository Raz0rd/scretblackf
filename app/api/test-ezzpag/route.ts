import { NextRequest, NextResponse } from 'next/server'

/**
 * 🧪 ROTA DE TESTE EZZPAG
 * 
 * Endpoint: POST /api/test-ezzpag
 * 
 * Body de teste:
 * {
 *   "amount": 1499,
 *   "customer": {
 *     "name": "João Silva",
 *     "document": "12345678900",
 *     "phone": "11999999999"
 *   }
 * }
 */

export async function POST(request: NextRequest) {
  try {
    console.log('\n🧪 ==================== TESTE EZZPAG - INÍCIO ====================')
    
    // Pegar dados do body
    const body = await request.json()
    console.log('📥 [TEST] Body recebido:', JSON.stringify(body, null, 2))
    
    // Credenciais Ezzpag
    const authToken = 'c2tfbGl2ZV92MnpCODdZR3FVdDRPNXRKa0Qza0xreGR2OE80T3pIT0lGQkVidnVza246eA=='
    
    // Gerar email fake baseado no nome
    const generateFakeEmail = (name: string): string => {
      const cleanName = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
      return `${cleanName}@gmail.com`
    }
    
    // Endereços para uso aleatório
    const ADDRESSES = [
      { cep: "61932130", cidade: "Maracanaú", estado: "CE", bairro: "Pajuçara", rua: "Rua Senador Petrônio Portela" },
      { cep: "60331200", cidade: "Fortaleza", estado: "CE", bairro: "Barra do Ceará", rua: "Avenida Vinte de Janeiro" },
      { cep: "12510516", cidade: "Guaratinguetá", estado: "SP", bairro: "Bosque dos Ipês", rua: "Rua Fábio Rangel Dinamarco" },
      { cep: "58400295", cidade: "Campina Grande", estado: "PB", bairro: "Centro", rua: "Rua Frei Caneca" },
      { cep: "66025660", cidade: "Belém", estado: "PA", bairro: "Jurunas", rua: "Rua dos Mundurucus" }
    ]
    
    const randomAddress = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)]
    
    // Preparar payload Ezzpag (FORMATO CORRETO)
    const ezzpagPayload = {
      customer: {
        document: {
          number: body.customer?.document || '08596766766',
          type: 'cpf'
        },
        name: body.customer?.name || 'João Silva Teste',
        email: body.customer?.email || generateFakeEmail(body.customer?.name || 'teste'),
        phone: body.customer?.phone || '61995956744'
      },
      shipping: {
        address: {
          street: randomAddress.rua,
          streetNumber: '123',
          zipCode: randomAddress.cep,
          neighborhood: randomAddress.bairro,
          city: randomAddress.cidade,
          state: randomAddress.estado,
          country: 'BR'
        },
        fee: 0
      },
      items: [
        {
          tangible: false,
          title: 'Produto Digital Premium',
          unitPrice: body.amount || 2100,
          quantity: 1
        }
      ],
      amount: body.amount || 2100,
      paymentMethod: 'pix'
    }
    
    console.log('📤 [EZZPAG] REQUEST PAYLOAD:')
    console.log(JSON.stringify(ezzpagPayload, null, 2))
    console.log('')
    console.log('🎯 [EZZPAG] URL: https://api.ezzypag.com.br/v1/transactions')
    console.log('🔑 [EZZPAG] Auth: Basic ' + authToken.substring(0, 20) + '...')
    console.log('')
    
    // Fazer requisição para Ezzpag
    const response = await fetch('https://api.ezzypag.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(ezzpagPayload)
    })
    
    console.log('📡 [EZZPAG] RESPONSE STATUS:', response.status)
    console.log('📡 [EZZPAG] RESPONSE STATUS TEXT:', response.statusText)
    console.log('')
    console.log('📊 [EZZPAG] RESPONSE HEADERS:')
    const headers = Object.fromEntries(response.headers.entries())
    console.log(JSON.stringify(headers, null, 2))
    console.log('')
    
    // Pegar resposta
    const responseText = await response.text()
    console.log('📥 [EZZPAG] RESPONSE BODY (RAW):')
    console.log(responseText)
    console.log('')
    
    let data
    try {
      data = JSON.parse(responseText)
      console.log('📥 [EZZPAG] RESPONSE BODY (PARSED):')
      console.log(JSON.stringify(data, null, 2))
    } catch (e) {
      console.error('❌ [EZZPAG] Erro ao fazer parse do JSON:', e)
      data = { raw: responseText }
    }
    
    console.log('')
    
    // Se sucesso, extrair dados importantes
    if (response.ok) {
      console.log('✅ [EZZPAG] SUCESSO!')
      console.log('')
      console.log('🔍 [EZZPAG] DADOS EXTRAÍDOS:')
      console.log('   - Transaction ID:', data.id || data.transaction_id || 'NÃO ENCONTRADO')
      console.log('   - Status:', data.status || 'NÃO ENCONTRADO')
      console.log('   - PIX QR Code:', data.pix?.qrcode ? `${data.pix.qrcode.substring(0, 50)}...` : 'NÃO ENCONTRADO')
      console.log('   - PIX Copy/Paste:', data.pix?.copy_paste ? `${data.pix.copy_paste.substring(0, 50)}...` : 'NÃO ENCONTRADO')
      console.log('   - Expiration:', data.pix?.expiration_date || data.expires_at || 'NÃO ENCONTRADO')
      console.log('')
      
      // Estrutura completa para análise
      console.log('📋 [EZZPAG] ESTRUTURA COMPLETA DA RESPOSTA:')
      console.log('Chaves de primeiro nível:', Object.keys(data))
      if (data.pix) {
        console.log('Chaves dentro de "pix":', Object.keys(data.pix))
      }
      if (data.data) {
        console.log('Chaves dentro de "data":', Object.keys(data.data))
      }
    } else {
      console.error('❌ [EZZPAG] ERRO NA REQUISIÇÃO!')
      console.error('   - Status:', response.status)
      console.error('   - Mensagem:', data.message || data.error || 'Sem mensagem')
      if (data.errors) {
        console.error('   - Erros detalhados:', JSON.stringify(data.errors, null, 2))
      }
    }
    
    console.log('')
    console.log('🏁 ==================== TESTE EZZPAG - FIM ====================\n')
    
    // Retornar resposta completa para análise
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      headers: headers,
      data: data,
      payload_sent: ezzpagPayload
    }, { status: response.ok ? 200 : 500 })
    
  } catch (error: any) {
    console.error('💥 [EZZPAG] ERRO FATAL:', error)
    console.error('💥 [EZZPAG] Stack:', error.stack)
    console.log('🏁 ==================== TESTE EZZPAG - FIM (COM ERRO) ====================\n')
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

// Permitir GET para teste rápido
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: '🧪 Rota de teste Ezzpag',
    usage: 'POST /api/test-ezzpag com body JSON',
    example_body: {
      amount: 1499,
      customer: {
        name: 'João Silva',
        document: '12345678900',
        phone: '11999999999'
      }
    },
    docs: 'https://ezzypag.readme.io/reference/criar-transacao'
  })
}
