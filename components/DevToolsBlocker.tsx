"use client"

import { useEffect } from 'react'

export function DevToolsBlocker() {
  useEffect(() => {
    // Verificar se está em produção
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Em desenvolvimento, não bloquear (para facilitar debug)
    if (!isProduction) {
      console.log('[DevTools] Proteção desativada em desenvolvimento')
      return
    }
    
    // Função para mostrar mensagem de aviso
    const showWarning = () => {
      console.clear()
      console.log('%c⚠️ ATENÇÃO - ACESSO NÃO AUTORIZADO ⚠️', 'color: #ff0000; font-size: 40px; font-weight: bold; text-shadow: 3px 3px 0 #000;')
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ff0000; font-weight: bold;')
      console.log('%c🚨 SISTEMA DE SEGURANÇA ATIVO', 'color: #ff6600; font-size: 24px; font-weight: bold;')
      console.log('%c', '')
      console.log('%c⚡ Seu acesso está sendo monitorado', 'color: #ffff00; font-size: 18px; font-weight: bold;')
      console.log('%c⚡ Tentativas de invasão serão reportadas', 'color: #ffff00; font-size: 18px; font-weight: bold;')
      console.log('%c⚡ Seu IP e dados foram registrados', 'color: #ffff00; font-size: 18px; font-weight: bold;')
      console.log('%c', '')
      console.log('%c🔒 Este console é protegido por sistemas anti-fraude', 'color: #00ff00; font-size: 16px;')
      console.log('%c🔒 Qualquer tentativa de manipulação será bloqueada', 'color: #00ff00; font-size: 16px;')
      console.log('%c', '')
      console.log('%c⛔ FECHE O DEVTOOLS IMEDIATAMENTE', 'color: #ff0000; font-size: 28px; font-weight: bold; text-shadow: 2px 2px 0 #000;')
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #ff0000; font-weight: bold;')
    }
    
    // Mostrar aviso inicial
    showWarning()

    // 1. BLOQUEAR F12
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault()
        showWarning()
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

    // 3. MOSTRAR AVISO (a cada 3 segundos)
    const showWarningPeriodic = () => {
      showWarning()
    }

    // Adicionar event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)
    
    // Mostrar aviso a cada 3 segundos
    const consoleInterval = setInterval(showWarningPeriodic, 3000)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      clearInterval(consoleInterval)
    }
  }, [])

  return null // Componente invisível
}
