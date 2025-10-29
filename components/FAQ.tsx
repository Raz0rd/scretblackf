"use client"

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    id: 1,
    question: "Como funciona a compra de diamantes?",
    answer: "O processo é simples: escolha o pacote desejado, informe seu ID do Free Fire, realize o pagamento e receba seus diamantes automaticamente em até 5 minutos."
  },
  {
    id: 2,
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos PIX (instantâneo), cartão de crédito (parcelado em até 12x), boleto bancário e outras formas de pagamento digital."
  },
  {
    id: 3,
    question: "É seguro comprar diamantes aqui?",
    answer: "Sim! Utilizamos criptografia SSL de ponta e seguimos todas as normas de segurança. Seus dados e pagamentos estão 100% protegidos."
  },
  {
    id: 4,
    question: "Quanto tempo leva para receber os diamantes?",
    answer: "A entrega é automática e leva em média 5 minutos após a confirmação do pagamento. Em casos raros, pode levar até 30 minutos."
  },
  {
    id: 5,
    question: "Preciso fornecer minha senha do Free Fire?",
    answer: "NÃO! Nunca solicitamos sua senha. Você só precisa informar seu ID do Free Fire, que pode ser encontrado nas configurações do jogo."
  },
  {
    id: 6,
    question: "Posso comprar para outra pessoa?",
    answer: "Sim! Basta informar o ID do Free Fire da pessoa que receberá os diamantes no momento da compra."
  },
  {
    id: 7,
    question: "O que fazer se não recebi os diamantes?",
    answer: "Entre em contato com nosso suporte 24/7 através do WhatsApp ou e-mail. Resolveremos seu problema imediatamente."
  },
  {
    id: 8,
    question: "Vocês têm garantia de entrega?",
    answer: "Sim! Garantimos 100% a entrega dos diamantes. Se houver qualquer problema, devolvemos seu dinheiro ou reenviamos os diamantes."
  }
]

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null)

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Tire suas dúvidas sobre como comprar diamantes para Free Fire
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition-all"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </span>
                {openId === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              
              {openId === faq.id && (
                <div className="px-6 pb-5">
                  <p className="text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-300 mb-4">
            Não encontrou sua resposta?
          </p>
          <button 
            onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Entre em Contato
          </button>
        </div>
      </div>
    </section>
  )
}
