"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function CuponsPage() {
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState<'privacy' | 'terms' | 'identify' | 'security' | 'events' | 'conditions' | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showTestButton, setShowTestButton] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verificar se tem parâmetro ?test=google para mostrar botão de teste
  useEffect(() => {
    const testParam = searchParams.get('test')
    if (testParam === 'google') {
      setShowTestButton(true)
    }
  }, [searchParams])

  // Função para testar conversão do Google Ads
  const handleTestConversion = () => {
    // Disparar conversão diretamente sem redirecionar
    if (typeof window !== 'undefined' && window.gtag) {
      const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17683862692'
      const conversionLabel = process.env.NEXT_PUBLIC_GTAG_CONVERSION_COMPRA || 'wKeVCK6GirUbEKSpqfBB'
      const conversionId = `${googleAdsId}/${conversionLabel}`
      
      console.log('[TESTE] 🧪 Disparando conversão de teste...')
      console.log('[TESTE] Conversion ID:', conversionId)
      console.log('[TESTE] Transaction ID: test_' + Date.now())
      
      window.gtag('event', 'conversion', {
        'send_to': conversionId,
        'value': 50.0,
        'currency': 'BRL',
        'transaction_id': 'test_' + Date.now()
      })
      
      console.log('[TESTE] ✅ Conversão enviada!')
      alert('✅ Conversão de teste enviada! Verifique o console (F12) para detalhes.')
    } else {
      console.error('[TESTE] ❌ gtag não está disponível')
      alert('❌ Erro: gtag não carregado. Verifique se NEXT_PUBLIC_GOOGLE_ADS_ENABLED=true')
    }
  }

  useEffect(() => {
    // Adicionar meta tags SEO otimizadas
    const metaTags = [
      { name: 'description', content: 'Plataforma independente de cupons verificados para jogos online. Free Fire, PUBG Mobile, Mobile Legends, Genshin Impact e mais. Cupons testados e seguros.' },
      { name: 'keywords', content: 'cupons jogos online, free fire cupons, pubg mobile promoções, mobile legends desconto, genshin impact cupons, recarga jogos, diamantes free fire' },
      { name: 'author', content: 'EASYCOM - Comércio e Serviços' },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'pt_BR' },
      { property: 'og:title', content: 'EASY CUPONS — Cupons Verificados para Jogos Online' },
      { property: 'og:description', content: 'Cupons e promoções verificadas para Free Fire, PUBG, Mobile Legends, Genshin Impact e mais jogos. Plataforma independente e segura.' },
      { property: 'og:site_name', content: 'EASY CUPONS' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'EASY CUPONS — Cupons para Jogos Online' },
      { name: 'twitter:description', content: 'Cupons verificados para Free Fire, PUBG, Mobile Legends e mais jogos.' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'theme-color', content: '#ffffff' },
    ]

    metaTags.forEach(tag => {
      const meta = document.createElement('meta')
      if (tag.name) meta.setAttribute('name', tag.name)
      if (tag.property) meta.setAttribute('property', tag.property)
      meta.setAttribute('content', tag.content)
      document.head.appendChild(meta)
    })

    // Adicionar JSON-LD para SEO
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "EASY CUPONS",
      "url": process.env.NEXT_PUBLIC_BASE_URL || "https://rurubux.shop",
      "description": "Plataforma independente de cupons verificados para jogos online",
      "publisher": {
        "@type": "Organization",
        "name": "TICUPOL INDUSTRIA E COMERCIO LTDA",
        "legalName": "TICUPOL",
        "taxID": "58.041.030/0001-28",
        "foundingDate": "2010-01-01",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rua Comercial",
          "addressLocality": "São Paulo",
          "addressRegion": "SP",
          "postalCode": "01000-000",
          "addressCountry": "BR"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "contato@" + (process.env.NEXT_PUBLIC_BASE_URL || "rurubux.shop").replace('https://', '').replace('www.', ''),
          "contactType": "customer service"
        }
      }
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(jsonLd)
    document.head.appendChild(script)

    // Adicionar estilos globais
    const style = document.createElement('style')
    style.id = 'coopersam-styles'
    style.innerHTML = `
      :root {
        --bg: #ffffff;
        --card: #ffffff;
        --accent: #000000;
        --accent-glow: #000000;
        --muted: #333333;
        --glass: rgba(0, 0, 0, 0.02);
        --maxw: 1100px;
      }

      * { 
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      html { 
        overflow-x: hidden;
        width: 100%;
      }

      body { 
        overflow-x: hidden;
        width: 100%;
        max-width: 100vw;
        cursor: none;
        margin: 0;
        background: linear-gradient(180deg, #818181 0%, #ffffff 76.1%, #7179cf 100%) !important;
        color: #000000;
        font-family: Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial;
        -webkit-font-smoothing: antialiased;
        padding: 16px;
        display: flex;
        justify-content: center;
        position: relative;
        min-height: 100vh;
      }

      @media (min-width: 768px) {
        body {
          padding: 24px;
        }
      }
      
      /* Mostrar cursor padrão em inputs e áreas de texto */
      input, textarea, select {
        cursor: text !important;
      }
      
      button, a, .btn {
        cursor: pointer !important;
      }

      /* Background animado com grades */
      body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
          linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px);
        background-size: 50px 50px;
        animation: gridMove 20s linear infinite;
        pointer-events: none;
        z-index: 0;
      }

      body::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 0%, transparent 50%);
        animation: pulse 4s ease-in-out infinite;
        pointer-events: none;
        z-index: 0;
      }

      @keyframes gridMove {
        0% { transform: translate(0, 0); }
        100% { transform: translate(50px, 50px); }
      }

      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }

      /* Cursor de mira de sniper */
      #sniper-cursor {
        position: fixed;
        width: 60px;
        height: 60px;
        pointer-events: none;
        z-index: 10000;
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease, opacity 0.2s ease;
        opacity: 1;
      }

      #sniper-cursor::before,
      #sniper-cursor::after {
        content: '';
        position: absolute;
        background: var(--accent-glow);
        box-shadow: 0 0 10px var(--accent-glow);
      }

      #sniper-cursor::before {
        width: 2px;
        height: 100%;
        left: 50%;
        transform: translateX(-50%);
      }

      #sniper-cursor::after {
        width: 100%;
        height: 2px;
        top: 50%;
        transform: translateY(-50%);
      }

      .sniper-circle {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid var(--accent-glow);
        border-radius: 50%;
        box-shadow: 0 0 15px var(--accent-glow), inset 0 0 15px rgba(0, 0, 0, 0.2);
      }

      .sniper-dot {
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--accent-glow);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 8px var(--accent-glow);
      }

      .wrap { 
        width: 100%; 
        max-width: min(var(--maxw), 100%);
        position: relative;
        z-index: 1;
        overflow-x: hidden;
      }
      
      a { 
        color: var(--accent); 
        text-decoration: none;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      }

      .container {
        background: #ffffff;
        border-radius: 12px;
        padding: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        border: 1px solid rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(10px);
        width: 100%;
        max-width: 100%;
        overflow-x: hidden;
      }

      @media (min-width: 640px) {
        .container {
          padding: 20px;
        }
      }

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      @media (max-width: 640px) {
        header {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .brand { display: flex; align-items: center; gap: 12px }

      .logo {
        width: 56px;
        height: 56px;
        border-radius: 10px;
        background: var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #ffffff;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
      }

      h1 { 
        margin: 0; 
        font-size: 18px;
        text-shadow: none;
      }

      @media (min-width: 768px) {
        h1 {
          font-size: 20px;
        }
      }
      
      p.lead { 
        margin: 0; 
        color: var(--muted);
        font-size: 13px;
      }

      @media (min-width: 768px) {
        p.lead {
          font-size: 14px;
        }
      }

      .actions { 
        display: flex; 
        gap: 8px; 
        align-items: center;
        flex-wrap: wrap;
      }

      @media (max-width: 640px) {
        .actions {
          width: 100%;
          justify-content: flex-start;
        }
      }

      .btn {
        background: var(--accent);
        color: #ffffff;
        padding: 8px 12px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        display: inline-block;
        font-size: 13px;
        white-space: nowrap;
        text-align: center;
      }

      @media (min-width: 640px) {
        .btn {
          padding: 10px 14px;
          font-size: 14px;
        }
      }

      .btn:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
      }

      .btn.ghost {
        background: transparent;
        color: var(--accent);
        border: 1px solid rgba(0, 0, 0, 0.3);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }

      .btn.ghost:hover {
        background: rgba(0, 0, 0, 0.1);
        border-color: var(--accent);
      }

      .main-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 16px;
      }

      @media (min-width: 880px) {
        .main-grid { 
          grid-template-columns: 1fr 380px;
          gap: 18px;
        }
      }

      .card {
        background: #ffffff;
        padding: 14px;
        border-radius: 12px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        width: 100%;
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }

      .coupon-list { display: flex; flex-direction: column; gap: 10px }

      .coupon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 10px;
        border-radius: 8px;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        flex-wrap: wrap;
        width: 100%;
      }

      @media (max-width: 640px) {
        .coupon {
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
        }
      }

      .coupon:hover {
        background: rgba(0, 0, 0, 0.1);
        border-color: rgba(0, 0, 0, 0.3);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
      }

      .coupon .left { 
        display: flex; 
        gap: 12px; 
        align-items: center;
        flex-wrap: wrap;
        flex: 1;
        min-width: 0;
      }

      .chip {
        background: rgba(0, 0, 0, 0.15);
        padding: 6px 8px;
        border-radius: 8px;
        font-weight: 700;
        letter-spacing: 1px;
        color: var(--accent);
        border: 1px solid rgba(0, 0, 0, 0.3);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        font-size: 11px;
        white-space: nowrap;
      }

      @media (min-width: 640px) {
        .chip {
          padding: 8px 10px;
          font-size: 13px;
        }
      }

      .coupon-code {
        font-family: monospace;
        background: rgba(255, 255, 255, 0.9);
        padding: 6px 8px;
        border-radius: 6px;
        color: var(--accent);
        border: 1px solid rgba(0, 0, 0, 0.2);
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        font-size: 13px;
        word-break: break-all;
      }

      @media (min-width: 640px) {
        .coupon-code {
          font-size: 14px;
        }
      }

      .coupon .meta { 
        color: var(--muted); 
        font-size: 12px;
        word-break: break-word;
      }

      @media (min-width: 640px) {
        .coupon .meta {
          font-size: 13px;
        }
      }
      
      .search {
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(0, 0, 0, 0.2);
        color: #1a1a1a;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        font-size: 16px; /* Evita zoom no iOS */
        -webkit-appearance: none;
      }

      .search:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
      }

      .search::placeholder {
        color: var(--muted);
        opacity: 0.6;
      }

      .small { font-size: 13px; color: var(--muted) }
      .muted { color: var(--muted) }

      footer {
        margin-top: 18px;
        text-align: center;
        color: var(--muted);
        font-size: 13px;
        width: 100%;
        max-width: 100%;
        overflow-wrap: break-word;
        word-wrap: break-word;
      }

      .links {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 12px;
        flex-wrap: wrap;
      }

      /* Partículas flutuantes */
      .particle {
        position: fixed;
        width: 2px;
        height: 2px;
        background: var(--accent-glow);
        border-radius: 50%;
        pointer-events: none;
        opacity: 0;
        box-shadow: 0 0 4px var(--accent-glow);
        animation: float 15s infinite ease-in-out;
      }

      @keyframes float {
        0% {
          transform: translateY(100vh) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100vh) translateX(100px);
          opacity: 0;
        }
      }

      /* Modal */
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
        cursor: default !important;
      }

      .modal-content {
        background: linear-gradient(180deg, #ffffff, #f8f9fa);
        border: 2px solid var(--accent);
        border-radius: 16px;
        padding: 20px;
        max-width: 90vw;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
        position: relative;
        animation: slideIn 0.4s ease;
        width: 100%;
      }

      @media (min-width: 768px) {
        .modal-content {
          padding: 30px;
          max-width: 800px;
          max-height: 80vh;
        }
      }

      .modal-close {
        position: absolute;
        top: 15px;
        right: 15px;
        background: var(--accent);
        color: #ffffff;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
        transition: all 0.3s ease;
      }

      .modal-close:hover {
        transform: rotate(90deg) scale(1.1);
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
      }

      .modal-content h2 {
        color: var(--accent);
        text-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
        margin-top: 0;
      }

      .modal-content h3 {
        color: var(--accent);
        margin-top: 20px;
        margin-bottom: 10px;
        font-size: 18px;
      }

      .modal-content p, .modal-content ul {
        color: #000000;
        line-height: 1.8;
        font-size: 14px;
      }

      .modal-content p strong {
        color: #000000;
      }

      .modal-content ul {
        margin-left: 20px;
        background: rgba(0, 0, 0, 0.05);
        padding: 12px 12px 12px 32px;
        border-radius: 8px;
        border-left: 3px solid var(--accent);
      }

      .modal-content li {
        margin-bottom: 8px;
        color: #000000;
      }

      .modal-content::-webkit-scrollbar {
        width: 10px;
      }

      .modal-content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10px;
      }

      .modal-content::-webkit-scrollbar-thumb {
        background: var(--accent);
        border-radius: 10px;
        box-shadow: 0 0 10px var(--accent-glow);
      }

      .modal-content::-webkit-scrollbar-thumb:hover {
        background: var(--accent-glow);
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      /* Bullet effect - Balas de jogo */
      .bullet {
        position: fixed;
        width: 3px;
        height: 15px;
        background: linear-gradient(180deg, #fff, var(--accent-glow), var(--accent));
        pointer-events: none;
        z-index: 10000;
        box-shadow: 
          0 0 15px var(--accent-glow),
          0 0 30px var(--accent),
          0 0 5px #fff;
        border-radius: 50% 50% 0 0;
      }

      @keyframes bulletFly {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 1;
        }
        20% {
          opacity: 1;
        }
        100% {
          transform: translate(var(--tx), var(--ty)) scale(0.3);
          opacity: 0;
        }
      }

      /* Muzzle flash - Flash do tiro */
      .muzzle-flash {
        position: fixed;
        width: 40px;
        height: 40px;
        background: radial-gradient(circle, #fff, var(--accent-glow), transparent);
        pointer-events: none;
        z-index: 9999;
        border-radius: 50%;
        animation: flashFade 0.15s ease-out forwards;
        box-shadow: 0 0 30px var(--accent-glow);
      }

      @keyframes flashFade {
        0% {
          transform: scale(0.5);
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }

      /* Bullet trail - Rastro da bala */
      .bullet-trail {
        position: fixed;
        width: 2px;
        height: 30px;
        background: linear-gradient(180deg, transparent, var(--accent-glow));
        pointer-events: none;
        z-index: 9998;
        opacity: 0.6;
        animation: trailFade 0.3s ease-out forwards;
      }

      @keyframes trailFade {
        0% {
          opacity: 0.8;
        }
        100% {
          opacity: 0;
        }
      }

      /* Loading Screen */
      .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(180deg, #818181 0%, #ffffff 76.1%, #7179cf 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        animation: fadeOut 0.5s ease-out 1.5s forwards;
      }

      @keyframes fadeOut {
        to {
          opacity: 0;
          pointer-events: none;
        }
      }

      .loading-logo {
        font-size: 64px;
        font-weight: 900;
        color: #000000;
        letter-spacing: 4px;
        animation: slideInScale 0.8s ease-out;
      }

      @keyframes slideInScale {
        0% {
          transform: translateY(-50px) scale(0.5);
          opacity: 0;
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      .loading-text {
        font-size: 18px;
        color: #333333;
        margin-top: 20px;
        animation: fadeInUp 0.8s ease-out 0.3s both;
      }

      @keyframes fadeInUp {
        0% {
          transform: translateY(20px);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .loading-dots {
        display: flex;
        gap: 8px;
        margin-top: 30px;
      }

      .loading-dot {
        width: 12px;
        height: 12px;
        background: #000000;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out both;
      }

      .loading-dot:nth-child(1) {
        animation-delay: -0.32s;
      }

      .loading-dot:nth-child(2) {
        animation-delay: -0.16s;
      }

      @keyframes bounce {
        0%, 80%, 100% {
          transform: scale(0);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `
    
    document.head.appendChild(style)

    // Inicializar cursor de mira
    function initSniperCursor() {
      const existingCursor = document.getElementById('sniper-cursor')
      if (existingCursor) {
        existingCursor.remove()
      }

      const sniperCursor = document.createElement('div')
      sniperCursor.id = 'sniper-cursor'
      sniperCursor.innerHTML = '<div class="sniper-circle"></div><div class="sniper-dot"></div>'
      
      document.body.appendChild(sniperCursor)
      
      sniperCursor.style.position = 'fixed'
      sniperCursor.style.width = '60px'
      sniperCursor.style.height = '60px'
      sniperCursor.style.pointerEvents = 'none'
      sniperCursor.style.zIndex = '99999'
      sniperCursor.style.opacity = '1'
      sniperCursor.style.display = 'block'

      const handleMouseMove = (e: MouseEvent) => {
        if (sniperCursor && sniperCursor.parentElement) {
          sniperCursor.style.left = e.clientX + 'px'
          sniperCursor.style.top = e.clientY + 'px'
          sniperCursor.style.transform = 'translate(-50%, -50%)'
        }
      }

      document.addEventListener('mousemove', handleMouseMove)

      document.addEventListener('mouseenter', (e) => {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          if (sniperCursor) sniperCursor.style.opacity = '0'
          document.body.style.cursor = 'text'
        }
      }, true)

      document.addEventListener('mouseleave', (e) => {
        const target = e.target as HTMLElement
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          if (sniperCursor) sniperCursor.style.opacity = '1'
          document.body.style.cursor = 'none'
        }
      }, true)

      document.addEventListener('mousedown', () => {
        if (sniperCursor) sniperCursor.style.transform = 'translate(-50%, -50%) scale(0.9)'
      })

      document.addEventListener('mouseup', () => {
        if (sniperCursor) sniperCursor.style.transform = 'translate(-50%, -50%) scale(1)'
      })
    }

    // Criar partículas
    function createParticles() {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div')
        particle.className = 'particle'
        particle.style.left = Math.random() * 100 + '%'
        particle.style.animationDelay = Math.random() * 15 + 's'
        particle.style.animationDuration = (10 + Math.random() * 10) + 's'
        document.body.appendChild(particle)
      }
    }

    // Função copiar cupom com efeito de balas
    function copyCoupon(btn: HTMLElement) {
      const el = btn.closest('.coupon')
      const code = el?.getAttribute('data-code')
      if (!code) return
      
      // Verificar se já está processando
      if (btn.classList.contains('copying')) return
      btn.classList.add('copying')
      
      // Som de cópia (mais suave)
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.frequency.value = 800
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } catch (e) {
        // Ignorar erro de áudio
      }
      
      // Criar efeito de balas
      const rect = btn.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      
      // Criar balas em padrão de dispersão
      const bulletCount = 8
      for (let i = 0; i < bulletCount; i++) {
        const angle = (Math.PI * 2 * i) / bulletCount
        const distance = 150 + Math.random() * 100
        const tx = Math.cos(angle) * distance
        const ty = Math.sin(angle) * distance
        
        const bullet = document.createElement('div')
        bullet.className = 'bullet'
        bullet.style.left = x + 'px'
        bullet.style.top = y + 'px'
        bullet.style.setProperty('--tx', tx + 'px')
        bullet.style.setProperty('--ty', ty + 'px')
        bullet.style.transform = `rotate(${angle}rad)`
        bullet.style.animation = `bulletFly ${0.5 + Math.random() * 0.2}s ease-out forwards`
        bullet.style.animationDelay = (i * 0.02) + 's'
        document.body.appendChild(bullet)
        setTimeout(() => bullet.remove(), 800)
      }
      
      // Copiar para clipboard (sem feedback visual de texto)
      navigator.clipboard?.writeText(code).then(() => {
        // Remover classe após 1 segundo
        setTimeout(() => {
          btn.classList.remove('copying')
        }, 1000)
      }).catch(() => {
        btn.classList.remove('copying')
      })
    }

    // Função filtrar cupons
    function filterCoupons() {
      const searchInput = document.getElementById('search') as HTMLInputElement
      const q = searchInput?.value.toLowerCase().trim() || ''
      document.querySelectorAll('#couponList .coupon').forEach(c => {
        const store = (c.getAttribute('data-store') || '').toLowerCase()
        const text = (c.textContent || '').toLowerCase()
        const tags = (c.getAttribute('data-tags') || '').toLowerCase()
        ;(c as HTMLElement).style.display = !q || store.includes(q) || text.includes(q) || tags.includes(q) ? '' : 'none'
      })
    }

    // Inicializar tudo
    initSniperCursor()
    createParticles()

    // Remover loading após 2 segundos
    setTimeout(() => {
      setLoading(false)
    }, 2000)

    // Event listeners
    document.getElementById('search')?.addEventListener('input', filterCoupons)
    
    document.querySelectorAll('.btn').forEach(btn => {
      if (btn.textContent?.includes('Copiar')) {
        btn.addEventListener('click', function(this: HTMLElement) { 
          copyCoupon(this) 
        })
      }
    })

    return () => {
      style.remove()
      const cursor = document.getElementById('sniper-cursor')
      if (cursor) cursor.remove()
    }
  }, [])

  // Função para criar efeito de balas realistas
  const createBulletEffect = (x: number, y: number) => {
    // Muzzle flash (flash do tiro)
    const flash = document.createElement('div')
    flash.className = 'muzzle-flash'
    flash.style.left = x + 'px'
    flash.style.top = y + 'px'
    flash.style.transform = 'translate(-50%, -50%)'
    document.body.appendChild(flash)
    setTimeout(() => flash.remove(), 200)

    // Criar balas em padrão de dispersão
    const bulletCount = 12
    for (let i = 0; i < bulletCount; i++) {
      const angle = (Math.PI * 2 * i) / bulletCount
      const distance = 400 + Math.random() * 200
      const tx = Math.cos(angle) * distance
      const ty = Math.sin(angle) * distance
      
      // Bala principal
      const bullet = document.createElement('div')
      bullet.className = 'bullet'
      bullet.style.left = x + 'px'
      bullet.style.top = y + 'px'
      bullet.style.setProperty('--tx', tx + 'px')
      bullet.style.setProperty('--ty', ty + 'px')
      bullet.style.transform = `rotate(${angle}rad)`
      bullet.style.animation = `bulletFly ${0.6 + Math.random() * 0.3}s ease-out forwards`
      bullet.style.animationDelay = (i * 0.02) + 's'
      document.body.appendChild(bullet)
      setTimeout(() => bullet.remove(), 1000)

      // Rastro da bala
      const trail = document.createElement('div')
      trail.className = 'bullet-trail'
      trail.style.left = x + 'px'
      trail.style.top = y + 'px'
      trail.style.transform = `rotate(${angle}rad)`
      trail.style.animationDelay = (i * 0.02) + 's'
      document.body.appendChild(trail)
      setTimeout(() => trail.remove(), 400)
    }
  }

  // Função para tocar som de tiro realista
  const playGunSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Som principal do tiro (baixa frequência)
    const oscillator1 = audioContext.createOscillator()
    const gainNode1 = audioContext.createGain()
    oscillator1.connect(gainNode1)
    gainNode1.connect(audioContext.destination)
    oscillator1.frequency.value = 80
    gainNode1.gain.setValueAtTime(0.4, audioContext.currentTime)
    gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08)
    oscillator1.start(audioContext.currentTime)
    oscillator1.stop(audioContext.currentTime + 0.08)
    
    // Som do impacto (média frequência)
    const oscillator2 = audioContext.createOscillator()
    const gainNode2 = audioContext.createGain()
    oscillator2.connect(gainNode2)
    gainNode2.connect(audioContext.destination)
    oscillator2.frequency.value = 200
    gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)
    oscillator2.start(audioContext.currentTime)
    oscillator2.stop(audioContext.currentTime + 0.05)
    
    // Som do eco/reverb (alta frequência)
    const oscillator3 = audioContext.createOscillator()
    const gainNode3 = audioContext.createGain()
    oscillator3.connect(gainNode3)
    gainNode3.connect(audioContext.destination)
    oscillator3.frequency.value = 400
    gainNode3.gain.setValueAtTime(0.15, audioContext.currentTime + 0.02)
    gainNode3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
    oscillator3.start(audioContext.currentTime + 0.02)
    oscillator3.stop(audioContext.currentTime + 0.15)
  }

  // Abrir modal com efeitos
  const openModal = (type: 'privacy' | 'terms' | 'identify' | 'security' | 'events' | 'conditions', event: React.MouseEvent) => {
    event.preventDefault()
    playGunSound()
    createBulletEffect(event.clientX, event.clientY)
    setTimeout(() => {
      setModalContent(type)
      setShowModal(true)
    }, 200)
  }

  // Fechar modal
  const closeModal = () => {
    setShowModal(false)
    setModalContent(null)
  }

  return (
    <>
      {/* Loading Screen */}
      {loading && (
        <div className="loading-screen">
          <div className="loading-logo">EASY CUPONS</div>
          <div className="loading-text">Cupons e Promoções para Jogos</div>
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        </div>
      )}

      <div className="wrap">
        <div className="container" role="main" aria-labelledby="site-title">
        <header>
          <div className="brand">
            <div className="logo" aria-hidden="true">EC</div>
            <div>
              <h1 id="site-title">EASY CUPONS</h1>
              <p className="lead">Cupons verificados e promoções para jogos online • Recargas com desconto</p>
            </div>
          </div>
          <div className="actions">
            <a className="btn" href={`mailto:contato@${(process.env.NEXT_PUBLIC_BASE_URL || 'rurubux.shop').replace('https://', '').replace('www.', '')}`}>Contato</a>
            <a className="btn ghost" href="#guide">Guia</a>
          </div>
        </header>

        <div className="main-grid">
          <div>
            <section className="card" aria-labelledby="coupons-title">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px', marginBottom:'12px'}}>
                <div>
                  <h2 id="coupons-title" style={{margin:'0 0 4px 0'}}>Cupons Disponíveis</h2>
                  <div className="small">Clique em copiar para usar o código no site parceiro — confira condições abaixo.</div>
                </div>
                <input id="search" className="search" placeholder="Buscar por cupom, loja ou tag" aria-label="Buscar cupons" style={{maxWidth:'320px'}} />
              </div>

              <div className="coupon-list" id="couponList">
                <article className="coupon" data-code="GAME10" data-valid="Até 2025-12-31" data-store="Gaming" data-tags="gaming,bonus">
                  <div className="left">
                    <div className="chip">Gaming</div>
                    <div>
                      <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <strong className="coupon-code">GAME10</strong>
                        <span className="muted"> — 10% bônus</span>
                      </div>
                      <div className="meta small">Validade: <span className="muted">Até 31 Dez 2025</span></div>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                    <button className="btn">Copiar</button>
                  </div>
                </article>

                <article className="coupon" data-code="PROMO2025" data-valid="Até 2025-11-30" data-store="Gaming" data-tags="gaming,promo">
                  <div className="left">
                    <div className="chip">Exclusivo</div>
                    <div>
                      <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <strong className="coupon-code">PROMO2025</strong>
                        <span className="muted"> — bônus especial</span>
                      </div>
                      <div className="meta small">Validade: <span className="muted">30 Nov 2025</span></div>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                    <button className="btn">Copiar</button>
                  </div>
                </article>

                <article className="coupon" data-code="FIRE15" data-valid="Até 2025-12-15" data-store="Gaming" data-tags="freefire,diamantes">
                  <div className="left">
                    <div className="chip">Free Fire</div>
                    <div>
                      <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <strong className="coupon-code">FIRE15</strong>
                        <span className="muted"> — 15% de desconto</span>
                      </div>
                      <div className="meta small">Validade: <span className="muted">15 Dez 2025</span></div>
                    </div>
                  </div>
                  <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                    <button className="btn">Copiar</button>
                  </div>
                </article>
              </div>

              <div style={{marginTop:'12px', fontSize:'13px'}} className="small muted">
                Atenção: os cupons são fornecidos por parceiros e podem expirar a qualquer momento.
                Verifique as condições no site do parceiro antes de validar o pagamento.
              </div>
            </section>

            <section className="card" style={{marginTop:'16px'}}>
              <h2 style={{margin:'0 0 12px 0'}}>Sobre Nossos Serviços</h2>
              <p className="small" style={{lineHeight:'1.8'}}>
                A <strong>EASY CUPONS</strong> é uma plataforma independente especializada em <strong>cupons e promoções para jogos online</strong>. 
                Trabalhamos de forma autônoma, sem vínculo direto com desenvolvedoras ou publishers de jogos.
              </p>
              <p className="small" style={{lineHeight:'1.8', marginTop:'12px'}}>
                Nossa missão é conectar jogadores com as melhores ofertas disponíveis no mercado através de parcerias com 
                <strong> plataformas de recarga confiáveis</strong> e distribuidores autorizados.
              </p>
            </section>

            <section className="card" style={{marginTop:'16px'}}>
              <h2 style={{margin:'0 0 12px 0'}}>Jogos que Atendemos</h2>
              <p className="small" style={{marginBottom:'12px'}}>Oferecemos cupons e promoções para diversos títulos populares:</p>
              
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'10px'}}>
                <div style={{padding:'12px', background:'rgba(0,0,0,0.03)', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.1)'}}>
                  <strong style={{color:'var(--accent)'}}>Battle Royale</strong>
                  <div className="small" style={{marginTop:'4px'}}>Free Fire, PUBG Mobile, Fortnite, Apex Legends</div>
                </div>
                
                <div style={{padding:'12px', background:'rgba(0,0,0,0.03)', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.1)'}}>
                  <strong style={{color:'var(--accent)'}}>MOBA</strong>
                  <div className="small" style={{marginTop:'4px'}}>Mobile Legends, League of Legends, Arena of Valor</div>
                </div>
                
                <div style={{padding:'12px', background:'rgba(0,0,0,0.03)', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.1)'}}>
                  <strong style={{color:'var(--accent)'}}>RPG & MMO</strong>
                  <div className="small" style={{marginTop:'4px'}}>Genshin Impact, Ragnarok, Black Desert</div>
                </div>
                
                <div style={{padding:'12px', background:'rgba(0,0,0,0.03)', borderRadius:'8px', border:'1px solid rgba(0,0,0,0.1)'}}>
                  <strong style={{color:'var(--accent)'}}>Outros Títulos</strong>
                  <div className="small" style={{marginTop:'4px'}}>Roblox, Minecraft, Valorant, CS:GO</div>
                </div>
              </div>

              <p className="small muted" style={{marginTop:'12px', fontSize:'11px'}}>
                * Não somos afiliados, patrocinados ou endossados por nenhuma das empresas mencionadas. 
                Todos os nomes de jogos e marcas são propriedade de seus respectivos donos.
              </p>
            </section>

            <section className="card" style={{marginTop:'16px'}}>
              <h2 style={{margin:'0 0 12px 0'}}>Como Funcionam os Cupons</h2>
              <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <div style={{
                    minWidth:'32px', 
                    height:'32px', 
                    background:'var(--accent)', 
                    color:'#ffffff', 
                    borderRadius:'50%', 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center',
                    fontWeight:'700',
                    boxShadow:'0 0 15px rgba(0,0,0,0.2)'
                  }}>1</div>
                  <div>
                    <strong>Parcerias com Plataformas</strong>
                    <p className="small" style={{marginTop:'4px'}}>
                      Estabelecemos parcerias com plataformas de recarga autorizadas que oferecem cupons promocionais.
                    </p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <div style={{
                    minWidth:'32px', 
                    height:'32px', 
                    background:'var(--accent)', 
                    color:'#ffffff', 
                    borderRadius:'50%', 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center',
                    fontWeight:'700',
                    boxShadow:'0 0 15px rgba(0,0,0,0.2)'
                  }}>2</div>
                  <div>
                    <strong>Verificação e Validação</strong>
                    <p className="small" style={{marginTop:'4px'}}>
                      Todos os cupons são verificados antes de serem publicados. Conferimos validade, condições e disponibilidade.
                    </p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <div style={{
                    minWidth:'32px', 
                    height:'32px', 
                    background:'var(--accent)', 
                    color:'#ffffff', 
                    borderRadius:'50%', 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center',
                    fontWeight:'700',
                    boxShadow:'0 0 15px rgba(0,0,0,0.2)'
                  }}>3</div>
                  <div>
                    <strong>Uso Seguro</strong>
                    <p className="small" style={{marginTop:'4px'}}>
                      Você copia o cupom e utiliza diretamente no site do parceiro. Não processamos pagamentos nem armazenamos dados financeiros.
                    </p>
                  </div>
                </div>

                <div style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <div style={{
                    minWidth:'32px', 
                    height:'32px', 
                    background:'var(--accent)', 
                    color:'#ffffff', 
                    borderRadius:'50%', 
                    display:'flex', 
                    alignItems:'center', 
                    justifyContent:'center',
                    fontWeight:'700',
                    boxShadow:'0 0 15px rgba(0,0,0,0.2)'
                  }}>4</div>
                  <div>
                    <strong>Suporte Contínuo</strong>
                    <p className="small" style={{marginTop:'4px'}}>
                      Atualizamos constantemente nossa base de cupons e oferecemos suporte para dúvidas sobre uso e validade.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="guide" className="card" style={{marginTop:'16px'}}>
              <h2 style={{margin:'0 0 8px 0'}}>Guia e Dicas</h2>
              <p className="small" style={{color:'var(--muted)'}}>Conteúdos educativos sobre gaming e recargas seguras.</p>

              <div style={{display:'flex', flexDirection:'column', gap:'12px', marginTop:'12px'}}>
                <a href="#" onClick={(e) => openModal('identify', e)} style={{display:'block', padding:'14px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'10px', background:'rgba(0,0,0,0.02)', transition:'all 0.3s', cursor:'pointer'}}>
                  <strong>Como Identificar Cupons Legítimos</strong>
                  <div className="small" style={{color:'var(--muted)', marginTop:'4px'}}>Aprenda a diferenciar ofertas reais de golpes e fraudes online.</div>
                </a>

                <a href="#" onClick={(e) => openModal('security', e)} style={{display:'block', padding:'14px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'10px', background:'rgba(0,0,0,0.02)', cursor:'pointer'}}>
                  <strong>Melhores Práticas de Segurança</strong>
                  <div className="small" style={{color:'var(--muted)', marginTop:'4px'}}>Proteja sua conta e dados pessoais ao fazer recargas online.</div>
                </a>

                <a href="#" onClick={(e) => openModal('events', e)} style={{display:'block', padding:'14px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'10px', background:'rgba(0,0,0,0.02)', cursor:'pointer'}}>
                  <strong>Promoções e Eventos Oficiais</strong>
                  <div className="small" style={{color:'var(--muted)', marginTop:'4px'}}>Fique por dentro dos eventos oficiais dos jogos e aproveite bônus extras.</div>
                </a>

                <a href="#" onClick={(e) => openModal('conditions', e)} style={{display:'block', padding:'14px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'10px', background:'rgba(0,0,0,0.02)', cursor:'pointer'}}>
                  <strong>Entendendo Termos e Condições</strong>
                  <div className="small" style={{color:'var(--muted)', marginTop:'4px'}}>Saiba interpretar as regras de uso dos cupons e evite problemas.</div>
                </a>
              </div>
            </section>
          </div>

          <aside>
            <div className="card">
              <h3 style={{margin:'0 0 8px 0'}}>Quem Somos</h3>
              <p className="small muted">
                A <strong>EASY CUPONS</strong> é operada pela
                <strong> TICUPOL INDUSTRIA E COMERCIO LTDA</strong> —
                <strong> CNPJ 58.041.030/0001-28</strong>, empresa estabelecida no mercado.
                <br /><br />
                Somos uma <strong>empresa séria e comprometida</strong> no segmento de
                serviços administrativos, localizada em
                <strong> Alagoinhas, Bahia</strong>, com mais de 25 anos de atuação no mercado.
                <br /><br />
                <strong style={{color:'var(--accent)'}}>Nossa Atuação no Gaming:</strong>
                <br />
                Como parte de nossas iniciativas de incentivo e desenvolvimento, expandimos para o setor de 
                <strong> e-sports e gaming</strong>, promovendo competições online e estabelecendo
                <strong> parcerias estratégicas com plataformas de recarga</strong>.
                <br /><br />
                <strong style={{color:'var(--accent)'}}>Independência e Transparência:</strong>
                <br />
                Atuamos de forma <strong>totalmente independente</strong>, sem vínculos corporativos com desenvolvedoras de jogos.
                Nosso papel é facilitar o acesso a promoções legítimas através de parceiros verificados.
              </p>

              <div style={{marginTop:'10px', display:'flex', gap:'8px', flexDirection:'column'}}>
                <button className="btn" onClick={(e) => openModal('privacy', e)}>Política de Privacidade</button>
                <button className="btn ghost" onClick={(e) => openModal('terms', e)}>Termos e Condições</button>
                <a className="btn" href={`mailto:contato@${(process.env.NEXT_PUBLIC_BASE_URL || 'rurubux.shop').replace('https://', '').replace('www.', '')}`}>Email: contato@{(process.env.NEXT_PUBLIC_BASE_URL || 'rurubux.shop').replace('https://', '').replace('www.', '')}</a>
              </div>
            </div>

            <div className="card" style={{marginTop:'12px'}}>
              <h3 style={{margin:'0 0 8px 0'}}>Nossos Diferenciais</h3>
              <ul className="small" style={{listStyle:'none', paddingLeft:0, margin:0, display:'flex', flexDirection:'column', gap:'8px'}}>
                <li style={{display:'flex', gap:'8px', alignItems:'flex-start'}}>
                  <span style={{color:'var(--accent)', fontSize:'18px'}}>✓</span>
                  <span><strong>Empresa Regularizada</strong> - CNPJ ativo e em conformidade legal</span>
                </li>
                <li style={{display:'flex', gap:'8px', alignItems:'flex-start'}}>
                  <span style={{color:'var(--accent)', fontSize:'18px'}}>✓</span>
                  <span><strong>Cupons Verificados</strong> - Todos testados antes da publicação</span>
                </li>
                <li style={{display:'flex', gap:'8px', alignItems:'flex-start'}}>
                  <span style={{color:'var(--accent)', fontSize:'18px'}}>✓</span>
                  <span><strong>Sem Intermediação</strong> - Você usa direto no site parceiro</span>
                </li>
                <li style={{display:'flex', gap:'8px', alignItems:'flex-start'}}>
                  <span style={{color:'var(--accent)', fontSize:'18px'}}>✓</span>
                  <span><strong>Suporte Dedicado</strong> - Equipe disponível para ajudar</span>
                </li>
                <li style={{display:'flex', gap:'8px', alignItems:'flex-start'}}>
                  <span style={{color:'var(--accent)', fontSize:'18px'}}>✓</span>
                  <span><strong>Transparência Total</strong> - Informações claras sobre origem dos cupons</span>
                </li>
              </ul>
            </div>

          </aside>
        </div>

        <footer>
          <div>
            © <strong>EASY CUPONS</strong> — Operado por
            <strong> TICUPOL INDUSTRIA E COMERCIO LTDA</strong> (CNPJ: 58.041.030/0001-28)
          </div>
          <div className="small muted" style={{marginTop:'4px'}}>
            Razão Social: TICUPOL INDUSTRIA E COMERCIO LTDA · CNPJ: 58.041.030/0001-28
          </div>
          
          <div className="small muted" style={{
            marginTop:'12px', 
            padding:'12px', 
            background:'rgba(0,0,0,0.03)', 
            borderRadius:'8px',
            border:'1px solid rgba(0,0,0,0.08)',
            lineHeight:'1.6'
          }}>
            <strong style={{color:'var(--accent)'}}>Aviso Legal:</strong> A EASY CUPONS é uma plataforma independente de divulgação de cupons e promoções. 
            Não somos afiliados, patrocinados, endossados ou de qualquer forma oficialmente conectados com as empresas desenvolvedoras dos jogos mencionados 
            (incluindo mas não limitado a Garena, Riot Games, Epic Games, Activision, Tencent, miHoYo, Roblox Corporation, Mojang Studios, entre outras). 
            Todos os nomes de produtos, logotipos e marcas são propriedade de seus respectivos donos. O uso de qualquer nome comercial ou marca registrada 
            é apenas para fins de identificação e referência, e não implica qualquer associação com o proprietário da marca. 
            Trabalhamos exclusivamente com <strong>parceiros autorizados de recarga</strong> e não processamos transações financeiras diretamente.
          </div>

          <div className="links" style={{marginTop:'12px'}}>
            <a href="#" onClick={(e) => openModal('privacy', e)}>Privacidade</a> ·
            <a href="#" onClick={(e) => openModal('terms', e)}>Termos</a> ·
            <a href={`mailto:contato@${(process.env.NEXT_PUBLIC_BASE_URL || 'rurubux.shop').replace('https://', '').replace('www.', '')}`}>Contato</a>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            {modalContent === 'privacy' && (
              <>
                <h2>Política de Privacidade</h2>
                <p><strong>Última atualização:</strong> 26 de outubro de 2025</p>
                
                <h3>1. Informações que Coletamos</h3>
                <p>A TICUPOL coleta informações quando você utiliza nossos serviços, incluindo:</p>
                <ul>
                  <li>Dados de navegação e uso do site</li>
                  <li>Informações fornecidas voluntariamente em formulários</li>
                  <li>Cookies e tecnologias similares</li>
                </ul>

                <h3>2. Como Usamos suas Informações</h3>
                <p>Utilizamos as informações coletadas para:</p>
                <ul>
                  <li>Melhorar a experiência do usuário</li>
                  <li>Processar transações e fornecer cupons</li>
                  <li>Comunicar sobre promoções e eventos</li>
                  <li>Garantir a segurança do site</li>
                </ul>

                <h3>3. Compartilhamento de Dados</h3>
                <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto quando necessário para:</p>
                <ul>
                  <li>Cumprir obrigações legais</li>
                  <li>Processar pagamentos através de parceiros confiáveis</li>
                  <li>Proteger nossos direitos e segurança</li>
                </ul>

                <h3>4. Segurança</h3>
                <p>Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, alteração ou divulgação.</p>

                <h3>5. Seus Direitos</h3>
                <p>Você tem direito a:</p>
                <ul>
                  <li>Acessar seus dados pessoais</li>
                  <li>Solicitar correção de informações incorretas</li>
                  <li>Solicitar exclusão de seus dados</li>
                  <li>Revogar consentimento a qualquer momento</li>
                </ul>

                <h3>6. Contato</h3>
                <p>Para questões sobre privacidade, entre em contato:</p>
                <p><strong>Email:</strong> contato@{(process.env.NEXT_PUBLIC_BASE_URL || 'rurubux.shop').replace('https://', '').replace('www.', '')}</p>
                <p><strong>CNPJ:</strong> 58.041.030/0001-28</p>
              </>
            )}

            {modalContent === 'identify' && (
              <>
                <h2>Como Identificar Cupons Legítimos</h2>
                <p>Proteja-se contra golpes e fraudes ao buscar cupons online. Siga estas orientações:</p>
                
                <h3>✓ Sinais de Cupons Legítimos</h3>
                <ul>
                  <li><strong>Fonte Verificada:</strong> Cupons vêm de sites estabelecidos com CNPJ público</li>
                  <li><strong>Condições Claras:</strong> Regras de uso, validade e restrições bem definidas</li>
                  <li><strong>Sem Pedido de Senha:</strong> Nunca pedem senha da sua conta do jogo</li>
                  <li><strong>Sem Pagamento Antecipado:</strong> Cupons legítimos não exigem pagamento para uso</li>
                  <li><strong>URL Segura:</strong> Site usa HTTPS (cadeado no navegador)</li>
                </ul>

                <h3>⚠️ Sinais de Alerta (Red Flags)</h3>
                <ul>
                  <li><strong>Promessas Irreais:</strong> "Diamantes grátis ilimitados" ou "hack 100% funcional"</li>
                  <li><strong>Urgência Artificial:</strong> "Apenas hoje!" ou "Últimas 5 vagas!"</li>
                  <li><strong>Pedido de Dados Sensíveis:</strong> Senha, CPF, cartão de crédito</li>
                  <li><strong>Downloads Suspeitos:</strong> APKs modificados ou "geradores"</li>
                  <li><strong>Erros de Português:</strong> Textos mal escritos ou traduzidos</li>
                  <li><strong>Sem Informações da Empresa:</strong> Falta de CNPJ, endereço ou contato</li>
                </ul>

                <h3>🔍 Como Verificar</h3>
                <ul>
                  <li>Pesquise o nome da empresa + "reclamações" no Google</li>
                  <li>Verifique o CNPJ no site da Receita Federal</li>
                  <li>Leia avaliações em sites como Reclame Aqui</li>
                  <li>Confira se há informações de contato reais</li>
                  <li>Teste com valores pequenos primeiro</li>
                </ul>

                <p><strong>Lembre-se:</strong> Se parece bom demais para ser verdade, provavelmente é golpe!</p>
              </>
            )}

            {modalContent === 'security' && (
              <>
                <h2>Melhores Práticas de Segurança</h2>
                <p>Proteja sua conta e dados pessoais ao fazer recargas e usar cupons online.</p>
                
                <h3>🔐 Segurança da Conta</h3>
                <ul>
                  <li><strong>Senha Forte:</strong> Use combinação de letras, números e símbolos</li>
                  <li><strong>Autenticação em Dois Fatores:</strong> Ative sempre que disponível</li>
                  <li><strong>Email Seguro:</strong> Use um email exclusivo para jogos</li>
                  <li><strong>Não Compartilhe:</strong> Nunca divulgue sua senha ou código de verificação</li>
                  <li><strong>Desconfie de Links:</strong> Não clique em links suspeitos por email/SMS</li>
                </ul>

                <h3>💳 Segurança em Pagamentos</h3>
                <ul>
                  <li><strong>Sites Confiáveis:</strong> Use apenas plataformas conhecidas</li>
                  <li><strong>Cartão Virtual:</strong> Prefira cartões virtuais com limite</li>
                  <li><strong>Verifique a URL:</strong> Confirme que está no site correto</li>
                  <li><strong>Evite WiFi Público:</strong> Não faça compras em redes abertas</li>
                  <li><strong>Guarde Comprovantes:</strong> Salve todos os recibos e confirmações</li>
                </ul>

                <h3>📱 Segurança do Dispositivo</h3>
                <ul>
                  <li><strong>Antivírus Atualizado:</strong> Mantenha proteção ativa</li>
                  <li><strong>Apps Oficiais:</strong> Baixe apenas de lojas oficiais</li>
                  <li><strong>Atualizações:</strong> Mantenha sistema e apps atualizados</li>
                  <li><strong>Bloqueio de Tela:</strong> Use PIN, senha ou biometria</li>
                </ul>

                <h3>🚨 Em Caso de Problemas</h3>
                <ul>
                  <li>Mude sua senha imediatamente</li>
                  <li>Entre em contato com o suporte do jogo</li>
                  <li>Cancele cartões comprometidos</li>
                  <li>Registre boletim de ocorrência se necessário</li>
                  <li>Avise amigos se sua conta foi hackeada</li>
                </ul>
              </>
            )}

            {modalContent === 'events' && (
              <>
                <h2>Promoções e Eventos Oficiais</h2>
                <p>Aproveite ao máximo os eventos oficiais dos jogos e maximize seus benefícios.</p>
                
                <h3>📅 Tipos de Eventos</h3>
                <ul>
                  <li><strong>Eventos Sazonais:</strong> Natal, Ano Novo, Halloween, etc.</li>
                  <li><strong>Aniversários:</strong> Do jogo ou da desenvolvedora</li>
                  <li><strong>Colaborações:</strong> Parcerias com marcas ou outros jogos</li>
                  <li><strong>Torneios:</strong> Competições com premiações</li>
                  <li><strong>Atualizações:</strong> Lançamento de novos conteúdos</li>
                </ul>

                <h3>🎁 Como Aproveitar Melhor</h3>
                <ul>
                  <li><strong>Siga Canais Oficiais:</strong> Redes sociais e site oficial do jogo</li>
                  <li><strong>Ative Notificações:</strong> Não perca anúncios importantes</li>
                  <li><strong>Planeje com Antecedência:</strong> Economize recursos para eventos grandes</li>
                  <li><strong>Leia as Regras:</strong> Entenda requisitos e recompensas</li>
                  <li><strong>Participe de Comunidades:</strong> Grupos e fóruns compartilham dicas</li>
                </ul>

                <h3>💎 Bônus em Recargas</h3>
                <ul>
                  <li><strong>Primeira Recarga:</strong> Geralmente oferece bônus dobrado</li>
                  <li><strong>Eventos de Recarga:</strong> Bônus extra em períodos específicos</li>
                  <li><strong>Pacotes Especiais:</strong> Bundles com melhor custo-benefício</li>
                  <li><strong>Cashback:</strong> Alguns eventos devolvem parte do valor</li>
                </ul>

                <h3>⚠️ Cuidados Importantes</h3>
                <ul>
                  <li>Verifique sempre a fonte da informação</li>
                  <li>Eventos falsos são comuns em golpes</li>
                  <li>Não compartilhe códigos pessoais de eventos</li>
                  <li>Leia os termos antes de participar</li>
                  <li>Respeite os limites de tempo e participação</li>
                </ul>

                <h3>📱 Onde Encontrar Informações Oficiais</h3>
                <ul>
                  <li>Site oficial do jogo</li>
                  <li>Redes sociais verificadas (selo azul)</li>
                  <li>Notificações dentro do próprio jogo</li>
                  <li>Canais oficiais no YouTube</li>
                  <li>Discord ou fóruns oficiais</li>
                </ul>
              </>
            )}

            {modalContent === 'conditions' && (
              <>
                <h2>Entendendo Termos e Condições</h2>
                <p>Aprenda a interpretar as regras de uso dos cupons e evite problemas.</p>
                
                <h3>📋 Elementos Importantes</h3>
                <ul>
                  <li><strong>Validade:</strong> Data de início e fim do cupom</li>
                  <li><strong>Valor Mínimo:</strong> Compra mínima necessária</li>
                  <li><strong>Restrições:</strong> Produtos ou categorias excluídas</li>
                  <li><strong>Limite de Uso:</strong> Quantas vezes pode ser usado</li>
                  <li><strong>Primeira Compra:</strong> Se é exclusivo para novos usuários</li>
                </ul>

                <h3>🔍 Termos Comuns</h3>
                <ul>
                  <li><strong>"Não cumulativo":</strong> Não pode usar com outros cupons</li>
                  <li><strong>"Sujeito a disponibilidade":</strong> Pode acabar antes do prazo</li>
                  <li><strong>"Mediante condições":</strong> Há requisitos específicos</li>
                  <li><strong>"Válido para":</strong> Lista o que está incluído</li>
                  <li><strong>"Exceto":</strong> Lista o que está excluído</li>
                </ul>

                <h3>⚠️ Pontos de Atenção</h3>
                <ul>
                  <li><strong>Leia TUDO:</strong> Não pule os termos pequenos</li>
                  <li><strong>Verifique Restrições:</strong> Seu item pode estar excluído</li>
                  <li><strong>Confira Datas:</strong> Fuso horário pode afetar validade</li>
                  <li><strong>Teste Antes:</strong> Adicione ao carrinho para ver se aplica</li>
                  <li><strong>Print da Tela:</strong> Guarde evidência das condições</li>
                </ul>

                <h3>❌ Motivos Comuns de Rejeição</h3>
                <ul>
                  <li>Cupom expirado ou ainda não ativo</li>
                  <li>Valor mínimo não atingido</li>
                  <li>Produto em categoria excluída</li>
                  <li>Limite de uso já atingido</li>
                  <li>Conta não elegível (ex: já usou antes)</li>
                  <li>Região geográfica não coberta</li>
                </ul>

                <h3>✅ Boas Práticas</h3>
                <ul>
                  <li>Copie o código exatamente como aparece</li>
                  <li>Não adicione espaços antes ou depois</li>
                  <li>Respeite maiúsculas e minúsculas</li>
                  <li>Use antes da data de expiração</li>
                  <li>Guarde comprovante da transação</li>
                  <li>Entre em contato com suporte se houver problema</li>
                </ul>

                <h3>🆘 Se o Cupom Não Funcionar</h3>
                <ul>
                  <li>Verifique se digitou corretamente</li>
                  <li>Confirme que está dentro da validade</li>
                  <li>Leia novamente todas as condições</li>
                  <li>Limpe cache e cookies do navegador</li>
                  <li>Tente em outro navegador ou dispositivo</li>
                  <li>Entre em contato com o suporte da plataforma</li>
                </ul>
              </>
            )}

            {modalContent === 'terms' && (
              <>
                <h2>Termos e Condições</h2>
                <p><strong>Última atualização:</strong> 26 de outubro de 2025</p>
                
                <h3>1. Aceitação dos Termos</h3>
                <p>Ao acessar e usar o site EASY CUPONS, você concorda com estes termos e condições.</p>

                <h3>2. Sobre o Serviço</h3>
                <p>A TICUPOL oferece cupons e informações sobre promoções de jogos eletrônicos através de parcerias com plataformas de recarga.</p>

                <h3>3. Uso dos Cupons</h3>
                <ul>
                  <li>Os cupons são fornecidos por parceiros e podem expirar</li>
                  <li>Verifique sempre as condições no site do parceiro</li>
                  <li>Não garantimos a disponibilidade contínua de cupons</li>
                  <li>Os cupons não podem ser trocados por dinheiro</li>
                </ul>

                <h3>4. Responsabilidades do Usuário</h3>
                <p>Você concorda em:</p>
                <ul>
                  <li>Usar o site de forma legal e ética</li>
                  <li>Não tentar acessar áreas restritas</li>
                  <li>Não distribuir malware ou conteúdo prejudicial</li>
                  <li>Respeitar os direitos de propriedade intelectual</li>
                </ul>

                <h3>5. Limitação de Responsabilidade</h3>
                <p>A TICUPOL não se responsabiliza por:</p>
                <ul>
                  <li>Problemas com cupons fornecidos por terceiros</li>
                  <li>Interrupções no serviço</li>
                  <li>Perdas ou danos decorrentes do uso do site</li>
                </ul>

                <h3>6. Modificações</h3>
                <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações entram em vigor imediatamente após publicação.</p>

                <h3>7. Lei Aplicável</h3>
                <p>Estes termos são regidos pelas leis brasileiras.</p>

                <h3>8. Contato</h3>
                <p><strong>TICUPOL INDUSTRIA E COMERCIO LTDA</strong></p>
                <p><strong>CNPJ:</strong> 58.041.030/0001-28</p>
                <p><strong>Email:</strong> contato@{(process.env.NEXT_PUBLIC_BASE_URL || 'rurubux.shop').replace('https://', '').replace('www.', '')}</p>
                <p><strong>Endereço:</strong> São Paulo - SP</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Botão de Teste Google Ads (só aparece com ?test=google) */}
      {showTestButton && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={handleTestConversion}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Testar Conversão Google Ads
          </button>
        </div>
      )}
      </div>
    </>
  )
}
