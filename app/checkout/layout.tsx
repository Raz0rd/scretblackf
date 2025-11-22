"use client"

import type React from "react"
import { useEffect } from "react"
import "./globals.css"

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Forçar light mode removendo classe dark
  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('dark')
    html.classList.add('light')
    html.style.colorScheme = 'light'
  }, [])

  return (
    <div data-route="checkout">
      {children}
    </div>
  )
}
