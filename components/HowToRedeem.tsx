"use client"

import { CheckCircle, Gift, Globe, CreditCard } from 'lucide-react'

export default function HowToRedeem() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Como Funciona?
            </h2>
            <p className="text-xl text-slate-300">
              Processo simples e rápido para receber seus diamantes
            </p>
          </div>

          {/* Como Comprar */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">📌 Como Comprar Diamantes?</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-blue-400">1</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">FINALIZE SUA COMPRA</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Adicione a quantidade desejada de Diamantes de Free Fire ao carrinho e conclua a compra em nossa loja.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-green-400">2</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">RECEBA SEU CÓDIGO</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Assim que o pagamento for confirmado, você receberá imediatamente o código de resgate único diretamente no seu e-mail 📧 e também na tela de pagamento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Imagem Ilustrativa */}
          <div className="mb-16">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <img 
                src="https://i.postimg.cc/XYmfnQvn/dima.webp" 
                alt="Exemplo de código de resgate" 
                className="w-full rounded-lg"
                loading="lazy"
              />
            </div>
          </div>

          {/* Como Resgatar */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white">💎 Como Resgatar?</h3>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">🔹 ACESSE O SITE OFICIAL DO FREE FIRE</h4>
                    <a 
                      href="https://recargajogo.com.br/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-semibold text-lg underline"
                    >
                      🌐 https://recargajogo.com.br/
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">🔹 RESGATE SEU CÓDIGO</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Na loja, selecione a opção <span className="text-white font-semibold">"Cartão pré-pago Garena"</span> e insira o código recebido.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-md rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">🔹 APROVEITE SEUS DIAMANTES 💎</h4>
                    <p className="text-slate-300 leading-relaxed">
                      Agora é só usá-los para adquirir os itens e benefícios que desejar!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vídeo Demonstração */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-400 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="text-3xl font-bold text-white">Demonstração</h3>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                <iframe 
                  src="https://streamable.com/e/c2de61?" 
                  frameBorder="0" 
                  width="100%" 
                  height="100%" 
                  allowFullScreen
                  className="rounded-xl"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Nota Importante */}
          <div className="mt-12 bg-yellow-500/10 backdrop-blur-md rounded-2xl p-6 border border-yellow-500/30">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div>
                <h4 className="text-xl font-bold text-yellow-400 mb-2">Importante</h4>
                <p className="text-slate-300 leading-relaxed">
                  Certifique-se de inserir o código corretamente no site oficial. Em caso de dúvidas, entre em contato com nosso suporte 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
