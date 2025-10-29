"use client"

import { Calendar, User, ArrowRight } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: "Como Comprar Diamantes FF com Segurança em 2025",
    excerpt: "Guia completo sobre como adquirir diamantes para Free Fire de forma segura, evitando golpes e garantindo a melhor experiência.",
    date: "28 de Outubro, 2025",
    author: "Equipe ComprarDiamantesFF",
    category: "Guias",
    image: "/images/blog-1.jpg"
  },
  {
    id: 2,
    title: "Melhores Skins e Pacotes de Diamantes FF",
    excerpt: "Descubra quais são as skins mais procuradas e os melhores pacotes de diamantes disponíveis no Free Fire atualmente.",
    date: "25 de Outubro, 2025",
    author: "Equipe ComprarDiamantesFF",
    category: "Dicas",
    image: "/images/blog-2.jpg"
  },
  {
    id: 3,
    title: "Eventos Especiais Free Fire: Vale a Pena?",
    excerpt: "Análise completa dos eventos especiais do Free Fire e como aproveitar ao máximo seus diamantes durante essas promoções.",
    date: "20 de Outubro, 2025",
    author: "Equipe ComprarDiamantesFF",
    category: "Análises",
    image: "/images/blog-3.jpg"
  }
]

export default function BlogSection() {
  return (
    <section id="blog" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Blog & Novidades
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Fique por dentro das últimas notícias, dicas e guias sobre Free Fire e diamantes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all transform hover:-translate-y-2 hover:shadow-2xl group"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-500/20 to-cyan-400/20 flex items-center justify-center">
                <div className="text-6xl">🎮</div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>

                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                </div>

                <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm group-hover:gap-3 transition-all">
                  Ler mais
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-slate-900/50">
            Ver Todos os Artigos
          </button>
        </div>
      </div>
    </section>
  )
}
