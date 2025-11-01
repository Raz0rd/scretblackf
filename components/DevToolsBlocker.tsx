"use client"

import { useEffect } from 'react'

export function DevToolsBlocker() {
  useEffect(() => {
    // Verificar se está em produção E se não é localhost
    const isProduction = process.env.NODE_ENV === 'production'
    const isLocalhost = typeof window !== 'undefined' && 
                        (window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1')
    
    // Em desenvolvimento OU localhost, não bloquear (para facilitar debug)
    if (!isProduction || isLocalhost) {
      console.log('[DevTools] Proteção desativada em desenvolvimento/localhost')
      return
    }
    
    console.log('[DevTools] 🔒 Proteção ativada - F12, Clique Direito e Console')

    // Função para expulsar para 404
    const expelUser = () => {
      console.clear()
      window.location.href = '/404'
    }

    // 1. BLOQUEAR F12 e expulsar
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault()
        expelUser()
        return false
      }
      
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault()
        expelUser()
        return false
      }
      
      // Ctrl+U (view source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault()
        expelUser()
        return false
      }
    }

    // 2. BLOQUEAR CLIQUE DIREITO (mas permitir em inputs)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Permitir em inputs e textareas (para copiar/colar)
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return true
      }
      
      e.preventDefault()
      return false
    }

    // 3. DETECTAR DEVTOOLS ABERTO (diferença de tamanho da janela)
    // APENAS EM DESKTOP - não afetar mobile
    const detectDevTools = () => {
      // Detectar se é mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      // Não verificar em mobile (evita falso positivo com teclado virtual)
      if (isMobile) {
        return
      }
      
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      if (widthThreshold || heightThreshold) {
        expelUser()
      }
    }

    // 4. LIMPAR CONSOLE (a cada 2 segundos)
    const clearConsole = () => {
      console.clear()
    }

    // Adicionar event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)
    
    // Verificar DevTools a cada 1 segundo
    const devToolsInterval = setInterval(detectDevTools, 1000)
    
    // Limpar console a cada 2 segundos
    const consoleInterval = setInterval(clearConsole, 2000)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      clearInterval(devToolsInterval)
      clearInterval(consoleInterval)
    }
  }, [])

  return null // Componente invisível
}
