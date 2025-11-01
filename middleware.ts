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
    
    // Blacklist de IPs (bots, scrapers, etc)
    // Edge Runtime não suporta fs, então usamos lista hardcoded
    // Para adicionar IPs, edite esta lista e faça commit
    const ipBlacklist = [
      '2001:4860:7:303::eb',
      '2804:391c:0:3c:a33f:2:0:31b6',
      '2001:4860:7:f03::dd', // Google Bot
    ]
    
    if (ipBlacklist.includes(ip)) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🚫 [IP BLACKLIST] ACESSO BLOQUEADO')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🌐 IP:', ip)
      console.log('📍 Motivo: IP na blacklist')
      console.log('⚠️  Ação: Retornando 404 Not Found')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      
      return new NextResponse(null, { status: 404 })
    }
    
    // Se já foi verificado (tem cookie), liberar APENAS se não for acesso com parâmetros
    const alreadyVerified = request.cookies.get('referer_verified')?.value === 'true'
    const hasParams = request.nextUrl.searchParams.toString().length > 0
    
    if (alreadyVerified && !hasParams) {
      // Se já foi verificado E não tem parâmetros na URL, liberar navegação interna
      console.log('✅ [REFERER] Navegação interna liberada (já verificado)')
      return NextResponse.next()
    }
    
    // Se tem parâmetros, SEMPRE validar (mesmo que já verificado)
    // Isso evita que alguém tente acessar com apenas 1 parâmetro (espião)
    
    // Log do referer recebido (para debug)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔍 [REFERER CHECK] Nova tentativa de acesso')
    console.log('🔗 Referer recebido:', referer || '(vazio)')
    console.log('🌐 IP:', ip)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    // Mapeamento de parâmetros de URL para whitepages
    // Google Ads redireciona via google.com, então identificamos pela campanha
    const whitePageMapping: Record<string, string> = {
      'empresadomarcelo': 'cuponeriavirtual.shop',
      'pessoal': 'recargajogom.click',
      'promotion': 'recarga-jogoff.shop',
      'cupons': 'hubdecuponsedescontos.shop'
    }
    
    // Pegar parâmetros da URL
    const urlParams = request.nextUrl.searchParams
    const campanha = urlParams.get('campanha')
    const conta = urlParams.get('conta')
    const cupons = urlParams.get('cupons')
    const recargas = urlParams.get('recargas')
    
    // Identificar whitepage pelo parâmetro
    let whitePageDomain = ''
    if (campanha && whitePageMapping[campanha]) {
      whitePageDomain = whitePageMapping[campanha]
    } else if (conta && whitePageMapping[conta]) {
      whitePageDomain = whitePageMapping[conta]
    } else if (cupons && whitePageMapping[cupons]) {
      whitePageDomain = whitePageMapping[cupons]
    } else if (recargas && whitePageMapping[recargas]) {
      whitePageDomain = whitePageMapping[recargas]
    }
    
    // Referers permitidos (APENAS Google Ads)
    // Whitepages não enviam tráfego direto, apenas via Google Ads
    const allowedReferers: string[] = [
      'google.com',
      'google.com.br'
    ]
    
    // Se não tem referer, verificar se tem UTMs completos do Google Ads
    let validatedByCloaker = false
    if (!referer) {
      // Pegar parâmetros da URL
      const urlParams = request.nextUrl.searchParams
      const gclid = urlParams.get('gclid')
      const gad_source = urlParams.get('gad_source')
      const gad_campaignid = urlParams.get('gad_campaignid')
      
      // Se tem UTMs completos do Google Ads + parâmetro de whitepage, permitir
      // (significa que passou pelo cloaker e é usuário real)
      if (gclid && gad_source && gad_campaignid && whitePageDomain) {
        console.log('✅ [REFERER] Sem referer MAS com UTMs completos do Google Ads - LIBERADO')
        console.log('   - Validado pelo Cloaker')
        console.log('   - GCLID:', gclid)
        console.log('   - Whitepage:', whitePageDomain)
        validatedByCloaker = true
        // Pular todas as outras validações de referer
      } else {
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
    }
    
    // Se foi validado pelo cloaker, pular validações de referer
    if (!validatedByCloaker) {
      // Verificar se referer está na whitelist
      const refererLower = referer.toLowerCase()
      const isFromGoogle = refererLower.includes('google.com')
      const isFromOwnSite = refererLower.includes(request.headers.get('host') || '')
      
      // Permitir referer do próprio site se já foi verificado
      const isAllowed = allowedReferers.some(allowed => 
        refererLower.includes(allowed.toLowerCase())
      ) || (isFromOwnSite && alreadyVerified)
      
      // Se vem do Google, precisa ter parâmetro válido
      if (isFromGoogle && !whitePageDomain) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🚫 [REFERER CHECK] ACESSO BLOQUEADO')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📍 Motivo: GOOGLE SEM PARÂMETRO VÁLIDO')
      console.log('🔗 Referer:', referer)
      console.log('🌐 IP:', ip)
      console.log('🖥️  User-Agent:', userAgent.slice(0, 80))
      console.log('🔗 URL:', pathname + request.nextUrl.search)
      console.log('⚠️  Parâmetros verificados: campanha, conta, cupons')
        console.log('⚠️  Ação: Retornando 404 Not Found')
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
        
        return new NextResponse(null, { status: 404 })
      }
      
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
    }
    
    // Referer AUTORIZADO - Verificar UTMs obrigatórios do Google
    const searchParams = request.nextUrl.searchParams
    
    // Parâmetros mínimos obrigatórios do Google Ads
    // Google envia: gclid, gad_source, gad_campaignid (e às vezes gbraid)
    const gclid = searchParams.get('gclid')
    const gad_source = searchParams.get('gad_source')
    const gad_campaignid = searchParams.get('gad_campaignid')
    
    // Verificar se tem os parâmetros mínimos do Google Ads
    if (!gclid || !gad_source || !gad_campaignid) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🚫 [UTM CHECK] PARÂMETROS GOOGLE ADS INCOMPLETOS')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📍 Motivo: Faltam parâmetros essenciais do Google Ads')
      console.log('🔗 Referer:', referer)
      console.log('🌐 IP:', ip)
      console.log('❌ gclid:', gclid || '(faltando)')
      console.log('❌ gad_source:', gad_source || '(faltando)')
      console.log('❌ gad_campaignid:', gad_campaignid || '(faltando)')
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
    
    // Domínio da whitepage identificado pelo parâmetro (SEMPRE via Google Ads)
    const originDomain = whitePageDomain
    
    console.log('🎯 [ORIGEM] Whitepage identificada:', originDomain)
    console.log('   - Parâmetro usado:', campanha ? `campanha=${campanha}` : conta ? `conta=${conta}` : cupons ? `cupons=${cupons}` : '(nenhum)')
    console.log('   - Referer Google:', referer)
    
    // Salvar referer em cookie (para usar na página de sucesso)
    response.cookies.set('source_referer', referer, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 horas
    })
    
    // Salvar domínio de origem codificado em base64 (segurança)
    if (originDomain) {
      // Codificar em base64 para ofuscar
      const encodedDomain = Buffer.from(originDomain).toString('base64')
      response.cookies.set('_ref_origin', encodedDomain, {
        httpOnly: false, // Precisa ser acessível pelo JavaScript no checkout
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 horas
      })
      console.log('💾 [Cookie] Origem salva (base64):', encodedDomain, '→', originDomain)
    }
    
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
