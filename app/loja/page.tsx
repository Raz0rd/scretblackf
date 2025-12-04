"use client"

import { useEffect } from "react"
import { useRouter } from 'next/navigation'

export default function LojaRedirect() {
  const router = useRouter()
  
  // Redirect para /loja/freefire preservando query params
  useEffect(() => {
    if (typeof window === 'undefined') return
    const searchParams = new URLSearchParams(window.location.search)
    const fullPath = searchParams.toString() ? `/loja/freefire?${searchParams.toString()}` : '/loja/freefire'
    router.replace(fullPath)
  }, [router])
  
  return null
}