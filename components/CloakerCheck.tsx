'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function CloakerCheck() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Verificar se o cloaker está habilitado
    const cloakerEnabled = process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED === 'true'
    
    if (!cloakerEnabled) {
      console.log('[Cloaker] Desabilitado')
      setIsChecking(false)
      return
    }

    // Não aplicar em rotas específicas
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/cupons') ||
      pathname.startsWith('/success') ||
      pathname.startsWith('/checkout')
    ) {
      setIsChecking(false)
      return
    }

    // Função para verificar com o cloaker
    const checkCloaker = async () => {
      try {
        // Coletar dados do cliente
        const clientData = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          referrer: document.referrer,
          pathname: pathname,
          search: window.location.search,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          platform: navigator.platform,
          ip: '' // Será detectado no servidor
        }

        console.log('🔍 [Cloaker Client] Verificando...', {
          pathname,
          search: window.location.search
        })

        // Fazer requisição para a API
        const response = await fetch('/api/cloaker-check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(clientData)
        })

        const result = await response.json()

        console.log('📥 [Cloaker Client] Resultado:', result)

        if (result.shouldRedirect) {
          console.log('🤖 [Cloaker Client] Bot detectado - carregando white page')
          
          // Carregar conteúdo da white page sem mudar URL
          const whitePageResponse = await fetch(result.url)
          const whitePageHtml = await whitePageResponse.text()
          
          // Substituir o conteúdo da página mantendo a URL original
          document.open()
          document.write(whitePageHtml)
          document.close()
        } else {
          console.log('👤 [Cloaker Client] Usuário real - continuando')
          setIsChecking(false)
        }
      } catch (error) {
        console.error('❌ [Cloaker Client] Erro:', error)
        // Em caso de erro, deixar continuar
        setIsChecking(false)
      }
    }

    checkCloaker()
  }, [pathname, searchParams, router])

  // Mostrar loading enquanto verifica
  if (isChecking) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent mb-4"></div>
          <p className="text-gray-800">Verificando...</p>
        </div>
      </div>
    )
  }

  return null
}
