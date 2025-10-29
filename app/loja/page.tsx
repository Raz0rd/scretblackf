"use client"

import Navbar from '@/components/Navbar'
import Shop from '@/components/Shop'
import Footer from '@/components/Footer'

export default function LojaPage() {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #13141F 0%, #191A23 76.1%, #1E1F2A 100%)' }}>
      {/* Rede Neural Abstrata */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* Pontos de conexão */}
        <div className="absolute top-[10%] left-[15%] w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[25%] left-[35%] w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-[15%] left-[65%] w-3 h-3 bg-blue-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[25%] w-2 h-2 bg-cyan-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
        <div className="absolute top-[35%] left-[75%] w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s', animationDelay: '2s' }}></div>
        <div className="absolute top-[60%] left-[20%] w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '2.5s' }}></div>
        <div className="absolute top-[55%] left-[55%] w-3 h-3 bg-blue-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '3s' }}></div>
        <div className="absolute top-[70%] left-[40%] w-2 h-2 bg-cyan-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.8s' }}></div>
        <div className="absolute top-[80%] left-[70%] w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.2s' }}></div>
        <div className="absolute top-[85%] left-[30%] w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '1.8s' }}></div>
      </div>

      <Navbar />
      
      {/* Hero da Loja - Simples e direto */}
      <section className="relative z-10 pt-24 pb-8">
        <div className="container mx-auto px-4">
          <Shop />
        </div>
      </section>

      <Footer />
    </div>
  )
}
