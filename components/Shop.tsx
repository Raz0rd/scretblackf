"use client"

import { useState } from 'react'
import { ShoppingCart, Zap, Star, Check, X } from 'lucide-react'

interface Product {
  id: string
  name: string
  game: 'freefire' | 'robux'
  amount: string
  price: number
  originalPrice?: number
  popular?: boolean
  bonus?: string
  image: string
}

const products: Product[] = [
  // Free Fire - Nomes corretos das imagens
  {
    id: 'ff-calca',
    name: 'Calça Angelical',
    game: 'freefire',
    amount: 'Calça Angelical',
    price: 69.90,
    image: '/images/products/ANGELICAL.png'
  },
  {
    id: 'ff-1060',
    name: '1060 Diamantes',
    game: 'freefire',
    amount: '1060',
    price: 18.70,
    bonus: '+30% Bônus',
    image: '/images/products/1060-min.png'
  },
  {
    id: 'ff-2180',
    name: '2180 Diamantes',
    game: 'freefire',
    amount: '2180',
    price: 32.40,
    popular: true,
    bonus: '+30% Bônus',
    image: '/images/products/2180-min.png'
  },
  {
    id: 'ff-5600',
    name: '5600 Diamantes',
    game: 'freefire',
    amount: '5600',
    price: 69.80,
    bonus: '+30% Bônus = 7280 💎',
    image: '/images/products/5600-min.png'
  },
  // Robux - Nomes corretos das imagens
  {
    id: 'rbx-800',
    name: '800 Robux',
    game: 'robux',
    amount: '800',
    price: 18.90,
    image: '/images/products/roblox_800_robux.webp'
  },
  {
    id: 'rbx-1500',
    name: '1500 Robux',
    game: 'robux',
    amount: '1500',
    price: 22.90,
    image: '/images/products/robux_1500.webp'
  },
  {
    id: 'rbx-2700',
    name: '2700 Robux',
    game: 'robux',
    amount: '2700',
    price: 29.90,
    image: '/images/products/robux_2700.webp'
  },
  {
    id: 'rbx-3600',
    name: '3600 Robux',
    game: 'robux',
    amount: '3600',
    price: 47.90,
    image: '/images/products/robux-3600-o6_PR7Lu.webp'
  },
  {
    id: 'rbx-4500',
    name: '4500 Robux',
    game: 'robux',
    amount: '4500',
    price: 55.90,
    originalPrice: 69.90,
    popular: true,
    bonus: '-20%',
    image: '/images/products/robux-4500-CBGtdrYT.webp'
  },
  {
    id: 'rbx-10000',
    name: '10000 Robux',
    game: 'robux',
    amount: '10000',
    price: 92.90,
    originalPrice: 119.90,
    bonus: '-23%',
    image: '/images/products/robux-10000-DH0988eb.webp'
  }
]

export default function Shop() {
  const [selectedGame, setSelectedGame] = useState<'all' | 'freefire' | 'robux'>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    gameId: '',
    name: ''
  })

  const filteredProducts = selectedGame === 'all' 
    ? products 
    : products.filter(p => p.game === selectedGame)

  const handleBuyClick = (product: Product) => {
    // Redirecionar para página do produto
    window.location.href = `/produto/${product.id}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProduct) return

    // Aqui você pode integrar com a mesma API de pagamento
    console.log('Compra:', {
      product: selectedProduct,
      ...formData
    })

    // Redirecionar para checkout ou gerar PIX
    alert(`Compra iniciada!\n\nProduto: ${selectedProduct.name}\nValor: R$ ${selectedProduct.price.toFixed(2)}\n\nVocê será redirecionado para o pagamento.`)
  }

  return (
    <section id="loja" className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-4">
            <ShoppingCart className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-300">Loja Oficial</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Recargas Instantâneas
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Compre diamantes Free Fire e Robux com entrega automática em minutos
          </p>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedGame('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedGame === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedGame('freefire')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedGame === 'freefire'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              💎 Free Fire
            </button>
            <button
              onClick={() => setSelectedGame('robux')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                selectedGame === 'robux'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              🎮 Robux
            </button>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`relative bg-white/5 backdrop-blur-md rounded-2xl p-6 border transition-all transform hover:-translate-y-2 hover:shadow-2xl ${
                product.popular
                  ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                  : 'border-white/10 hover:border-blue-500/50'
              }`}
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg">
                  ⭐ POPULAR
                </div>
              )}

              {product.bonus && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full text-xs font-bold text-white shadow-lg">
                  🎁 BÔNUS
                </div>
              )}

              <div className="text-center mb-4">
                <div className="mb-3 h-48 flex items-center justify-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-2">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="max-h-full max-w-full object-contain rounded-lg"
                    onError={(e) => {
                      // Fallback para emoji se imagem não carregar
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement!.innerHTML = `<div class="text-6xl">${product.game === 'freefire' ? '💎' : '🎮'}</div>`
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {product.name}
                </h3>
                {product.bonus && (
                  <p className="text-xs text-green-400 font-semibold">
                    {product.bonus}
                  </p>
                )}
              </div>

              <div className="text-center mb-4">
                {product.originalPrice && (
                  <p className="text-sm text-slate-400 line-through mb-1">
                    R$ {product.originalPrice.toFixed(2)}
                  </p>
                )}
                <p className="text-3xl font-bold text-white">
                  R$ {product.price.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => handleBuyClick(product)}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Comprar Agora
              </button>

              <div className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-400">
                <Zap className="w-3 h-3 text-green-400" />
                <span>Entrega em 5min</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de Checkout */}
        {showCheckout && selectedProduct && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-white/10">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-t-2xl relative">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-2xl font-bold text-white">Finalizar Compra</h3>
              </div>

              <div className="p-6">
                {/* Resumo do Produto */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name}
                        className="max-h-full max-w-full object-contain rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.parentElement!.innerHTML = `<div class="text-4xl">${selectedProduct.game === 'freefire' ? '💎' : '🎮'}</div>`
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-white">{selectedProduct.name}</h4>
                      {selectedProduct.bonus && (
                        <p className="text-xs text-green-400">{selectedProduct.bonus}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        R$ {selectedProduct.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Seu E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      {selectedProduct.game === 'freefire' ? 'ID do Free Fire *' : 'Username do Roblox *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.gameId}
                      onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                      placeholder={selectedProduct.game === 'freefire' ? 'Seu ID do FF' : 'Seu username'}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nome completo"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Gerar PIX e Finalizar
                  </button>

                  <p className="text-xs text-slate-400 text-center">
                    🔒 Pagamento 100% seguro via PIX
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Garantias */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Entrega Rápida</h4>
            <p className="text-sm text-slate-300">
              Receba em até 5 minutos após confirmação do pagamento
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/50">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Garantia Total</h4>
            <p className="text-sm text-slate-300">
              100% de garantia ou seu dinheiro de volta
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Suporte 24/7</h4>
            <p className="text-sm text-slate-300">
              Atendimento sempre disponível para ajudar você
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
