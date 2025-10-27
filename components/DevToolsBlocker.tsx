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
    
    console.log('[DevTools] 🔒 Proteção ativada - F12, Clique Direito e Console')

    // 1. BLOQUEAR F12
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault()
        console.clear()
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

    // 3. LIMPAR CONSOLE (a cada 2 segundos)
    const clearConsole = () => {
      console.clear()
    }

    // Adicionar event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)
    
    // Limpar console a cada 2 segundos
    const consoleInterval = setInterval(clearConsole, 2000)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      clearInterval(consoleInterval)
    }
  }, [])

  return null // Componente invisível
}
