"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { Trash2, ShoppingBag, ArrowLeft, ChevronDown, ChevronUp, Check } from 'lucide-react'
import LojaLayout from '@/components/loja/LojaLayout'
import { fetchWithRetry, saveFailedRequest } from "@/lib/retry-fetch"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cart = useCart()
  
  // Pegar categoria da URL ou do carrinho
  const categoryParam = searchParams.get('category') as 'freefire' | 'robux' | 'vbucks' | null
  const category = categoryParam || cart.items[0]?.category || 'freefire'
  
  // Sempre começar no resumo do carrinho
  const [step, setStep] = useState<'cart' | 'form'>('cart')

  // Redirecionar se carrinho vazio
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/loja')
    }
  }, [cart.items.length, router])

  const categoryNames = {
    freefire: 'Free Fire',
    robux: 'Robux',
    vbucks: 'Brainrot'
  }

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
    <LojaLayout hideRanking={true}>
      <div className="container mx-auto max-w-4xl px-4 py-6 pb-32">
        {step === 'cart' ? (
          <>
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
                  onClick={() => setStep('form')}
                  className={`w-full ${colors.primary} text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl`}
                >
                  Continuar para Pagamento
                </button>
              </div>
            </div>
          </>
        ) : (
          <CheckoutForm 
            category={category} 
            colors={colors}
            onBack={() => setStep('cart')}
          />
        )}
      </div>
    </LojaLayout>
  )
}

