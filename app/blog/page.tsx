"use client"

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, Clock, ArrowRight, Flame, TrendingUp, Gamepad2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: 'freefire' | 'roblox' | 'dicas'
  date: string
  readTime: string
  trending?: boolean
}

const blogPosts: BlogPost[] = [
  {
    id: 'ff-guia-completo',
    title: 'Free Fire: Guia Completo - Personagens, Mapas, Armas e Mais',
    excerpt: 'Confira um guia completo sobre o jogo que mistura tiro e sobrevivência em equipe da Garena. Tudo sobre personagens, mapas e armas!',
    content: 'Free Fire é um jogo battle royale que conquistou milhões de jogadores...',
    image: '/images/blog/ff-guide.jpg',
    category: 'freefire',
    date: '30 de Outubro, 2025',
    readTime: '12 min',
    trending: true
  },
  {
    id: 'ff-idade-recomendada',
    title: 'Qual a Idade Recomendada para Jogar Free Fire? Guia para Pais',
    excerpt: 'Entenda a classificação etária do Free Fire e saiba se o jogo é adequado para seu filho. Dicas de segurança e controle parental.',
    content: 'Free Fire é um dos jogos mais populares entre crianças e adolescentes...',
    image: '/images/blog/ff-age.jpg',
    category: 'dicas',
    date: '29 de Outubro, 2025',
    readTime: '6 min',
    trending: true
  },
  {
    id: 'ff-novo-evento-2025',
    title: 'Free Fire: Novo Evento Traz Skins Exclusivas e Diamantes Grátis em 2025',
    excerpt: 'Garena anuncia mega evento com recompensas incríveis. Saiba como participar e ganhar diamantes de graça!',
    content: 'O Free Fire está preparando um dos maiores eventos de 2025...',
    image: '/images/blog/freefire-event.jpg',
    category: 'freefire',
    date: '28 de Outubro, 2025',
    readTime: '5 min'
  },
  {
    id: 'roblox-premium-vale-pena',
    title: 'Roblox Premium Vale a Pena em 2025? Análise Completa',
    excerpt: 'Descubra se o Roblox Premium realmente compensa e como aproveitar ao máximo os benefícios.',
    content: 'O Roblox Premium oferece diversos benefícios exclusivos...',
    image: '/images/blog/roblox-premium.jpg',
    category: 'roblox',
    date: '28 de Outubro, 2025',
    readTime: '7 min',
    trending: true
  },
  {
    id: 'ff-melhores-personagens',
    title: 'Top 10 Melhores Personagens do Free Fire em 2025',
    excerpt: 'Conheça os personagens mais fortes da temporada atual e monte a melhor combinação de habilidades.',
    content: 'A meta do Free Fire está sempre mudando...',
    image: '/images/blog/ff-characters.jpg',
    category: 'freefire',
    date: '25 de Outubro, 2025',
    readTime: '8 min'
  },
  {
    id: 'roblox-jogos-populares',
    title: '15 Jogos Mais Populares do Roblox em 2025',
    excerpt: 'Lista atualizada com os games que estão bombando na plataforma e valem a pena jogar.',
    image: '/images/blog/roblox-games.jpg',
    category: 'roblox',
    date: '22 de Outubro, 2025',
    readTime: '10 min',
    content: ''
  },
  {
    id: 'dicas-economizar-diamantes',
    title: 'Como Economizar Diamantes no Free Fire: 10 Dicas Essenciais',
    excerpt: 'Aprenda a gastar seus diamantes de forma inteligente e aproveitar melhor as promoções.',
    image: '/images/blog/ff-tips.jpg',
    category: 'dicas',
    date: '20 de Outubro, 2025',
    readTime: '6 min',
    content: ''
  },
  {
    id: 'roblox-criar-jogo',
    title: 'Como Criar Seu Próprio Jogo no Roblox: Guia para Iniciantes',
    excerpt: 'Passo a passo completo para começar a desenvolver no Roblox Studio e ganhar Robux.',
    image: '/images/blog/roblox-studio.jpg',
    category: 'roblox',
    date: '18 de Outubro, 2025',
    readTime: '12 min',
    content: ''
  },
  {
    id: 'ff-atualização-nova',
    title: 'Free Fire: Nova Atualização Traz Modo de Jogo Inédito',
    excerpt: 'Confira todas as novidades da última atualização e as mudanças no balanceamento.',
    image: '/images/blog/ff-update.jpg',
    category: 'freefire',
    date: '15 de Outubro, 2025',
    readTime: '5 min',
    content: ''
  },
  {
    id: 'roblox-segurança',
    title: 'Segurança no Roblox: Como Proteger Sua Conta de Hackers',
    excerpt: 'Dicas essenciais para manter sua conta segura e evitar golpes comuns na plataforma.',
    image: '/images/blog/roblox-security.jpg',
    category: 'dicas',
    date: '12 de Outubro, 2025',
    readTime: '7 min',
    content: ''
  },
  {
    id: 'ff-melhores-armas',
    title: 'Ranking das Melhores Armas do Free Fire Atualizado',
    excerpt: 'Lista completa com as armas mais fortes de cada categoria e dicas de uso.',
    image: '/images/blog/ff-weapons.jpg',
    category: 'freefire',
    date: '10 de Outubro, 2025',
    readTime: '9 min',
    content: ''
  }
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'freefire' | 'roblox' | 'dicas'>('all')

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'freefire':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      case 'roblox':
        return 'bg-red-500/10 text-red-400 border-red-500/30'
      case 'dicas':
        return 'bg-green-500/10 text-green-400 border-green-500/30'
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'freefire':
        return '🔥 Free Fire'
      case 'roblox':
        return '🎮 Roblox'
      case 'dicas':
        return '💡 Dicas'
      default:
        return category
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #13141F 0%, #191A23 76.1%, #1E1F2A 100%)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[25%] left-[35%] w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-[15%] left-[65%] w-3 h-3 bg-blue-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-lg shadow-purple-500/50">
              <Gamepad2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Blog & Notícias
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Fique por dentro das últimas novidades, dicas e atualizações do Free Fire e Roblox
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('freefire')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === 'freefire'
                  ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              🔥 Free Fire
            </button>
            <button
              onClick={() => setSelectedCategory('roblox')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === 'roblox'
                  ? 'bg-gradient-to-r from-red-600 to-pink-500 text-white shadow-lg shadow-red-500/50'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              🎮 Roblox
            </button>
            <button
              onClick={() => setSelectedCategory('dicas')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedCategory === 'dicas'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              💡 Dicas
            </button>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-[#1B1B25] rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
                  {post.trending && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      TRENDING
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B25] to-transparent opacity-60"></div>
                  <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">
                    {post.category === 'freefire' ? '🔥' : post.category === 'roblox' ? '🎮' : '💡'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(post.category)}`}>
                      {getCategoryName(post.category)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-white/60 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <a 
                    href={`/blog/${post.id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600 hover:to-pink-600 border border-purple-500/30 hover:border-purple-500 text-white font-semibold rounded-xl transition-all group-hover:shadow-lg group-hover:shadow-purple-500/50"
                  >
                    Ler Mais
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/50 text-lg">Nenhum post encontrado nesta categoria.</p>
            </div>
          )}

          {/* Newsletter Section */}
          <div className="mt-16 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Não Perca Nenhuma Novidade!
              </h3>
              <p className="text-white/70 mb-6">
                Receba as últimas notícias, dicas exclusivas e promoções diretamente no seu e-mail.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 px-4 py-3 bg-[#13141F] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-purple-500/50">
                  Inscrever
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
