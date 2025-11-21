import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuração do cloaker
const CLOAKER_FILTER_ID = process.env.CLOAKER_FILTER_ID
if (!CLOAKER_FILTER_ID) {
  throw new Error('❌ CLOAKER_FILTER_ID não configurado no .env')
}

const CLOAKER_CONFIG = {
  url: `https://www.altercpa.one/fltr/${CLOAKER_FILTER_ID}`,
  whitePagePath: '/',  // Página principal agora é white page
  offerPagePath: '/promo'  // Página de oferta
}

// Cache para evitar múltiplas verificações do mesmo usuário
const cloakerCache = new Map<string, { type: string; timestamp: number }>()
const CACHE_DURATION = 60 * 1000 // 1 minuto

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const hostname = request.headers.get('host') || ''
  
  // 🚫 IGNORAR requisições de assets, APIs e arquivos estáticos
  const shouldIgnore = 
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') && !pathname.endsWith('/') || // Arquivos com extensão (exceto rotas)
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  
  if (shouldIgnore) {
    return NextResponse.next()
  }
  
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
  
  // ✅ VERIFICAR COOKIE PRIMEIRO - Se tem cookie válido, libera TUDO
  const hasValidCookie = request.cookies.get('cloaker_verified')?.value === 'true'
  
  if (hasValidCookie) {
    // Se tem cookie mas está acessando a raiz (/) sem referer, redirecionar para /promo
    if (pathname === '/' || pathname === '') {
      const referer = request.headers.get('referer') || ''
      if (!referer) {
        console.log('🔄 [Cloaker] Usuário com cookie acessando raiz sem referer - redirecionando para /promo')
        return NextResponse.redirect(new URL('/promo', request.url))
      }
    }
    
    // Usuário verificado - pode acessar qualquer rota
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
    // Se chegou aqui sem cookie, bloquear (cookie já foi verificado acima)
    console.log('🚫 [Cloaker] Acesso a /promo sem cookie do cloaker - redirecionando para /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Proteger rota /success - mas permitir Google Ads Bot e requisições internas
  if (pathname.startsWith('/success')) {
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    const url = request.nextUrl
    const hasTransactionId = url.searchParams.has('transactionId')
    const hasAmount = url.searchParams.has('amount')
    
    // Detectar bots do Google (Googlebot, AdsBot, etc)
    const isGoogleBot = /googlebot|adsbot-google|google-ads/i.test(userAgent)
    
    // Detectar requisições internas (UTMify, scripts do próprio site)
    const isInternalRequest = referer.includes(request.headers.get('host') || '')
    
    // Se é bot do Google, deixar passar SEMPRE (para registrar conversão)
    if (isGoogleBot) {
      console.log('🤖 [Success] Google Bot detectado - permitindo acesso')
      return NextResponse.next()
    }
    
    // Se é requisição interna (UTMify), deixar passar
    if (isInternalRequest) {
      return NextResponse.next()
    }
    
    // Se não é bot/interno e não tem parâmetros, redirecionar para white page
    if (!hasTransactionId || !hasAmount) {
      console.log('🚫 [Success] Acesso sem parâmetros obrigatórios - redirecionando para /')
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Se chegou aqui sem cookie, bloquear (cookie já foi verificado acima)
    console.log('🚫 [Success] Acesso sem cookie do cloaker - redirecionando para /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Proteger rota /checkout - APENAS acessível com cookie (vem do /promo)
  if (pathname.startsWith('/checkout')) {
    // Se chegou aqui sem cookie, bloquear (cookie já foi verificado acima)
    console.log('🚫 [Cloaker] Acesso a /checkout sem cookie do cloaker - redirecionando para /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Não aplicar cloaker nas rotas internas e arquivos estáticos (deixar passar)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images') ||
    // pathname.startsWith('/success') || // REMOVIDO - /success tem verificação própria acima
    // pathname.startsWith('/checkout') || // REMOVIDO - /checkout tem verificação própria acima
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

  // ===== APENAS ROTA / (raiz) chega aqui =====
  // Cookie já foi verificado no início - se chegou aqui, não tem cookie

  // 🛡️ FILTRO DE REFERER: Verificar se vem do Google (APENAS para rota /)
  const referer = request.headers.get('referer') || ''
  const isFromGoogle = referer === 'https://www.google.com/'
  
  // Se NÃO vem do Google = BOT! (cookie já foi verificado acima)
  if (!isFromGoogle) {
    console.log('🚫 [Cloaker] BOT detectado - referer inválido:', referer || 'direct')
    console.log('   ❌ Não é do Google - mostrando white page')
    return NextResponse.next() // Mostrar white page sem chamar cloaker
  }

  // 🚀 CACHE: Verificar se já verificamos este usuário recentemente
  const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || request.ip || 'unknown'
  const userAgent = request.headers.get('user-agent') || ''
  const cacheKey = `${clientIp}-${userAgent.substring(0, 50)}` // Limitar tamanho
  
  const cached = cloakerCache.get(cacheKey)
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    // Usar resultado do cache
    if (cached.type === 'white') {
      return NextResponse.next() // Mostrar white page
    } else {
      // Redirecionar para /promo
      const redirectUrl = new URL(CLOAKER_CONFIG.offerPagePath, request.url)
      redirectUrl.search = request.nextUrl.search
      const response = NextResponse.redirect(redirectUrl)
      response.cookies.set('cloaker_verified', 'true', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24
      })
      return response
    }
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

    // Salvar no cache
    cloakerCache.set(cacheKey, {
      type: result.type,
      timestamp: Date.now()
    })

    // Limpar cache antigo (mais de 5 minutos)
    for (const [key, value] of cloakerCache.entries()) {
      if (Date.now() - value.timestamp > 5 * 60 * 1000) {
        cloakerCache.delete(key)
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
    
    // 🎯 SALVAR UTMs em cookie para NUNCA perder os parâmetros
    console.log('💾 [Cloaker] Salvando UTMs em cookies...')
    console.log('   Query String:', request.nextUrl.search)
    
    // Lista de parâmetros importantes para salvar
    const utmParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'gclid', 'fbclid', 'msclkid', 'ttclid',
      'gad_source', 'gad_campaignid', 'gbraid', 'wbraid',
      'src', 'sck', 'xcod', 'keyword', 'device', 'network', 'cuponeria'
    ]
    
    // Salvar cada parâmetro em cookie individual
    const searchParams = request.nextUrl.searchParams
    let savedCount = 0
    utmParams.forEach(param => {
      const value = searchParams.get(param)
      if (value) {
        response.cookies.set(`utmify_${param}`, value, {
          httpOnly: false, // Precisa ser acessível via JavaScript
          secure: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30 // 30 dias (padrão UTMify)
        })
        console.log(`   💾 [UTM Cookie] ${param}: ${value.substring(0, 50)}`)
        savedCount++
      }
    })
    
    console.log(`✅ [Cloaker] ${savedCount} cookies UTM salvos`)
    
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
