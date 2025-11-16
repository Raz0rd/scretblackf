"use client"

import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Shop from '@/components/Shop'
import Footer from '@/components/Footer'

export default function LojaPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      <Navbar />
      
      {/* Hero da Loja */}
      <section className="relative z-10 pt-24 pb-8">
        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-semibold">Carregando produtos...</p>
              </div>
            </div>
          }>
            <Shop />
          </Suspense>
        </div>
      </section>

      <Footer />
    </div>
  )
}
