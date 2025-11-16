"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Zap, X, Check, Star } from 'lucide-react'

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
  special?: boolean
}

const products: Product[] = [
  // Free Fire - Diamantes simples
  {
    id: 'ff-520',
    name: '520 Diamantes',
    game: 'freefire',
    amount: '520',
    price: 22.90,
    bonus: 'Recarga instantânea',
    image: '/images/products/1060-min.png'
  },
  {
    id: 'ff-1060',
    name: '1.060 Diamantes',
    game: 'freefire',
    amount: '1060',
    price: 34.90,
    bonus: 'PROMOÇÃO',
    image: '/images/products/1060-min.png'
  },
  {
    id: 'ff-2180',
    name: '2.180 Diamantes',
    game: 'freefire',
    amount: '2180',
    price: 44.90,
    popular: true,
    bonus: 'PROMOÇÃO',
    image: '/images/products/2180-min.png'
  },
  {
    id: 'ff-5600',
    name: '5.600 Diamantes',
    game: 'freefire',
    amount: '5600',
    price: 67.90,
    bonus: 'PROMOÇÃO',
    image: '/images/products/5600-min.png'
  },
  // Free Fire - Ofertas Especiais
  {
    id: 'ff-mensal',
    name: 'Evolução - 30 dias',
    game: 'freefire',
    amount: 'Passe Mensal',
    price: 24.90,
    special: true,
    image: '/images/mensal.png'
  },
  {
    id: 'ff-calca',
    name: 'Calça Angelical Brilhante',
    game: 'freefire',
    amount: 'Calça Angelical',
    price: 34.90,
    special: true,
    image: '/images/products/ANGELICAL.png'
  },
  {
    id: 'ff-passe-booyah',
    name: 'Passe Booyah',
    game: 'freefire',
    amount: 'Passe Booyah',
    price: 24.90,
    special: true,
    image: '/images/passe-booyah.webp'
  },
  {
    id: 'ff-semanal',
    name: 'Semanal Anônimo',
    game: 'freefire',
    amount: 'Passe Semanal',
    price: 14.90,
    special: true,
    image: '/images/semanal.png'
  },
  {
    id: 'ff-violento',
    name: 'Jimg Violento',
    game: 'freefire',
    amount: 'Skin Jimg',
    price: 29.90,
    special: true,
    image: '/images/jimg_violento.png'
  },
  {
    id: 'ff-pisico',
    name: 'Jimg Písico',
    game: 'freefire',
    amount: 'Skin Jimg',
    price: 29.90,
    special: true,
    image: '/images/jimg_pisico.png'
  },
  {
    id: 'ff-firepower',
    name: 'Poder do Fogo',
    game: 'freefire',
    amount: 'Item Especial',
    price: 39.90,
    special: true,
    image: '/images/firepower.png'
  },
  // Robux
  {
    id: 'rbx-2000',
    name: '2.000 Robux',
    game: 'robux',
    amount: '2000',
    price: 29.90,
    bonus: 'Outras plataformas: 1.700',
    image: '/images/products/robux_2700.webp'
  },
  {
    id: 'rbx-5250',
    name: '5.250 Robux',
    game: 'robux',
    amount: '5250',
    price: 59.90,
    bonus: 'Outras plataformas: 4.500',
    image: '/images/products/robux-3600-o6_PR7Lu.webp'
  },
  {
    id: 'rbx-11000',
    name: '11.000 Robux',
    game: 'robux',
    amount: '11000',
    price: 117.90,
    bonus: 'Outras plataformas: 10.000',
    image: '/images/products/robux-4500-CBGtdrYT.webp'
  },
  {
    id: 'rbx-24000',
    name: '24.000 Robux',
    game: 'robux',
    amount: '24000',
    price: 484.20,
    bonus: 'Outras plataformas: 22.500',
    image: '/images/products/robux-10000-DH0988eb.webp'
  }
]

