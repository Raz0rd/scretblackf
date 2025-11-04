import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isBlockedBotIP } from '@/lib/bot-ips'

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

  // ============================================
  // 🔓 VERIFICAÇÃO DE COOKIES (Subdomain ↔ Domain Base)
  // ============================================
  
  // Verificar se usuário já passou pela verificação inicial
  const alreadyVerified = request.cookies.get('referer_verified')?.value === 'true'
  const hasQuizCompleted = request.cookies.get('quiz_completed')?.value === 'true'
  
  // Verificar se está no subdomain
  const subdomain = process.env.NEXT_PUBLIC_USER_SUBDOMAIN || 'recarga'
  const isSubdomain = host.startsWith(subdomain + '.')
  
  // Se está no SUBDOMAIN, EXIGIR verificação
  if (isSubdomain) {
    if (!alreadyVerified && !hasQuizCompleted) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🚫 [SUBDOMAIN] ACESSO BLOQUEADO - NÃO VERIFICADO')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('📍 Host:', host)
      console.log('🔒 Motivo: Tentativa de acessar subdomain sem verificação')
      console.log('⚠️  Ação: Redirecionando para domain base')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
      
      // Redirecionar para domain base
      const parts = host.split('.')
      // Se tem 3 ou mais partes (recarga.gmeports.com.br), pegar as últimas 3
      // Se tem 2 partes (gmeports.com.br), manter as 2
      const baseDomainHost = parts.length >= 3 ? parts.slice(-3).join('.') : parts.join('.')
      const redirectUrl = new URL(request.url)
      redirectUrl.hostname = baseDomainHost
      
      return NextResponse.redirect(redirectUrl)
    }
    
    // Se verificado, liberar acesso no subdomain
    console.log('✅ [SUBDOMAIN] Usuário verificado - liberando acesso')
    console.log('   - Cookie referer_verified:', alreadyVerified)
    console.log('   - Cookie quiz_completed:', hasQuizCompleted)
    console.log('   - Rota:', pathname)
    return NextResponse.next()
  }
  
  // Se está no DOMAIN BASE e já verificado, liberar
  if (alreadyVerified || hasQuizCompleted) {
    console.log('✅ [DOMAIN BASE] Usuário verificado - liberando acesso')
    console.log('   - Cookie referer_verified:', alreadyVerified)
    console.log('   - Cookie quiz_completed:', hasQuizCompleted)
    console.log('   - Rota:', pathname)
    return NextResponse.next()
  }
  
  // ============================================
  // 🔓 PROTEÇÕES DESABILITADAS - ACESSO LIVRE
  // ============================================
  
  // Liberar acesso total sem verificação de referer
  console.log('✅ [MIDDLEWARE] Acesso livre - proteções desabilitadas')
  console.log('   - Rota:', pathname)
  
  // Pular TODAS as verificações de referer/UTMs
  // Apenas liberar acesso
  return NextResponse.next()
}



// Configurar em quais rotas o middleware deve rodar
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
