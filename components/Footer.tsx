"use client"

import { useState } from 'react'
import { Shield, CreditCard, Phone, Mail, X } from 'lucide-react'

export default function Footer() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  return (
    <>
    <footer 
      className="relative text-white py-12 border-t border-white/10 overflow-hidden"
      style={{
        backgroundImage: 'url(/images/products/backgroundFOOTER.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-slate-900/80"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Aviso de Segurança */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-blue-400 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-bold mb-2">Segurança e Autenticidade</h4>
                <p className="text-slate-300 text-sm">
                  Preços e condições exclusivos para este site oficial. Evite comprar em outras lojas, pois você pode ser enganado por golpistas.
                </p>
              </div>
            </div>
          </div>

          {/* Formas de Pagamento */}
          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Formas de Pagamento
            </h4>
            <div className="bg-white rounded-lg p-4 inline-block">
              <img 
                src="/images/products/paymentMethods.png" 
                alt="Formas de Pagamento" 
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Selos de Confiança */}
          <div className="mb-8">
            <h4 className="text-lg font-bold mb-4">Segurança e Confiança</h4>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="bg-white rounded-lg p-3">
                <img 
                  src="/images/products/norton.webp" 
                  alt="Norton Secured" 
                  className="h-12 w-auto"
                />
              </div>
              <div className="bg-white rounded-lg p-3">
                <img 
                  src="/images/products/google Site Seguro.webp" 
                  alt="Google Site Seguro" 
                  className="h-12 w-auto"
                />
              </div>
              <div className="bg-white rounded-lg p-3">
                <img 
                  src="/images/products/reclameAqui.avif" 
                  alt="Reclame Aqui" 
                  className="h-12 w-auto"
                />
              </div>
            </div>
          </div>

          {/* Links de Políticas */}
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-slate-300 hover:text-white underline"
            >
              Política de Privacidade
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              className="text-slate-300 hover:text-white underline"
            >
              Termos de Uso
            </button>
          </div>

          {/* Copyright */}
          <div className="text-center text-slate-400 text-sm">
            <p className="font-bold text-white mb-1">Dimbux - Mais Dimas, mais Robux, mais diversão!</p>
            <p>© 2021-2025 Dimbux - Todos os direitos reservados</p>
          </div>
        </div>
      </div>
    </footer>

    {/* Modal Política de Privacidade */}
    {showPrivacyModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div 
          className="relative bg-slate-900 text-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
          style={{
            backgroundImage: 'url(/images/products/backgroundFOOTER.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-slate-900/90 rounded-2xl"></div>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-t-2xl relative z-10 sticky top-0 border-b border-cyan-400/30">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">Política de Privacidade</h2>
          </div>
          <div className="p-6 space-y-4 text-slate-200 relative z-10">
            <div className="bg-slate-800 p-4 rounded-lg border border-cyan-400/30">
              <p className="text-sm text-slate-300">
                <strong className="text-white">Última atualização:</strong> 29 de outubro de 2025<br />
                <strong className="text-white">Empresa:</strong> AMANDA IZABEL DUTRA DA SILVA<br />
                <strong className="text-white">CNPJ:</strong> 60.730.759/0001-51<br />
                <strong className="text-white">Endereço:</strong> Avenida Santo Amaro, 765 - Vila Nova Conceição<br />
                São Paulo/SP - CEP: 04505-001
              </p>
            </div>
            
            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">1. Introdução</h3>
              <p className="mb-2">
                AMANDA IZABEL DUTRA DA SILVA está comprometida em proteger a privacidade e os dados pessoais de seus usuários conforme a LGPD.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">2. Dados Coletados</h3>
              <p className="mb-2">Coletamos: nome, email, CPF, telefone, ID do jogo e dados de pagamento.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">3. Uso dos Dados</h3>
              <p className="mb-2">Utilizamos seus dados para processar pedidos, enviar produtos digitais e suporte ao cliente.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">4. Seus Direitos</h3>
              <p className="mb-2">Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">5. Contato</h3>
              <p className="mb-2">
                📧 E-mail: contato_loja@comprardiamantesff.shop<br />
                📞 Telefone: (11) 94562-2020
              </p>
            </section>
          </div>
        </div>
      </div>
    )}

    {/* Modal Termos de Uso */}
    {showTermsModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div 
          className="relative bg-slate-900 text-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
          style={{
            backgroundImage: 'url(/images/products/backgroundFOOTER.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Overlay escuro */}
          <div className="absolute inset-0 bg-slate-900/90 rounded-2xl"></div>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-t-2xl relative z-10 sticky top-0 border-b border-cyan-400/30">
            <button
              onClick={() => setShowTermsModal(false)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold">Termos de Uso</h2>
          </div>
          <div className="p-6 space-y-4 text-slate-200 relative z-10">
            <div className="bg-slate-800 p-4 rounded-lg border border-cyan-400/30">
              <p className="text-sm text-slate-300">
                <strong className="text-white">Última atualização:</strong> 29 de outubro de 2025<br />
                <strong className="text-white">Empresa:</strong> AMANDA IZABEL DUTRA DA SILVA<br />
                <strong className="text-white">CNPJ:</strong> 60.730.759/0001-51<br />
                <strong className="text-white">Endereço:</strong> Avenida Santo Amaro, 765 - Vila Nova Conceição<br />
                São Paulo/SP - CEP: 04505-001
              </p>
            </div>
            
            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">1. Aceitação dos Termos</h3>
              <p className="mb-2">
                Ao utilizar este site, você concorda com estes Termos de Uso.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">2. Produtos e Serviços</h3>
              <p className="mb-2">
                Vendemos produtos digitais (diamantes Free Fire e Robux) com entrega via código de resgate.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">3. Pagamento</h3>
              <p className="mb-2">
                Aceitamos pagamento via PIX. Após confirmação, o código é enviado por email.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">4. Garantia</h3>
              <p className="mb-2">
                Garantimos a entrega do produto ou reembolso integral em até 7 dias.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-3 text-cyan-400">5. Contato</h3>
              <p className="mb-2">
                📧 E-mail: contato_loja@comprardiamantesff.shop<br />
                📞 Telefone: (11) 94562-2020
              </p>
            </section>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
