import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const utmifyData = await request.json()

    // Verificar se UTMify está habilitado
    const utmifyEnabled = process.env.UTMIFY_ENABLED === 'true'
    const utmifyToken = process.env.UTMIFY_API_TOKEN
    const whitepageUrl = process.env.UTMIFY_WHITEPAGE_URL

    if (!utmifyEnabled || !utmifyToken) {
      console.log('UTMify não configurado ou desabilitado')
      return NextResponse.json({ success: false, message: 'UTMify não configurado' })
    }

    
    if (whitepageUrl) {
    } else {
    }

    // Preparar headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-token': utmifyToken
    }
    
    // Adicionar Referer apenas se whitepageUrl existir
    if (whitepageUrl) {
      headers['Referer'] = whitepageUrl
    }

    // Enviar para UTMify usando o mesmo endpoint do webhook
    const utmifyResponse = await fetch('https://api.utmify.com.br/api-credentials/orders', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(utmifyData)
    })

    if (utmifyResponse.ok) {
      const result = await utmifyResponse.json()
      console.log('✅ UTMify: Lead enviado com sucesso', result)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Lead enviado para UTMify',
        utmify_response: result
      })
    } else {
      const errorText = await utmifyResponse.text()
      console.error('❌ UTMify: Erro na resposta', errorText)
      
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
