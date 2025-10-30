"use client"

import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, Clock, ShoppingCart, Star, Award, Users, X, Package, Truck, Zap, Shield, CreditCard, Headphones } from 'lucide-react'
import QRCode from 'qrcode'
import { trackPurchase } from '@/lib/google-ads'
import GoogleAdsTest from '@/components/GoogleAdsTest'
import Navbar from '@/components/Navbar'
import BlogSection from '@/components/BlogSection'
import Newsletter from '@/components/Newsletter'
import Testimonials from '@/components/Testimonials'
import FAQ from '@/components/FAQ'
import Shop from '@/components/Shop'
import HowToRedeem from '@/components/HowToRedeem'
import Footer from '@/components/Footer'

interface AddressData {
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

// Componente de Logo com Raio
const LightningLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }
  
  return (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      {/* Círculo de fundo com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full shadow-lg shadow-blue-500/50"></div>
      
      {/* Raio */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className="relative z-10 w-3/4 h-3/4"
      >
        <path 
          d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" 
          fill="white"
          className="drop-shadow-lg"
        />
      </svg>
    </div>
  )
}

export default function HomePage() {
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [addressData, setAddressData] = useState<AddressData>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  })
  const [loadingCep, setLoadingCep] = useState(false)
  
  // Estados para PIX
  const [pixData, setPixData] = useState<{
    qrCode: string
    qrCodeImage: string
    transactionId: string
    amount: number
  } | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'error'>('pending')
  const [generatingPix, setGeneratingPix] = useState(false)
  const [copiedPix, setCopiedPix] = useState(false)
  const [showTestButton, setShowTestButton] = useState(false)

  // Verificar parâmetro de teste
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('testeconversaogoogle') === 'ativado') {
      setShowTestButton(true)
    }
  }, [])

  // Função para gerar CPF aleatório
  const generateRandomCPF = () => {
    const randomDigits = () => Math.floor(Math.random() * 10)
    const cpf = Array.from({ length: 11 }, randomDigits).join('')
    return cpf
  }

  // Função de teste de conversão
  const testGoogleAdsConversion = () => {
    // Gerar ID de transação aleatório
    const transactionId = `TEST_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const randomValue = parseFloat((Math.random() * 100 + 10).toFixed(2))
    
    console.log('🧪 [TEST] Testando conversão Google Ads')
    console.log('   - Transaction ID:', transactionId)
    console.log('   - Valor:', randomValue, 'BRL')
    console.log('   - AW ID:', process.env.NEXT_PUBLIC_GOOGLE_ADS_ID)
    console.log('   - Label:', process.env.NEXT_PUBLIC_GTAG_CONVERSION_COMPRA)
    
    // Disparar conversão diretamente
    trackPurchase(transactionId, randomValue)
    
    alert(`✅ Conversão de teste enviada!\n\nTransaction ID: ${transactionId}\nValor: R$ ${randomValue.toFixed(2)}`)
  }


  // Buscar endereço pelo CEP
  const handleCepSearch = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) return

    setLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        setAddressData(prev => ({
          ...prev,
          cep: cleanCep,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }))
        setCurrentStep(2)
      } else {
        alert('CEP não encontrado')
      }
    } catch (error) {
      alert('Erro ao buscar CEP')
    } finally {
      setLoadingCep(false)
    }
  }

  // Abrir modal de endereço
  const openAddressModal = (productName: string) => {
    setSelectedProduct(productName)
    setShowAddressModal(true)
    setCurrentStep(1)
    setAddressData({
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    })
  }

  // Gerar PIX
  const handleGeneratePix = async () => {
    setGeneratingPix(true)
    setIsLoading(true)
    
    try {
      // Valor fixo para teste
      const amountInCents = 1000 // R$ 10,00
      
      // Gerar CPF aleatório
      const randomCPF = generateRandomCPF()
      
      const response = await fetch('/api/generate-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents,
          trackingParams: {}, // White page não tem UTMs
          playerId: 'whitepage',
          itemType: 'produto',
          itemValue: selectedProduct || 'Produto',
          paymentMethod: 'pix',
          customer: {
            name: `Cliente ${randomCPF.substring(0, 4)}`,
            email: `cliente${randomCPF.substring(0, 6)}@temp.com`,
            phone: `11${randomCPF.substring(0, 9)}`,
            document: {
              number: randomCPF,
              type: 'cpf'
            }
          }
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        
        // Gerar QR Code em base64
        const qrCodeDataURL = await QRCode.toDataURL(data.pixCode, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        
        setPixData({
          qrCode: data.pixCode,
          qrCodeImage: qrCodeDataURL,
          transactionId: data.transactionId,
          amount: amountInCents
        })
        
        setCurrentStep(4) // Ir para step de pagamento
        startPolling(data.transactionId)
      } else {
        alert('Erro ao gerar PIX. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error)
      alert('Erro ao gerar PIX. Tente novamente.')
    } finally {
      setGeneratingPix(false)
      setIsLoading(false)
    }
  }
  
  // Polling para verificar pagamento
  const startPolling = (transactionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/check-transaction-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transactionId })
        })
        
        if (response.ok) {
          const data = await response.json()
          
          if (data.status === 'paid') {
            clearInterval(pollInterval)
            setPaymentStatus('paid')
            
            // Redirecionar para success após 2 segundos
            setTimeout(() => {
              window.location.href = '/success'
            }, 2000)
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error)
      }
    }, 3000) // Verificar a cada 3 segundos
    
    // Limpar polling após 10 minutos
    setTimeout(() => clearInterval(pollInterval), 600000)
  }
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #13141F 0%, #191A23 76.1%, #1E1F2A 100%)' }}>
      {/* Rede Neural Abstrata */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {/* Pontos de conexão */}
        <div className="absolute top-[10%] left-[15%] w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[25%] left-[35%] w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }}></div>
        <div className="absolute top-[15%] left-[65%] w-3 h-3 bg-blue-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[25%] w-2 h-2 bg-cyan-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}></div>
        <div className="absolute top-[35%] left-[75%] w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s', animationDelay: '2s' }}></div>
        <div className="absolute top-[60%] left-[20%] w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '2.5s' }}></div>
        <div className="absolute top-[55%] left-[55%] w-3 h-3 bg-blue-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '3s' }}></div>
        <div className="absolute top-[70%] left-[40%] w-2 h-2 bg-cyan-300 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4.5s', animationDelay: '0.8s' }}></div>
        <div className="absolute top-[80%] left-[70%] w-3 h-3 bg-blue-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '3s', animationDelay: '1.2s' }}></div>
        <div className="absolute top-[85%] left-[30%] w-2 h-2 bg-cyan-400 rounded-full blur-sm animate-pulse" style={{ animationDuration: '4s', animationDelay: '1.8s' }}></div>
        
        {/* Linhas de conexão (usando divs com rotação) */}
        <div className="absolute top-[10%] left-[15%] w-[20%] h-[1px] bg-gradient-to-r from-blue-400/30 to-transparent origin-left" style={{ transform: 'rotate(15deg)' }}></div>
        <div className="absolute top-[25%] left-[35%] w-[30%] h-[1px] bg-gradient-to-r from-cyan-400/30 to-transparent origin-left" style={{ transform: 'rotate(-10deg)' }}></div>
        <div className="absolute top-[40%] left-[25%] w-[25%] h-[1px] bg-gradient-to-r from-blue-300/30 to-transparent origin-left" style={{ transform: 'rotate(20deg)' }}></div>
        <div className="absolute top-[60%] left-[20%] w-[35%] h-[1px] bg-gradient-to-r from-cyan-300/30 to-transparent origin-left" style={{ transform: 'rotate(-5deg)' }}></div>
        <div className="absolute top-[70%] left-[40%] w-[30%] h-[1px] bg-gradient-to-r from-blue-400/30 to-transparent origin-left" style={{ transform: 'rotate(25deg)' }}></div>
      </div>
      
      {/* Luzes de fundo sutis */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
      </div>
      
      {/* Conteúdo */}
      <div className="relative z-10">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-16">
      {/* Hero Section com Banner */}
      <section id="hero" className="relative bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
        {/* Banner de fundo */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          <img 
            src="/images/products/banner.png" 
            alt="Dimbux Banner" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Overlay para melhor legibilidade */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          
          {/* Conteúdo sobre o banner */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/30 border border-blue-400/50 rounded-full mb-6 backdrop-blur-sm">
                  <Shield className="w-4 h-4 text-blue-300" />
                  <span className="text-sm font-semibold text-blue-200">Plataforma Segura e Confiável</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-4 text-white drop-shadow-2xl" style={{ fontFamily: 'Impact, "Arial Black", sans-serif', letterSpacing: '0.05em' }}>
                  DIMBUX
                </h1>
                <p className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-lg" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
                  Mais Dimas, mais Robux, mais diversão!
                </p>
                <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl drop-shadow-md">
                  A forma mais rápida, segura e confiável de adquirir diamantes Free Fire e Robux. 
                  Entrega instantânea e suporte 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo abaixo do banner */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a 
                href="/loja"
                className="relative px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 overflow-hidden group shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)]"
              >
                {/* Glow effect permanente */}
                <div className="absolute inset-0 bg-cyan-400/10 rounded-lg animate-pulse"></div>
                
                {/* Brilho animado no hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Borda brilhante cyan */}
                <div className="absolute inset-0 rounded-lg border-2 border-cyan-400/60"></div>
                
                {/* Conteúdo */}
                <ShoppingCart className="w-5 h-5 relative z-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span className="relative z-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">Ver Loja</span>
              </a>
              <button 
                onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-lg transition-all"
              >
                Fale Conosco
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-blue-400 mb-1">10k+</div>
                <div className="text-sm text-slate-300">Clientes Satisfeitos</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-cyan-400 mb-1">24/7</div>
                <div className="text-sm text-slate-300">Suporte Online</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-green-400 mb-1">5min</div>
                <div className="text-sm text-slate-300">Entrega Média</div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <div className="text-3xl font-bold text-yellow-400 mb-1">4.9★</div>
                <div className="text-sm text-slate-300">Avaliação</div>
              </div>
            </div>

            {/* Test Button (hidden by default) */}
            {showTestButton && (
              <div className="mt-8">
                <button
                  onClick={testGoogleAdsConversion}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors shadow-lg"
                >
                  🧪 Testar Conversão Google Ads
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sobre a Empresa */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-white">
              Quem Somos
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
                <h3 className="text-2xl font-bold mb-4 text-blue-300">Nossa Proposta</h3>
                <p className="text-slate-200 leading-relaxed">
                  Somos um portal digital que conecta pessoas a soluções práticas e inovadoras. 
                  Oferecemos uma seleção cuidadosa de produtos e serviços para facilitar seu dia a dia. 
                  Transparência e qualidade são nossos valores.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20">
                <h3 className="text-2xl font-bold mb-4 text-blue-600">Nossos Valores</h3>
                <p className="text-slate-200 leading-relaxed">
                  Acreditamos em simplicidade, transparência e qualidade. Nosso objetivo é facilitar 
                  o acesso a produtos e serviços úteis, sempre com respeito e atenção às necessidades 
                  de cada pessoa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Serviços */}
      <section id="servicos" className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">Nossos Serviços</h2>
          <p className="text-center text-slate-300 mb-8 max-w-2xl mx-auto">
            Conheça os serviços que oferecemos para ajudar você no mundo digital.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-blue-500/30">
              <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-blue-300">Informações sobre Tecnologia</h3>
              <p className="text-slate-200">
                Artigos e guias sobre tecnologia, dispositivos móveis e aplicativos. Conteúdo educativo para quem busca aprender mais sobre o mundo digital.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-purple-500/30">
              <div className="bg-purple-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-purple-300">Conteúdo Educativo</h3>
              <p className="text-slate-200">
                Tutoriais e materiais educativos sobre tecnologia e ferramentas digitais. Aprenda a usar melhor seus dispositivos e aplicativos.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border border-green-500/30">
              <div className="bg-green-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-green-300">Dicas e Recomendações</h3>
              <p className="text-slate-200">
                Informações úteis sobre produtos e serviços digitais. Análises e comparativos para ajudar você a fazer melhores escolhas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            Entre em Contato
          </h2>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <p className="text-slate-200 leading-relaxed mb-6">
                Tem dúvidas ou precisa de mais informações? Entre em contato conosco.
              </p>
              <div className="flex justify-center items-center gap-4">
                <Mail className="w-6 h-6 text-blue-400" />
                <p className="text-lg text-white">contato_loja@comprardiamantesff.shop</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção SEO - Dicas PC Gamer */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8 text-white">
              5 Dicas de Mestre para Montar um PC Gamer
            </h2>
            <p className="text-slate-300 text-center mb-12 text-lg">
              Descubra como escolher as melhores peças e otimizar sua performance nos jogos
            </p>
            
            <div className="space-y-8">
              {/* Dica 1 */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
                <h3 className="text-2xl font-bold mb-3 text-white">1. Pense no Computador como um Todo</h3>
                <p className="text-slate-200 leading-relaxed mb-4">
                  Não adianta só comprar o melhor disponível no mercado. A incompatibilidade pode existir entre 
                  quaisquer componentes do PC, por exemplo, entre o processador (CPU) e seu encaixe na placa-mãe (socket). 
                  Você deve conferir a compatibilidade antes de escolher.
                </p>
                <p className="text-slate-200 leading-relaxed">
                  Evite gastos inúteis escolhendo componentes com características que realmente serão usadas. 
                  Conferir os requerimentos dos jogos é essencial para não desperdiçar dinheiro.
                </p>
              </div>

              {/* Dica 2 */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-2xl font-bold mb-3 text-white">2. Saiba que Jogos Você Quer Jogar</h3>
                <p className="text-slate-200 leading-relaxed mb-4">
                  Para saber os requerimentos, tenha em mente os jogos que pretende rodar. Games variam muito 
                  seus requerimentos entre si e nem todos demandam as mesmas coisas.
                </p>
                <p className="text-slate-200 leading-relaxed">
                  Alguns podem demandar mais do armazenamento e da velocidade de transferência de dados. 
                  Placa de vídeo, RAM e CPU não são tudo - entenda o que cada jogo precisa.
                </p>
              </div>

              {/* Dica 3 */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-2xl font-bold mb-3 text-white">3. Escolha Bem seus Periféricos</h3>
                <p className="text-slate-200 leading-relaxed mb-4">
                  Monitores não são só resolução: o tempo de resposta e a taxa de atualização levam a imagem 
                  mais rapidamente à tela. Imagine perder uma partida por causa da demora em ver algo!
                </p>
                <p className="text-slate-200 leading-relaxed">
                  Teclado e mouse gamer são essenciais hoje em dia. E além de áudio, o headset é comunicação: 
                  jogando em equipe, é um pré-requisito.
                </p>
              </div>

              {/* Dica 4 */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                <h3 className="text-2xl font-bold mb-3 text-white">4. Não Compre em Qualquer Lugar</h3>
                <p className="text-slate-200 leading-relaxed mb-4">
                  Montar um PC gamer é um investimento que em geral dá retorno com a durabilidade. 
                  Por isso, não escolha lojas ou fabricantes suspeitos.
                </p>
                <p className="text-slate-200 leading-relaxed">
                  Prefira fábricas que já têm reconhecimento, como Intel e AMD, e fornecedores confiáveis. 
                  A economia inicial pode sair cara no futuro.
                </p>
              </div>

              {/* Dica 5 */}
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                <h3 className="text-2xl font-bold mb-3 text-white">5. Valorize a Performance Acima de Tudo</h3>
                <p className="text-slate-200 leading-relaxed mb-4">
                  Ainda que haja times no mundo do hardware (Intel vs. AMD, Nvidia vs. AMD...), no final das contas 
                  o importante é o aproveitamento dos componentes para obter a melhor performance.
                </p>
                <p className="text-slate-200 leading-relaxed">
                  Compare placas de vídeo, processadores e tudo mais para não investir o dinheiro economizado 
                  com suor em algo sem retorno. Escolha produtos com o melhor custo-benefício!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção SEO - Recarga de Jogos */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8 text-white">
              Recarga de Diamantes e Créditos para Jogos
            </h2>
            <p className="text-slate-300 text-center mb-12 text-lg">
              Tudo sobre recarga de jogos, diamantes FF e muito mais
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-blue-500/30">
                <h3 className="text-xl font-bold mb-3 text-blue-300">Recarga Diamantes FF</h3>
                <p className="text-slate-200 leading-relaxed">
                  Os diamantes são a moeda premium do Free Fire. Com eles você pode comprar skins exclusivas, 
                  personagens, pacotes especiais e muito mais. A recarga é rápida e segura, garantindo que você 
                  aproveite ao máximo sua experiência no jogo.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-blue-500/30">
                <h3 className="text-xl font-bold mb-3 text-blue-300">Recarga com ID do Jogo</h3>
                <p className="text-slate-200 leading-relaxed">
                  A recarga com ID é o método mais seguro e prático. Basta informar seu ID do jogo e pronto! 
                  Não é necessário senha ou dados sensíveis. O crédito cai direto na sua conta em poucos minutos, 
                  permitindo que você volte a jogar rapidamente.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-green-500/30">
                <h3 className="text-xl font-bold mb-3 text-green-300">Dimas FF e Outros Jogos</h3>
                <p className="text-slate-200 leading-relaxed">
                  Além do Free Fire, oferecemos recarga para diversos jogos populares como PUBG Mobile, 
                  Mobile Legends, Genshin Impact e muito mais. Todos com o mesmo padrão de qualidade e segurança 
                  que você merece.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-purple-500/30">
                <h3 className="text-xl font-bold mb-3 text-purple-300">Pagamento Seguro</h3>
                <p className="text-slate-200 leading-relaxed">
                  Todas as transações são protegidas com criptografia de ponta. Aceitamos PIX, cartão de crédito 
                  e outras formas de pagamento. Seu dinheiro e seus dados estão sempre seguros conosco.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Por Que Escolher */}
      <section id="sobre" className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Por Que Escolher Comprar Diamantes FF?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Somos a plataforma mais confiável para adquirir diamantes Free Fire no Brasil
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Entrega Rápida</h3>
              <p className="text-slate-300 leading-relaxed">
                Receba seus diamantes em até 5 minutos após a confirmação do pagamento. Processo automatizado e eficiente.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-green-500/50 transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/50">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">100% Seguro</h3>
              <p className="text-slate-300 leading-relaxed">
                Transações protegidas com criptografia SSL. Seus dados e pagamentos estão completamente seguros conosco.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Pagamento Fácil</h3>
              <p className="text-slate-300 leading-relaxed">
                Aceitamos PIX, cartão de crédito e outras formas de pagamento. Escolha a que for mais conveniente para você.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-500/50 transition-all transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/50">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Suporte 24/7</h3>
              <p className="text-slate-300 leading-relaxed">
                Nossa equipe está sempre disponível para ajudar. Atendimento rápido e eficiente a qualquer hora do dia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Blog */}
      <BlogSection />

      {/* Newsletter */}
      <Newsletter />

      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Informações da Empresa */}
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Sobre */}
              <div>
                <h3 className="text-xl font-bold mb-4">Comprar Diamantes FF</h3>
                <p className="text-slate-300 text-sm mb-4">
                  Plataforma líder em venda de diamantes para Free Fire. Segurança, rapidez e confiabilidade em cada transação.
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <a href="mailto:contato_loja@comprardiamantesff.shop" className="text-slate-300 hover:text-white text-sm">
                    contato_loja@comprardiamantesff.shop
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <a href="tel:+5511945622020" className="text-slate-300 hover:text-white text-sm">
                    (11) 94562-2020
                  </a>
                </div>
              </div>

              {/* Dados da Empresa */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Informações Legais</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p>
                    <span className="font-semibold text-white">Razão Social:</span><br />
                    AMANDA IZABEL DUTRA DA SILVA
                  </p>
                  <p>
                    <span className="font-semibold text-white">CNPJ:</span><br />
                    60.730.759/0001-51
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <span>
                      Avenida Santo Amaro, 765<br />
                      Vila Nova Conceição - São Paulo/SP<br />
                      CEP: 04505-001
                    </span>
                  </p>
                </div>
              </div>

              {/* Links Úteis */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => setShowPrivacyModal(true)}
                    className="block text-slate-300 hover:text-white transition-colors text-sm text-left"
                  >
                    → Política de Privacidade
                  </button>
                  <button 
                    onClick={() => setShowTermsModal(true)}
                    className="block text-slate-300 hover:text-white transition-colors text-sm text-left"
                  >
                    → Termos de Uso
                  </button>
                  <a 
                    href="#sobre" 
                    className="block text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    → Sobre Nós
                  </a>
                  <a 
                    href="#contato" 
                    className="block text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    → Contato
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </footer>

      {/* Footer Profissional */}
      <Footer />

      {/* Botão de Teste Google Ads */}
      <GoogleAdsTest />

      {/* Modal de Endereço */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-blue-500/30">
            {/* Header do Modal */}
            <div className="bg-slate-800/80 backdrop-blur-sm text-white p-6 rounded-t-2xl relative border-b border-blue-500/30">
              <button
                onClick={() => setShowAddressModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="text-xl font-bold">Dados Entrega</h3>
                  <p className="text-slate-300 text-sm">{selectedProduct}</p>
                </div>
              </div>
            </div>

            {/* Steps Indicator */}
            <div className="flex items-center justify-center gap-2 p-4 bg-slate-800/50">
              <div className={`flex items-center gap-2 ${
                currentStep >= 1 ? 'text-blue-400' : 'text-slate-500'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-700'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">CEP</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-600" />
              <div className={`flex items-center gap-2 ${
                currentStep >= 2 ? 'text-blue-400' : 'text-slate-500'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-700'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Endereço</span>
              </div>
              <div className="w-8 h-0.5 bg-slate-600" />
              <div className={`flex items-center gap-2 ${
                currentStep >= 3 ? 'text-blue-400' : 'text-slate-500'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-700'
                }`}>
                  3
                </div>
                <span className="text-sm font-medium">Confirmar</span>
              </div>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              {/* Step 1 - CEP */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Digite seu CEP
                    </label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      maxLength={9}
                      value={addressData.cep.replace(/(\d{5})(\d)/, '$1-$2')}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setAddressData(prev => ({ ...prev, cep: value }))
                        if (value.length === 8) {
                          handleCepSearch(value)
                        }
                      }}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white text-lg placeholder-slate-400"
                    />
                  </div>
                  {loadingCep && (
                    <p className="text-sm text-blue-400 flex items-center gap-2">
                      <span className="animate-spin">⏳</span> Buscando endereço...
                    </p>
                  )}
                  <p className="text-xs text-slate-300">
                    Informe seu CEP para calcularmos o frete e prazo de entrega
                  </p>
                </div>
              )}

              {/* Step 2 - Complemento do Endereço */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                    <p className="text-xs text-slate-300 mb-2">Endereço encontrado:</p>
                    <p className="text-sm font-medium text-white">
                      {addressData.logradouro}<br />
                      {addressData.bairro} - {addressData.cidade}/{addressData.estado}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 123"
                      value={addressData.numero}
                      onChange={(e) => setAddressData(prev => ({ ...prev, numero: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Complemento (opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Apto 101, Bloco B"
                      value={addressData.complemento}
                      onChange={(e) => setAddressData(prev => ({ ...prev, complemento: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={() => {
                        if (!addressData.numero) {
                          alert('Por favor, informe o número')
                          return
                        }
                        setCurrentStep(3)
                      }}
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 - Confirmação */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-slate-700/30 p-4 rounded-lg border border-blue-500/30">
                    <div className="flex items-start gap-3 mb-3">
                      <Truck className="w-5 h-5 text-blue-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-white mb-1">Endereço de Entrega</h4>
                        <p className="text-sm text-slate-200">
                          {addressData.logradouro}, {addressData.numero}
                          {addressData.complemento && ` - ${addressData.complemento}`}<br />
                          {addressData.bairro}<br />
                          {addressData.cidade}/{addressData.estado}<br />
                          CEP: {addressData.cep.replace(/(\d{5})(\d)/, '$1-$2')}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                    <h4 className="font-semibold text-white mb-2">Produto</h4>
                    <p className="text-sm text-slate-200">{selectedProduct}</p>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                    <p className="text-sm text-blue-300">
                      ℹ️ Entraremos em contato para confirmar o pedido e informar o valor do frete.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Voltar
                    </button>
                    <button
                      onClick={handleGeneratePix}
                      disabled={generatingPix}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingPix ? 'Gerando PIX...' : 'Gerar PIX'}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4 - Pagamento PIX */}
              {currentStep === 4 && pixData && (
                <div className="space-y-4">
                  {paymentStatus === 'paid' ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-green-400 mb-2">Pagamento Confirmado!</h3>
                      <p className="text-slate-300">Redirecionando...</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-white mb-2">Escaneie o QR Code</h3>
                        <p className="text-sm text-slate-300 mb-4">Use o app do seu banco para pagar</p>
                      </div>

                      {/* QR Code */}
                      <div className="bg-white p-4 rounded-lg relative">
                        <img 
                          src={pixData.qrCodeImage} 
                          alt="QR Code PIX" 
                          className="w-full max-w-[256px] mx-auto"
                        />
                        {/* Logo no centro do QR Code */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <LightningLogo size="md" />
                        </div>
                      </div>

                      {/* Valor */}
                      <div className="bg-slate-700/30 p-4 rounded-lg border border-blue-500/30 text-center">
                        <p className="text-sm text-slate-300 mb-1">Valor a pagar</p>
                        <p className="text-2xl font-bold text-green-400">
                          R$ {(pixData.amount / 100).toFixed(2).replace('.', ',')}
                        </p>
                      </div>

                      {/* Copia e Cola */}
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Ou copie o código PIX
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={pixData.qrCode}
                            readOnly
                            className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(pixData.qrCode)
                              setCopiedPix(true)
                              setTimeout(() => setCopiedPix(false), 2000)
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              copiedPix 
                                ? 'bg-green-600 text-white' 
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {copiedPix ? '✓ Copiado' : 'Copiar'}
                          </button>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <p className="text-sm text-blue-300">
                            Aguardando pagamento...
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-white text-lg font-semibold">Carregando...</p>
          </div>
        </div>
      )}

      {/* Modal Política de Privacidade */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6 rounded-t-2xl relative sticky top-0">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">Política de Privacidade</h2>
            </div>
            <div className="p-6 space-y-6 text-slate-700">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-600">
                  <strong>Última atualização:</strong> 27 de outubro de 2025<br />
                  <strong>Empresa:</strong> LUIZ ANTONIO SOUZA DOS SANTOS<br />
                  <strong>CNPJ:</strong> 45.123.456/0001-78
                </p>
              </div>
              
              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">1. Introdução</h3>
                <p className="mb-2">
                  LUIZ ANTONIO SOUZA DOS SANTOS, inscrito no CNPJ 45.123.456/0001-78, com sede na Rua das Tecnologias, 1234, Centro, Feira de Santana/BA, CEP 44001-000, está comprometido em proteger a privacidade e os dados pessoais de seus usuários.
                </p>
                <p>
                  Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e demais legislações aplicáveis.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">2. Informações que Coletamos</h3>
                <p className="mb-2"><strong>2.1 Dados Pessoais Fornecidos por Você:</strong></p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>Nome completo</li>
                  <li>CPF (Cadastro de Pessoa Física)</li>
                  <li>Endereço de e-mail</li>
                  <li>Número de telefone</li>
                  <li>Endereço completo para entrega</li>
                  <li>Dados de pagamento (processados por gateway seguro)</li>
                </ul>
                <p className="mb-2"><strong>2.2 Dados Coletados Automaticamente:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Endereço IP</li>
                  <li>Tipo de navegador e dispositivo</li>
                  <li>Páginas visitadas e tempo de navegação</li>
                  <li>Cookies e tecnologias similares</li>
                  <li>Dados de localização (quando autorizado)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">3. Como Usamos suas Informações</h3>
                <p className="mb-2">Utilizamos seus dados pessoais para as seguintes finalidades:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Processar pedidos:</strong> Confirmar, processar e entregar produtos adquiridos</li>
                  <li><strong>Comunicação:</strong> Enviar confirmações de pedidos, atualizações de entrega e suporte ao cliente</li>
                  <li><strong>Melhorias:</strong> Analisar o uso do site para melhorar nossos serviços</li>
                  <li><strong>Marketing:</strong> Enviar ofertas e promoções (com seu consentimento)</li>
                  <li><strong>Segurança:</strong> Prevenir fraudes e garantir a segurança da plataforma</li>
                  <li><strong>Cumprimento legal:</strong> Atender obrigações legais e regulatórias</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">4. Base Legal para Tratamento de Dados</h3>
                <p className="mb-2">Tratamos seus dados pessoais com base nas seguintes hipóteses legais:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Consentimento:</strong> Quando você autoriza expressamente</li>
                  <li><strong>Execução de contrato:</strong> Para processar e entregar seus pedidos</li>
                  <li><strong>Obrigação legal:</strong> Para cumprir exigências legais e regulatórias</li>
                  <li><strong>Legítimo interesse:</strong> Para melhorar nossos serviços e prevenir fraudes</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">5. Compartilhamento de Informações</h3>
                <p className="mb-2">Podemos compartilhar suas informações com:</p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li><strong>Processadores de pagamento:</strong> Para processar transações financeiras de forma segura</li>
                  <li><strong>Transportadoras:</strong> Para entrega de produtos</li>
                  <li><strong>Provedores de serviços:</strong> Que nos auxiliam na operação do site (hospedagem, analytics)</li>
                  <li><strong>Autoridades:</strong> Quando exigido por lei ou ordem judicial</li>
                </ul>
                <p className="font-semibold text-blue-900">
                  Importante: NÃO vendemos, alugamos ou comercializamos seus dados pessoais com terceiros para fins de marketing.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">6. Cookies e Tecnologias Similares</h3>
                <p className="mb-2">
                  Utilizamos cookies para melhorar sua experiência de navegação. Cookies são pequenos arquivos de texto armazenados em seu dispositivo.
                </p>
                <p className="mb-2"><strong>Tipos de cookies que utilizamos:</strong></p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li><strong>Essenciais:</strong> Necessários para o funcionamento do site</li>
                  <li><strong>Funcionais:</strong> Lembram suas preferências</li>
                  <li><strong>Analytics:</strong> Ajudam a entender como você usa o site</li>
                  <li><strong>Marketing:</strong> Personalizam anúncios (com seu consentimento)</li>
                </ul>
                <p>Você pode gerenciar ou desativar cookies nas configurações do seu navegador.</p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">7. Segurança dos Dados</h3>
                <p className="mb-2">
                  Implementamos medidas técnicas e organizacionais para proteger seus dados pessoais:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Criptografia SSL/TLS para transmissão de dados</li>
                  <li>Armazenamento seguro em servidores protegidos</li>
                  <li>Controle de acesso restrito aos dados</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Backups regulares</li>
                  <li>Treinamento de equipe em proteção de dados</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">8. Retenção de Dados</h3>
                <p className="mb-2">
                  Mantemos seus dados pessoais pelo tempo necessário para:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>Cumprir as finalidades descritas nesta política</li>
                  <li>Atender obrigações legais (ex: dados fiscais por 5 anos)</li>
                  <li>Resolver disputas e fazer cumprir acordos</li>
                </ul>
                <p>
                  Após esse período, os dados serão excluídos ou anonimizados de forma segura.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">9. Seus Direitos (LGPD)</h3>
                <p className="mb-2">Você tem os seguintes direitos sobre seus dados pessoais:</p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li><strong>Confirmação:</strong> Saber se tratamos seus dados</li>
                  <li><strong>Acesso:</strong> Obter cópia dos seus dados</li>
                  <li><strong>Correção:</strong> Corrigir dados incompletos ou desatualizados</li>
                  <li><strong>Anonimização:</strong> Solicitar anonimização dos dados</li>
                  <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                  <li><strong>Eliminação:</strong> Solicitar exclusão dos dados (exceto quando houver obrigação legal de retenção)</li>
                  <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                  <li><strong>Oposição:</strong> Opor-se ao tratamento em certas circunstâncias</li>
                </ul>
                <p className="font-semibold text-blue-900">
                  Para exercer seus direitos, entre em contato através dos canais indicados na seção 11.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">10. Menores de Idade</h3>
                <p>
                  Nossos serviços não são direcionados a menores de 18 anos. Não coletamos intencionalmente dados de menores sem o consentimento dos pais ou responsáveis legais. Se tomarmos conhecimento de que coletamos dados de um menor sem autorização, tomaremos medidas para excluir essas informações.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">11. Contato e Encarregado de Dados (DPO)</h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="mb-2">Para questões sobre esta política ou exercer seus direitos:</p>
                  <p className="mb-1"><strong>AMANDA IZABEL DUTRA DA SILVA</strong></p>
                  <p className="mb-1">Encarregado de Proteção de Dados (DPO)</p>
                  <p className="mb-1">📧 E-mail: contato_loja@comprardiamantesff.shop</p>
                  <p className="mb-1">📞 Telefone: (11) 94562-2020</p>
                  <p className="mb-1">📍 Endereço: Rua das Tecnologias, 1234 - Centro, Feira de Santana/BA - CEP: 44001-000</p>
                  <p className="mt-3 text-sm text-slate-600">
                    Responderemos sua solicitação em até 15 dias úteis, conforme previsto na LGPD.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">12. Alterações nesta Política</h3>
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas através do site ou por e-mail. A data da última atualização será sempre indicada no topo deste documento.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">13. Legislação Aplicável</h3>
                <p>
                  Esta Política de Privacidade é regida pelas leis brasileiras, especialmente pela Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), Marco Civil da Internet (Lei nº 12.965/2014) e Código de Defesa do Consumidor (Lei nº 8.078/1990).
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Modal Termos de Uso */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6 rounded-t-2xl relative sticky top-0">
              <button
                onClick={() => setShowTermsModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">Termos de Uso</h2>
            </div>
            <div className="p-6 space-y-6 text-slate-700">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-slate-600">
                  <strong>Última atualização:</strong> 27 de outubro de 2025<br />
                  <strong>Empresa:</strong> LUIZ ANTONIO SOUZA DOS SANTOS<br />
                  <strong>CNPJ:</strong> 45.123.456/0001-78
                </p>
              </div>
              
              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">1. Aceitação dos Termos</h3>
                <p className="mb-2">
                  Bem-vindo ao site da LUIZ ANTONIO SOUZA DOS SANTOS ("nós", "nosso" ou "empresa"). Ao acessar e utilizar este site (www.comprardiamantesff.shop), você ("usuário" ou "você") concorda em cumprir e estar vinculado a estes Termos de Uso.
                </p>
                <p className="mb-2">
                  Se você não concordar com qualquer parte destes termos, não deverá utilizar nosso site ou serviços.
                </p>
                <p className="font-semibold text-blue-900">
                  Ao realizar um pedido ou cadastro, você confirma que leu, entendeu e aceitou estes Termos de Uso e nossa Política de Privacidade.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">2. Definições</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>"Site":</strong> Refere-se ao portal www.comprardiamantesff.shop e todos os seus subdomínios</li>
                  <li><strong>"Serviços":</strong> Todos os serviços oferecidos através do site</li>
                  <li><strong>"Usuário":</strong> Qualquer pessoa que acesse ou utilize o site</li>
                  <li><strong>"Produtos":</strong> Itens disponíveis para consulta e aquisição no site</li>
                  <li><strong>"Conteúdo":</strong> Textos, imagens, vídeos e demais materiais disponíveis no site</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">3. Cadastro e Conta de Usuário</h3>
                <p className="mb-2"><strong>3.1 Informações Verdadeiras:</strong></p>
                <p className="mb-3">
                  Ao se cadastrar, você concorda em fornecer informações verdadeiras, precisas, atuais e completas. É sua responsabilidade manter essas informações atualizadas.
                </p>
                <p className="mb-2"><strong>3.2 Responsabilidade pela Conta:</strong></p>
                <p className="mb-3">
                  Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
                </p>
                <p className="mb-2"><strong>3.3 Idade Mínima:</strong></p>
                <p>
                  Você deve ter pelo menos 18 anos de idade para criar uma conta e realizar compras. Menores de 18 anos devem ter autorização dos pais ou responsáveis legais.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">4. Uso Permitido do Site</h3>
                <p className="mb-2">Você concorda em utilizar o site apenas para fins legais e de acordo com estes termos. É proibido:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violar qualquer lei ou regulamento aplicável</li>
                  <li>Infringir direitos de propriedade intelectual</li>
                  <li>Transmitir vírus, malware ou código malicioso</li>
                  <li>Tentar acessar áreas restritas do site sem autorização</li>
                  <li>Usar o site para fins fraudulentos ou enganosos</li>
                  <li>Coletar dados de outros usuários sem consentimento</li>
                  <li>Realizar engenharia reversa ou descompilar qualquer parte do site</li>
                  <li>Usar bots, scrapers ou ferramentas automatizadas sem autorização</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">5. Produtos e Serviços</h3>
                <p className="mb-2"><strong>5.1 Disponibilidade:</strong></p>
                <p className="mb-3">
                  Todos os produtos estão sujeitos a disponibilidade. Reservamo-nos o direito de limitar quantidades, descontinuar produtos ou recusar pedidos a nosso exclusivo critério.
                </p>
                <p className="mb-2"><strong>5.2 Descrições e Imagens:</strong></p>
                <p className="mb-3">
                  Fazemos o possível para exibir descrições e imagens precisas dos produtos. No entanto, não garantimos que as cores, descrições ou imagens sejam 100% precisas devido a variações de monitores e dispositivos.
                </p>
                <p className="mb-2"><strong>5.3 Preços:</strong></p>
                <p>
                  Todos os preços estão em Reais (BRL) e podem ser alterados sem aviso prévio. Os preços vigentes são aqueles exibidos no momento da finalização do pedido.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">6. Pedidos e Pagamentos</h3>
                <p className="mb-2"><strong>6.1 Confirmação de Pedido:</strong></p>
                <p className="mb-3">
                  Ao fazer um pedido, você receberá um e-mail de confirmação. A confirmação não significa aceitação do pedido - reservamo-nos o direito de recusar ou cancelar qualquer pedido por motivos como: erro de preço, indisponibilidade, suspeita de fraude ou outros motivos legítimos.
                </p>
                <p className="mb-2"><strong>6.2 Formas de Pagamento:</strong></p>
                <p className="mb-3">
                  Aceitamos as formas de pagamento indicadas no site. Todos os pagamentos são processados através de gateways seguros e criptografados.
                </p>
                <p className="mb-2"><strong>6.3 Segurança de Pagamento:</strong></p>
                <p>
                  Utilizamos tecnologia SSL/TLS para proteger suas informações de pagamento. Não armazenamos dados completos de cartão de crédito em nossos servidores.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">7. Entrega e Prazos</h3>
                <p className="mb-2"><strong>7.1 Prazos Estimados:</strong></p>
                <p className="mb-3">
                  Os prazos de entrega informados são estimativas e começam a contar após a confirmação do pagamento. Não nos responsabilizamos por atrasos causados por transportadoras, greves, condições climáticas ou outros eventos fora de nosso controle.
                </p>
                <p className="mb-2"><strong>7.2 Endereço de Entrega:</strong></p>
                <p className="mb-3">
                  É responsabilidade do usuário fornecer um endereço completo e correto. Não nos responsabilizamos por entregas não realizadas devido a endereços incorretos ou incompletos.
                </p>
                <p className="mb-2"><strong>7.3 Rastreamento:</strong></p>
                <p>
                  Quando disponível, forneceremos código de rastreamento para acompanhamento da entrega.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">8. Direito de Arrependimento (CDC)</h3>
                <p className="mb-2">
                  Conforme o Código de Defesa do Consumidor (Lei nº 8.078/1990), você tem o direito de desistir da compra no prazo de 7 (sete) dias corridos a partir do recebimento do produto, sem necessidade de justificativa.
                </p>
                <p className="mb-2"><strong>Condições para devolução:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Produto em perfeito estado, sem sinais de uso</li>
                  <li>Embalagem original intacta</li>
                  <li>Todos os acessórios e manuais incluídos</li>
                  <li>Nota fiscal</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">9. Propriedade Intelectual</h3>
                <p className="mb-2">
                  Todo o conteúdo do site, incluindo mas não limitado a textos, gráficos, logos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade da LUIZ ANTONIO SOUZA DOS SANTOS ou de seus fornecedores de conteúdo e está protegido por leis de direitos autorais brasileiras e internacionais.
                </p>
                <p className="mb-2"><strong>Uso Permitido:</strong></p>
                <p>
                  Você pode visualizar e imprimir páginas do site para uso pessoal e não comercial. Qualquer outro uso, incluindo reprodução, modificação, distribuição ou republicação, requer autorização prévia por escrito.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">10. Limitação de Responsabilidade</h3>
                <p className="mb-2">
                  Na extensão máxima permitida pela lei aplicável:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>O site é fornecido "como está" e "conforme disponível"</li>
                  <li>Não garantimos que o site estará sempre disponível ou livre de erros</li>
                  <li>Não nos responsabilizamos por danos indiretos, incidentais, especiais ou consequenciais</li>
                  <li>Nossa responsabilidade total não excederá o valor pago pelo produto em questão</li>
                </ul>
                <p className="font-semibold text-blue-900">
                  Esta limitação não se aplica a casos de dolo ou culpa grave, conforme previsto na legislação brasileira.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">11. Indenização</h3>
                <p>
                  Você concorda em indenizar e isentar a LUIZ ANTONIO SOUZA DOS SANTOS, seus diretores, funcionários e parceiros de quaisquer reivindicações, perdas, responsabilidades, danos, custos e despesas (incluindo honorários advocatícios) decorrentes de: (a) seu uso do site; (b) violação destes Termos de Uso; (c) violação de direitos de terceiros.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">12. Modificações dos Termos</h3>
                <p className="mb-2">
                  Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação no site.
                </p>
                <p>
                  É sua responsabilidade revisar periodicamente estes termos. O uso continuado do site após alterações constitui aceitação dos novos termos.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">13. Rescisão</h3>
                <p>
                  Podemos suspender ou encerrar seu acesso ao site imediatamente, sem aviso prévio, se você violar estes Termos de Uso ou por qualquer outro motivo que consideremos apropriado.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">14. Lei Aplicável e Foro</h3>
                <p className="mb-2">
                  Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, especialmente:
                </p>
                <ul className="list-disc pl-6 space-y-1 mb-3">
                  <li>Código de Defesa do Consumidor (Lei nº 8.078/1990)</li>
                  <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
                  <li>Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</li>
                  <li>Código Civil Brasileiro (Lei nº 10.406/2002)</li>
                </ul>
                <p>
                  Fica eleito o foro da comarca de Feira de Santana/BA para dirimir quaisquer controvérsias oriundas destes termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">15. Disposições Gerais</h3>
                <p className="mb-2"><strong>15.1 Integralidade:</strong></p>
                <p className="mb-3">
                  Estes Termos de Uso, juntamente com a Política de Privacidade, constituem o acordo integral entre você e a LUIZ ANTONIO SOUZA DOS SANTOS.
                </p>
                <p className="mb-2"><strong>15.2 Divisibilidade:</strong></p>
                <p className="mb-3">
                  Se qualquer disposição destes termos for considerada inválida ou inexequível, as demais disposições permanecerão em pleno vigor e efeito.
                </p>
                <p className="mb-2"><strong>15.3 Renúncia:</strong></p>
                <p>
                  A falha em exercer ou fazer cumprir qualquer direito ou disposição destes termos não constituirá renúncia a tal direito ou disposição.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold mb-3 text-blue-800">16. Contato</h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="mb-2">Para questões sobre estes Termos de Uso ou nossos serviços:</p>
                  <p className="mb-1"><strong>AMANDA IZABEL DUTRA DA SILVA</strong></p>
                  <p className="mb-1">📧 E-mail: contato_loja@comprardiamantesff.shop</p>
                  <p className="mb-1">📞 Telefone: (11) 94562-2020</p>
                  <p className="mb-1">📍 Endereço: Rua das Tecnologias, 1234 - Centro, Feira de Santana/BA - CEP: 44001-000</p>
                  <p className="mb-1">🕐 Horário de atendimento: Segunda a Sexta, das 9h às 18h</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
