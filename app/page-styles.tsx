"use client"

import { useEffect } from 'react'

export default function PageStyles() {
  useEffect(() => {
    // Adicionar estilos globais
    const style = document.createElement('style')
    style.innerHTML = `
      :root {
        --bg: #0a0e0a;
        --card: #0d1410;
        --accent: #00ff41;
        --accent-glow: #39ff14;
        --muted: #7a9d7a;
        --glass: rgba(0, 255, 65, 0.05);
        --maxw: 1100px;
      }

      html, body { 
        height: 100%; 
        overflow-x: hidden;
        cursor: none;
        margin: 0;
        background: #050a05;
        color: #e0ffe0;
        font-family: Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial;
        -webkit-font-smoothing: antialiased;
      }
      
      body {
        padding: 24px;
        display: flex;
        justify-content: center;
        position: relative;
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
          linear-gradient(90deg, rgba(0, 255, 65, 0.03) 1px, transparent 1px),
          linear-gradient(rgba(0, 255, 65, 0.03) 1px, transparent 1px);
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
        background: radial-gradient(circle at 50% 50%, rgba(0, 255, 65, 0.1) 0%, transparent 50%);
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
        box-shadow: 0 0 15px var(--accent-glow), inset 0 0 15px rgba(0, 255, 65, 0.2);
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
        max-width: var(--maxw);
        position: relative;
        z-index: 1;
      }
      
      a { 
        color: var(--accent); 
        text-decoration: none;
        text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
      }

      .container {
        background: linear-gradient(180deg, rgba(0, 255, 65, 0.05), rgba(0, 255, 65, 0.02));
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 6px 40px rgba(0, 255, 65, 0.3), 0 0 20px rgba(0, 255, 65, 0.1);
        border: 1px solid rgba(0, 255, 65, 0.2);
        backdrop-filter: blur(10px);
      }

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px
      }

      .brand { display: flex; align-items: center; gap: 12px }

      .logo {
        width: 56px;
        height: 56px;
        border-radius: 10px;
        background: linear-gradient(135deg, var(--accent), #00cc33);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        color: #000;
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.6);
      }

      h1 { 
        margin: 0; 
        font-size: 20px;
        text-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
      }
      
      p.lead { 
        margin: 0; 
        color: var(--muted);
      }

      .actions { display: flex; gap: 8px; align-items: center }

      .btn {
        background: var(--accent);
        color: #000;
        padding: 10px 14px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
        transition: all 0.3s ease;
      }

      .btn:hover {
        box-shadow: 0 0 25px rgba(0, 255, 65, 0.8);
        transform: translateY(-2px);
      }

      .btn.ghost {
        background: transparent;
        color: var(--accent);
        border: 1px solid rgba(0, 255, 65, 0.3);
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
      }

      .btn.ghost:hover {
        background: rgba(0, 255, 65, 0.1);
        border-color: var(--accent);
      }

      .main-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 18px
      }

      @media(min-width:880px) {
        .main-grid { grid-template-columns: 1fr 380px }
      }

      .card {
        background: rgba(13, 20, 16, 0.8);
        padding: 14px;
        border-radius: 12px;
        border: 1px solid rgba(0, 255, 65, 0.2);
        box-shadow: 0 0 15px rgba(0, 255, 65, 0.1);
        backdrop-filter: blur(5px);
      }

      .coupon-list { display: flex; flex-direction: column; gap: 10px }

      .coupon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px;
        border-radius: 8px;
        background: rgba(0, 255, 65, 0.05);
        border: 1px solid rgba(0, 255, 65, 0.15);
        transition: all 0.3s ease;
      }

      .coupon:hover {
        background: rgba(0, 255, 65, 0.1);
        border-color: rgba(0, 255, 65, 0.3);
        box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
      }

      .coupon .left { display: flex; gap: 12px; align-items: center }

      .chip {
        background: rgba(0, 255, 65, 0.15);
        padding: 8px 10px;
        border-radius: 8px;
        font-weight: 700;
        letter-spacing: 1px;
        color: var(--accent);
        border: 1px solid rgba(0, 255, 65, 0.3);
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
      }

      .coupon-code {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.5);
        padding: 6px 8px;
        border-radius: 6px;
        color: var(--accent);
        border: 1px solid rgba(0, 255, 65, 0.2);
        text-shadow: 0 0 5px rgba(0, 255, 65, 0.5);
      }

      .coupon .meta { color: var(--muted); font-size: 13px }
      
      .search {
        width: 100%;
        padding: 10px;
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(0, 255, 65, 0.3);
        color: var(--accent);
        box-shadow: 0 0 10px rgba(0, 255, 65, 0.1);
      }

      .search:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
      }

      .small { font-size: 13px; color: var(--muted) }

      footer {
        margin-top: 18px;
        text-align: center;
        color: var(--muted);
        font-size: 13px
      }

      .links {
        display: flex;
        gap: 12px;
        justify-content: center;
        margin-top: 12px;
        flex-wrap: wrap
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

    initSniperCursor()

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
    
    createParticles()

    return () => {
      style.remove()
    }
  }, [])

  return null
}
