'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface UserVerificationProps {
  onVerificationComplete: () => void
}

export default function UserVerification({ onVerificationComplete }: UserVerificationProps) {
  const [step, setStep] = useState<'initial' | 'quiz' | 'result' | 'reward' | 'terms' | 'verification' | 'loading'>('initial')
  const [playerId, setPlayerId] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTutorial, setShowTutorial] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  // Função para tocar som ao clicar
  const playClickSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGe77OeeSwwPUKXh8LdjHAU7k9jyz3ksBS1+zPLaizsKGGS56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHgU7k9jy0HksBSx+zPDajDsKF2O56+mjUBELTKXi8bllHg==')
    audio.volume = 0.3
    audio.play().catch(() => {})
  }
  
  // Estados do Quiz Arena de Fogo
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<number[]>([])
  const [quizResult, setQuizResult] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState(15)

  // Perguntas do Quiz
  const quizQuestions = [
    {
      question: "🔥 Qual é o seu estilo de jogo no Free Fire?",
      options: [
        { text: "Líder de Squad - Comando meu time", points: { lider: 3, estrategista: 1, atirador: 0, rusher: 0 } },
        { text: "Sniper Silencioso - Elimino de longe", points: { atirador: 3, estrategista: 1, lider: 0, rusher: 0 } },
        { text: "Rusher Insano - Vou pra cima!", points: { rusher: 3, lider: 1, atirador: 0, estrategista: 0 } },
        { text: "Suporte Tático - Ajudo meu time", points: { estrategista: 3, lider: 1, atirador: 0, rusher: 0 } }
      ]
    },
    {
      question: "💥 Como você reage em uma situação 1v4?",
      options: [
        { text: "Planejo cada movimento com calma", points: { estrategista: 3, atirador: 1, lider: 0, rusher: 0 } },
        { text: "Parto pra cima sem medo!", points: { rusher: 3, lider: 1, atirador: 0, estrategista: 0 } },
        { text: "Uso granadas e táticas", points: { estrategista: 2, atirador: 2, lider: 0, rusher: 0 } },
        { text: "Chamo reforços e coordeno", points: { lider: 3, estrategista: 1, atirador: 0, rusher: 0 } }
      ]
    },
    {
      question: "🎯 Qual arma você escolhe no início da partida?",
      options: [
        { text: "AWM - Precisão mortal", points: { atirador: 3, estrategista: 1, lider: 0, rusher: 0 } },
        { text: "MP40 - Velocidade e agilidade", points: { rusher: 3, lider: 0, atirador: 0, estrategista: 0 } },
        { text: "M1014 - Destruição garantida", points: { rusher: 2, lider: 1, atirador: 0, estrategista: 0 } },
        { text: "SCAR - Versatilidade total", points: { estrategista: 2, lider: 2, atirador: 0, rusher: 0 } }
      ]
    },
    {
      question: "🏆 O que te motiva a jogar Free Fire?",
      options: [
        { text: "Ser o Mestre", points: { lider: 3, atirador: 1, estrategista: 0, rusher: 0 } },
        { text: "Adrenalina pura", points: { rusher: 3, lider: 0, atirador: 0, estrategista: 0 } },
        { text: "Estratégia e inteligência", points: { estrategista: 3, lider: 0, atirador: 0, rusher: 0 } },
        { text: "Jogar com os amigos", points: { lider: 2, estrategista: 1, atirador: 0, rusher: 0 } }
      ]
    },
    {
      question: "🔥 Qual personagem te representa?",
      options: [
        { text: "Chrono - Controle do tempo", points: { estrategista: 3, lider: 0, atirador: 0, rusher: 0 } },
        { text: "Wukong - Agilidade ninja", points: { rusher: 3, lider: 0, atirador: 0, estrategista: 0 } },
        { text: "DJ Alok - Suporte e cura", points: { lider: 3, estrategista: 0, atirador: 0, rusher: 0 } },
        { text: "Moco - Rastreamento preciso", points: { atirador: 3, lider: 0, estrategista: 0, rusher: 0 } }
      ]
    }
  ]

  // Perfis de resultado
  const quizProfiles: Record<string, { title: string; description: string; emoji: string }> = {
    lider: {
      title: "🔥 O LÍDER DA FOGUEIRA",
      description: "Você nasceu para comandar! Seu squad te segue até o fim. Estratégia e liderança são suas armas.",
      emoji: "👑"
    },
    atirador: {
      title: "🎯 O SNIPER LENDÁRIO",
      description: "Precisão cirúrgica! Você elimina antes que vejam de onde veio. Cada tiro, uma baixa garantida.",
      emoji: "🎯"
    },
    rusher: {
      title: "💥 O RUSHER INSANO",
      description: "Adrenalina pura! Você não conhece o medo. Vai de frente e deixa o caos para trás.",
      emoji: "⚡"
    },
    estrategista: {
      title: "🧠 O MESTRE ESTRATEGISTA",
      description: "Você pensa 10 passos à frente. Cada movimento é calculado. A vitória é questão de tempo.",
      emoji: "🧠"
    }
  }

  const handleInitialCheck = () => {
    setStep('verification')
  }

  const handleAcceptTerms = () => {
    if (!accepted) {
      setError('Você precisa aceitar os termos para continuar')
      return
    }
    setStep('verification')
    setError('')
  }

  // Funções do Quiz
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const handleQuizAnswer = (answerIndex: number) => {
    const newAnswers = [...quizAnswers, answerIndex]
    setQuizAnswers(newAnswers)
    
    if (currentQuestion < quizQuestions.length - 1) {
      // Mostrar transição
      setIsTransitioning(true)
      
      // Aguardar animação antes de trocar pergunta
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1)
        setTimeLeft(15)
        setIsTransitioning(false)
      }, 400)
    } else {
      // Calcular resultado
      calculateQuizResult(newAnswers)
    }
  }

  const calculateQuizResult = (answers: number[]) => {
    const scores: Record<string, number> = {
      lider: 0,
      atirador: 0,
      rusher: 0,
      estrategista: 0
    }

    answers.forEach((answerIndex, questionIndex) => {
      const selectedOption = quizQuestions[questionIndex].options[answerIndex]
      Object.entries(selectedOption.points).forEach(([profile, points]) => {
        scores[profile] = (scores[profile] || 0) + (points as number)
      })
    })

    // Encontrar perfil com maior pontuação
    const winnerProfile = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    setQuizResult(winnerProfile)
    setStep('result')
  }

  const handleSkipQuiz = () => {
    setStep('verification')
  }

  const handleAcceptReward = () => {
    // Salvar no localStorage que o quiz foi completado
    localStorage.setItem('quizCompleted', 'true')
    localStorage.setItem('quizCompletedAt', new Date().toISOString())
    
    // Ir para o modal de verificação de ID (não redireciona ainda)
    setStep('verification')
  }

  // Verificar se o quiz já foi completado
  useEffect(() => {
    const quizCompleted = localStorage.getItem('quizCompleted')
    if (quizCompleted === 'true' && step === 'initial') {
      setStep('verification')
    }
  }, [step])

  // Timer do quiz
  useEffect(() => {
    if (step === 'quiz' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, timeLeft])

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
      
      // Salvar cookies
      const cookieOptions = `path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`
      document.cookie = `quiz_completed=true; ${cookieOptions}`
      document.cookie = `referer_verified=true; ${cookieOptions}`
      
      console.log('🍪 [VERIFICAÇÃO] Cookies definidos')
      console.log('   - quiz_completed=true')
      console.log('   - referer_verified=true')
      
      setStep('loading')
      
      // Fechar modal após 2 segundos e liberar central de recargas
      setTimeout(() => {
        console.log('✅ [VERIFICAÇÃO] Liberando acesso à central de recargas')
        onVerificationComplete() // Fecha o modal e libera a página
      }, 2000)
      
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
      <div className="fixed inset-0 z-[9999] overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1a0a1f 0%, #2a0f2f 50%, #1a0a1f 100%)'
      }}>
        {/* Efeitos de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Círculos decorativos */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-violet-500/20 to-purple-600/10 rounded-full blur-3xl" />
        </div>
        
        <div className="flex items-center justify-center min-h-screen p-4 relative z-10">
          <div className="text-center max-w-md">
            {/* Logo/Ícone */}
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-violet-500 flex items-center justify-center shadow-2xl border-4 border-white/20">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              {/* Spinner ao redor */}
              <div className="absolute inset-0 border-4 border-transparent border-t-violet-400 rounded-full animate-spin"></div>
            </div>

            {/* Mensagem Principal */}
            <div className="bg-purple-900/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-6">
              <h2 className="text-2xl font-bold mb-3 text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                ✅ Verificação Concluída!
              </h2>
              <p className="text-purple-100 text-base mb-2">
                Seu desconto foi ativado com sucesso
              </p>
              <div className="flex items-center justify-center gap-2 text-violet-300 font-bold">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-300 border-t-transparent"></div>
                <span>Redirecionando...</span>
              </div>
            </div>

            {/* Benefícios */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Desconto de 70% ativado</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Conta verificada</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Acesso liberado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1a0a1f 0%, #2a0f2f 50%, #1a0a1f 100%)'
    }}>
      {/* Efeitos de fundo - Roxo/Púrpura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Efeito de luz suave animado */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #a855f7 0%, transparent 70%)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
        
        {/* Círculos decorativos roxo/púrpura */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-purple-600/20 to-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-tr from-violet-500/20 to-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Pulso de luz suave do centro */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/10 via-violet-500/10 to-purple-600/10 animate-pulse-slow"></div>
      </div>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        }
        @keyframes float-fire {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-30px) rotate(180deg); opacity: 0.6; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
        .cursor-fire,
        .cursor-fire * {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23FF6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>') 4 4, auto !important;
        }
        .cursor-fire button:hover,
        .cursor-fire a:hover {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="%23FF3C00" stroke="%23FF6B00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>') 4 4, pointer !important;
        }
      `}</style>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          
          {/* Tela Inicial */}
          {step === 'initial' && (
            <div className="bg-gradient-to-br from-purple-950 via-violet-950 to-purple-950 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-purple-500/30 overflow-hidden backdrop-blur-xl">
              {/* Header */}
              <div className="relative h-14 sm:h-20 md:h-24 bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/10 to-black/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3),transparent_50%)] animate-pulse"></div>
                <h1 className="relative text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white text-center drop-shadow-2xl flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">💎</span>
                  <span>Bem-vindo!</span>
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">💎</span>
                </h1>
              </div>

              {/* Conteúdo */}
              <div className="p-3 sm:p-5 md:p-6 lg:p-8 text-center">
                {/* Elemento CSS Animado Customizado */}
                <div className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 md:mb-6">
                  {/* Círculo externo girando */}
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-violet-400 animate-spin"></div>
                  {/* Círculo do meio girando reverso */}
                  <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-violet-400 border-l-fuchsia-400 animate-spin-reverse"></div>
                  {/* Círculo interno pulsante */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 animate-pulse shadow-lg shadow-purple-500/50"></div>
                  {/* Estrela central */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</div>
                  </div>
                </div>
                <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 mb-2 sm:mb-3 md:mb-4">
                  Acesse Ofertas Exclusivas
                </h2>
                <p className="text-purple-100 mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-relaxed text-xs sm:text-sm md:text-base">
                  Valide sua identidade e tenha acesso a descontos especiais e bônus exclusivos!
                </p>
                
                <div className="bg-gradient-to-br from-purple-500/20 via-violet-500/15 to-fuchsia-500/20 border-2 border-purple-400/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 mb-3 sm:mb-4 md:mb-5 lg:mb-6 backdrop-blur-md shadow-2xl shadow-purple-500/30">
                  <p className="text-purple-300 font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl mb-2 sm:mb-3 flex items-center justify-center gap-1.5 sm:gap-2">
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">🎁</span>
                    <span>Recompensa Exclusiva</span>
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl">🎁</span>
                  </p>
                  <p className="text-purple-50 text-xs sm:text-sm md:text-base leading-relaxed">
                    Valide sua conta e ganhe <span className="font-bold text-violet-300 text-sm sm:text-base md:text-lg">70% de desconto</span> na sua recarga!
                  </p>
                </div>

                <button
                  onClick={handleInitialCheck}
                  className="w-full bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 hover:from-fuchsia-600 hover:via-purple-500 hover:to-violet-600 text-white font-bold text-sm sm:text-base md:text-lg py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-2xl shadow-purple-500/50 hover:shadow-violet-500/70 hover:scale-[1.05] border-2 border-purple-400/60 hover:border-violet-300 relative overflow-hidden group mb-2 sm:mb-3"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-3">
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl">🚀</span>
                    <span>Começar Agora</span>
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl">✨</span>
                  </span>
                </button>

                {/* Links de Termos e Políticas */}
                <div className="mt-2 sm:mt-3 md:mt-4 text-center text-[10px] sm:text-xs">
                  <p className="mb-2 text-purple-300">Ao continuar, você concorda com nossos</p>
                  <div className="flex items-center justify-center gap-3">
                    <button 
                      onClick={() => setShowTermsModal(true)}
                      className="text-violet-300 hover:text-purple-200 underline transition-colors font-semibold"
                    >
                      Termos de Uso
                    </button>
                    <span className="text-purple-500">•</span>
                    <button 
                      onClick={() => setShowPrivacyModal(true)}
                      className="text-violet-300 hover:text-purple-200 underline transition-colors font-semibold"
                    >
                      Política de Privacidade
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tela de Termos */}
          {step === 'terms' && (
            <div className="bg-gray-50 rounded-2xl border border-gray-300 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Termos de Uso e Política de Privacidade</h2>
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
                  <p className="mb-3">
                    <strong>5. Validade da Oferta:</strong> O desconto de 70% é válido para recargas e não pode ser combinado com outras promoções. Esta oferta está sujeita à disponibilidade e pode ser encerrada a qualquer momento sem aviso prévio.
                  </p>
                  <p className="mb-3">
                    <strong>6. Uso Único:</strong> Este cupom é válido para uso único por usuário e não pode ser transferido.
                  </p>
                  <p className="mb-3">
                    <strong>7. Conformidade:</strong> Esta promoção está em conformidade com as políticas do Google Ads e regulamentações aplicáveis. Todas as ofertas seguem as diretrizes de publicidade digital.
                  </p>

                  <h4 className="font-bold text-gray-800 mb-2 mt-4">🔒 POLÍTICA DE PRIVACIDADE</h4>
                  <p className="mb-3">
                    <strong>8. Coleta de Dados:</strong> Coletamos apenas informações necessárias para processar suas recargas: ID do jogador, dados de pagamento e informações de contato. Não compartilhamos dados com terceiros.
                  </p>
                  <p className="mb-3">
                    <strong>9. Uso das Informações:</strong> Seus dados são utilizados exclusivamente para: processar recargas, enviar confirmações, oferecer suporte técnico e disponibilizar ofertas personalizadas.
                  </p>
                  <p className="mb-3">
                    <strong>10. Cookies e Rastreamento:</strong> Utilizamos cookies para melhorar sua experiência, lembrar preferências e analisar o tráfego do site de forma anônima.
                  </p>
                  <p className="mb-3">
                    <strong>11. Direitos do Usuário:</strong> Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento através do nosso suporte.
                  </p>
                  <p className="mb-3">
                    <strong>12. Suporte 24h:</strong> Nossa equipe está disponível 24 horas para esclarecer dúvidas sobre privacidade, termos de uso ou questões técnicas.
                  </p>
                  <p className="mb-3">
                    <strong>13. Atualizações:</strong> Estes termos podem ser atualizados periodicamente. Usuários serão notificados sobre mudanças importantes por email ou no site.
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-4 italic">
                    Ao participar desta promoção, você concorda com estes termos e condições.
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

          {/* Tela do QUIZ */}
          {step === 'quiz' && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-blue-500/20 overflow-hidden backdrop-blur-xl">
              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-950">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-4 flex justify-between items-center">
                <div className="text-white font-semibold">
                  Pergunta {currentQuestion + 1}/{quizQuestions.length}
                </div>
                <div className="bg-black/30 px-4 py-2 rounded-full text-white font-semibold flex items-center gap-2 backdrop-blur-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
                  {timeLeft}s
                </div>
              </div>

              {/* Pergunta */}
              <div className="p-6">
                {isTransitioning ? (
                  // Loading entre perguntas
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent mb-4"></div>
                    <p className="text-white font-semibold">Próxima pergunta...</p>
                  </div>
                ) : (
                  <div className="animate-fade-in">
                    <h3 className="text-xl font-bold text-white mb-6 text-center leading-relaxed">
                      {quizQuestions[currentQuestion].question}
                    </h3>

                    {/* Opções */}
                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuizAnswer(index)}
                          disabled={isTransitioning}
                          className="w-full bg-gradient-to-r from-slate-800/50 to-slate-700/50 hover:from-blue-600 hover:to-cyan-500 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-200 border border-slate-600/30 hover:border-blue-400/50 text-left hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-blue-400 font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                          {option.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tela de RESULTADO */}
          {step === 'result' && (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-blue-500/20 overflow-hidden backdrop-blur-xl">
              {/* Header com animação */}
              <div className="relative h-28 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                <div className="relative text-center py-3">
                  <div className="text-3xl mb-1">{quizProfiles[quizResult]?.emoji}</div>
                  <h2 className="text-base font-bold text-white drop-shadow-lg">
                    SEU PERFIL
                  </h2>
                </div>
              </div>

              {/* Resultado */}
              <article className="p-8 text-center" role="main" aria-label="Resultado do Quiz">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
                  {quizProfiles[quizResult]?.title}
                </h3>
                <p className="text-slate-300 text-base mb-8 leading-relaxed">
                  {quizProfiles[quizResult]?.description}
                </p>

                {/* Recompensa */}
                <div className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-2xl p-6 mb-6 border border-blue-400/30 backdrop-blur-sm">
                  <div className="text-4xl mb-2">🎁</div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    Parabéns!
                  </h4>
                  <p className="text-slate-200 font-medium text-base mb-3">
                    Você desbloqueou
                  </p>
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                    70% OFF
                  </div>
                  <p className="text-slate-300 text-sm">
                    Desconto exclusivo na sua recarga!
                  </p>
                  <p className="text-blue-300 text-xs mt-2 font-medium">
                    ⏰ Válido por 24 horas
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleAcceptReward}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-lg py-5 px-8 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
                    aria-label="Resgatar desconto de 70% exclusivo"
                  >
                    Resgatar Meu Desconto ✨
                  </button>
                </div>

                <p className="text-slate-500 text-xs mt-4">
                  #Gaming #Quiz #Desconto
                </p>
              </article>
            </div>
          )}

          {/* Tela de Verificação */}
          {step === 'verification' && (
            <div className="bg-gradient-to-br from-purple-950 via-violet-950 to-purple-950 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-purple-500/30 overflow-hidden backdrop-blur-xl">
              {/* Header */}
              <div className="relative h-16 sm:h-20 md:h-24 bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-500/10 to-black/30" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.3),transparent_50%)] animate-pulse"></div>
                <h2 className="relative text-base sm:text-lg md:text-xl font-bold text-white text-center drop-shadow-2xl flex items-center gap-1.5 sm:gap-2 px-2">
                  <span className="text-lg sm:text-xl md:text-2xl">🔐</span>
                  <span>Validar Identidade</span>
                  <span className="text-lg sm:text-xl md:text-2xl">🔐</span>
                </h2>
              </div>

              <div className="p-4 sm:p-6 md:p-8">
                <p className="text-purple-100 text-sm mb-6 text-center">
                  Insira seu ID de jogador para confirmar que você é um usuário real
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 flex items-center gap-2">
                      <span className="text-xl">🎮</span>
                      <span>ID do Jogador</span>
                      <span className="text-xs text-purple-300 font-normal">(apenas números)</span>
                    </label>
                    <input
                      type="text"
                      value={playerId}
                      onChange={(e) => setPlayerId(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Digite seu ID do jogo (ex: 5435431)"
                      className="w-full px-5 py-4 bg-gradient-to-r from-purple-900/60 to-violet-900/60 border-2 border-purple-500/40 rounded-2xl text-white text-lg font-bold placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 hover:border-purple-400/70 transition-all duration-300 shadow-lg shadow-purple-900/20"
                      disabled={isLoading}
                      maxLength={15}
                    />
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500/20 via-violet-500/15 to-fuchsia-500/20 border-2 border-purple-400/50 rounded-2xl p-5 backdrop-blur-md shadow-lg shadow-purple-500/20">
                    <p className="text-sm text-purple-300 font-bold mb-3 flex items-center gap-2">
                      <span className="text-lg">⭐</span>
                      <span>Importante:</span>
                    </p>
                    <p className="text-sm text-purple-50 mb-3 leading-relaxed">
                      Digite seu <span className="text-violet-300 font-bold">ID REAL</span> do jogo! IDs falsos ou inválidos não passarão na verificação.
                    </p>
                    <p className="text-xs text-purple-100 mb-3 bg-purple-900/40 rounded-lg p-2 border border-purple-500/30">
                      📍 <span className="text-violet-300 font-semibold">Encontre seu ID em:</span><br/>
                      <span className="text-white font-bold ml-4">Configurações → Informações Básicas → ID do Jogador</span>
                    </p>
                    <button
                      onClick={() => setShowTutorial(true)}
                      className="text-sm text-violet-300 hover:text-purple-200 underline font-bold flex items-center gap-1"
                    >
                      📖 Ver tutorial completo de como encontrar seu ID
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="px-8 pb-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-3 text-center">
                    <p className="text-red-400 text-sm font-semibold">{error}</p>
                  </div>
                </div>
              )}

              <div className="px-8 pb-8">
                <button
                  onClick={handleVerification}
                  disabled={isLoading || !playerId.trim()}
                  className={`w-full font-bold text-lg py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center relative overflow-hidden group ${
                    isLoading || !playerId.trim()
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed border-2 border-slate-600'
                      : 'bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 hover:from-fuchsia-600 hover:via-purple-500 hover:to-violet-600 text-white shadow-2xl shadow-purple-500/50 hover:shadow-violet-500/70 hover:scale-[1.05] border-2 border-purple-400/60 hover:border-violet-300'
                  }`}
                >
                  {!isLoading && !(!playerId.trim()) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  )}
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent mr-3"></div>
                      <span className="animate-pulse">Verificando...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl mr-2">🚀</span>
                      <span className="relative z-10">Verificar Identidade</span>
                      <span className="text-2xl ml-2">✨</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Modal de Termos de Uso */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={playClickSound}>
          <div className="bg-gradient-to-br from-purple-950 via-violet-950 to-purple-950 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-purple-500/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 -m-6 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">📜</span>
                  <span>Termos de Uso</span>
                </h3>
                <button 
                  onClick={() => { playClickSound(); setShowTermsModal(false); }}
                  className="text-white hover:text-purple-200 transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 text-purple-100 text-sm leading-relaxed">
                <p><strong className="text-violet-300 text-base">1. Aceitação dos Termos:</strong> Ao aceitar estes termos, você concorda com todas as condições de uso deste site oficial de recargas e nossa política de privacidade.</p>
                
                <p><strong className="text-violet-300 text-base">2. Usuários Verificados:</strong> Este site é exclusivo para jogadores reais e verificados. É terminantemente proibido o uso de bots, sistemas automatizados ou contas falsas.</p>
                
                <p><strong className="text-violet-300 text-base">3. Ofertas Exclusivas:</strong> Usuários verificados têm acesso a descontos especiais, promoções exclusivas e bônus. As ofertas são limitadas e sujeitas a disponibilidade.</p>
                
                <p><strong className="text-violet-300 text-base">4. Transações Seguras:</strong> Garantimos 100% de segurança em todas as transações através de sistemas criptografados de última geração.</p>
                
                <p><strong className="text-violet-300 text-base">5. Responsabilidade:</strong> O usuário é responsável por manter suas credenciais seguras e por todas as atividades realizadas em sua conta.</p>
                
                <p><strong className="text-violet-300 text-base">6. Modificações:</strong> Reservamos o direito de modificar estes termos a qualquer momento. Usuários serão notificados sobre mudanças importantes.</p>
              </div>
              
              <button 
                onClick={() => { playClickSound(); setShowTermsModal(false); }}
                className="mt-6 w-full bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 hover:from-fuchsia-600 hover:via-purple-500 hover:to-violet-600 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-violet-500/70 hover:scale-[1.02]"
              >
                ✅ Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Política de Privacidade */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={playClickSound}>
          <div className="bg-gradient-to-br from-purple-950 via-violet-950 to-purple-950 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border-2 border-purple-500/50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 -m-6 p-6 rounded-t-2xl">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="text-3xl">🔐</span>
                  <span>Política de Privacidade</span>
                </h3>
                <button 
                  onClick={() => { playClickSound(); setShowPrivacyModal(false); }}
                  className="text-white hover:text-purple-200 transition-colors bg-white/10 hover:bg-white/20 rounded-lg p-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4 text-purple-100 text-sm leading-relaxed">
                <p><strong className="text-violet-300 text-base">1. Coleta de Dados:</strong> Coletamos apenas informações necessárias para processar suas recargas: ID do jogador, dados de pagamento e informações de contato. Não compartilhamos dados com terceiros.</p>
                
                <p><strong className="text-violet-300 text-base">2. Uso das Informações:</strong> Seus dados são utilizados exclusivamente para: processar recargas, enviar confirmações, oferecer suporte técnico e disponibilizar ofertas personalizadas.</p>
                
                <p><strong className="text-violet-300 text-base">3. Segurança:</strong> Utilizamos criptografia SSL/TLS e seguimos os mais altos padrões de segurança da indústria para proteger suas informações.</p>
                
                <p><strong className="text-violet-300 text-base">4. Cookies:</strong> Utilizamos cookies para melhorar sua experiência, lembrar preferências e analisar o tráfego do site de forma anônima.</p>
                
                <p><strong className="text-violet-300 text-base">5. Direitos do Usuário:</strong> Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento através do nosso suporte.</p>
                
                <p><strong className="text-violet-300 text-base">6. Conformidade LGPD:</strong> Estamos em conformidade com a Lei Geral de Proteção de Dados (LGPD) e respeitamos todos os seus direitos de privacidade.</p>
              </div>
              
              <button 
                onClick={() => { playClickSound(); setShowPrivacyModal(false); }}
                className="mt-6 w-full bg-gradient-to-r from-purple-600 via-violet-500 to-fuchsia-600 hover:from-fuchsia-600 hover:via-purple-500 hover:to-violet-600 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-violet-500/70 hover:scale-[1.02]"
              >
                ✅ Entendi
              </button>
            </div>
          </div>
        </div>
      )}

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
