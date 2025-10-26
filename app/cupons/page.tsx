"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CuponsPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirecionar para home (white page)
    router.replace('/')
  }, [router])
  
  return null
}
