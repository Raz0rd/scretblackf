import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuração do cloaker (mesma do PHP)
const CLOAKER_CONFIG = {
  url: 'https://www.altercpa.one/fltr/969-8f076e082dbcb1d080037ec2c216d589-15047',
  whitePageUrl: '/cupons' // Página "limpa" para bots
}

/**
 * Middleware do Cloaker
 * Replica o comportamento do index.php fornecido pelo AlterCPA
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  console.log('\n🔍 [Cloaker Middleware] ==================')
  console.log('📍 Pathname:', pathname)
  console.log('🌐 URL completa:', request.url)
  
  // Verificar se o cloaker está habilitado
  const cloakerEnabled = process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED === 'true'
  console.log('⚙️  Cloaker habilitado:', cloakerEnabled)
  
  if (!cloakerEnabled) {
    console.log('❌ Cloaker desabilitado - passando requisição normalmente')
    return NextResponse.next()
  }

  // Não aplicar cloaker nas rotas internas
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/cupons') ||
    pathname.includes('.')
  ) {
    console.log('⏭️  Rota ignorada pelo cloaker:', pathname)
    return NextResponse.next()
  }
  
  console.log('🎯 Aplicando cloaker na rota:', pathname)

  try {
    // Preparar dados do servidor (similar ao $_SERVER do PHP)
    const serverData = {
      HTTP_HOST: request.headers.get('host') || '',
      HTTP_USER_AGENT: request.headers.get('user-agent') || '',
      HTTP_ACCEPT: request.headers.get('accept') || '',
      HTTP_ACCEPT_LANGUAGE: request.headers.get('accept-language') || '',
      HTTP_ACCEPT_ENCODING: request.headers.get('accept-encoding') || '',
      HTTP_REFERER: request.headers.get('referer') || '',
      REMOTE_ADDR: request.ip || request.headers.get('x-forwarded-for') || '',
      REQUEST_URI: request.nextUrl.pathname + request.nextUrl.search,
      REQUEST_METHOD: request.method,
      SERVER_PROTOCOL: 'HTTP/1.1',
      QUERY_STRING: request.nextUrl.search.substring(1)
    }

    console.log('📤 Enviando dados para cloaker:')
    console.log('   User-Agent:', serverData.HTTP_USER_AGENT)
    console.log('   IP:', serverData.REMOTE_ADDR)
    console.log('   Query String:', serverData.QUERY_STRING)

    // Fazer requisição para o cloaker (similar ao curl do PHP)
    const formBody = new URLSearchParams(serverData as any).toString()
    
    console.log('🌐 Fazendo requisição para:', CLOAKER_CONFIG.url)
    
    const response = await fetch(CLOAKER_CONFIG.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:135.0) Gecko/20100101 Firefox/135.0'
      },
      body: formBody
    })

    console.log('📥 Resposta do cloaker - Status:', response.status)

    let result: { type: string; url: string }

    if (response.ok) {
      const responseText = await response.text()
      console.log('📄 Resposta RAW do cloaker:', responseText)
      
      try {
        result = JSON.parse(responseText)
        console.log('✅ Resposta do cloaker (JSON):')
        console.log('   Type:', result.type)
        console.log('   URL:', result.url)
      } catch (parseError) {
        console.error('❌ Erro ao parsear JSON:', parseError)
        console.log('⚠️  Usando fallback (white page)')
        result = {
          type: 'white',
          url: CLOAKER_CONFIG.whitePageUrl
        }
      }
    } else {
      console.log('⚠️  Cloaker falhou - usando fallback (white page)')
      // Fallback: se o cloaker falhar, mostrar white page
      result = {
        type: 'white',
        url: CLOAKER_CONFIG.whitePageUrl
      }
    }

    // Se for "white" (bot/crawler), fazer rewrite para /cupons
    if (result.type === 'white') {
      console.log('🤖 Detectado como BOT - redirecionando para:', CLOAKER_CONFIG.whitePageUrl)
      const url = request.nextUrl.clone()
      url.pathname = CLOAKER_CONFIG.whitePageUrl
      
      // Manter os parâmetros da URL original
      return NextResponse.rewrite(url)
    }

    // Se for "black" (usuário real), deixar passar normalmente
    console.log('👤 Detectado como USUÁRIO REAL - mostrando página principal')
    return NextResponse.next()

  } catch (error) {
    console.error('❌ [Cloaker Middleware] ERRO:', error)
    console.log('🛡️  Usando fallback de segurança - mostrando white page')
    
    // Em caso de erro, mostrar white page por segurança
    const url = request.nextUrl.clone()
    url.pathname = CLOAKER_CONFIG.whitePageUrl
    return NextResponse.rewrite(url)
  }
  
  console.log('==========================================\n')
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|cupons).*)',
  ],
}
