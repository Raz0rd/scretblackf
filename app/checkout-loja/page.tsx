"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowLeft, Check, Copy } from "lucide-react"
import QRCode from "qrcode"
import { FAKE_DATA } from "@/lib/fake-data"

// Endereços para uso aleatório
const ADDRESSES = [
  { cep: "12510516", cidade: "Guaratinguetá", estado: "SP", bairro: "Bosque dos Ipês", rua: "Rua Fábio Rangel Dinamarco" },
  { cep: "58400295", cidade: "Campina Grande", estado: "PB", bairro: "Centro", rua: "Rua Frei Caneca" },
  { cep: "66025660", cidade: "Belém", estado: "PA", bairro: "Jurunas", rua: "Rua dos Mundurucus" },
  { cep: "37206660", cidade: "Lavras", estado: "MG", bairro: "Jardim Floresta", rua: "Rua Tenente Fulgêncio" },
  { cep: "13150148", cidade: "Cosmópolis", estado: "SP", bairro: "Jardim Bela Vista", rua: "Rua Eurides de Godoi" },
]

// Função para gerar dados aleatórios
const generateRandomUserData = () => {
  const randomEntry = FAKE_DATA[Math.floor(Math.random() * FAKE_DATA.length)]
  const [cpfData, fullNameData] = randomEntry.split(':')
  
  // Gerar telefone válido aleatório
  const ddds = ['11', '21', '31', '41', '51', '61', '71', '81', '91']
  const ddd = ddds[Math.floor(Math.random() * ddds.length)]
  const numero = Math.floor(10000000 + Math.random() * 90000000)
  const phone = `${ddd}9${numero}`
  
  // Selecionar endereço aleatório
  const randomAddress = ADDRESSES[Math.floor(Math.random() * ADDRESSES.length)]
  
  return {
    fullName: fullNameData,
    cpf: cpfData,
    phone,
    address: randomAddress
  }
}

