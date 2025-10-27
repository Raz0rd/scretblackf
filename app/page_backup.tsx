// Desabilitar metadata do layout para esta página
export const metadata = {
  title: "Coopersam Gaming — Cupons e Dicas Free Fire",
  description: "Coopersam Gaming — cupons válidos e dicas seguras para conseguir diamantes no Free Fire.",
  robots: "index,follow",
  openGraph: {
    title: "Coopersam Gaming — Cupons e Dicas Free Fire",
    description: "Coopersam Gaming — cupons válidos e dicas seguras para conseguir diamantes no Free Fire.",
    siteName: "Coopersam Gaming",
  }
}

export default function CuponsPage() {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="page-type" content="cupons" />
        <title>Coopersam Gaming — Cupons e Dicas Free Fire</title>
        <meta name="description" content="Coopersam Gaming — cupons válidos e dicas seguras para conseguir diamantes no Free Fire. Consulte validade e condições antes de usar." />
        <meta name="robots" content="index,follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Coopersam Gaming — Cupons e Dicas Free Fire" />
        <meta property="og:description" content="Coopersam Gaming — cupons válidos e dicas seguras para conseguir diamantes no Free Fire. Consulte validade e condições antes de usar." />
        <meta property="og:site_name" content="Coopersam Gaming" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Coopersam Gaming — Cupons e Dicas Free Fire" />
        <meta name="twitter:description" content="Coopersam Gaming — cupons válidos e dicas seguras para conseguir diamantes no Free Fire." />
        
        <link rel="icon" href="data:,RC" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --bg: #0a0e0a;
            --card: #0d1410;
            --accent: #00ff41;
            --accent-glow: #39ff14;
            --muted: #7a9d7a;
            --glass: rgba(0, 255, 65, 0.05);
            --maxw: 1100px;
          }

          * { box-sizing: border-box; }
          html, body { 
            height: 100%; 
            overflow-x: hidden;
            cursor: none;
          }
          
          /* Mostrar cursor padrão em inputs e áreas de texto */
          input, textarea, select {
            cursor: text !important;
          }
          
          button, a, .btn {
            cursor: pointer !important;
          }

          body {
            margin: 0;
            background: #050a05;
            color: #e0ffe0;
            font-family: Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial;
            -webkit-font-smoothing: antialiased;
            padding: 24px;
            display: flex;
            justify-content: center;
            position: relative;
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
        `}} />

      </head>

      <body>
        <div className="wrap">
          <div className="container" role="main" aria-labelledby="site-title">
            <header>
              <div className="brand">
                <div className="logo" aria-hidden="true">CG</div>
                <div>
                  <h1 id="site-title">Coopersam Gaming</h1>
                  <p className="lead">Cupons verificados • dicas seguras para conseguir diamantes no Free Fire</p>
                </div>
              </div>
              <div className="actions">
                <a className="btn" href="mailto:contato@verifiedbyffire.store">Contato</a>
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
                    <article className="coupon" data-code="COOPERSAM10" data-valid="Até 2025-12-31" data-store="Coopersam" data-tags="cooperativa,bonus">
                      <div className="left">
                        <div className="chip">Coopersam</div>
                        <div>
                          <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                            <strong className="coupon-code">COOPERSAM10</strong>
                            <span className="muted"> — 10% bônus</span>
                          </div>
                          <div className="meta small">Validade: <span className="muted">Até 31 Dez 2025</span></div>
                        </div>
                      </div>
                      <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <button className="btn">Copiar</button>
                      </div>
                    </article>

                    <article className="coupon" data-code="GAMING2025" data-valid="Até 2025-11-30" data-store="Coopersam" data-tags="gaming,promo">
                      <div className="left">
                        <div className="chip">Exclusivo</div>
                        <div>
                          <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                            <strong className="coupon-code">GAMING2025</strong>
                            <span className="muted"> — bônus especial</span>
                          </div>
                          <div className="meta small">Validade: <span className="muted">30 Nov 2025</span></div>
                        </div>
                      </div>
                      <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <button className="btn">Copiar</button>
                      </div>
                    </article>

                    <article className="coupon" data-code="FREEFIRE15" data-valid="Até 2025-12-15" data-store="Coopersam" data-tags="freefire,diamantes">
                      <div className="left">
                        <div className="chip">Free Fire</div>
                        <div>
                          <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                            <strong className="coupon-code">FREEFIRE15</strong>
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

                <section id="guide" className="card" style={{marginTop:'16px'}}>
                  <h2 style={{margin:'0 0 8px 0'}}>Guia — dicas e tutoriais</h2>
                  <p className="small" style={{color:'var(--muted)'}}>Conteúdos em formato de blog.</p>

                  <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                    <a href="#" style={{display:'block', padding:'14px', border:'1px solid rgba(255,255,255,.08)', borderRadius:'10px', background:'rgba(255,255,255,.02)'}}>
                      <strong>Promoções oficiais e eventos</strong>
                      <div className="small" style={{color:'var(--muted)'}}>Como acompanhar eventos e aproveitar bônus com segurança.</div>
                    </a>

                    <a href="#" style={{display:'block', padding:'14px', border:'1px solid rgba(255,255,255,.08)', borderRadius:'10px', background:'rgba(255,255,255,.02)'}}>
                      <strong>Recargas com bônus</strong>
                      <div className="small" style={{color:'var(--muted)'}}>Dicas para usar cupons, entender condições e maximizar o valor.</div>
                    </a>

                    <a href="#" style={{display:'block', padding:'14px', border:'1px solid rgba(255,255,255,.08)', borderRadius:'10px', background:'rgba(255,255,255,.02)'}}>
                      <strong>Segurança da conta</strong>
                      <div className="small" style={{color:'var(--muted)'}}>Boas práticas para proteger seu login e evitar golpes.</div>
                    </a>
                  </div>
                </section>
              </div>

              <aside>
                <div className="card">
                  <h3 style={{margin:'0 0 8px 0'}}>Sobre</h3>
                  <p className="small muted">
                    O site <strong>Coopersam Gaming</strong> é operado por
                    <strong> COOPERATIVA DE TRABALHO DE SERVICOS ADMINISTRATIVOS E DE MANUTENCAO - COOPERSAM</strong> —
                    <strong> CNPJ 03.396.056/0001-03</strong>, razão social registrada em
                    <strong> 13/09/1999</strong>.
                    <br /><br />
                    A <strong>COOPERSAM</strong> é uma cooperativa ativa no segmento de
                    serviços administrativos e de manutenção, localizada em
                    <strong> Alagoinhas, Bahia</strong>.
                    <br /><br />
                    Como parte de nossas ações de incentivo e aprendizado, promovemos
                    <strong> competições online em jogos eletrônicos</strong> e firmamos
                    <strong> parcerias com plataformas de recarga</strong>, recebendo cupons e benefícios
                    para nossos participantes utilizarem em recargas e eventos oficiais.
                  </p>

                  <div style={{marginTop:'10px', display:'flex', gap:'8px', flexDirection:'column'}}>
                    <a className="btn" href="/privacidade">Política de Privacidade</a>
                    <a className="btn ghost" href="/termos">Termos e Condições</a>
                    <a className="btn" href="mailto:contato@verifiedbyffire.store">Email: contato@verifiedbyffire.store</a>
                  </div>
                </div>

                <div className="card" style={{marginTop:'12px'}}>
                  <h3 style={{margin:'0 0 8px 0'}}>Informações Cadastrais</h3>
                  <ul className="small muted" style={{listStyle:'none', paddingLeft:0, margin:0}}>
                    <li><strong>Razão Social:</strong> COOPERATIVA DE TRABALHO DE SERVICOS ADMINISTRATIVOS E DE MANUTENCAO - COOPERSAM</li>
                    <li><strong>Nome Fantasia:</strong> Coopersam Ltda</li>
                    <li><strong>CNPJ:</strong> 03.396.056/0001-03</li>
                    <li><strong>Endereço:</strong> Rua Lucio Bento Cardoso, 59 - Centro - Alagoinhas/BA - CEP: 48000-057</li>
                    <li><strong>Capital Social:</strong> R$ 406.000,00</li>
                  </ul>
                </div>
              </aside>
            </div>

            <footer>
              <div>
                © <strong>Coopersam Gaming</strong> — Operado por
                <strong> COOPERATIVA DE TRABALHO DE SERVICOS ADMINISTRATIVOS E DE MANUTENCAO - COOPERSAM</strong> (CNPJ: 03.396.056/0001-03)
              </div>
              <div className="small muted" style={{marginTop:'4px'}}>
                Razão Social: COOPERATIVA DE TRABALHO DE SERVICOS ADMINISTRATIVOS E DE MANUTENCAO - COOPERSAM · Nome Fantasia: Coopersam Ltda
              </div>
              <div className="links">
                <a href="/privacidade">Privacidade</a> ·
                <a href="/termos">Termos</a> ·
                <a href="mailto:contato@verifiedbyffire.store">Contato</a>
              </div>
            </footer>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          // Criar cursor de mira de sniper
          function initSniperCursor() {
            // Verificar se já existe e remover
            const existingCursor = document.getElementById('sniper-cursor');
            if (existingCursor) {
              console.log('⚠️ Cursor já existe, removendo...');
              existingCursor.remove();
            }

            const sniperCursor = document.createElement('div');
            sniperCursor.id = 'sniper-cursor';
            sniperCursor.innerHTML = '<div class="sniper-circle"></div><div class="sniper-dot"></div>';
            
            // Garantir que o cursor seja adicionado ao body
            document.body.appendChild(sniperCursor);
            
            // Forçar estilos inline para garantir visibilidade
            sniperCursor.style.position = 'fixed';
            sniperCursor.style.width = '60px';
            sniperCursor.style.height = '60px';
            sniperCursor.style.pointerEvents = 'none';
            sniperCursor.style.zIndex = '99999';
            sniperCursor.style.opacity = '1';
            sniperCursor.style.display = 'block';

            console.log('✅ Cursor de mira criado!', sniperCursor);

            // Seguir movimento do mouse
            const handleMouseMove = (e) => {
              if (sniperCursor && sniperCursor.parentElement) {
                sniperCursor.style.left = e.clientX + 'px';
                sniperCursor.style.top = e.clientY + 'px';
                sniperCursor.style.transform = 'translate(-50%, -50%)';
                
                // Debug: mostrar posição no console (apenas primeiros 5 movimentos)
                if (window.cursorDebugCount === undefined) window.cursorDebugCount = 0;
                if (window.cursorDebugCount < 5) {
                  console.log('🎯 Cursor em:', e.clientX, e.clientY, 'Visível:', sniperCursor.style.opacity);
                  window.cursorDebugCount++;
                }
              } else {
                console.error('❌ Cursor foi removido do DOM!');
              }
            };

            document.addEventListener('mousemove', handleMouseMove);

            // Esconder cursor customizado em inputs e mostrar cursor padrão
            document.addEventListener('mouseenter', (e) => {
              if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                if (sniperCursor) sniperCursor.style.opacity = '0';
                document.body.style.cursor = 'text';
              }
            }, true);

            document.addEventListener('mouseleave', (e) => {
              if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
                if (sniperCursor) sniperCursor.style.opacity = '1';
                document.body.style.cursor = 'none';
              }
            }, true);

            // Adicionar efeito de clique
            document.addEventListener('mousedown', () => {
              if (sniperCursor) sniperCursor.style.transform = 'translate(-50%, -50%) scale(0.9)';
            });

            document.addEventListener('mouseup', () => {
              if (sniperCursor) sniperCursor.style.transform = 'translate(-50%, -50%) scale(1)';
            });

            // Verificar periodicamente se o cursor ainda existe
            const checkInterval = setInterval(() => {
              const cursor = document.getElementById('sniper-cursor');
              if (!cursor || !cursor.parentElement) {
                console.error('❌ Cursor desapareceu! Recriando...');
                clearInterval(checkInterval);
                setTimeout(initSniperCursor, 100);
              }
            }, 2000);

            console.log('✅ Eventos do cursor configurados!');
            
            // Salvar referência global para debug
            window.sniperCursor = sniperCursor;
          }

          // Inicializar quando o DOM estiver pronto
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSniperCursor);
          } else {
            initSniperCursor();
          }
          
          // Reinicializar após um pequeno delay (para garantir que o Next.js terminou de renderizar)
          setTimeout(() => {
            if (!document.getElementById('sniper-cursor')) {
              console.log('🔄 Cursor não encontrado, inicializando novamente...');
              initSniperCursor();
            }
          }, 500);

          function copyCoupon(btn) {
            const el = btn.closest('.coupon');
            const code = el?.getAttribute('data-code');
            if (!code) return;
            navigator.clipboard?.writeText(code).then(() => {
              const s = document.createElement('span');
              s.style.marginLeft = '8px';
              s.style.fontSize = '12px';
              s.textContent = 'Copiado!';
              s.style.color = 'var(--accent)';
              s.style.textShadow = '0 0 10px var(--accent)';
              btn.parentNode.appendChild(s);
              setTimeout(() => s.remove(), 1400);
            });
          }

          function filterCoupons() {
            const q = document.getElementById('search').value.toLowerCase().trim();
            document.querySelectorAll('#couponList .coupon').forEach(c => {
              const store = (c.getAttribute('data-store') || '').toLowerCase();
              const text = (c.textContent || '').toLowerCase();
              const tags = (c.getAttribute('data-tags') || '').toLowerCase();
              c.style.display = !q || store.includes(q) || text.includes(q) || tags.includes(q) ? '' : 'none';
            });
          }

          document.getElementById('search')?.addEventListener('input', filterCoupons);
          
          document.querySelectorAll('.btn').forEach(btn => {
            if (btn.textContent.includes('Copiar')) {
              btn.addEventListener('click', function() { copyCoupon(this); });
            }
          });

          // Criar partículas flutuantes
          function createParticles() {
            for (let i = 0; i < 20; i++) {
              const particle = document.createElement('div');
              particle.className = 'particle';
              particle.style.left = Math.random() * 100 + '%';
              particle.style.animationDelay = Math.random() * 15 + 's';
              particle.style.animationDuration = (10 + Math.random() * 10) + 's';
              document.body.appendChild(particle);
            }
          }
          
          createParticles();
        `}} />
      </body>
    </html>
  )
}
