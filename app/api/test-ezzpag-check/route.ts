import { NextRequest, NextResponse } from 'next/server'

/**
 * 🧪 ROTA DE TESTE EZZPAG - CHECK STATUS
 * 
 * Endpoint: GET /api/test-ezzpag-check?transactionId=121297373
 * 
 * Testa a busca de transação por ID
 */

export async function GET(request: NextRequest) {
  try {
    console.log('\n🔍 ==================== TESTE EZZPAG CHECK - INÍCIO ====================')
    
    // Pegar transaction ID da query
    const transactionId = request.nextUrl.searchParams.get('transactionId')
    
    if (!transactionId) {
      return NextResponse.json({
        error: 'Transaction ID é obrigatório',
        usage: 'GET /api/test-ezzpag-check?transactionId=121297373'
      }, { status: 400 })
    }
    
    console.log('🔎 [TEST] Transaction ID:', transactionId)
    
    // Credenciais Ezzpag
    const authToken = 'c2tfbGl2ZV92MnpCODdZR3FVdDRPNXRKa0Qza0xreGR2OE80T3pIT0lGQkVidnVza246eA=='
    
    const url = `https://api.ezzypag.com.br/v1/transactions/${transactionId}`
    
    console.log('🎯 [EZZPAG] URL:', url)
    console.log('🔑 [EZZPAG] Auth: Basic ' + authToken.substring(0, 20) + '...')
    console.log('')
    
    // Fazer requisição para Ezzpag
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authToken}`,
        'Accept': 'application/json'
      }
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
      console.log('   - Transaction ID:', data.id || 'NÃO ENCONTRADO')
      console.log('   - Status:', data.status || 'NÃO ENCONTRADO')
      console.log('   - Amount:', data.amount || 'NÃO ENCONTRADO')
      console.log('   - Paid Amount:', data.paidAmount || 0)
      console.log('   - Paid At:', data.paidAt || 'NÃO PAGO')
      console.log('   - Customer:', data.customer?.name || 'NÃO ENCONTRADO')
      console.log('')
      
      // Análise do status
      console.log('📊 [EZZPAG] ANÁLISE DO STATUS:')
      const isPaid = data.status === 'paid' || data.status === 'approved' || data.paidAmount > 0
      const isWaiting = data.status === 'waiting_payment'
      const isCanceled = data.status === 'canceled' || data.status === 'cancelled'
      const isRefunded = data.status === 'refunded'
      
      console.log('   - isPaid:', isPaid)
      console.log('   - isWaiting:', isWaiting)
      console.log('   - isCanceled:', isCanceled)
      console.log('   - isRefunded:', isRefunded)
      console.log('')
      
      // Estrutura completa para análise
      console.log('📋 [EZZPAG] ESTRUTURA COMPLETA DA RESPOSTA:')
      console.log('Chaves de primeiro nível:', Object.keys(data))
      if (data.pix) {
        console.log('Chaves dentro de "pix":', Object.keys(data.pix))
      }
      if (data.customer) {
        console.log('Chaves dentro de "customer":', Object.keys(data.customer))
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
    console.log('🏁 ==================== TESTE EZZPAG CHECK - FIM ====================\n')
    
    // Retornar resposta completa para análise
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      headers: headers,
      data: data,
      analysis: response.ok ? {
        transactionId: data.id,
        status: data.status,
        isPaid: data.status === 'paid' || data.status === 'approved' || data.paidAmount > 0,
        isWaiting: data.status === 'waiting_payment',
        amount: data.amount,
        paidAmount: data.paidAmount,
        paidAt: data.paidAt,
        customer: data.customer?.name
      } : null
    }, { status: response.ok ? 200 : 500 })
    
  } catch (error: any) {
    console.error('💥 [EZZPAG] ERRO FATAL:', error)
    console.error('💥 [EZZPAG] Stack:', error.stack)
    console.log('🏁 ==================== TESTE EZZPAG CHECK - FIM (COM ERRO) ====================\n')
    
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
