// Desabilitar metadata do layout para esta página
export const metadata = {
  title: "Recarga Cupom — Cupons e Dicas Free Fire",
  description: "Recarga Cupom — cupons válidos e dicas seguras para conseguir diamantes no Free Fire.",
  robots: "index,follow",
  openGraph: {
    title: "Recarga Cupom — Cupons e Dicas Free Fire",
    description: "Recarga Cupom — cupons válidos e dicas seguras para conseguir diamantes no Free Fire.",
    siteName: "Recarga Cupom",
  }
}

export default function CuponsPage() {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="page-type" content="cupons" />
        <title>Recarga Cupom — Cupons e Dicas Free Fire</title>
        <meta name="description" content="Recarga Cupom — cupons válidos e dicas seguras para conseguir diamantes no Free Fire. Consulte validade e condições antes de usar." />
        <meta name="robots" content="index,follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Recarga Cupom — Cupons e Dicas Free Fire" />
        <meta property="og:description" content="Recarga Cupom — cupons válidos e dicas seguras para conseguir diamantes no Free Fire. Consulte validade e condições antes de usar." />
        <meta property="og:site_name" content="Recarga Cupom" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Recarga Cupom — Cupons e Dicas Free Fire" />
        <meta name="twitter:description" content="Recarga Cupom — cupons válidos e dicas seguras para conseguir diamantes no Free Fire." />
        
        <link rel="icon" href="data:,RC" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --bg: #0f1724;
            --card: #0b1220;
            --accent: #06b6d4;
            --muted: #94a3b8;
            --glass: rgba(255, 255, 255, 0.03);
            --maxw: 1100px;
          }

          * { box-sizing: border-box }
          html, body { height: 100% }

          body {
            margin: 0;
            background: linear-gradient(180deg, #061427 0%, #041024 100%);
            color: #e6eef6;
            font-family: Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial;
            -webkit-font-smoothing: antialiased;
            padding: 24px;
            display: flex;
            justify-content: center
          }

          .wrap { width: 100%; max-width: var(--maxw) }
          a { color: var(--accent); text-decoration: none }

          .container {
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01));
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 6px 40px rgba(2, 6, 23, .7);
            border: 1px solid rgba(255, 255, 255, 0.03)
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
            background: linear-gradient(135deg, var(--accent), #7c3aed);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #041024
          }

          h1 { margin: 0; font-size: 20px }
          p.lead { margin: 0; color: var(--muted) }

          .actions { display: flex; gap: 8px; align-items: center }

          .btn {
            background: var(--accent);
            color: #021724;
            padding: 10px 14px;
            border-radius: 10px;
            font-weight: 600;
            cursor: pointer;
            border: none
          }

          .btn.ghost {
            background: transparent;
            color: var(--muted);
            border: 1px solid rgba(255, 255, 255, 0.08)
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
            background: var(--card);
            padding: 14px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.06)
          }

          .coupon-list { display: flex; flex-direction: column; gap: 10px }

          .coupon {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            padding: 10px;
            border-radius: 8px;
            background: var(--glass);
            border: 1px solid rgba(255, 255, 255, 0.02)
          }

          .coupon .left { display: flex; gap: 12px; align-items: center }

          .chip {
            background: rgba(255, 255, 255, 0.06);
            padding: 8px 10px;
            border-radius: 8px;
            font-weight: 700;
            letter-spacing: 1px
          }

          .coupon-code {
            font-family: monospace;
            background: rgba(0, 0, 0, 0.25);
            padding: 6px 8px;
            border-radius: 6px
          }

          .coupon .meta { color: var(--muted); font-size: 13px }
          .search {
            width: 100%;
            padding: 10px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: inherit
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
        `}} />

        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16784716231"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-16784716231');
        `}} />
      </head>

      <body>
        <div className="wrap">
          <div className="container" role="main" aria-labelledby="site-title">
            <header>
              <div className="brand">
                <div className="logo" aria-hidden="true">RC</div>
                <div>
                  <h1 id="site-title">Recarga Cupom</h1>
                  <p className="lead">Cupons verificados • dicas seguras para conseguir diamantes no Free Fire</p>
                </div>
              </div>
              <div className="actions">
                <button className="btn">Contato</button>
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
                    <article className="coupon" data-code="RECARGA10" data-valid="Até 2025-12-31" data-store="RecargaJogo" data-tags="recarga,bonus">
                      <div className="left">
                        <div className="chip">RecargaJogo</div>
                        <div>
                          <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                            <strong className="coupon-code">RECARGA10</strong>
                            <span className="muted"> — 10% bônus</span>
                          </div>
                          <div className="meta small">Validade: <span className="muted">Até 31 Dez 2025</span></div>
                        </div>
                      </div>
                      <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <button className="btn">Copiar</button>
                      </div>
                    </article>

                    <article className="coupon" data-code="DIAMANTES50" data-valid="Até 2025-11-30" data-store="RecargaJogo" data-tags="diamante,promo">
                      <div className="left">
                        <div className="chip">Promo</div>
                        <div>
                          <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                            <strong className="coupon-code">DIAMANTES50</strong>
                            <span className="muted"> — bônus especial</span>
                          </div>
                          <div className="meta small">Validade: <span className="muted">30 Nov 2025</span></div>
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
                    O site <strong>Recarga Cupom</strong> é operado por
                    <strong> Escola Viva Esportes LTDA</strong> —
                    <strong> CNPJ 59.076.552/0001-26</strong>, razão social registrada em
                    <strong> 24/01/2025</strong>.
                    <br /><br />
                    A <strong>Viva Esportes</strong> é uma microempresa ativa no segmento de
                    recreação, lazer e ensino de esportes, com foco em atividades educativas e
                    competitivas para jovens e adolescentes.
                    <br /><br />
                    Como parte de nossas ações de incentivo e aprendizado, promovemos
                    <strong> competições online em jogos eletrônicos</strong> e firmamos
                    <strong> parcerias com plataformas de recarga</strong>, recebendo cupons e benefícios
                    para nossos participantes utilizarem em recargas e eventos oficiais.
                  </p>

                  <div style={{marginTop:'10px', display:'flex', gap:'8px', flexDirection:'column'}}>
                    <button className="btn">Política de Privacidade</button>
                    <button className="btn ghost">Termos e Condições</button>
                    <a className="btn" href="mailto:suporte@recargacupom.shop">Email: suporte@recargacupom.shop</a>
                  </div>
                </div>

                <div className="card" style={{marginTop:'12px'}}>
                  <h3 style={{margin:'0 0 8px 0'}}>Informações Cadastrais</h3>
                  <ul className="small muted" style={{listStyle:'none', paddingLeft:0, margin:0}}>
                    <li><strong>Razão Social:</strong> Escola Viva Esportes LTDA</li>
                    <li><strong>Nome Fantasia:</strong> Viva Esportes</li>
                    <li><strong>CNPJ:</strong> 59.076.552/0001-26</li>
                  </ul>
                </div>
              </aside>
            </div>

            <footer>
              <div>
                © <strong>Recarga Cupom</strong> — Operado por
                <strong> Escola Viva Esportes LTDA</strong> (CNPJ: 59.076.552/0001-26)
              </div>
              <div className="small muted" style={{marginTop:'4px'}}>
                Razão Social: Escola Viva Esportes LTDA · Nome Fantasia: Recarga Cupom
              </div>
              <div className="links">
                <a href="#">Privacidade</a> ·
                <a href="#">Termos</a> ·
                <a href="mailto:suporte@recargacupom.shop">Contato</a>
              </div>
            </footer>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{__html: `
          function copyCoupon(btn) {
            const el = btn.closest('.coupon');
            const code = el?.getAttribute('data-code');
            if (!code) return;
            navigator.clipboard?.writeText(code).then(() => {
              const s = document.createElement('span');
              s.style.marginLeft = '8px';
              s.style.fontSize = '12px';
              s.textContent = 'Copiado!';
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
        `}} />
      </body>
    </html>
  )
}