// Componente do Formulário
function CheckoutForm({ 
  category, 
  colors,
  onBack 
}: { 
  category: 'freefire' | 'robux' | 'vbucks'
  colors: any
  onBack: () => void
}) {
  const cart = useCart()
  const [step, setStep] = useState<'validate' | 'form'>('validate')
  const [loading, setLoading] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  
  // Dados do jogador validado
  const [playerData, setPlayerData] = useState<any>(null)
  const [avatarInfo, setAvatarInfo] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    email: '',
    nome: '',
    cpf: '',
    telefone: '',
    gameId: '',
    gameUsername: '',
  })

  const [pixData, setPixData] = useState<any>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired'>('pending')
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('checkout_form_data')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setFormData(parsed.formData || formData)
        setPlayerData(parsed.playerData || null)
        setAvatarInfo(parsed.avatarInfo || null)
        if (parsed.playerData) {
          setStep('form')
        }
      } catch (e) {
        console.error('Erro ao carregar dados salvos:', e)
      }
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    if (formData.gameId || formData.email) {
      localStorage.setItem('checkout_form_data', JSON.stringify({
        formData,
        playerData,
        avatarInfo
      }))
    }
  }, [formData, playerData, avatarInfo])

  // Buscar informações do avatar
  const fetchAvatarInfo = async (headPicId: number) => {
    try {
      const response = await fetch(`/api/get-avatar?headPicId=${headPicId}`)
      if (response.ok) {
        const avatarData = await response.json()
        setAvatarInfo(avatarData)
        return avatarData
      } else {
        return null
      }
    } catch (error) {
      return null
    }
  }

  // Validar ID do Free Fire
  const handleValidateFreeFire = async () => {
    if (!formData.gameId) {
      setAlertMessage('Digite o ID do Free Fire')
      setShowAlertModal(true)
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/game-data?uid=${formData.gameId}`)
      const result = await response.json()

      if (result.success && result.data) {
        setPlayerData(result.data)
        
        // Buscar avatar se disponível
        if (result.data.basicInfo?.headPic) {
          await fetchAvatarInfo(result.data.basicInfo.headPic)
        }
        
        setStep('form')
      } else {
        setAlertMessage(result.error || 'ID não encontrado')
        setShowAlertModal(true)
      }
    } catch (err) {
      setAlertMessage('Erro ao validar ID')
      setShowAlertModal(true)
    } finally {
      setLoading(false)
    }
  }

  // Carregar pagamento pendente do localStorage
  useEffect(() => {
    const savedPayment = localStorage.getItem('pendingPayment')
    if (savedPayment) {
      try {
        const payment = JSON.parse(savedPayment)
        // Verificar se não expirou (30 minutos)
        const expiresAt = new Date(payment.expiresAt).getTime()
        if (expiresAt > Date.now()) {
          setPixData(payment)
          setStep('form')
          startPolling(payment.transactionId)
        } else {
          localStorage.removeItem('pendingPayment')
        }
      } catch (e) {
        console.error('Erro ao carregar pagamento:', e)
        localStorage.removeItem('pendingPayment')
      }
    }
  }, [])

  // Polling para verificar status do pagamento
  const startPolling = (transactionId: string) => {
    // Limpar polling anterior
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    const checkPayment = async () => {
      try {
        const response = await fetch(`/api/check-payment?transactionId=${transactionId}`)
        const result = await response.json()

        if (result.success && result.data.status === 'paid') {
          setPaymentStatus('paid')
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current)
          }
          localStorage.removeItem('pendingPayment')
          
          // Enviar conversões
          await handlePurchaseComplete(transactionId)
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error)
      }
    }

    // Verificar a cada 5 segundos
    const interval = setInterval(checkPayment, 5000)
    pollingIntervalRef.current = interval

    // Verificar imediatamente
    checkPayment()
  }

  // Parar polling quando sair da página
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  const handlePurchaseComplete = async (transactionId: string) => {
    // TODO: Implementar conversões Google Ads e Facebook
    console.log('Pagamento confirmado:', transactionId)
    
    // Limpar carrinho
    cart.items.forEach(item => cart.removeItem(item.id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessingPayment(true)

    try {
      // Criar pagamento PIX usando a API do GhostPay
      const response = await fetch('/api/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          cpf: formData.cpf,
          telefone: formData.telefone,
          items: cart.items,
          totalPrice: cart.totalPrice,
          gameId: formData.gameId,
          playerNickname: playerData?.basicInfo?.nickname
        })
      })

      const result = await response.json()

      if (result.success) {
        setPixData(result.data)
        
        // Salvar no localStorage
        localStorage.setItem('pendingPayment', JSON.stringify(result.data))
        
        // TODO: Enviar conversão waiting_payment para UTMify
        
        // Iniciar polling
        startPolling(result.data.transactionId)
      } else {
        setAlertMessage(result.error || 'Erro ao gerar PIX. Tente novamente.')
        setShowAlertModal(true)
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      setAlertMessage('Erro ao processar pagamento. Verifique sua conexão e tente novamente.')
      setShowAlertModal(true)
    } finally {
      setProcessingPayment(false)
    }
  }

  // Validação de CPF
  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]/g, '')
    if (cpf.length !== 11) return false
    if (/^(\d)\1{10}$/.test(cpf)) return false
    
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cpf.charAt(9))) return false
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    digit = 11 - (sum % 11)
    if (digit >= 10) digit = 0
    if (digit !== parseInt(cpf.charAt(10))) return false
    
    return true
  }

  // Formatar CPF
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  // Formatar Telefone
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  // Para Free Fire, mostrar validação primeiro
  if (category === 'freefire' && step === 'validate') {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Voltar</span>
        </button>

        {/* Seção de Validação - Design Futurístico */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100">
          {/* Efeito de brilho orgânico */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-100/30 to-transparent rounded-full blur-3xl" />
          
          <div className="relative p-8">
            {/* Header da seção */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-2xl ${colors.bg} flex items-center justify-center`}>
                <ShoppingBag className={`w-6 h-6 ${colors.text}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Validar Conta</h2>
                <p className="text-sm text-gray-500">Confirme sua identidade no jogo</p>
              </div>
            </div>

            {/* Input futurístico */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                ID do Free Fire *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.gameId}
                  onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                  placeholder="Digite seu ID"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all outline-none text-lg font-medium disabled:opacity-50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full" />
                Encontre no jogo: Perfil → Configurações
              </p>
            </div>

            {/* Botão futurístico */}
            <button
              type="button"
              onClick={handleValidateFreeFire}
              disabled={loading || !formData.gameId}
              className={`mt-6 w-full ${colors.primary} text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group`}
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Validando...
                  </span>
                ) : (
                  'Validar e Continuar'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Jogador Validado (Free Fire) */}
      {category === 'freefire' && playerData && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-3">
            {avatarInfo?.imageUrl && (
              <img
                src={avatarInfo.imageUrl}
                alt="Avatar"
                className="w-12 h-12 rounded-lg border-2 border-orange-500"
              />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-600">Conta Validada</p>
              <p className="font-bold text-gray-900">{playerData.basicInfo?.nickname || 'Jogador'}</p>
              <p className="text-xs text-gray-500">ID: {formData.gameId}</p>
            </div>
          </div>
        </div>
      )}

      {/* Resumo do Pedido */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-3">Resumo do Pedido</h3>
        <div className="space-y-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.name}</span>
              <span className="font-semibold text-gray-900">
                R$ {item.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className={colors.text}>
                R$ {cart.totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário de Dados - Esconder quando PIX gerado */}
      {!pixData && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Voltar</span>
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dados para Pagamento
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                E-mail *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CPF *
              </label>
              <input
                type="text"
                required
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.cpf && !validateCPF(formData.cpf) && (
                <p className="text-xs text-red-500 mt-1">CPF inválido</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                type="text"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Botão Finalizar ou QR Code PIX */}
            {!pixData ? (
              <button
                type="submit"
                disabled={!!(category === 'freefire' && formData.cpf && !validateCPF(formData.cpf)) || processingPayment}
                className={`w-full ${colors.primary} text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processingPayment ? 'Gerando PIX...' : `Gerar PIX - R$ ${cart.totalPrice.toFixed(2).replace('.', ',')}`}
              </button>
            ) : null}
          </form>
        </div>
      )}

      {/* QR Code PIX */}
      {pixData && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          {paymentStatus === 'paid' ? (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h3>
              <p className="text-green-600">Seu pedido está sendo processado</p>
              <p className="text-sm text-gray-600 mt-2">ID: {pixData.transactionId}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* QR Code */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Escaneie o QR Code
                </h3>
                <div className="flex justify-center mb-4">
                  <img
                    src={`data:image/png;base64,${pixData.qrCode}`}
                    alt="QR Code PIX"
                    className="w-72 h-72 rounded-2xl shadow-xl border-4 border-white"
                  />
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-6">
                  R$ {pixData.amount.toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* Copiar Código */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <p className="text-sm font-semibold text-gray-700 text-center">
                  Ou copie o código PIX Copia e Cola:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pixData.qrCodeText}
                    readOnly
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm bg-white font-mono"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(pixData.qrCodeText)
                      setAlertMessage('Código PIX copiado com sucesso! ✓')
                      setShowAlertModal(true)
                    }}
                    className={`${colors.primary} text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform`}
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Aguardando Pagamento */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-200 border-t-yellow-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-yellow-900 mb-1">
                      Aguardando pagamento...
                    </p>
                    <p className="text-sm text-yellow-700">
                      Fique nesta página! O pagamento será confirmado automaticamente em alguns segundos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de Alerta */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
              Atenção - Verifique os Dados
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {alertMessage}
            </p>
            <button
              onClick={() => setShowAlertModal(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Entendi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
