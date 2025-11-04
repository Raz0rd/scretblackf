"use client"

import { useEffect } from 'react'

export function DevToolsBlocker() {
  useEffect(() => {
    // PROTEÇÃO DESATIVADA PERMANENTEMENTE
    console.log('[DevTools] ✅ Proteção desativada - DevTools liberado')
  }, [])

  return null
}
