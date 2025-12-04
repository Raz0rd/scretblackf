"use client"

import { useState, useEffect } from "react"
import LojaLayout from '@/components/loja/LojaLayout'
import RobuxBanner from '@/components/loja/RobuxBanner'
import { useCart } from '@/contexts/CartContext'

export default function RobuxPage() {
  const cart = useCart()
  const [selectedRechargeValue, setSelectedRechargeValue] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Robux - Roblox Recarga Rápida'
  }, [])

  const config = {
    name: 'Robux',
    coinIcon: '/images/iconeRobux.svg',
    rechargeValues: ["1000", "2000", "5250", "11000", "24000"]
  }

  const calculatePrice = (value: string) => {
    const originalPrices: { [key: string]: number } = {
      "1000": 59.90,
      "2000": 117.90,
      "5250": 294.90,
      "11000": 589.90,
      "24000": 1179.90
    }
    
    const numericValue = parseInt(value.replace(/\./g, ''))
    const realPrice = numericValue * 0.02 // R$ 0,02 por unidade
    
    return { 
      originalPrice: originalPrices[value] || 0,
      realPrice: realPrice,
      discount: originalPrices[value] ? Math.round((1 - realPrice / originalPrices[value]) * 100) : 0
    }
  }

  return (
    <LojaLayout customBanner={<RobuxBanner />}>
      <div className="max-w-5xl mx-auto p-4 py-8">
        {/* Título da Promoção */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 mb-2">
            Aproveite até 25% a mais de Robux
          </h2>
          <p className="text-sm text-gray-600">
            Receba mais Robux no computador, web, com cartões-presente e em plataformas selecionadas
          </p>
        </div>

        {/* Lista de Valores */}
        <div className="space-y-3 max-w-md mx-auto mb-8">
          {config.rechargeValues.map((value: string) => {
            const isSelected = selectedRechargeValue === value
            const priceInfo = calculatePrice(value)
            
            return (
              <div
                key={value}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`relative flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
                onClick={() => {
                  console.log('🖱️ [Robux] Item clicado:', value)
                  cart.addItem({
                    id: `robux-${value}`,
                    name: `${value} Robux`,
                    image: config.coinIcon,
                    price: priceInfo.realPrice,
                    originalPrice: priceInfo.originalPrice,
                    category: 'robux',
                    details: {
                      'Quantidade': value,
                      'Desconto': `${priceInfo.discount}%`,
                      'Preço por unidade': 'R$ 0,02'
                    }
                  })
                  setSelectedRechargeValue(value)
                }}
              >
                {/* Badge de Desconto */}
                <div className="absolute -top-2 -right-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  -{priceInfo.discount}%
                </div>

                {/* Preços em Reais */}
                <div className="flex flex-col">
                  <div className="text-sm text-gray-400 line-through">
                    R$ {priceInfo.originalPrice.toFixed(2).replace('.', ',')}
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    R$ {priceInfo.realPrice.toFixed(2).replace('.', ',')}
                  </div>
                </div>

                {/* Quantidade de Robux */}
                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg">
                  <img
                    alt="Robux"
                    loading="lazy"
                    width="24"
                    height="24"
                    decoding="async"
                    className="w-6 h-6 object-contain"
                    src="/images/robux-coin-gold.svg"
                  />
                  <span className="text-lg font-bold text-gray-900">
                    {value.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Informação sobre outras plataformas */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            Computador, web e cartões presente
          </p>
        </div>

        {/* Roblox Premium Section */}
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="6" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none"/>
                <rect x="9" y="9" width="6" height="6" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Roblox Premium</h3>
              <p className="text-sm text-gray-600">
                Assinantes podem obter até <strong>35% a mais</strong> em valor em compras de Robux no computador, na web e com cartões presente.
              </p>
            </div>
          </div>

          <button className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Assine Premium
          </button>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-base font-bold text-gray-900 mb-3">R$ 59,00 / mês</h4>
            
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>1000 Robux por mês</span>
              </div>
              
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Até 35% a mais nas compras de Robux</span>
              </div>
              
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
                <span>Negocie, revenda e publique itens de avatar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LojaLayout>
  )
}
