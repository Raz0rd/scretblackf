"use client"

import { useState, useEffect } from 'react'
import { Mail, Gamepad2, Rocket, Zap, Gift, Trophy, Award, X } from 'lucide-react'

const BlueShiftLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = { sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-20 h-20' }
  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-full shadow-lg shadow-purple-500/50 animate-pulse"></div>
      <Rocket className="relative z-10 w-3/5 h-3/5 text-white" />
    </div>
  )
}

const CosmicShooter = () => {
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameActive, setGameActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; size: number; speed: number; color: string; points: number }[]>([])
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number }[]>([])
  const [combo, setCombo] = useState(0)
  const [lastHit, setLastHit] = useState(0)
  const [showWin, setShowWin] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    const newStars = Array.from({ length: 80 }, (_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2 + 1
    }))
    setStars(newStars)
  }, [])

  useEffect(() => {
    if (!gameActive) return
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Dificuldade progressiva baseada na pontuação
    const getDifficulty = () => {
      if (score >= 400) return { spawnRate: 500, speedMultiplier: 0.5 } // Muito difícil
      if (score >= 300) return { spawnRate: 600, speedMultiplier: 0.6 } // Difícil
      if (score >= 200) return { spawnRate: 650, speedMultiplier: 0.7 } // Médio-difícil
      if (score >= 100) return { spawnRate: 700, speedMultiplier: 0.8 } // Médio
      return { spawnRate: 800, speedMultiplier: 1 } // Normal
    }

    const difficulty = getDifficulty()

    const targetSpawner = setInterval(() => {
      const targetTypes = [
        { size: 40, speed: 2000, color: 'bg-blue-500', points: 10 },
        { size: 30, speed: 1500, color: 'bg-purple-500', points: 20 },
        { size: 20, speed: 1200, color: 'bg-pink-500', points: 30 },
        { size: 50, speed: 2500, color: 'bg-green-500', points: 5 },
      ]
      
      const type = targetTypes[Math.floor(Math.random() * targetTypes.length)]
      const newTarget = {
        id: Date.now() + Math.random(),
        x: Math.random() * 85,
        y: Math.random() * 85,
        ...type,
        speed: type.speed * difficulty.speedMultiplier // Alvos desaparecem mais rápido
      }
      
      setTargets(prev => [...prev, newTarget])
      
      setTimeout(() => {
        setTargets(prev => prev.filter(t => t.id !== newTarget.id))
      }, newTarget.speed)
    }, difficulty.spawnRate) // Alvos aparecem mais rápido

    return () => {
      clearInterval(timer)
      clearInterval(targetSpawner)
    }
  }, [gameActive, score])

  useEffect(() => {
    if (combo > 0) {
      const comboTimer = setTimeout(() => {
        setCombo(0)
      }, 2000)
      return () => clearTimeout(comboTimer)
    }
  }, [lastHit])

  const startGame = () => {
    setScore(0)
    setTimeLeft(30)
    setTargets([])
    setCombo(0)
    setGameActive(true)
    setShowWin(false)
  }

  const endGame = () => {
    setGameActive(false)
    setTargets([])
    if (score > highScore) {
      setHighScore(score)
    }
    if (score >= 500) {
      setShowWin(true)
    }
  }

  const playShootSound = () => {
    if (!soundEnabled) return
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }

  const hitTarget = (target: typeof targets[0]) => {
    playShootSound()
    setTargets(prev => prev.filter(t => t.id !== target.id))
    const comboBonus = combo > 0 ? Math.floor(combo * 0.5) : 0
    const totalPoints = target.points + comboBonus
    setScore(prev => prev + totalPoints)
    setCombo(prev => prev + 1)
    setLastHit(Date.now())
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl p-6 border border-purple-500/30 shadow-xl">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Gamepad2 className="w-6 h-6 text-purple-400" />
          Cosmic Shooter
        </h3>
        <p className="text-slate-300 text-sm mb-3">Acerte os alvos antes que desapareçam! Alvos menores = mais pontos!</p>
        
        <div className="flex justify-center gap-4 mb-3 flex-wrap">
          <div className="bg-purple-600/30 px-4 py-2 rounded-full border border-purple-500/50">
            <span className="text-2xl font-bold text-purple-300">{score}</span>
            <span className="text-slate-400 ml-2 text-sm">pontos</span>
          </div>
          {gameActive && (
            <div className="bg-blue-600/30 px-4 py-2 rounded-full border border-blue-500/50">
              <span className="text-2xl font-bold text-blue-300">{timeLeft}s</span>
            </div>
          )}
          {highScore > 0 && (
            <div className="bg-yellow-600/30 px-4 py-2 rounded-full border border-yellow-500/50">
              <span className="text-sm text-yellow-300">Recorde: {highScore}</span>
            </div>
          )}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-4 py-2 rounded-full border transition-all ${
              soundEnabled 
                ? 'bg-green-600/30 border-green-500/50 text-green-300' 
                : 'bg-red-600/30 border-red-500/50 text-red-300'
            }`}
          >
            {soundEnabled ? '🔊 Som ON' : '🔇 Som OFF'}
          </button>
        </div>

        {combo > 2 && gameActive && (
          <div className="animate-bounce text-yellow-400 font-bold text-lg mb-2">
            🔥 COMBO x{combo}! +{Math.floor(combo * 0.5)} bônus
          </div>
        )}

        {showWin && (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg mb-3 animate-pulse">
            <p className="font-bold text-lg">🎉 INCRÍVEL! Você é um mestre! 🎉</p>
            <p className="text-sm">Pontuação: {score} pontos!</p>
          </div>
        )}
      </div>

      <div className="relative w-full h-80 bg-gradient-to-b from-indigo-950 to-slate-950 rounded-lg overflow-hidden border-2 border-purple-500/30" style={{ cursor: gameActive ? 'crosshair' : 'default' }}>
        {stars.map(star => (
          <div key={star.id} className="absolute bg-white rounded-full animate-pulse" style={{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.size}px`, height: `${star.size}px`, animationDuration: `${Math.random() * 3 + 2}s` }} />
        ))}

        {!gameActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-white text-xl mb-4">
                {score > 0 ? `Fim de jogo! Você fez ${score} pontos!` : 'Pronto para o desafio?'}
              </p>
              <button onClick={startGame} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105">
                {score > 0 ? 'Jogar Novamente' : 'Iniciar Jogo'}
              </button>
            </div>
          </div>
        )}

        {gameActive && targets.map(target => (
          <button
            key={target.id}
            onClick={() => hitTarget(target)}
            className={`absolute ${target.color} rounded-full cursor-crosshair transition-all hover:scale-110 shadow-lg animate-pulse`}
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              width: `${target.size}px`,
              height: `${target.size}px`,
            }}
          >
            <span className="text-white font-bold text-xs">{target.points}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-blue-900/30 p-2 rounded border border-blue-500/30">
          <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-1"></div>
          <span className="text-blue-300">10pts</span>
        </div>
        <div className="bg-purple-900/30 p-2 rounded border border-purple-500/30">
          <div className="w-6 h-6 bg-purple-500 rounded-full mx-auto mb-1"></div>
          <span className="text-purple-300">20pts</span>
        </div>
        <div className="bg-pink-900/30 p-2 rounded border border-pink-500/30">
          <div className="w-4 h-4 bg-pink-500 rounded-full mx-auto mb-1"></div>
          <span className="text-pink-300">30pts</span>
        </div>
        <div className="bg-green-900/30 p-2 rounded border border-green-500/30">
          <div className="w-10 h-10 bg-green-500 rounded-full mx-auto mb-1"></div>
          <span className="text-green-300">5pts</span>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)

  // JSON-LD para SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BlueShift Games",
    "alternateName": "EASYCOM COMÉRCIO E SERVIÇOS LTDA",
    "url": "https://blueshiftgames.com",
    "logo": "https://blueshiftgames.com/logo.png",
    "description": "Plataforma gaming completa com dicas, cupons e informações sobre recarga de diamantes FF, dimas FF e jogos mobile.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Agenor de Freitas, 35",
      "addressLocality": "Serrinha",
      "addressRegion": "BA",
      "postalCode": "48700-000",
      "addressCountry": "BR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contato@blueshiftgames.com",
      "contactType": "customer service"
    },
    "sameAs": [],
    "keywords": "diamantes ff, dimas ff, recarga free fire, cupons jogos, dicas gamer"
  }

  const cupons = [
    { code: 'BLUESHIFT10', game: 'Free Fire', discount: '10% OFF', expires: '31/12/2025' },
    { code: 'GAMER2025', game: 'PUBG Mobile', discount: '15% OFF', expires: '31/12/2025' },
    { code: 'SHIFT20', game: 'Mobile Legends', discount: '20% OFF', expires: '31/12/2025' },
  ]

  const dicas = [
    { title: 'Otimize suas Configurações', description: 'Ajuste gráficos e sensibilidade para melhor performance e precisão nos jogos mobile.', icon: <Zap className="w-8 h-8 text-yellow-400" /> },
    { title: 'Pratique Diariamente', description: 'Dedique pelo menos 30 minutos por dia para treinar mira e movimentação.', icon: <Trophy className="w-8 h-8 text-purple-400" /> },
    { title: 'Jogue em Equipe', description: 'Comunicação é essencial. Use fones e microfone para coordenar estratégias.', icon: <Award className="w-8 h-8 text-blue-400" /> },
  ]

  return (
    <>
      {/* JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0F0A1F 0%, #1A0F2E 50%, #0F0A1F 100%)' }}>
        <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-2 h-2 bg-purple-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[15%] left-[80%] w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-blue-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3.5s' }}></div>
        <div className="absolute top-[45%] left-[70%] w-3 h-3 bg-purple-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '5s' }}></div>
        <div className="absolute top-[60%] left-[15%] w-2 h-2 bg-cyan-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4.5s' }}></div>
        <div className="absolute top-[75%] left-[85%] w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3.8s' }}></div>
      </div>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      </div>
      <div className="relative z-10">
        <header className="bg-purple-900/20 backdrop-blur-md text-white shadow-2xl border-b border-purple-500/30">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <BlueShiftLogo size="lg" />
              <div>
                <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">BlueShift Games</h1>
                <p className="text-slate-300 text-sm">Sua plataforma gaming completa</p>
              </div>
            </div>
          </div>
        </header>
        <section className="bg-purple-900/10 backdrop-blur-sm text-white py-20 border-b border-purple-500/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Bem-vindo ao BlueShift</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Sua plataforma completa para o universo gaming. Dicas, cupons e diversão garantida!</p>
          </div>
        </section>
        <section className="py-16 bg-purple-900/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-12 text-white">Sobre a BlueShift Games</h2>
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-purple-500/30">
                <p className="text-slate-200 leading-relaxed text-lg text-center mb-6">
                  A BlueShift Games é sua plataforma completa para o universo dos jogos. Oferecemos dicas exclusivas, cupons especiais e uma comunidade apaixonada por gaming.
                </p>
                <div className="border-t border-purple-500/30 pt-6 mt-6">
                  <p className="text-slate-300 text-center text-sm">
                    <strong className="text-purple-300">Operado por:</strong> EASYCOM COMÉRCIO E SERVIÇOS LTDA<br />
                    <strong className="text-purple-300">CNPJ:</strong> 18.877.138/0001-39<br />
                    <strong className="text-purple-300">Localização:</strong> Rua Agenor de Freitas, 35 - Centro, Serrinha - BA, CEP 48700-000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-purple-900/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">Dicas para Gamers</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {dicas.map((dica, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-purple-500/30">
                  <div className="flex justify-center mb-4">{dica.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-center text-white">{dica.title}</h3>
                  <p className="text-slate-200 text-center">{dica.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-purple-900/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">Cupons Exclusivos</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {cupons.map((cupom, index) => (
                <div key={index} className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-green-500/30 hover:scale-105 transition-transform">
                  <div className="flex items-center justify-center mb-3"><Gift className="w-8 h-8 text-green-400" /></div>
                  <h3 className="text-lg font-bold text-center text-green-300 mb-2">{cupom.game}</h3>
                  <div className="bg-black/30 py-3 px-4 rounded-lg mb-3">
                    <p className="text-2xl font-bold text-center text-white font-mono">{cupom.code}</p>
                  </div>
                  <p className="text-center text-green-400 font-semibold mb-1">{cupom.discount}</p>
                  <p className="text-center text-slate-400 text-sm">Válido até {cupom.expires}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-16 bg-purple-900/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 text-white">Divirta-se Enquanto Navega</h2>
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-md p-6 rounded-xl border border-purple-500/20 text-center">
                <p className="text-slate-200 text-lg mb-3">
                  🎯 <strong className="text-purple-300">Melhore sua mira e pratique seus reflexos!</strong>
                </p>
                <p className="text-slate-300 text-sm mb-2">
                  Teste suas habilidades neste desafiador jogo de tiro espacial. Acerte os alvos que aparecem aleatoriamente 
                  e tente bater seu próprio recorde! Quanto menor o alvo, mais pontos você ganha.
                </p>
                <p className="text-slate-400 text-xs italic">
                  💡 Dica: Mantenha o combo ativo para ganhar pontos bônus! Temos outros jogos incríveis chegando em breve.
                </p>
              </div>
            </div>
            <div className="max-w-2xl mx-auto"><CosmicShooter /></div>
          </div>
        </section>
        <section className="py-16 bg-purple-900/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-bold text-center mb-8 text-white">Recarga de Diamantes Free Fire e Outros Jogos</h2>
              <p className="text-slate-300 text-center mb-12 text-lg">Tudo sobre diamantes FF, dimas FF e recarga para seus jogos favoritos</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-purple-500/30">
                  <h3 className="text-xl font-bold mb-3 text-purple-300">Diamantes Free Fire</h3>
                  <p className="text-slate-200 leading-relaxed">Os diamantes são a moeda premium do Free Fire. Recarga rápida e segura de dimas FF.</p>
                </div>
                <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-blue-500/30">
                  <h3 className="text-xl font-bold mb-3 text-blue-300">Recarga com ID do Jogo</h3>
                  <p className="text-slate-200 leading-relaxed">A recarga com ID é o método mais seguro e prático. O crédito cai direto na sua conta.</p>
                </div>
                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-green-500/30">
                  <h3 className="text-xl font-bold mb-3 text-green-300">Outros Jogos Populares</h3>
                  <p className="text-slate-200 leading-relaxed">PUBG Mobile, Mobile Legends, Genshin Impact, Call of Duty Mobile e muito mais.</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-md p-6 rounded-xl shadow-lg border border-cyan-500/30">
                  <h3 className="text-xl font-bold mb-3 text-cyan-300">Pagamento Seguro</h3>
                  <p className="text-slate-200 leading-relaxed">Todas as transações são protegidas. Aceitamos PIX e cartão de crédito.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-purple-900/5 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">Entre em Contato</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-purple-500/30">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-purple-300">BlueShift Games</h3>
                    <p className="text-slate-200 mb-4">Operado por EASYCOM COMÉRCIO E SERVIÇOS LTDA</p>
                    <div className="space-y-2 text-slate-300 text-sm">
                      <p><strong>CNPJ:</strong> 18.877.138/0001-39</p>
                      <p><strong>Endereço:</strong> Rua Agenor de Freitas, 35</p>
                      <p>Centro - Serrinha, BA - CEP: 48700-000</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-blue-300">Fale Conosco</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <Mail className="w-6 h-6 text-blue-400" />
                      <p className="text-lg text-white">contato@blueshiftgames.com</p>
                    </div>
                    <p className="text-slate-300 text-sm">Tem dúvidas? Entre em contato conosco.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-gradient-to-r from-purple-900 to-slate-900 text-white py-12 border-t border-purple-500/30">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-4"><BlueShiftLogo size="md" /></div>
            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">BlueShift Games</h3>
            <p className="text-slate-300 mb-6">Sua plataforma gaming completa</p>
            <div className="border-t border-slate-700 pt-6 mt-6">
              <div className="flex flex-wrap justify-center gap-6 mb-6">
                <button onClick={() => setShowPrivacyModal(true)} className="text-slate-300 hover:text-white transition-colors underline">Política de Privacidade</button>
                <span className="text-slate-600">|</span>
                <button onClick={() => setShowTermsModal(true)} className="text-slate-300 hover:text-white transition-colors underline">Termos de Uso</button>
              </div>
              <p className="text-slate-400 text-sm mb-4">© 2025 BlueShift Games<br />Operado por EASYCOM COMÉRCIO E SERVIÇOS LTDA<br />Todos os direitos reservados.</p>
              <p className="text-slate-500 text-xs">CNPJ: 18.877.138/0001-39 | Serrinha - BA</p>
            </div>
          </div>
        </footer>
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-700 to-blue-800 text-white p-6 rounded-t-2xl relative sticky top-0">
                <button onClick={() => setShowPrivacyModal(false)} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"><X className="w-6 h-6" /></button>
                <h2 className="text-2xl font-bold">Política de Privacidade</h2>
              </div>
              <div className="p-6 space-y-4 text-slate-700">
                <section><h3 className="text-lg font-bold mb-2">1. Informações que Coletamos</h3><p>Coletamos informações que você nos fornece diretamente, como nome, e-mail e telefone quando você entra em contato conosco.</p></section>
                <section><h3 className="text-lg font-bold mb-2">2. Como Usamos suas Informações</h3><p>Utilizamos suas informações para melhorar nossos serviços e comunicar sobre promoções relacionadas a jogos.</p></section>
                <section><h3 className="text-lg font-bold mb-2">3. Segurança</h3><p>Implementamos medidas de segurança para proteger suas informações pessoais.</p></section>
                <section><h3 className="text-lg font-bold mb-2">4. Contato</h3><p>Para questões sobre esta política: contato@blueshiftgames.com</p></section>
              </div>
            </div>
          </div>
        )}
        {showTermsModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-purple-700 to-blue-800 text-white p-6 rounded-t-2xl relative sticky top-0">
                <button onClick={() => setShowTermsModal(false)} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"><X className="w-6 h-6" /></button>
                <h2 className="text-2xl font-bold">Termos de Uso</h2>
              </div>
              <div className="p-6 space-y-4 text-slate-700">
                <section><h3 className="text-lg font-bold mb-2">1. Aceitação dos Termos</h3><p>Ao acessar e usar este site, você aceita estes termos e condições de uso.</p></section>
                <section><h3 className="text-lg font-bold mb-2">2. Uso do Site</h3><p>Você concorda em usar o site apenas para fins legais.</p></section>
                <section><h3 className="text-lg font-bold mb-2">3. Propriedade Intelectual</h3><p>Todo o conteúdo deste site é protegido por direitos autorais.</p></section>
                <section><h3 className="text-lg font-bold mb-2">4. Contato</h3><p>Para questões sobre estes termos: contato@blueshiftgames.com</p></section>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
