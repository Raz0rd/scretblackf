"use client"

import { useState } from 'react'
import { ArrowRight, Shield, CreditCard, CheckCircle, Loader2, AlertCircle } from "lucide-react"

// Adicionar estilos de animação
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes neon-pulse {
      0% {
        opacity: 0.1;
        transform: scale(0.9);
      }
      50% {
        opacity: 0.4;
        transform: scale(1.05);
      }
      100% {
        opacity: 0.1;
        transform: scale(0.9);
      }
    }
    .animate-neon-pulse {
      animation: neon-pulse 3s ease-in-out infinite;
    }
  `
  if (!document.head.querySelector('#neon-animation')) {
    style.id = 'neon-animation'
    document.head.appendChild(style)
  }
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const handleContinue = () => {
    setIsLoading(true)
    
    // Simular verificação de disponibilidade
    setTimeout(() => {
      setIsLoading(false)
      setShowMessage(true)
    }, 2000)
  }

  return (
    <>
      {/* Aviso de Segurança - Topo */}
      <div className="bg-slate-800 border-b border-slate-700 py-2 px-4 fixed top-0 left-0 right-0 z-50">
        <p className="text-center text-xs text-slate-200">
          🛡️ <strong>Plataforma independente de créditos digitais.</strong> Não solicitamos senha, login nem dados sensíveis.
        </p>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 pt-16">
        <div className="max-w-2xl w-full">
        {/* Card Principal */}
        <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 md:p-12 border border-slate-700/50">
          {/* Cabeçalho */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-6 relative">
              {/* Efeito neon pulsante no centro da logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-emerald-500/30 rounded-full blur-2xl animate-neon-pulse pointer-events-none"></div>
              
              <img 
                src="/loogs.png" 
                alt="Logo" 
                className="h-32 w-auto relative z-10"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Créditos Digitais Rápidos
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto">
              Compre itens e créditos digitais para seus jogos mobile com entrega imediata.
            </p>
          </div>

          {/* Benefícios */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-emerald-500/50 transition-colors">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Entrega Digital Rápida</h3>
                <p className="text-sm text-slate-400">Receba seus créditos em minutos</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-emerald-500/50 transition-colors">
              <CreditCard className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Preços Acessíveis</h3>
                <p className="text-sm text-slate-400">Melhores ofertas do mercado</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-emerald-500/50 transition-colors">
              <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Segurança e Confiança</h3>
                <p className="text-sm text-slate-400">Transações 100% seguras</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-emerald-500/50 transition-colors">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-white mb-1">Plataforma Independente</h3>
                <p className="text-sm text-slate-400">Sem solicitar dados sensíveis</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleContinue}
            disabled={isLoading || showMessage}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Verificando disponibilidade...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Mensagem após loading */}
          {showMessage && (
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg animate-fade-in">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-amber-200 font-medium mb-1">
                    Serviço Temporariamente Indisponível
                  </p>
                  <p className="text-xs text-slate-400">
                    Estamos realizando manutenção em nossos sistemas. Por favor, tente novamente em alguns minutos ou entre em contato através dos nossos canais de atendimento.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aviso de Segurança */}
          <div className="mt-6 p-4 bg-slate-700/50 border border-slate-600/50 rounded-lg">
            <p className="text-xs text-slate-300 text-center leading-relaxed">
              <Shield className="w-4 h-4 inline-block mr-1 mb-0.5 text-emerald-400" />
              <strong className="text-white">Importante:</strong> Nunca solicitamos senha, login ou dados de acesso à sua conta.
            </p>
          </div>
        </div>

        {/* Footer com Links Legais */}
        <footer className="mt-8 text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-sm p-6 border border-slate-700/50">
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Este site é independente e não é afiliado, administrado ou patrocinado por qualquer desenvolvedora de jogos.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <a href="/termos" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                Termos de Uso
              </a>
              <span className="text-slate-600">•</span>
              <a href="/privacidade" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                Política de Privacidade
              </a>
              <span className="text-slate-600">•</span>
              <a href="/reembolso" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                Política de Reembolso
              </a>
              <span className="text-slate-600">•</span>
              <a href="/sobre" className="text-emerald-400 hover:text-emerald-300 hover:underline transition-colors">
                Quem Somos
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-4">
              © 2025 - Todos os direitos reservados
            </p>
          </div>
        </footer>
      </div>
    </div>
    </>
  )
}
