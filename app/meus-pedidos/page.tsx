"use client"

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Search, Mail, Lock, CheckCircle, Clock, XCircle, Package, Copy, ExternalLink, Settings } from 'lucide-react'

interface Order {
  transactionId: string
  status: 'pending' | 'paid' | 'delivered' | 'expired'
  amount: number
  product: string
  createdAt: string
  code?: string
}

export default function MeusPedidosPage() {
  const [email, setEmail] = useState('')
  const [accessCode, setAccessCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')
  const [showNewCodeModal, setShowNewCodeModal] = useState(false)

  const handleSearch = async () => {
    if (!email) {
      setError('Por favor, digite seu e-mail')
      return
    }

    setLoading(true)
    setError('')
    
    // Mostrar mensagem de "em construção"
    setTimeout(() => {
      setLoading(false)
      // Não define orders, mantém vazio para mostrar o estado de construção
    }, 800)
  }

  const handleRequestNewCode = () => {
    setShowNewCodeModal(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Você pode adicionar um toast aqui
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5" />,
          text: 'Aguardando Pagamento',
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10'
        }
      case 'paid':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          text: 'Pago - Processando',
          color: 'text-green-400',
          bg: 'bg-green-500/10'
        }
      case 'delivered':
        return {
          icon: <Package className="w-5 h-5" />,
          text: 'Entregue',
          color: 'text-blue-400',
          bg: 'bg-blue-500/10'
        }
      case 'expired':
        return {
          icon: <XCircle className="w-5 h-5" />,
          text: 'Expirado',
          color: 'text-red-400',
          bg: 'bg-red-500/10'
        }
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          text: 'Processando',
          color: 'text-gray-400',
          bg: 'bg-gray-500/10'
        }
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
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6 shadow-lg shadow-green-500/50">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meus Pedidos
            </h1>
            <p className="text-lg text-white/70">
              Gerencie e acompanhe o status dos seus pedidos
            </p>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <a href="/" className="hover:text-white/80 transition-colors">Início</a>
            <span>›</span>
            <span className="text-white/80">Meus Pedidos</span>
          </div>

          {/* Search Card */}
          <div className="bg-[#1B1B25] rounded-2xl p-8 border border-white/10 shadow-2xl mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Buscar Pedidos</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Email Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <Mail className="w-4 h-4 text-green-400" />
                  EMAIL *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 bg-[#13141F] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-green-500/50 transition-colors"
                />
              </div>

              {/* Access Code Input */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  CÓDIGO DE ACESSO
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Cole aqui o código recebido por email"
                  className="w-full px-4 py-3 bg-[#13141F] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <p className="text-xs text-white/50 mt-2">
                  Recebido por email após fazer um pedido ou solicitar acesso
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Buscar Pedidos
                  </>
                )}
              </button>

              <button
                onClick={handleRequestNewCode}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-[#13141F] hover:bg-[#1a1b28] border border-white/10 hover:border-cyan-500/50 text-white font-semibold rounded-xl transition-all"
              >
                <Mail className="w-5 h-5" />
                Solicitar Novo Código
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-sm text-white/80">
                  <p className="font-semibold text-white mb-2">Como obter o código de acesso:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span><strong>Finalize uma compra</strong> - você receberá o código automaticamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span><strong>Clique em "Solicitar Novo Código"</strong> - será enviado para seu email</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">•</span>
                      <span><strong>Código válido por 2 horas</strong> - solicite um novo se expirar</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {orders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">Seus Pedidos</h3>
              
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                
                return (
                  <div key={order.transactionId} className="bg-[#1B1B25] rounded-xl p-6 border border-white/10 hover:border-green-500/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${statusInfo.bg} rounded-xl flex items-center justify-center ${statusInfo.color}`}>
                          {statusInfo.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white">{order.product}</h4>
                          <p className="text-sm text-white/50">ID: {order.transactionId}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">R$ {(order.amount / 100).toFixed(2)}</p>
                          <p className={`text-sm font-semibold ${statusInfo.color}`}>{statusInfo.text}</p>
                        </div>
                      </div>
                    </div>

                    {/* Code Display */}
                    {order.code && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-xs text-white/70 mb-1">Seu código de resgate:</p>
                            <p className="text-lg font-mono font-bold text-green-400">{order.code}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyToClipboard(order.code!)}
                              className="p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                              title="Copiar código"
                            >
                              <Copy className="w-5 h-5 text-green-400" />
                            </button>
                            <a
                              href="https://freefire.garena.com.br/resgate"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors"
                              title="Resgatar no site oficial"
                            >
                              <ExternalLink className="w-5 h-5 text-blue-400" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Pending Payment */}
                    {order.status === 'pending' && (
                      <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-sm text-yellow-400">
                          ⏳ Aguardando confirmação do pagamento. Você receberá o código assim que o pagamento for confirmado.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Em Construção State */}
          {!loading && orders.length === 0 && email && (
            <div className="bg-[#1B1B25] rounded-2xl p-12 border border-white/10 shadow-2xl">
              <div className="text-center max-w-2xl mx-auto">
                {/* Engrenagem Animada */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Settings className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>

                {/* Título */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  🚧 Funcionalidade em Desenvolvimento
                </h3>

                {/* Descrição */}
                <div className="space-y-4 text-white/70">
                  <p className="text-lg">
                    Estamos trabalhando para trazer esta funcionalidade em breve!
                  </p>
                  
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mt-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white mb-2">
                          ✅ Seus códigos estão sendo enviados automaticamente!
                        </p>
                        <p className="text-sm text-white/80">
                          Após a confirmação do pagamento, você receberá seu código de resgate diretamente no e-mail cadastrado. 
                          O envio é <strong className="text-green-400">instantâneo</strong> e ocorre em até <strong className="text-green-400">5 minutos</strong>.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Mail className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white mb-2">
                          📧 Verifique sua caixa de entrada
                        </p>
                        <p className="text-sm text-white/80">
                          Não se esqueça de verificar a pasta de <strong>spam/lixo eletrônico</strong> caso não encontre o e-mail na caixa de entrada principal.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-sm text-white/50">
                      Precisa de ajuda? Entre em contato com nosso suporte através do botão "Contato" no menu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal Solicitar Novo Código */}
      {showNewCodeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1B1B25] rounded-2xl shadow-2xl max-w-md w-full border border-white/10 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Solicitar Novo Código</h3>
              <p className="text-white/70 mb-6">
                Digite seu e-mail para receber um novo código de acesso. O código será enviado em alguns segundos.
              </p>
              
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 bg-[#13141F] border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-green-500/50 transition-colors mb-6"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewCodeModal(false)}
                  className="flex-1 px-6 py-3 bg-[#13141F] hover:bg-[#1a1b28] border border-white/10 text-white font-semibold rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    // Implementar envio de código
                    setShowNewCodeModal(false)
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/50"
                >
                  Enviar Código
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
