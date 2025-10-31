import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuração do cloaker
const CLOAKER_CONFIG = {
  url: 'https://www.altercpa.one/fltr/969-8f076e082dbcb1d080037ec2c216d589-15444',
  whitePagePath: '/',  // Página principal agora é white page
  offerPagePath: '/quest'  // Página de oferta
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Analytics desabilitado para desenvolvimento
  // Registrar acesso no analytics (não-bloqueante)
  // if (!pathname.startsWith('/_next') && !pathname.startsWith('/api/s7k2m9p4') && pathname !== '/x9f2w8k5') {
  //   try {
  //     const userAgent = request.headers.get('user-agent') || ''
  //     const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
  //     const referer = request.headers.get('referer') || ''
  //     const query = request.nextUrl.search
  //     
  //     // Fazer requisição assíncrona sem aguardar
  //     fetch(`${request.nextUrl.origin}/api/s7k2m9p4`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         path: pathname,
  //         userAgent,
  //         ip,
  //         referer,
  //         query,
  //         timestamp: Date.now()
  //       })
  //     }).catch(() => {}) // Ignorar erros silenciosamente
  //   } catch (error) {
  //     // Ignorar erros de analytics
  //   }
  // }
  
  // ============================================
  // 🔒 SISTEMA DE REFERER WHITELIST (Cloaker Interno)
  // ============================================
  
  // Verificar se está rodando em ambiente de desenvolvimento local
  const host = request.headers.get('host') || ''
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
  
  // Em produção, NUNCA liberar localhost (previne bypass com curl)
  if (isLocalhost && process.env.NODE_ENV === 'development') {
    console.log('🔓 [Referer] LOCALHOST LIBERADO (DEV MODE)')
    return NextResponse.next()
  }

  // Verificar referer apenas na rota principal
  if (pathname === '/') {
    const referer = request.headers.get('referer') || ''
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || ''
    
    // Log do referer recebido (para debug)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔍 [REFERER CHECK] Nova tentativa de acesso')
    console.log('🔗 Referer recebido:', referer || '(vazio)')
    console.log('🌐 IP:', ip)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    // Lista de referers permitidos (hardcoded para Edge Runtime)
    // IMPORTANTE: Manter sincronizado com allowed-referers.json
    const allowedReferers: string[] = [
      'recarga-jogoff.shop'
    ]
    
    // Se não tem referer, BLOQUEAR
    if (!referer) {
      const whitepageUrl = process.env.NEXT_PUBLIC_WHITEPAGE_URL || process.env.NEXT_PUBLIC_UTMIFY_WHITEPAGE_URL
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🚫 [REFERER CHECK] ACESSO BLOQUEADO')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📍 Motivo: SEM REFERER')
      console.log('🌐 IP:', ip)
      console.log('🖥️  User-Agent:', userAgent.slice(0, 80))
      console.log('🔗 URL:', pathname + request.nextUrl.search)
      console.log('⚠️  Ação: Retornando 404 Not Found')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      
      return new NextResponse(null, { status: 404 })
    }
    
    // Verificar se referer está na whitelist
    const refererLower = referer.toLowerCase()
    const isAllowed = allowedReferers.some(allowed => 
      refererLower.includes(allowed.toLowerCase())
    )
    
    if (!isAllowed) {
      const whitepageUrl = process.env.NEXT_PUBLIC_WHITEPAGE_URL || process.env.NEXT_PUBLIC_UTMIFY_WHITEPAGE_URL
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🚫 [REFERER CHECK] ACESSO BLOQUEADO')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📍 Motivo: REFERER NÃO AUTORIZADO')
      console.log('🔗 Referer:', referer)
      console.log('🌐 IP:', ip)
      console.log('🖥️  User-Agent:', userAgent.slice(0, 80))
      console.log('🔗 URL:', pathname + request.nextUrl.search)
      console.log('⚠️  Ação: Retornando 404 Not Found')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      
      return new NextResponse(null, { status: 404 })
    }
    
    // Referer AUTORIZADO - Verificar UTMs obrigatórios do Google
    const searchParams = request.nextUrl.searchParams
    
    // UTMs obrigatórios do Google Ads
    const requiredUtms = {
      utm_source: searchParams.get('utm_source'),
      utm_campaign: searchParams.get('utm_campaign'),
      utm_medium: searchParams.get('utm_medium'),
      utm_content: searchParams.get('utm_content'),
      utm_term: searchParams.get('utm_term'),
      keyword: searchParams.get('keyword'),
      device: searchParams.get('device'),
      network: searchParams.get('network'),
      gad_source: searchParams.get('gad_source'),
      gad_campaignid: searchParams.get('gad_campaignid'),
      gbraid: searchParams.get('gbraid')
    }
    
    // Verificar se tem utm_source=google
    const hasGoogleSource = requiredUtms.utm_source === 'google'
    
    // Verificar se tem TODOS os parâmetros obrigatórios
    const missingUtms = Object.entries(requiredUtms)
      .filter(([key, value]) => !value)
      .map(([key]) => key)
    
    if (!hasGoogleSource || missingUtms.length > 0) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🚫 [UTM CHECK] PARÂMETROS INCOMPLETOS')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📍 Motivo: UTMs do Google Ads incompletos')
      console.log('🔗 Referer:', referer)
      console.log('🌐 IP:', ip)
      console.log('❌ UTMs faltando:', missingUtms.join(', '))
      console.log('⚠️  Ação: Redirecionando de volta para o referer')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      
      // Redirecionar de volta para o referer
      return NextResponse.redirect(referer)
    }
    
    // Referer AUTORIZADO + UTMs COMPLETOS
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ [REFERER + UTM CHECK] ACESSO AUTORIZADO')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📍 Status: REFERER VÁLIDO + UTMs COMPLETOS')
    console.log('🔗 Referer:', referer)
    console.log('🌐 IP:', ip)
    console.log('🖥️  User-Agent:', userAgent.slice(0, 80))
    console.log('🔗 URL:', pathname + request.nextUrl.search)
    console.log('✅ UTMs Google Ads: TODOS presentes')
    console.log('✅ Ação: Salvando referer em cookie + Liberando acesso')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    const response = NextResponse.next()
    
    // Salvar referer em cookie (para usar na página de sucesso)
    response.cookies.set('source_referer', referer, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 horas
    })
    
    // Marcar como verificado
    response.cookies.set('referer_verified', 'true', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 horas
    })
    
    return response
  }

  // Lista de rotas válidas (além de /, /quest e rotas internas)
  const validRoutes = [
    '/',
    '/quest',
    '/cupons',
    '/checkout',
    '/success',
    '/analytics',
    '/api',
    '/_next',
    '/images',
    '/fonts',
    '/manifest',
    '/icon-',
    '/sw.js'
  ]

  // Verificar se é uma rota válida ou arquivo estático
  const isValidRoute = validRoutes.some(route => pathname.startsWith(route)) ||
                       pathname.includes('.') // Arquivos estáticos (.js, .css, .png, etc)

  // Se não é rota válida, redirecionar para /
  if (!isValidRoute) {
    console.log(`🚫 [Cloaker] Rota inválida "${pathname}" - redirecionando para /`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Rota / agora é LIVRE (sem proteção de cloaker)
  // A verificação de usuário será feita no client-side pelo LoginModal
  if (pathname === '/') {
    console.log('✅ [Cloaker] Rota / liberada - verificação será client-side')
    return NextResponse.next()
  }

  // Proteger rota /quest - só acessível com cookie do cloaker OU com parâmetros de tracking
  if (pathname.startsWith('/quest')) {
    const hasValidCookie = request.cookies.get('cloaker_verified')?.value === 'true'
    const hasTrackingParams = request.nextUrl.search.includes('gclid') || 
                              request.nextUrl.search.includes('fbclid') ||
                              request.nextUrl.search.includes('utm_')
    
    // Se não tem cookie E não tem parâmetros de tracking, bloquear
    if (!hasValidCookie && !hasTrackingParams) {
      console.log('🚫 [Cloaker] Acesso a /quest sem cookie ou tracking - redirecionando para /')
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Se tem cookie OU parâmetros de tracking, deixar passar e setar cookie
    const response = NextResponse.next()
    if (!hasValidCookie && hasTrackingParams) {
      // Setar cookie para próximas requisições
      response.cookies.set('cloaker_verified', 'true', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 horas
      })
      console.log('✅ [Cloaker] Cookie setado para /quest com tracking params')
    }
    
    return response
  }

  // Proteger rota /success - mas permitir Google Ads Bot
  if (pathname.startsWith('/success')) {
    const userAgent = request.headers.get('user-agent') || ''
    const url = request.nextUrl
    const hasTransactionId = url.searchParams.has('transactionId')
    const hasAmount = url.searchParams.has('amount')
    
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
    
    // Se tem parâmetros válidos (usuário real vindo do checkout), deixar passar
    return NextResponse.next()
  }

  // Não aplicar cloaker nas rotas internas e arquivos estáticos (deixar passar)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/success') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/x9f2w8k5') ||
    pathname.startsWith('/analytics') ||
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

  // Deixar passar para outras rotas
  return NextResponse.next()
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
