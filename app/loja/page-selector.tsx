"use client"

import { useRouter } from 'next/navigation'
import { useUtmParams } from '@/hooks/useUtmParams'

export default function LojaSelector() {
  const router = useRouter()
  const { getUtmObject } = useUtmParams()

  const games = [
    {
      id: 'freefire',
      name: 'Free Fire',
      description: 'Diamantes e itens',
      icon: '🔥',
      color: 'from-orange-400 to-red-500',
      path: '/loja/freefire'
    },
    {
      id: 'robux',
      name: 'Robux',
      description: 'Roblox',
      icon: '⬡',
      color: 'from-red-500 to-red-600',
      path: '/loja/robux'
    },
    {
      id: 'vbucks',
      name: 'V-Bucks',
      description: 'Fortnite',
      icon: '⚡',
      color: 'from-purple-500 to-pink-500',
      path: '/loja/vbucks'
    },
    {
      id: 'recarga-celular',
      name: 'Recarga Celular',
      description: 'Vivo, Claro, TIM, Oi...',
      icon: '📱',
      color: 'from-green-500 to-green-600',
      path: '/loja/recarga-celular'
    },
    {
      id: 'brainroots',
      name: 'Brainroots Raros',
      description: 'Itens exclusivos e moedas',
      icon: '💎',
      color: 'from-emerald-500 to-teal-600',
      path: '/loja/brainroots'
    }
  ]

  const handleGameSelect = (path: string) => {
    // Preservar UTMs ao navegar
    const utms = getUtmObject()
    const params = new URLSearchParams(utms)
    const fullPath = params.toString() ? `${path}?${params.toString()}` : path
    router.push(fullPath)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Escolha seu Jogo
          </h1>
          <p className="text-lg text-gray-600">
            Selecione o jogo para fazer sua recarga
          </p>
        </div>

        {/* Grid de Jogos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <button
              key={game.id}
              onClick={() => handleGameSelect(game.path)}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-orange-500"
            >
              {/* Ícone */}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center text-4xl shadow-lg group-hover:scale-110 transition-transform`}>
                {game.icon}
              </div>

              {/* Nome */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                {game.name}
              </h3>

              {/* Descrição */}
              <p className="text-sm text-gray-500">
                {game.description}
              </p>

              {/* Seta */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Recarga rápida e segura • Entrega instantânea</span>
          </div>
        </div>
      </div>
    </div>
  )
}
