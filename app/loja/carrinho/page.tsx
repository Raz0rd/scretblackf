"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import LojaLayout from '@/components/loja/LojaLayout'

export default function CarrinhoPage() {
  const router = useRouter()
  const cart = useCart()

  // Redirecionar se carrinho vazio
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/loja')
    }
  }, [cart.items.length, router])

  // Determinar categoria do carrinho
  const category = cart.items[0]?.category || 'freefire'

  // Cores por categoria
  const getCategoryColors = () => {
    switch (category) {
      case 'freefire':
        return {
          primary: 'bg-orange-500 hover:bg-orange-600',
          text: 'text-orange-600',
          border: 'border-orange-500',
          bg: 'bg-orange-50'
        }
      case 'robux':
        return {
          primary: 'bg-gray-800 hover:bg-gray-900',
          text: 'text-gray-800',
          border: 'border-gray-800',
          bg: 'bg-gray-50'
        }
      case 'vbucks':
        return {
          primary: 'bg-blue-500 hover:bg-blue-600',
          text: 'text-blue-600',
          border: 'border-blue-500',
          bg: 'bg-blue-50'
        }
    }
  }

  const colors = getCategoryColors()

  if (cart.items.length === 0) {
    return null
  }

  return (
    <LojaLayout>
      <div className="container mx-auto max-w-4xl px-4 py-6 pb-32">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Carrinho
          </h1>
        </div>

        {/* Lista de Produtos */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Seus Itens ({cart.items.length})
          </h2>

          <div className="space-y-3">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className={`flex gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg}`}
              >
                {/* Imagem */}
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded border border-gray-200 p-1 flex items-center justify-center">
                  {item.category === 'robux' ? (
                    <img
                      src="/images/robux-coin-gold.svg"
                      alt="Robux"
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{item.name}</h3>
                  
                  {/* Detalhes */}
                  <div className="space-y-0.5 mb-1.5">
                    {Object.entries(item.details).slice(0, 2).map(([key, value]) => (
                      <p key={key} className="text-[10px] text-gray-600">
                        <span className="font-semibold">{key}:</span> {value}
                      </p>
                    ))}
                  </div>

                  {/* Preço */}
                  <div className="flex items-center gap-2">
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className="text-xs text-gray-400 line-through">
                        R$ {item.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className={`text-base font-bold ${colors.text}`}>
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Botão Remover */}
                <button
                  onClick={() => cart.removeItem(item.id)}
                  className="flex-shrink-0 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remover item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Botão Sticky Inferior */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-xl font-bold text-gray-900">
                R$ {cart.totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <button
              onClick={() => router.push('/loja/checkout')}
              className={`w-full ${colors.primary} text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl`}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </LojaLayout>
  )
}
