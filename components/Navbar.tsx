"use client"

import { useState } from 'react'
import { Menu, X, Zap } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    // Se não estiver na página principal, redirecionar primeiro
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`
      return
    }
    
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 cursor-pointer -ml-8">
            <img 
              src="/images/products/LogoDimBuxBAckgroundFREE.png" 
              alt="Dimbux" 
              className="h-[5rem] w-auto"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/loja" className="text-slate-700 hover:text-blue-600 transition-colors font-semibold">
              🛒 Loja
            </a>
            <button onClick={() => scrollToSection('servicos')} className="text-slate-700 hover:text-blue-600 transition-colors">
              Serviços
            </button>
            <button onClick={() => scrollToSection('sobre')} className="text-slate-700 hover:text-blue-600 transition-colors">
              Sobre
            </button>
            <button onClick={() => scrollToSection('blog')} className="text-slate-700 hover:text-blue-600 transition-colors">
              Blog
            </button>
            <button onClick={() => scrollToSection('faq')} className="text-slate-700 hover:text-blue-600 transition-colors">
              FAQ
            </button>
            <button onClick={() => scrollToSection('contato')} className="text-slate-700 hover:text-blue-600 transition-colors">
              Contato
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-slate-700 p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-white">
            <div className="flex flex-col gap-3">
              <a href="/loja" className="text-slate-700 hover:text-blue-600 transition-colors text-left py-2 font-semibold">
                🛒 Loja
              </a>
              <button onClick={() => scrollToSection('servicos')} className="text-slate-700 hover:text-blue-600 transition-colors text-left py-2">
                Serviços
              </button>
              <button onClick={() => scrollToSection('sobre')} className="text-slate-700 hover:text-blue-600 transition-colors text-left py-2">
                Sobre
              </button>
              <button onClick={() => scrollToSection('blog')} className="text-slate-700 hover:text-blue-600 transition-colors text-left py-2">
                Blog
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-slate-700 hover:text-blue-600 transition-colors text-left py-2">
                FAQ
              </button>
              <button onClick={() => scrollToSection('contato')} className="text-slate-700 hover:text-blue-600 transition-colors text-left py-2">
                Contato
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
