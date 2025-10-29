"use client"

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: "João Silva",
    location: "São Paulo, SP",
    rating: 5,
    text: "Melhor site para comprar diamantes FF! Entrega rápida e suporte excelente. Já fiz várias compras e sempre tudo certinho.",
    date: "Outubro 2025"
  },
  {
    id: 2,
    name: "Maria Santos",
    location: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Confiável e seguro! Recebi meus diamantes em menos de 5 minutos. Recomendo para todos os jogadores de Free Fire.",
    date: "Outubro 2025"
  },
  {
    id: 3,
    name: "Pedro Costa",
    location: "Belo Horizonte, MG",
    rating: 5,
    text: "Preços justos e atendimento nota 10. Tive uma dúvida e fui atendido rapidamente. Site muito profissional!",
    date: "Outubro 2025"
  },
  {
    id: 4,
    name: "Ana Oliveira",
    location: "Brasília, DF",
    rating: 5,
    text: "Primeira vez comprando diamantes online e foi perfeito! Processo simples e seguro. Com certeza vou comprar novamente.",
    date: "Outubro 2025"
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Milhares de jogadores confiam em nós para suas compras de diamantes
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-500/50 transition-all transform hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-blue-400/30" />
              </div>

              <p className="text-slate-200 text-sm mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="border-t border-white/10 pt-4">
                <p className="text-white font-semibold text-sm">
                  {testimonial.name}
                </p>
                <p className="text-slate-400 text-xs">
                  {testimonial.location}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  {testimonial.date}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-full">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-semibold">
              4.9/5.0 baseado em 2.847 avaliações
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