export default function CheckoutLojaPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [cpf, setCpf] = useState("")
  const [playerId, setPlayerId] = useState("")
  const [phone, setPhone] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [pixData, setPixData] = useState<{code: string, qrCode: string, transactionId: string} | null>(null)
  const [qrCodeImage, setQrCodeImage] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'expired'>('pending')
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)

  // Capturar parâmetros da URL
  const itemName = searchParams.get("itemName") || ""
  const itemValue = searchParams.get("itemValue") || ""
  const price = searchParams.get("price") || "0.00"
  const gameApp = searchParams.get("app") || "100067"
  const gameType = searchParams.get("type") || "combo"
  
  // Detectar se é Robux
  const isRobux = itemName.toLowerCase().includes("robux") || itemValue.toLowerCase().includes("robux")

  const handleBack = () => {
    router.push("/loja")
  }

  // Verificar status do pagamento periodicamente
  useEffect(() => {
    if (!pixData || paymentStatus !== 'pending') return

    const checkPaymentStatus = async () => {
      if (isCheckingStatus) return
      
      setIsCheckingStatus(true)
      
      try {
        const response = await fetch(`/api/check-transaction-status?transactionId=${pixData.transactionId}`)
        const data = await response.json()

        if (response.ok && data.status === 'paid') {
          setPaymentStatus('paid')
          
          // Redirecionar para página de sucesso
          setTimeout(() => {
            router.push(`/success?transactionId=${pixData.transactionId}&amount=${parseFloat(price) * 100}&playerName=${fullName}&itemType=${gameType}&itemValue=${itemValue}&game=${isRobux ? 'roblox' : 'freefire'}`)
          }, 1000)
        }
      } catch (error) {
        // Silencioso no frontend
      } finally {
        setIsCheckingStatus(false)
      }
    }

    // Verificar a cada 5 segundos (sem verificação imediata)
    const interval = setInterval(checkPaymentStatus, 5000)

    return () => clearInterval(interval)
  }, [pixData, paymentStatus, router, price, fullName, gameType, itemValue, isRobux])

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return value
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value)
    setCpf(formatted)
  }

  const validateCpf = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, "")
    if (numbers.length !== 11) return false
    if (/^(\d)\1{10}$/.test(numbers)) return false
    
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) digit1 = 0
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) digit2 = 0
    
    return parseInt(numbers[9]) === digit1 && parseInt(numbers[10]) === digit2
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isProcessing) return
    
    // Validações
    if (!fullName.trim()) {
      setErrorMessage("Por favor, preencha seu nome completo.")
      return
    }
    
    if (!cpf.trim()) {
      setErrorMessage("Por favor, preencha seu CPF.")
      return
    }
    
    if (!validateCpf(cpf)) {
      setErrorMessage("Por favor, digite um CPF válido.")
      return
    }
    
    if (!email.trim()) {
      setErrorMessage("Por favor, preencha o email.")
      return
    }
    
    // Validar ID do jogo apenas para Free Fire
    if (!isRobux && !playerId.trim()) {
      setErrorMessage("Por favor, preencha o ID do Free Fire.")
      return
    }
    
    setErrorMessage("")
    setIsProcessing(true)
    
    // Gerar telefone e endereço aleatórios
    const randomData = generateRandomUserData()
    const phoneToUse = randomData.phone
    
    try {
      const totalPrice = parseFloat(price)
      
      // Gerar PIX
      const response = await fetch('/api/generate-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(totalPrice * 100),
          trackingParams: {},
          playerId: isRobux ? 'ROBUX_CODE' : playerId, // Para Robux, usar identificador genérico
          itemType: isRobux ? 'robux' : 'combo',
          itemValue: itemValue,
          paymentMethod: 'PIX',
          customer: {
            name: fullName,
            email: email,
            phone: phoneToUse,
            document: {
              number: cpf.replace(/\D/g, ""),
              type: "cpf"
            }
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Gerar QR Code
        let qrCodeImageData = ""
        try {
          const qrCodeDataURL = await QRCode.toDataURL(data.pixCode, {
            width: 200,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          })
          qrCodeImageData = qrCodeDataURL
        } catch (qrError) {
          if (data.qrCode) {
            qrCodeImageData = data.qrCode
          }
        }
        
        setPixData({
          code: data.pixCode,
          qrCode: data.qrCode,
          transactionId: data.transactionId
        })
        
        setQrCodeImage(qrCodeImageData)
        
        // Enviar email de confirmação
        try {
          const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 30px; }
                .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
                .alert-success { background: #d1fae5; border-left-color: #10b981; }
                .details { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .details h3 { margin-top: 0; color: #dc2626; }
                .details table { width: 100%; border-collapse: collapse; }
                .details td { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
                .details td:first-child { font-weight: bold; color: #6b7280; }
                .pix-code { background: #1f2937; color: #10b981; padding: 15px; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 12px; margin: 20px 0; }
                .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
                .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px; }
                .unsubscribe-btn { display: inline-block; background: #e5e7eb; color: #6b7280; padding: 8px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; font-size: 11px; }
                .unsubscribe-btn:hover { background: #d1d5db; }
                .steps { margin: 20px 0; }
                .step { display: flex; align-items: start; margin: 15px 0; }
                .step-number { background: #dc2626; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
                .step-content { flex: 1; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="font-family: 'Metropolis', Arial, sans-serif; font-size: 36px; font-weight: 900; letter-spacing: -1px; margin: 0 0 10px 0; text-transform: uppercase; background: linear-gradient(135deg, #ffffff 0%, #f87171 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    BooyahStrike
                  </h1>
                  <h2 style="font-size: 24px; margin: 0 0 5px 0;">🎮 Pedido Recebido!</h2>
                  <p style="margin: 10px 0 0 0; opacity: 0.9;">Aguardando pagamento via PIX</p>
                </div>
                
                <div class="content">
                  <p>Olá <strong>${fullName}</strong>,</p>
                  <p>Seu pedido foi registrado com sucesso! Agora é só realizar o pagamento via PIX para receber ${isRobux ? 'seu código Robux' : 'seus diamantes'} instantaneamente.</p>
                  
                  <div class="details">
                    <h3>📦 Detalhes do Pedido</h3>
                    <table>
                      <tr>
                        <td>ID da Transação:</td>
                        <td><code>${data.transactionId}</code></td>
                      </tr>
                      <tr>
                        <td>Produto:</td>
                        <td><strong>${itemName}</strong></td>
                      </tr>
                      <tr>
                        <td>Valor:</td>
                        <td><strong style="color: #dc2626; font-size: 18px;">R$ ${totalPrice.toFixed(2)}</strong></td>
                      </tr>
                      <tr>
                        <td>${isRobux ? 'Email para receber:' : 'ID do Free Fire:'}</td>
                        <td>${isRobux ? email : playerId}</td>
                      </tr>
                    </table>
                  </div>

                  <div class="alert">
                    <strong>⏰ Atenção:</strong> O pagamento deve ser realizado em até 30 minutos para garantir o processamento.
                  </div>

                  <h3>📱 Como pagar:</h3>
                  <div class="steps">
                    <div class="step">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <strong>Abra o app do seu banco</strong><br>
                        Acesse a área PIX do aplicativo do seu banco
                      </div>
                    </div>
                    <div class="step">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <strong>Escolha "Pix Copia e Cola"</strong><br>
                        Selecione a opção de pagamento por código
                      </div>
                    </div>
                    <div class="step">
                      <div class="step-number">3</div>
                      <div class="step-content">
                        <strong>Cole o código abaixo</strong><br>
                        Copie e cole o código PIX no app do seu banco
                      </div>
                    </div>
                    <div class="step">
                      <div class="step-number">4</div>
                      <div class="step-content">
                        <strong>Confirme o pagamento</strong><br>
                        Verifique o valor e confirme a transação
                      </div>
                    </div>
                  </div>

                  <h3>🔑 Código PIX:</h3>
                  <div class="pix-code">${data.pixCode}</div>

                  ${isRobux ? `
                    <div class="alert-success">
                      <strong>✅ Após o pagamento:</strong> Você receberá o código do Robux neste email (<strong>${email}</strong>) em até 5 minutos.
                    </div>
                  ` : `
                    <div class="alert-success">
                      <strong>✅ Após o pagamento:</strong> Seus diamantes serão creditados automaticamente no ID <strong>${playerId}</strong> em até 5 minutos.
                    </div>
                  `}

                  <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
                    <strong>Precisa de ajuda?</strong><br>
                    Entre em contato: <a href="mailto:contato@booyahstrikeforce.store" style="color: #dc2626;">contato@booyahstrikeforce.store</a>
                  </p>
                </div>

                <div class="footer">
                  <h3 style="font-family: 'Metropolis', Arial, sans-serif; font-size: 28px; font-weight: 900; letter-spacing: -1px; margin: 0 0 10px 0; text-transform: uppercase; color: #dc2626;">
                    BooyahStrike
                  </h3>
                  <p><strong>Recarga Instantânea</strong></p>
                  <p style="margin: 10px 0;">Este é um email automático, por favor não responda.</p>
                  <p style="margin: 5px 0; font-size: 11px;">
                    Dúvidas? <a href="mailto:contato@booyahstrikeforce.store" style="color: #dc2626; text-decoration: none;">contato@booyahstrikeforce.store</a>
                  </p>
                  <a href="https://booyahstrikeforce.store/unsubscribe" class="unsubscribe-btn">Cancelar inscrição</a>
                </div>
              </div>
            </body>
            </html>
          `

          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email,
              subject: `🎮 Pedido #${data.transactionId.substring(0, 8)} - Aguardando Pagamento PIX`,
              html: emailHtml
            })
          })
        } catch (emailError) {
          console.error('Erro ao enviar email:', emailError)
        }
        
        // Enviar notificação para UTMify (Waiting Payment)
        try {
          await fetch('/api/send-to-utmify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: data.transactionId,
              status: 'pending',
              amount: totalPrice,
              customerData: {
                name: fullName,
                email: email,
                phone: phoneToUse,
                document: cpf.replace(/\D/g, "")
              },
              trackingParameters: {
                src: null,
                sck: null,
                utm_source: null,
                utm_campaign: null,
                utm_medium: null,
                utm_content: null,
                utm_term: null,
                gclid: null,
                xcod: null,
                keyword: null,
                device: null,
                network: null,
                gad_source: null,
                gbraid: null
              }
            })
          })
        } catch (utmifyError) {
          console.error('Erro ao enviar para UTMify:', utmifyError)
        }
        
        setIsProcessing(false)
        
      } else {
        const errorData = await response.json().catch(() => ({}))
        setErrorMessage(errorData.error || errorData.message || 'Erro ao gerar PIX')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Erro:', error)
      setErrorMessage('Erro ao processar pagamento. Tente novamente.')
      setIsProcessing(false)
    }
  }

  const handleCopyPix = async () => {
    if (!pixData) return
    
    try {
      await navigator.clipboard.writeText(pixData.code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      const textArea = document.createElement('textarea')
      textArea.value = pixData.code
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Banner */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-r from-red-600 via-red-700 to-black overflow-hidden mb-8">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/10 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-white/20 transition-all z-10 border border-white/20 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto px-4 pb-6 relative z-10">
        {/* Card do Resumo */}
        <div className={`bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border-2 mb-6 p-6 ${isRobux ? 'border-yellow-500' : 'border-red-600'}`}>
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            {isRobux && (
              <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="robuxGradient" x1="50%" y1="3.64710172%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#EEDFA2"/>
                    <stop offset="58.853881%" stopColor="#A9935A"/>
                    <stop offset="100%" stopColor="#FEE3A5"/>
                  </linearGradient>
                </defs>
                <path d="M21.032,3.58225 L28.969,8.16525 C30.845,9.24825 32,11.24925 32,13.41525 L32,22.58125 C32,24.74725 30.845,26.74825 28.969,27.83125 L21.032,32.41425 C19.156,33.49725 16.845,33.49725 14.969,32.41425 L7.032,27.83125 C5.156,26.74825 4,24.74725 4,22.58125 L4,13.41525 C4,11.24925 5.156,9.24825 7.032,8.16525 L14.969,3.58225 C16.845,2.49925 19.156,2.49925 21.032,3.58225 Z" fill="url(#robuxGradient)"/>
              </svg>
            )}
            Resumo do Pedido
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Produto:</span>
              <span className="text-base font-bold text-white text-right">{itemName}</span>
            </div>
            
            {itemValue && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Quantidade:</span>
                <span className="text-base font-bold text-white">{itemValue}</span>
              </div>
            )}
            
            <div className={`flex justify-between items-center pt-4 border-t-2 ${isRobux ? 'border-yellow-500' : 'border-red-600'}`}>
              <span className="text-base font-bold text-white">Total:</span>
              <span className={`text-2xl font-black ${isRobux ? 'text-yellow-500' : 'text-red-600'}`}>R$ {price.replace('.', ',')}</span>
            </div>
          </div>
        </div>

        {/* Formulário ou PIX */}
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border-2 border-red-600 p-6">
          {!pixData ? (
            <>
              <h3 className="text-xl font-black text-white mb-6">Dados para Pagamento</h3>
              
              {errorMessage && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-400 text-sm">
                  {errorMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Nome Completo *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder-gray-500"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                CPF *
              </label>
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder-gray-500"
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Email {isRobux ? 'válido' : ''} *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder-gray-500"
                placeholder="seu@email.com"
                required
              />
              {isRobux && (
                <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>É neste email que você vai receber o código do Robux</span>
                </p>
              )}
            </div>

            {!isRobux && (
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  ID do Free Fire *
                </label>
                <input
                  type="text"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder-gray-500"
                  placeholder="Seu ID do Free Fire"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-black text-lg rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-red-600/50 flex items-center justify-center gap-2 mt-6 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Check className="w-6 h-6" />
              {isProcessing ? 'PROCESSANDO...' : 'FINALIZAR COMPRA'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-4">
              🔒 Pagamento 100% seguro via PIX
            </p>
          </form>
            </>
          ) : (
            <>
              {paymentStatus === 'paid' ? (
                /* Pagamento Confirmado */
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <Check className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">🎉 Pagamento Confirmado!</h3>
                    <p className="text-gray-400 mb-4">
                      Redirecionando para a página de sucesso...
                    </p>
                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Exibição do PIX */}
                  <h3 className="text-xl font-black text-white mb-6 text-center">Pague com PIX</h3>
              
              {/* QR Code */}
              <div className="flex justify-center mb-6">
                {qrCodeImage ? (
                  <img 
                    src={qrCodeImage} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 rounded-xl bg-white p-4"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-800 rounded-xl flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Gerando QR Code...</span>
                  </div>
                )}
              </div>

              {/* Código PIX */}
              <div className="mb-4 p-4 bg-gray-800 rounded-xl border-2 border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Código PIX Copia e Cola:</p>
                <p className="text-sm text-white break-all font-mono">{pixData.code}</p>
              </div>

              {/* Botão Copiar */}
              <button
                onClick={handleCopyPix}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-black text-lg rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-2 mb-4"
              >
                <Copy className="w-6 h-6" />
                {isCopied ? 'COPIADO!' : 'COPIAR CÓDIGO PIX'}
              </button>

              <div className="bg-blue-500/10 border border-blue-500 rounded-xl p-4">
                <p className="text-sm text-blue-400 text-center">
                  ⏱️ Após o pagamento, seu pedido será processado automaticamente em até 5 minutos!
                </p>
              </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
