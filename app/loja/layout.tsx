"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import HeadManager from '@/components/HeadManager'
import { CartProvider, useCart } from '@/contexts/CartContext'
import CartButton from '@/components/loja/CartButton'

function LojaContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const cart = useCart()
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')

  // Determinar categoria baseado nos params ou rota
  const getCategory = () => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) return categoryParam as 'freefire' | 'robux' | 'vbucks'
    if (pathname?.includes('/freefire')) return 'freefire'
    if (pathname?.includes('/robux')) return 'robux'
    if (pathname?.includes('/brainroots')) return 'vbucks'
    return 'freefire'
  }

  // Função para abrir carrinho - vai direto para checkout
  const handleOpenCart = () => {
    const category = getCategory()
    router.push(`/loja/checkout?category=${category}`)
  }

  // Esconder carrinho na página de checkout
  const isCheckoutPage = pathname?.includes('/checkout')

  return (
    <>
      {children}
      
      {/* Sistema de Carrinho - Esconder no checkout */}
      {!isCheckoutPage && (
        <CartButton
          itemCount={cart.itemCount}
          totalPrice={cart.totalPrice}
          onClick={handleOpenCart}
          category={getCategory()}
        />
      )}
    </>
  )
}

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Forçar light mode
  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('dark')
    html.removeAttribute('data-theme')
    html.style.colorScheme = 'light'
  }, [])

  return (
    <CartProvider>
      <HeadManager />
      <LojaContent>{children}</LojaContent>
    </CartProvider>
  )
}
