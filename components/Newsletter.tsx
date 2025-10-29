"use client"

import { useState, useEffect } from 'react'
import { Mail, Send, X } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Verificar se já mostrou o modal antes
    const hasSeenModal = localStorage.getItem('newsletter_modal_seen')
    
    if (!hasSeenModal) {
      // Mostrar modal após 2 segundos
      const timer = setTimeout(() => {
        setShowModal(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setShowModal(false)
    localStorage.setItem('newsletter_modal_seen', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email && email.includes('@')) {
      setIsSubmitting(true)
      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })

        if (response.ok) {
          // Aguardar 1 segundo para mostrar o loader
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          setIsSubmitting(false)
          setSubscribed(true)
          setEmail('')
          localStorage.setItem('newsletter_modal_seen', 'true')
          
          setTimeout(() => {
            setSubscribed(false)
            setShowModal(false)
          }, 3000)
        } else {
          setIsSubmitting(false)
          alert('Erro ao cadastrar email. Tente novamente.')
        }
      } catch (error) {
        setIsSubmitting(false)
        console.error('Erro:', error)
        alert('Erro ao cadastrar email. Tente novamente.')
      }
    }
  }

  return (
    <>
    {/* Animações CSS */}
    <style jsx>{`
      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      @keyframes check {
        to {
          stroke-dashoffset: 0;
        }
      }
      
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .animate-fade-in {
        animation: fade-in 0.5s ease-out forwards;
      }
    `}</style>

    {/* Modal Newsletter */}
    {showModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-center">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-cyan-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              Ganhe 10% OFF!
            </h2>
            <p className="text-slate-300 text-sm">
              Cadastre-se e receba ofertas exclusivas
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {isSubmitting ? (
              <div className="text-center py-12">
                {/* Loader Animado */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-slate-700 font-medium">
                  Processando...
                </p>
              </div>
            ) : !subscribed ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Seu melhor e-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="w-5 h-5" />
                  Quero meu desconto!
                </button>

                <p className="text-xs text-slate-500 text-center">
                  Ao se cadastrar, você concorda com nossa Política de Privacidade<br />
                  📧 Contato: <a href="mailto:contato_loja@comprardiamantesff.shop" className="text-cyan-600 hover:underline">contato_loja@comprardiamantesff.shop</a>
                </p>
              </form>
            ) : (
              <div className="text-center py-12">
                {/* Animação de Sucesso */}
                <div className="relative w-20 h-20 mx-auto mb-6">
                  {/* Círculo de fundo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 rounded-full animate-pulse"></div>
                  
                  {/* Check animado */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 52 52">
                    <circle 
                      className="animate-[dash_0.6s_ease-in-out]" 
                      cx="26" 
                      cy="26" 
                      r="24" 
                      fill="none" 
                      stroke="white" 
                      strokeWidth="3"
                      strokeDasharray="150"
                      strokeDashoffset="150"
                      style={{
                        animation: 'dash 0.6s ease-in-out forwards',
                        strokeLinecap: 'round'
                      }}
                    />
                    <path 
                      className="animate-[check_0.3s_0.4s_ease-in-out_forwards]"
                      fill="none" 
                      stroke="white" 
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 27l7 7 16-16"
                      strokeDasharray="48"
                      strokeDashoffset="48"
                      style={{
                        animation: 'check 0.3s 0.4s ease-in-out forwards'
                      }}
                    />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2 animate-fade-in">
                  Cadastro realizado!
                </h3>
                <p className="text-slate-600 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  Verifique seu e-mail para aproveitar as ofertas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* Seção Newsletter na página */}
    <section id="newsletter" className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Receba Ofertas Exclusivas
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Inscreva-se na nossa newsletter e receba promoções especiais, dicas sobre Free Fire e novidades em primeira mão!
          </p>

          {subscribed ? (
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Inscrição Confirmada!
              </h3>
              <p className="text-white/90">
                Obrigado por se inscrever. Em breve você receberá nossas novidades!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
                className="flex-1 px-6 py-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-slate-100 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Inscrever
              </button>
            </form>
          )}

          <p className="text-white/70 text-sm mt-6">
            🔒 Seus dados estão seguros. Não compartilhamos com terceiros.
          </p>
        </div>
      </div>
    </section>
    </>
  )
}
