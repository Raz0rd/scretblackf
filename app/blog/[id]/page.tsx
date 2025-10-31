"use client"

import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: 'freefire' | 'roblox' | 'dicas'
  date: string
  readTime: string
}

const blogPosts: Record<string, BlogPost> = {
  'ff-guia-completo': {
    id: 'ff-guia-completo',
    title: 'Free Fire: Guia Completo - Personagens, Mapas, Armas e Mais',
    excerpt: 'Confira um guia completo sobre o jogo que mistura tiro e sobrevivência em equipe da Garena.',
    content: `
      <h2>O que é Free Fire?</h2>
      <p>Free Fire é um jogo battle royale desenvolvido pela Garena que conquistou milhões de jogadores ao redor do mundo. O jogo coloca 50 jogadores em uma ilha onde apenas um sobreviverá.</p>

      <h2>Personagens</h2>
      <p>O Free Fire possui diversos personagens únicos, cada um com habilidades especiais que podem mudar o rumo da partida. Alguns dos mais populares incluem:</p>
      <ul>
        <li><strong>DJ Alok:</strong> Cria uma aura que aumenta a velocidade de movimento e restaura HP</li>
        <li><strong>Chrono:</strong> Cria um campo de força que bloqueia dano de fora</li>
        <li><strong>K:</strong> Alterna entre modos de recuperação e combate</li>
        <li><strong>Skyler:</strong> Destrói gloo walls e cria uma onda sônica</li>
      </ul>

      <h2>Mapas</h2>
      <p>O jogo conta com diversos mapas, sendo os principais:</p>
      <ul>
        <li><strong>Bermuda:</strong> O mapa clássico com 50 jogadores</li>
        <li><strong>Purgatory:</strong> Mapa maior com mais áreas para explorar</li>
        <li><strong>Kalahari:</strong> Mapa desértico com terreno único</li>
        <li><strong>Alpine:</strong> Mapa nevado com clima desafiador</li>
      </ul>

      <h2>Armas</h2>
      <p>Existem diversas categorias de armas no Free Fire:</p>
      <ul>
        <li><strong>Rifles de Assalto:</strong> AK, M4A1, SCAR, Groza</li>
        <li><strong>Snipers:</strong> AWM, Kar98k, SVD</li>
        <li><strong>SMGs:</strong> MP40, Thompson, UMP</li>
        <li><strong>Shotguns:</strong> M1887, SPAS12, M1014</li>
      </ul>

      <h2>Dicas para Iniciantes</h2>
      <p>Se você está começando no Free Fire, aqui vão algumas dicas essenciais:</p>
      <ol>
        <li>Escolha bem seu ponto de queda no início da partida</li>
        <li>Colete equipamentos e armas rapidamente</li>
        <li>Fique atento à zona segura</li>
        <li>Use fones de ouvido para ouvir passos inimigos</li>
        <li>Pratique sua mira no campo de treinamento</li>
      </ol>
    `,
    image: '/images/blog/ff-guide.jpg',
    category: 'freefire',
    date: '30 de Outubro, 2025',
    readTime: '12 min'
  },
  'ff-idade-recomendada': {
    id: 'ff-idade-recomendada',
    title: 'Qual a Idade Recomendada para Jogar Free Fire? Guia para Pais',
    excerpt: 'Entenda a classificação etária do Free Fire e saiba se o jogo é adequado para seu filho.',
    content: `
      <h2>Classificação Etária</h2>
      <p>O Free Fire possui classificação indicativa de <strong>12 anos</strong> no Brasil, segundo o Ministério da Justiça. Isso significa que o jogo contém elementos que podem não ser adequados para crianças menores de 12 anos.</p>

      <h2>Por que essa classificação?</h2>
      <p>A classificação de 12 anos se deve principalmente aos seguintes fatores:</p>
      <ul>
        <li><strong>Violência:</strong> O jogo envolve combate com armas de fogo</li>
        <li><strong>Competitividade:</strong> Ambiente competitivo que pode gerar estresse</li>
        <li><strong>Interação online:</strong> Comunicação com outros jogadores</li>
      </ul>

      <h2>Controle Parental</h2>
      <p>Se você decidir permitir que seu filho jogue Free Fire, é importante estabelecer algumas regras:</p>
      <ol>
        <li><strong>Limite de tempo:</strong> Estabeleça horários específicos para jogar</li>
        <li><strong>Supervisão:</strong> Acompanhe as partidas ocasionalmente</li>
        <li><strong>Chat:</strong> Desative ou monitore as conversas no jogo</li>
        <li><strong>Compras:</strong> Configure controles para evitar gastos não autorizados</li>
      </ol>

      <h2>Benefícios do Jogo</h2>
      <p>Quando jogado de forma equilibrada, o Free Fire pode trazer alguns benefícios:</p>
      <ul>
        <li>Desenvolvimento de raciocínio rápido</li>
        <li>Trabalho em equipe</li>
        <li>Coordenação motora</li>
        <li>Tomada de decisões sob pressão</li>
      </ul>

      <h2>Sinais de Alerta</h2>
      <p>Fique atento a estes sinais que podem indicar uso excessivo:</p>
      <ul>
        <li>Queda no desempenho escolar</li>
        <li>Isolamento social</li>
        <li>Irritabilidade quando não pode jogar</li>
        <li>Negligência de outras atividades</li>
      </ul>

      <h2>Conclusão</h2>
      <p>O Free Fire pode ser uma forma de entretenimento adequada para adolescentes, desde que seja jogado com moderação e sob supervisão dos pais. O diálogo aberto sobre o jogo e seus conteúdos é fundamental.</p>
    `,
    image: '/images/blog/ff-age.jpg',
    category: 'dicas',
    date: '29 de Outubro, 2025',
    readTime: '6 min'
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const postId = params.id as string
  const post = blogPosts[postId]

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#13141F]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post não encontrado</h1>
          <a href="/blog" className="text-blue-400 hover:text-blue-300">
            ← Voltar para o blog
          </a>
        </div>
      </div>
    )
  }

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
      <Navbar />

      <article className="relative z-10 pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <a 
            href="/blog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o blog
          </a>

          {/* Category Badge */}
          <div className="mb-6">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getCategoryColor(post.category)}`}>
              {getCategoryName(post.category)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-white/50 mb-8">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime} de leitura
            </span>
            <button className="flex items-center gap-2 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
          </div>

          {/* Featured Image */}
          <div className="relative h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden mb-12">
            <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20">
              {post.category === 'freefire' ? '🔥' : post.category === 'roblox' ? '🎮' : '💡'}
            </div>
          </div>

          {/* Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between">
              <p className="text-white/70">Gostou deste artigo? Compartilhe com seus amigos!</p>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/50 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Compartilhar
              </button>
            </div>
          </div>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <a 
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 text-white font-semibold rounded-xl transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Ver mais artigos
            </a>
          </div>
        </div>
      </article>

      <Footer />

      <style jsx global>{`
        .prose h2 {
          color: white;
          font-size: 1.875rem;
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose h3 {
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }
        .prose ul, .prose ol {
          margin-top: 1rem;
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
        .prose strong {
          color: rgba(255, 255, 255, 0.95);
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