export default function Shop() {
  const router = useRouter()
  const [selectedGame, setSelectedGame] = useState<'all' | 'freefire' | 'robux'>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedDiamond, setSelectedDiamond] = useState<Product | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    gameId: '',
    name: ''
  })

  // Ler parâmetro 'game' da URL ao carregar (apenas no cliente)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const gameParam = urlParams.get('game')
      if (gameParam === 'freefire' || gameParam === 'robux') {
        setSelectedGame(gameParam)
      }
    }
  }, [])

  const filteredProducts = selectedGame === 'all' 
    ? products 
    : products.filter(p => p.game === selectedGame)
  
  const handleGameClick = (game: 'freefire' | 'robux') => {
    setSelectedGame(game)
    // Atualizar URL sem recarregar a página
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/loja?game=${game}`)
    }
  }

  const toggleDiamondSelection = (product: Product) => {
    if (selectedDiamond?.id === product.id) {
      setSelectedDiamond(null)
    } else {
      setSelectedDiamond(product)
    }
  }

  const toggleOfferSelection = (product: Product) => {
    if (selectedOffer?.id === product.id) {
      setSelectedOffer(null)
    } else {
      setSelectedOffer(product)
    }
  }

  const selectedItems = [selectedDiamond, selectedOffer].filter(Boolean) as Product[]
  const totalPrice = selectedItems.reduce((sum, p) => sum + p.price, 0)
  const hasSelection = selectedItems.length > 0

  const handleCheckout = () => {
    if (!hasSelection) return
    
    // Montar nomes e valores para o resumo
    const itemNames = selectedItems.map(p => p.name).join(' + ')
    const itemValues = selectedItems.map(p => p.amount).join(' + ')
    
    // Redirecionar com parâmetros para o checkout
    const params = new URLSearchParams({
      itemValue: itemValues,
      itemName: itemNames,
      price: totalPrice.toFixed(2),
      type: 'combo',
      app: '100067' // Free Fire
    })
    
    window.location.href = `/checkout-loja?${params.toString()}`
  }

  const handleBuyClick = (product: Product) => {
    // Se for Robux, redirecionar para checkout da loja
    if (product.game === 'robux') {
      const params = new URLSearchParams({
        itemValue: product.amount,
        itemName: product.name,
        price: product.price.toFixed(2),
        type: 'robux',
        app: '100068' // Roblox
      })
      window.location.href = `/checkout-loja?${params.toString()}`
    } else {
      // Free Fire vai para página do produto
      window.location.href = `/produto/${product.id}`
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProduct) return

    // Redirecionar para checkout ou gerar PIX
    alert(`Compra iniciada!\n\nProduto: ${selectedProduct.name}\nValor: R$ ${selectedProduct.price.toFixed(2)}\n\nVocê será redirecionado para o pagamento.`)
  }

  return (
    <section id="loja" className="py-20 relative overflow-hidden" style={{
      backgroundColor: selectedGame === 'robux' ? '#1a1a1a' : '#0a0a0a',
      backgroundImage: selectedGame === 'robux' ? 'url(/images/backgroundRoblox.jpg)' : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      {/* Overlay escuro para Robux */}
      {selectedGame === 'robux' && (
        <div className="absolute inset-0 bg-black/60 z-0"></div>
      )}
      
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-red-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          {/* Badge animado */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 rounded-full mb-6 shadow-lg shadow-red-500/30 animate-bounce">
            <ShoppingCart className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white"> LOJA OFICIAL - ENTREGA INSTANTÂNEA</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
            Recargas Premium
          </h2>
          <p className="text-xl md:text-2xl text-red-500 max-w-3xl mx-auto mb-4 font-bold">
            Diamantes Free Fire & Robux
          </p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 font-semibold">
            Entrega automática em até 5 minutos • Pagamento seguro via PIX
          </p>

          {/* Filtros - Só mostrar se já selecionou um jogo */}
          {selectedGame !== 'all' && (
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedGame('all')
                  window.history.pushState({}, '', '/loja')
                }}
                className="px-6 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 bg-white text-black hover:bg-gray-50 shadow-lg border-2 border-black"
              >
                ← Voltar
              </button>
              <button
                onClick={() => handleGameClick('freefire')}
                className={`px-6 py-3 rounded-xl font-black text-sm transition-all transform hover:scale-105 ${
                  selectedGame === 'freefire'
                    ? 'bg-red-600 text-white shadow-2xl shadow-red-500/50 scale-105'
                    : 'bg-white text-black hover:bg-gray-50 shadow-lg border-2 border-black'
                }`}
              >
                🔥 Free Fire
              </button>
              <button
                onClick={() => handleGameClick('robux')}
                className={`px-6 py-3 rounded-xl font-black text-sm transition-all transform hover:scale-105 ${
                  selectedGame === 'robux'
                    ? 'bg-red-600 text-white shadow-2xl shadow-red-500/50 scale-105'
                    : 'bg-white text-black hover:bg-gray-50 shadow-lg border-2 border-black'
                }`}
              >
                🎮 Robux
              </button>
            </div>
          )}
        </div>

        {/* Seleção de Categoria - Mostrar quando 'all' */}
        {selectedGame === 'all' && (
          <div className="max-w-4xl mx-auto mb-20">
            <h3 className="text-3xl font-black text-center text-white mb-8">
              Escolha o jogo que deseja recarregar:
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card Free Fire */}
              <button
                onClick={() => handleGameClick('freefire')}
                className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 border-4 border-red-500"
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl shadow-2xl">
                      <span className="text-4xl">🔥</span>
                    </div>
                  </div>
                  <h4 className="text-3xl font-black text-white mb-3">FREE FIRE</h4>
                  <p className="text-gray-300 text-lg mb-4">
                    Diamantes e Ofertas Especiais
                  </p>
                  <div className="bg-red-600/20 backdrop-blur-sm rounded-xl p-3 mb-4 border border-red-500/30">
                    <p className="text-white font-bold text-sm">
                      ⚡ Entrega instantânea<br/>
                      💎 A partir de R$ 22,90
                    </p>
                  </div>
                  <div className="bg-red-600 text-white font-black py-3 px-6 rounded-xl inline-block group-hover:bg-red-700 transition-colors">
                    VER PRODUTOS →
                  </div>
                </div>
              </button>

              {/* Card Robux */}
              <button
                onClick={() => handleGameClick('robux')}
                className="group relative bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 border-4 border-yellow-500"
              >
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl shadow-2xl">
                      <span className="text-4xl">💰</span>
                    </div>
                  </div>
                  <h4 className="text-3xl font-black text-white mb-3">ROBUX</h4>
                  <p className="text-gray-300 text-lg mb-4">
                    Moeda do Roblox
                  </p>
                  <div className="bg-yellow-600/20 backdrop-blur-sm rounded-xl p-3 mb-4 border border-yellow-500/30">
                    <p className="text-white font-bold text-sm">
                      📧 Código enviado por email<br/>
                      💰 A partir de R$ 29,90
                    </p>
                  </div>
                  <div className="bg-yellow-600 text-white font-black py-3 px-6 rounded-xl inline-block group-hover:bg-yellow-700 transition-colors">
                    VER PRODUTOS →
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Seção de Free Fire - Grid 2x2 */}
        {selectedGame === 'freefire' && (
          <div className="max-w-2xl mx-auto pb-32">
            {/* Pacotes de Diamantes */}
            <div className="mb-12">
              <div className="bg-gradient-to-r from-purple-900 via-gray-900 to-black rounded-2xl p-6 border-2 border-purple-500">
                <h3 className="text-xl font-black text-white mb-4">
                  <span className="text-2xl mr-2">💰</span>
                  Pacotes de diamantes
                </h3>
                <p className="text-sm text-purple-300 mb-6">
                  Pacotes com descontos promocionais são válidos apenas na sua primeira compra!
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {filteredProducts.filter(p => !p.special && p.game === 'freefire').map((product) => {
                    const isSelected = selectedDiamond?.id === product.id
                    return (
                      <div
                        key={product.id}
                        onClick={() => toggleDiamondSelection(product)}
                        className={`group relative bg-gradient-to-r from-gray-900 to-black rounded-xl p-3 border-2 transition-all cursor-pointer active:scale-95 ${
                          isSelected ? 'border-purple-500 ring-2 ring-purple-400 scale-[1.02]' : 'border-gray-700 hover:border-purple-500'
                        }`}
                      >
                        {/* Checkbox visual */}
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-purple-500 border-purple-500 scale-110' : 'bg-transparent border-gray-500'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Diamante menor à esquerda */}
                          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg p-1.5">
                            <img 
                              src="/images/point.png" 
                              alt="Diamante"
                              className="w-full h-full object-contain drop-shadow-lg"
                            />
                          </div>
                          
                          {/* Texto à direita */}
                          <div className="flex-1 text-left">
                            <h4 className="text-sm font-black text-white leading-tight mb-1">
                              {product.amount}
                            </h4>
                            <div className="text-base font-black text-white">
                              R$ {product.price.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Ofertas Especiais - Grid 2x2 */}
            <div className="mb-12">
              <h3 className="text-2xl font-black text-white mb-6">
                <span className="text-3xl mr-2">🎁</span>
                Ofertas especiais
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.filter(p => p.special && p.game === 'freefire').map((product) => {
                  const isSelected = selectedOffer?.id === product.id
                  return (
                    <div
                      key={product.id}
                      onClick={() => toggleOfferSelection(product)}
                      className={`group relative bg-gradient-to-br from-purple-900 via-gray-900 to-black rounded-xl p-3 border-2 transition-all cursor-pointer active:scale-95 ${
                        isSelected ? 'border-pink-500 ring-2 ring-pink-400 scale-[1.02]' : 'border-purple-500 hover:border-pink-500'
                      }`}
                    >
                      {/* Checkbox visual */}
                      <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                        isSelected ? 'bg-pink-500 border-pink-500 scale-110' : 'bg-transparent border-gray-500'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>

                      <div className="mb-2 h-20 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-2">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      </div>
                      <h4 className="text-[10px] font-black text-white mb-1.5 text-center leading-tight">
                        {product.name}
                      </h4>
                      <div className="text-center">
                        <div className="text-base font-black text-pink-500">
                          R$ {product.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Produtos Robux - Lista Vertical */}
        {selectedGame === 'robux' && (
          <div className="max-w-lg mx-auto mb-16">
            <div className="space-y-3">
              {filteredProducts.filter(p => p.game === 'robux').map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleBuyClick(product)}
                  className="group relative bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-500 transition-all cursor-pointer shadow-md hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    {/* Preço à esquerda */}
                    <div className="flex-shrink-0">
                      <div className="text-2xl font-black text-black">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </div>
                    </div>

                    {/* Quantidade à direita */}
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg border-2 border-gray-300">
                      <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <linearGradient id="robuxGradient" x1="50%" y1="3.64710172%" x2="50%" y2="100%">
                            <stop offset="0%" stopColor="#EEDFA2"/>
                            <stop offset="58.853881%" stopColor="#A9935A"/>
                            <stop offset="100%" stopColor="#FEE3A5"/>
                          </linearGradient>
                        </defs>
                        <path d="M21.032,3.58225 L28.969,8.16525 C30.845,9.24825 32,11.24925 32,13.41525 L32,22.58125 C32,24.74725 30.845,26.74825 28.969,27.83125 L21.032,32.41425 C19.156,33.49725 16.845,33.49725 14.969,32.41425 L7.032,27.83125 C5.156,26.74825 4,24.74725 4,22.58125 L4,13.41525 C4,11.24925 5.156,9.24825 7.032,8.16525 L14.969,3.58225 C16.845,2.49925 19.156,2.49925 21.032,3.58225 Z M15.976,5.31025 L8.025,9.90125 C6.772,10.62425 6,11.96125 6,13.40725 L6,22.58925 C6,24.03525 6.772,25.37225 8.025,26.09525 L15.976,30.68625 C17.229,31.40925 18.772,31.40925 20.025,30.68625 L27.976,26.09525 C29.229,25.37225 30,24.03525 30,22.58925 L30,13.40725 C30,11.96125 29.229,10.62425 27.976,9.90125 L20.025,5.31025 C18.772,4.58725 17.229,4.58725 15.976,5.31025 Z M19.559,8.50825 L25.442,11.90425 C26.406,12.46125 27,13.49025 27,14.60425 L27,21.39625 C27,22.51025 26.406,23.53925 25.442,24.09625 L19.559,27.49225 C18.594,28.04925 17.406,28.04925 16.442,27.49225 L10.559,24.09625 C9.594,23.53925 9,22.51025 9,21.39625 L9,14.60425 C9,13.49025 9.594,12.46125 10.559,11.90425 L16.442,8.50825 C17.406,7.95125 18.594,7.95125 19.559,8.50825 Z M21,15.00025 L15,15.00025 L15,21.00025 L21,21.00025 L21,15.00025 Z" fill="url(#robuxGradient)" transform="translate(2, 2)"/>
                      </svg>
                      <span className="text-xl font-black text-black">
                        {product.amount}
                      </span>
                    </div>
                  </div>

                  {/* Texto de comparação */}
                  {product.bonus && (
                    <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                      <span>{product.bonus}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Botão Sticky Mobile - Carrinho */}
        {hasSelection && selectedGame === 'freefire' && (
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-black via-red-900 to-black shadow-2xl z-50 border-t-4 border-red-600/50">
            <div className="container mx-auto px-4 py-4">
              {/* Resumo dos itens */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">Itens selecionados</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedDiamond && (
                      <span className="text-xs bg-red-600/30 px-2 py-1 rounded-full text-white font-bold border border-red-600/50">
                        💎 {selectedDiamond.amount}
                      </span>
                    )}
                    {selectedOffer && (
                      <span className="text-xs bg-red-600/30 px-2 py-1 rounded-full text-white font-bold border border-red-600/50">
                        🎁 {selectedOffer.name.substring(0, 15)}...
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-2xl font-black text-red-600">R$ {totalPrice.toFixed(2)}</p>
                </div>
              </div>
              
              {/* Botão de checkout */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black rounded-xl transition-all transform active:scale-95 shadow-2xl text-lg flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-6 h-6" />
                FINALIZAR COMPRA ({selectedItems.length} {selectedItems.length === 1 ? 'item' : 'itens'})
              </button>
            </div>
          </div>
        )}

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
