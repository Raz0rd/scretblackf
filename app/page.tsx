"use client"

import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, Clock, ShoppingCart, Star, Award, Users, X, Package, Truck, ChevronLeft, ChevronRight } from 'lucide-react'
import QRCode from 'qrcode'

interface AddressData {
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

interface Product {
  id: string
  name: string
  price: string
  description: string
  images: string[]
  features: string[]
  deliveryTime: string
  stock: boolean
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
  const [showProductModal, setShowProductModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
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
    if (urlParams.get('testGoogleAdsConv') === 'true') {
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
    const randomValue = (Math.random() * 100 + 10).toFixed(2)
    const conversionLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL || ''
    const awId = process.env.NEXT_PUBLIC_GOOGLE_ADS_AW_ID || ''
    
    console.log('🧪 [TEST] Testando conversão Google Ads')
    console.log('   - Valor aleatório:', randomValue)
    console.log('   - AW ID:', awId)
    console.log('   - Label:', conversionLabel)
    
    // Redirecionar para /success com parâmetros de teste
    window.location.href = `/success?test=true&value=${randomValue}&aw=${awId}&label=${conversionLabel}`
  }

  // Dados dos produtos
  const products: Product[] = [
    {
      id: 'kit-6-acessorios',
      name: 'Kit 6 Luvas Gamer Premium',
      price: 'R$ 13,29',
      description: 'Kit composto por 6 unidades de luvas gamer para jogar no celular e aumentar a sensibilidade dos jogos. Tecnologia têxtil 2022 com fibras de prata superfinas e filamentos de nylon. Com 50% de alto teor de fibra de prata para máxima precisão e zero toque quebrado.',
      images: [
        '/images/kit6_dedeira1.avif',
        '/images/kit6_dedeira1-1.avif',
        '/images/kit6_dedeira1-2.avif',
        '/images/kit6_dedeira1-3.avif'
      ],
      features: [
        '6 luvas gamer de alta performance',
        '50% fibra de prata + 25% fibra de carbono',
        'Tecnologia têxtil 2022 - tecelagem densa',
        'Compatível: Free Fire, PUBG, COD Mobile, Fortnite',
        'Tamanho único (5,5 a 8,3 polegadas)',
        'Pressão ideal: 2-3 Newtons (justo mas confortável)',
        'Contato duplo para atrito estável',
        '3x mais sensível que luvas comuns',
        'Testado: 5000 cliques sem falhas',
        'Anti-suor e respirável',
        'Compatível: Android e iOS',
        'Cor: Preto com borda azul',
        'Dimensões: 5x1.5x0.1cm',
        'Garantia: 30 dias'
      ],
      deliveryTime: '5-10 dias úteis',
      stock: true
    },
    {
      id: 'fone-premium',
      name: 'HyperX Cloud Earbuds II',
      price: 'R$ 178,20',
      description: 'Fones de ouvido gamer otimizados para áudio móvel. Com drivers de 14mm, proporcionam som imersivo para jogos, streaming e audiolivros. Design discreto com plugue 90° para evitar esbarrões e cabo resistente a emaranhamentos. Perfeito para quem exige qualidade de áudio e portabilidade.',
      images: [
        '/images/fone1.webp',
        '/images/fone1-1.webp',
        '/images/fone1-2.webp',
        '/images/fone1-3.webp'
      ],
      features: [
        'Drivers de 14mm otimizados para jogos móveis',
        'Som imersivo de alta qualidade',
        'Plugue 90° discreto anti-esbarrão',
        'Cabo resistente a torções e emaranhamentos',
        'Microfone integrado cristalino',
        'Botão multifuncional para chamadas e mídia',
        '4 conjuntos de pontas auriculares',
        'Ajuste perfeito para diferentes orelhas',
        'Estojo de transporte rígido incluso',
        'Compatível: PC, Nintendo Switch, Steam Deck',
        'Compatível: Dispositivos móveis Android e iOS',
        'Conexão: 3,5mm universal',
        'Ideal para jogos, streaming e podcasts',
        'Cor: Preto',
        'Marca: HyperX | Modelo: 70N24AA'
      ],
      deliveryTime: '3-7 dias úteis',
      stock: true
    },
    {
      id: 'gamesir-gatilho',
      name: 'GameSir F4 Falcon Gatilho',
      price: 'R$ 169,95',
      description: 'Controlador universal para jogos de tiro mobile. Equipado com seletor de modos como o M4A1 real, permite escolher entre 4 modos de disparo. Plug and Play - sem Bluetooth ou apps necessários. Compatível com PUBG, COD Mobile, Free Fire, Knives Out, Rules of Survival e mais.',
      images: [
        '/images/Gamesir1.webp',
        '/images/gamesir1-1.webp',
        '/images/gamesir1-2.webp',
        '/images/gamesir-1-3.webp'
      ],
      features: [
        '4 modos de disparo ajustáveis',
        'Modo Padrão: 1 clique = 1 tiro',
        'Modo 3 Burst: 1 clique = 3 tiros',
        'Modo 6 Burst: 1 clique = 6 tiros',
        'Modo 9 Burst: 1 clique = 9 tiros',
        'Seletor inspirado no M4A1 real',
        'Plug and Play - sem Bluetooth',
        'Não precisa de aplicativos',
        'Compatível: PUBG, COD Mobile, Free Fire',
        'Compatível: Knives Out, Rules of Survival',
        'Universal para telefones de até 5 polegadas',
        'Resposta ultra-rápida',
        'Design ergonômico profissional',
        'Dimensões: 9cm',
        'Peso: 100 gramas',
        'Garantia: 1 mês',
        'Código: gdgg7g9b74'
      ],
      deliveryTime: '5-10 dias úteis (Envio de SP)',
      stock: true
    }
  ]

  // Abrir modal de produto
  const openProductModal = (product: Product) => {
    setSelectedProductDetails(product)
    setCurrentImageIndex(0)
    setShowProductModal(true)
  }

  // Navegar entre imagens
  const nextImage = () => {
    if (selectedProductDetails) {
      setCurrentImageIndex((prev) => 
        prev === selectedProductDetails.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedProductDetails) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProductDetails.images.length - 1 : prev - 1
      )
    }
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
  const openAddressModal = (productName: string, productDetails?: Product) => {
    setSelectedProduct(productName)
    // Se productDetails foi passado, usar ele. Senão, buscar pelo nome
    if (productDetails) {
      setSelectedProductDetails(productDetails)
    } else {
      const product = products.find(p => p.name === productName)
      if (product) {
        setSelectedProductDetails(product)
      }
    }
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
    if (!selectedProductDetails) return
    
    setGeneratingPix(true)
    setIsLoading(true)
    
    try {
      // Extrair valor do preço (ex: "R$ 13,29" -> 1329 centavos)
      const priceValue = parseFloat(selectedProductDetails.price.replace('R$', '').replace(',', '.').trim())
      const amountInCents = Math.round(priceValue * 100)
      
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
          itemValue: selectedProductDetails.name,
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
      {/* Header */}
      <header className="bg-white/5 backdrop-blur-sm text-white shadow-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LightningLogo size="lg" />
              <div>
                <h1 className="text-4xl font-bold mb-2">Portal Digital</h1>
                <p className="text-slate-300 text-lg">Soluções e serviços digitais</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {showTestButton && (
                <button
                  onClick={testGoogleAdsConversion}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors"
                >
                  🧪 Testar Conversão
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white/5 backdrop-blur-sm text-white py-20 border-b border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6">Bem-vindo ao Portal</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Conectando pessoas e soluções digitais. Explore nossos serviços e produtos selecionados.
          </p>
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
      <section className="py-16 bg-white/5 backdrop-blur-sm">
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
      <section className="py-16 bg-white/5 backdrop-blur-sm">
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
                <p className="text-lg text-white">contato@webshop-kia.com</p>
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

      {/* Seção de Produtos - Discreta */}
      <section className="py-12 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-8 text-white">
              Produtos Selecionados
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                  onClick={() => openProductModal(product)}
                >
                  <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                        Ver Detalhes
                      </span>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-slate-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-lg font-bold text-slate-900 mb-3">
                    {product.price}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openProductModal(product)
                      }}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm py-2 px-4 rounded-lg transition-colors"
                    >
                      Ver Mais
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openAddressModal(product.name, product)
                      }}
                      className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-sm py-2 px-4 rounded-lg transition-colors"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              Produtos disponíveis mediante consulta. Entre em contato para mais informações.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Portal Digital</h3>
          <p className="text-slate-300 mb-6">
            Conectando pessoas e soluções
          </p>
          <div className="border-t border-slate-700 pt-6 mt-6">
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <button 
                onClick={() => setShowPrivacyModal(true)}
                className="text-slate-300 hover:text-white transition-colors underline"
              >
                Política de Privacidade
              </button>
              <span className="text-slate-600">|</span>
              <button 
                onClick={() => setShowTermsModal(true)}
                className="text-slate-300 hover:text-white transition-colors underline"
              >
                Termos de Uso
              </button>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              © 2025 Portal Digital<br />
              Todos os direitos reservados.
            </p>
            <p className="text-slate-500 text-xs">
              Portal de soluções digitais e produtos selecionados
            </p>
          </div>
        </div>
      </footer>

      {/* Modal de Detalhes do Produto */}
      {showProductModal && selectedProductDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6 rounded-t-2xl relative">
              <button
                onClick={() => setShowProductModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">{selectedProductDetails.name}</h2>
              <p className="text-blue-100 text-lg mt-1">{selectedProductDetails.price}</p>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Galeria de Imagens */}
                <div>
                  <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4">
                    <img 
                      src={selectedProductDetails.images[currentImageIndex]} 
                      alt={selectedProductDetails.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedProductDetails.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Miniaturas */}
                  <div className="grid grid-cols-4 gap-2">
                    {selectedProductDetails.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          currentImageIndex === index 
                            ? 'border-blue-600 scale-105' 
                            : 'border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${selectedProductDetails.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Informações do Produto */}
                <div className="space-y-6">
                  {/* Descrição */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Descrição</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedProductDetails.description}
                    </p>
                  </div>

                  {/* Características */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Características</h3>
                    <ul className="space-y-2">
                      {selectedProductDetails.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-600">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prazo de Entrega */}
                  <div className="bg-slate-700/30 border border-blue-500/30 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-blue-400" />
                      <h3 className="font-bold text-white">Prazo de Entrega</h3>
                    </div>
                    <p className="text-slate-200">{selectedProductDetails.deliveryTime}</p>
                  </div>

                  {/* Estoque */}
                  <div className={`p-4 rounded-lg ${
                    selectedProductDetails.stock 
                      ? 'bg-green-900/20 border border-green-500/30' 
                      : 'bg-red-900/20 border border-red-500/30'
                  }`}>
                    <p className={`font-semibold ${
                      selectedProductDetails.stock ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedProductDetails.stock ? '✓ Em estoque' : '✗ Fora de estoque'}
                    </p>
                  </div>

                  {/* Botão de Compra */}
                  <button
                    onClick={() => {
                      setShowProductModal(false)
                      openAddressModal(selectedProductDetails.name, selectedProductDetails)
                    }}
                    disabled={!selectedProductDetails.stock}
                    className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-colors ${
                      selectedProductDetails.stock
                        ? 'bg-blue-700 hover:bg-blue-800 text-white'
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {selectedProductDetails.stock ? 'Comprar Agora' : 'Indisponível'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6 rounded-t-2xl relative sticky top-0">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">Política de Privacidade</h2>
            </div>
            <div className="p-6 space-y-4 text-slate-700">
              <p className="text-sm text-slate-500">Última atualização: 27 de outubro de 2025</p>
              
              <section>
                <h3 className="text-lg font-bold mb-2">1. Informações que Coletamos</h3>
                <p>Coletamos informações que você nos fornece diretamente, como nome, e-mail, telefone e endereço quando você realiza uma compra ou entra em contato conosco.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">2. Como Usamos suas Informações</h3>
                <p>Utilizamos suas informações para processar pedidos, enviar produtos, melhorar nossos serviços e comunicar sobre promoções e novidades.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">3. Compartilhamento de Informações</h3>
                <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para processar seu pedido (transportadoras, processadores de pagamento).</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">4. Segurança</h3>
                <p>Implementamos medidas de segurança para proteger suas informações pessoais contra acesso não autorizado, alteração ou destruição.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">5. Seus Direitos</h3>
                <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Entre em contato conosco para exercer esses direitos.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">6. Contato</h3>
                <p>Para questões sobre esta política, entre em contato: contato@webshop-kia.com ou (75) 3465-3331.</p>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Modal Termos de Uso */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white p-6 rounded-t-2xl relative sticky top-0">
              <button
                onClick={() => setShowTermsModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold">Termos de Uso</h2>
            </div>
            <div className="p-6 space-y-4 text-slate-700">
              <p className="text-sm text-slate-500">Última atualização: 27 de outubro de 2025</p>
              
              <section>
                <h3 className="text-lg font-bold mb-2">1. Aceitação dos Termos</h3>
                <p>Ao acessar e usar este site, você aceita e concorda em cumprir estes termos e condições de uso.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">2. Uso do Site</h3>
                <p>Você concorda em usar o site apenas para fins legais e de maneira que não infrinja os direitos de terceiros.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">3. Produtos e Preços</h3>
                <p>Todos os produtos estão sujeitos a disponibilidade. Reservamo-nos o direito de limitar quantidades e descontinuar produtos. Os preços podem mudar sem aviso prévio.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">4. Pedidos e Pagamentos</h3>
                <p>Ao fazer um pedido, você garante que todas as informações fornecidas são verdadeiras e precisas. Reservamo-nos o direito de recusar ou cancelar qualquer pedido.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">5. Entrega</h3>
                <p>Os prazos de entrega são estimativas e podem variar. Não nos responsabilizamos por atrasos causados por transportadoras.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">6. Propriedade Intelectual</h3>
                <p>Todo o conteúdo deste site é protegido por direitos autorais e não pode ser reproduzido sem permissão.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">7. Limitação de Responsabilidade</h3>
                <p>Não nos responsabilizamos por danos indiretos, incidentais ou consequenciais resultantes do uso deste site ou produtos.</p>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-2">8. Contato</h3>
                <p>Para questões sobre estes termos, entre em contato: contato@webshop-kia.com ou (75) 3465-3331.</p>
              </section>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
