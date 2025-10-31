'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface UserVerificationProps {
  onVerificationComplete: () => void
}

export default function UserVerification({ onVerificationComplete }: UserVerificationProps) {
  const [step, setStep] = useState<'initial' | 'terms' | 'verification' | 'loading'>('initial')
  const [playerId, setPlayerId] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTutorial, setShowTutorial] = useState(false)

  const handleInitialCheck = () => {
    setStep('terms')
  }

  const handleAcceptTerms = () => {
    if (!accepted) {
      setError('Você precisa aceitar os termos para continuar')
      return
    }
    setStep('verification')
    setError('')
  }

  const handleVerification = async () => {
    if (!playerId.trim()) {
      setError('Por favor, insira seu ID de jogador')
      return
    }

    // Validação básica de formato (apenas números)
    if (!/^\d+$/.test(playerId.trim())) {
      setError('ID inválido! Digite apenas números')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // VERIFICAÇÃO REAL - Validar se é um ID de jogador válido
      const response = await validatePlayerId(playerId.trim())
      
      if (!response.valid) {
        setError(response.message || 'ID de jogador inválido! Verifique e tente novamente.')
        setIsLoading(false)
        return
      }
      
      // Dados do jogo retornados pela API (mesmo formato do login normal)
      const gameBasicInfo = response.gameInfo.basicInfo
      
      // Salvar dados exatamente como no sistema de login normal
      localStorage.setItem('userData', JSON.stringify(gameBasicInfo))
      
      // Dados de autenticação completos (integração com sistema existente)
      const authUserData = {
        name: gameBasicInfo.nickname,
        email: `player${playerId.trim()}@game.local`,
        phone: '+55000000000',
        loginAt: new Date().toISOString(),
        playerId: playerId.trim(),
        verified: true,
        verifiedAt: Date.now(),
        gameData: response.gameInfo
      }
      
      // Salvar verificação
      localStorage.setItem('userVerified', 'true')
      localStorage.setItem('userPlayerId', playerId.trim())
      localStorage.setItem('verificationData', JSON.stringify({
        playerId: playerId.trim(),
        verified: true,
        verifiedAt: Date.now(),
        gameInfo: response.gameInfo
      }))
      localStorage.setItem('verificationExpiry', (Date.now() + (24 * 60 * 60 * 1000)).toString()) // 24h
      
      // Salvar autenticação (integração com sistema existente)
      localStorage.setItem('user_authenticated', 'true')
      localStorage.setItem('user_data', JSON.stringify(authUserData))
      localStorage.setItem('terms_accepted', 'true')
      localStorage.setItem('terms_accepted_at', Date.now().toString())
      
      setStep('loading')
      
      // Finalizar verificação após delay
      setTimeout(() => {
        onVerificationComplete()
      }, 1500)
      
    } catch (err) {
      setError('Erro na verificação. Verifique sua conexão e tente novamente.')
      setIsLoading(false)
    }
  }

  // Função para validar ID do jogador (API REAL)
  const validatePlayerId = async (playerId: string) => {
    try {
      
      // Usar a mesma API que vocês já usam no sistema de login
      const response = await fetch(`/api/game-data/?uid=${playerId}`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'accept-language': 'pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin'
        }
      })


      // Se status não for 200, usuário não é válido (mesma lógica do login)
      if (response.status !== 200) {
        
        // Mensagens específicas baseadas no status
        let message = 'ID de jogador inválido! Verifique e tente novamente.'
        
        if (response.status === 404) {
          message = 'ID não encontrado! Verifique se digitou corretamente.'
        } else if (response.status === 403) {
          message = 'Acesso negado! Este ID não pode ser usado.'
        } else if (response.status === 429) {
          message = 'Muitas tentativas! Aguarde um momento e tente novamente.'
        } else if (response.status >= 500) {
          message = 'Erro no servidor! Tente novamente em alguns minutos.'
        }

        return {
          valid: false,
          message: message
        }
      }

      // Se chegou aqui, status é 200 - verificar se dados são válidos
      const gameData = await response.json()

      // Verificar se o usuário tem nickname "LOGADO" (não é válido)
      if (gameData?.success && gameData?.data?.basicInfo?.nickname === 'LOGADO') {
        return {
          valid: false,
          message: 'ID inválido! Este não é um usuário real. Digite seu ID verdadeiro do jogo.'
        }
      }

      // Verificar se os dados são válidos e tem nickname real
      if (!gameData?.success || !gameData?.data?.basicInfo?.nickname) {
        return {
          valid: false,
          message: 'ID não encontrado ou dados inválidos! Verifique seu ID do jogo.'
        }
      }


      return {
        valid: true,
        gameInfo: gameData.data || {
          accountAge: 'Verificado',
          lastActive: 'Recente'
        }
      }

    } catch (error) {
      
      // Tratar erros de rede/conexão
      return {
        valid: false,
        message: 'Erro de conexão! Verifique sua internet e tente novamente.'
      }
    }
  }

  if (step === 'loading') {
    return (
      <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
        {/* Raios de fundo animados */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"
              style={{
                width: `${Math.random() * 60 + 40}%`,
                left: `${Math.random() * 50}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `lightning ${Math.random() * 2 + 1}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <div className="text-center">
            {/* Círculo elétrico pulsante */}
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-cyan-400 animate-ping absolute"></div>
              <div className="w-24 h-24 rounded-full border-4 border-purple-500 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl">⚡</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
              Usuário Verificado!
            </h2>
            <p className="text-cyan-300">Entrando no site como usuário logado...</p>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes lightning {
            0%, 100% { opacity: 0; transform: scaleX(0); }
            50% { opacity: 1; transform: scaleX(1); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black overflow-hidden">
      {/* Grid elétrico de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-blue-950 to-black"></div>
      
      {/* Raios elétricos animados */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{
              width: `${Math.random() * 80 + 20}%`,
              height: '2px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 180 - 90}deg)`,
              opacity: 0.6,
              animation: `lightning-strike ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
              boxShadow: '0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4)'
            }}
          />
        ))}
      </div>

      {/* Partículas elétricas flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${['#06b6d4', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 3)]} 0%, transparent 70%)`,
              animation: `electric-float ${Math.random() * 8 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`
            }}
          />
        ))}
      </div>

      {/* Pulsos de energia do centro */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse-slow"></div>
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 animate-ping-slow"></div>
      </div>

      <style jsx>{`
        @keyframes lightning-strike {
          0%, 100% { opacity: 0; transform: scaleX(0) rotate(var(--rotation)); }
          10% { opacity: 1; transform: scaleX(1) rotate(var(--rotation)); }
          20% { opacity: 0; transform: scaleX(0.8) rotate(var(--rotation)); }
          30% { opacity: 0.8; transform: scaleX(1) rotate(var(--rotation)); }
          40%, 100% { opacity: 0; transform: scaleX(0) rotate(var(--rotation)); }
        }
        @keyframes electric-float {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
            opacity: 0.8;
          }
          25% { 
            transform: translate(30px, -40px) scale(1.2); 
            opacity: 1;
          }
          50% { 
            transform: translate(-20px, -80px) scale(0.8); 
            opacity: 0.6;
          }
          75% { 
            transform: translate(40px, -40px) scale(1.1); 
            opacity: 0.9;
          }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0.3; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          
          {/* Tela Inicial */}
          {step === 'initial' && (
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-8 text-center shadow-2xl shadow-cyan-500/10 animate-fade-in-up">
              {/* Ícone profissional de raio */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="relative bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-8 rounded-full border border-cyan-400/40">
                    <svg 
                      className="w-16 h-16 text-cyan-400" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  Verificação de Segurança
                </h1>
                <p className="text-gray-300 text-sm">
                  Para sua proteção, precisamos verificar que você é um usuário real
                </p>
              </div>
              
              <button
                onClick={handleInitialCheck}
                className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-cyan-500/50 hover:scale-105 border border-cyan-400/20"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                  </svg>
                  Iniciar Verificação
                </span>
              </button>
            </div>
          )}

          {/* Tela de Termos */}
          {step === 'terms' && (
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-purple-400/30 p-8 shadow-2xl shadow-purple-500/10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Termos de Uso e Política de Privacidade</h2>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-gray-700 leading-relaxed border">
                  
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                    <p className="text-red-700 font-semibold">
                      🎁 <strong>EXCLUSIVIDADE:</strong> Deseja ganhar seu desconto especial? 
                      Aceite os termos e tenha acesso a ofertas exclusivas!
                    </p>
                  </div>

                  <h4 className="font-bold text-gray-800 mb-2">📋 TERMOS DE USO</h4>
                  <p className="mb-3">
                    <strong>1. Aceitação dos Termos:</strong> Ao aceitar estes termos, você concorda com todas as condições de uso deste site oficial de recargas e nossa política de privacidade. Este acordo é válido para todas as transações realizadas.
                  </p>
                  <p className="mb-3">
                    <strong>2. Usuários Verificados:</strong> Este site é exclusivo para jogadores reais e verificados. É terminantemente proibido o uso de bots, sistemas automatizados ou contas falsas. Apenas IDs válidos de jogadores ativos são aceitos.
                  </p>
                  <p className="mb-3">
                    <strong>3. Ofertas Exclusivas:</strong> Usuários verificados têm acesso a descontos especiais, promoções exclusivas e bônus em diamantes. As ofertas são limitadas e sujeitas a disponibilidade.
                  </p>
                  <p className="mb-3">
                    <strong>4. Transações Seguras:</strong> Garantimos 100% de segurança em todas as transações através de sistemas criptografados de última geração. Seus dados financeiros são protegidos pelos mais altos padrões de segurança.
                  </p>

                  <h4 className="font-bold text-gray-800 mb-2 mt-4">🔒 POLÍTICA DE PRIVACIDADE</h4>
                  <p className="mb-3">
                    <strong>5. Coleta de Dados:</strong> Coletamos apenas informações necessárias para processar suas recargas: ID do jogador, dados de pagamento e informações de contato. Não compartilhamos dados com terceiros.
                  </p>
                  <p className="mb-3">
                    <strong>6. Uso das Informações:</strong> Seus dados são utilizados exclusivamente para: processar recargas, enviar confirmações, oferecer suporte técnico e disponibilizar ofertas personalizadas.
                  </p>
                  <p className="mb-3">
                    <strong>7. Cookies e Rastreamento:</strong> Utilizamos cookies para melhorar sua experiência, lembrar preferências e analisar o tráfego do site de forma anônima.
                  </p>
                  <p className="mb-3">
                    <strong>8. Direitos do Usuário:</strong> Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento através do nosso suporte.
                  </p>
                  <p className="mb-3">
                    <strong>9. Suporte 24h:</strong> Nossa equipe está disponível 24 horas para esclarecer dúvidas sobre privacidade, termos de uso ou questões técnicas.
                  </p>
                  <p>
                    <strong>10. Atualizações:</strong> Estes termos podem ser atualizados periodicamente. Usuários serão notificados sobre mudanças importantes por email ou no site.
                  </p>

                  <div className="bg-green-50 border-l-4 border-green-500 p-3 mt-4">
                    <p className="text-green-700 text-xs">
                      ✅ <strong>Site Oficial e Confiável:</strong> Somos um centro de recarga oficial com milhares de usuários satisfeitos. 
                      Transações rápidas, seguras e com garantia de entrega.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-start text-sm text-cyan-100">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mr-3 w-5 h-5 text-cyan-500 rounded focus:ring-cyan-500 mt-0.5 bg-gray-800 border-cyan-400"
                  />
                  <span>
                    Eu li e aceito os{' '}
                    <span className="text-cyan-400 underline font-bold">
                      Termos de Uso
                    </span>
                    {' '}e{' '}
                    <span className="text-cyan-400 underline font-bold">
                      Política de Privacidade
                    </span>, 
                    e desejo ter acesso às <strong className="text-pink-400">ofertas exclusivas</strong> para usuários verificados
                  </span>
                </label>
              </div>

              {error && (
                <div className="mb-4 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('initial')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-cyan-300 font-medium py-3 px-4 rounded-lg transition-all duration-200 border border-cyan-400/30 hover:border-cyan-400/50"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleAcceptTerms}
                  disabled={!accepted}
                  className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all duration-300 ${
                    accepted
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white shadow-lg shadow-purple-500/50 hover:scale-105 border border-purple-400/30'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                  }`}
                >
                  Continuar ⚡
                </button>
              </div>
            </div>
          )}

          {/* Tela de Verificação */}
          {step === 'verification' && (
            <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl border border-cyan-400/30 p-8 shadow-2xl shadow-cyan-500/10">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">⚡ Verificação de Usuário</h2>
                <p className="text-cyan-200 text-sm mb-4">
                  Insira seu ID de jogador para confirmar que você é um usuário real
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-cyan-300">
                      ⚡ ID do Jogador * (apenas números)
                    </label>
                    <input
                      type="text"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Digite seu ID do jogo (ex: 5435431)"
                      className="w-full px-4 py-3 bg-gray-800 border-2 border-cyan-400/50 rounded-lg text-cyan-100 placeholder-cyan-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      disabled={isLoading}
                      maxLength={15}
                    />
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs text-red-700">
                      ⚠️ <strong>Importante:</strong> Digite seu ID real do jogo! IDs falsos ou inválidos não passarão na verificação.
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Encontre seu ID em: Configurações → Informações Básicas → ID do Jogador
                    </p>
                    <button
                      onClick={() => setShowTutorial(true)}
                      className="mt-2 text-xs text-red-600 hover:text-red-700 underline"
                    >
                      📖 Ver tutorial completo de como encontrar seu ID
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('terms')}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 border"
                >
                  Voltar
                </button>
                <button
                  onClick={handleVerification}
                  disabled={isLoading || !playerId.trim()}
                  className={`flex-1 font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center ${
                    isLoading || !playerId.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Verificando...
                    </>
                  ) : (
                    'Verificar'
                  )}
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Modal Tutorial */}
      {showTutorial && (
        <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Como encontrar seu ID - Free Fire</h3>
                <button 
                  onClick={() => setShowTutorial(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-700 mb-3">Veja onde encontrar seu ID no Free Fire:</p>
                  <img 
                    src="/images/tutorialff.jpg" 
                    alt="Tutorial Free Fire" 
                    className="w-full rounded-lg border border-gray-200"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      const fallback = target.nextElementSibling as HTMLElement;
                      target.style.display = 'none';
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <div className="hidden bg-gray-100 rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-gray-500 text-sm">
                      📱 Tutorial em imagem não disponível<br/>
                      Siga os passos: Menu → Configurações → Informações Básicas → ID do Jogador
                    </p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowTutorial(false)}
                className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
