import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  // Inicializar Resend dentro da função para pegar do .env
  const resendApiKey = process.env.RESEND_API_KEY
  
  if (!resendApiKey) {
    console.error('❌ RESEND_API_KEY não configurada no .env')
    return NextResponse.json(
      { error: 'Configuração de email não disponível' },
      { status: 500 }
    )
  }
  
  const resend = new Resend(resendApiKey)
  
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Enviar email de boas-vindas
    const { data, error } = await resend.emails.send({
      from: 'BooyahStrike Force <contato@booyahstrikeforce.store>',
      to: [email],
      subject: '🎮 Bem-vindo! Promoção Especial de Boas-Vindas',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bem-vindo à BooyahStrike!</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header com Banner -->
                    <tr>
                      <td style="padding: 0;">
                        <img src="${process.env.NEXT_PUBLIC_BASE_URL}/images/products/banner.png" alt="BooyahStrike Banner" width="600" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0;" />
                      </td>
                    </tr>

                    <!-- Logo -->
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background-color: #ffffff;">
                        <img src="${process.env.NEXT_PUBLIC_BASE_URL}/images/products/LogoDimBuxBAckgroundFREE.png" alt="BooyahStrike" width="88" style="width: 88px; max-width: 100%; height: auto; display: block; margin: 0 auto 20px auto;" />
                        <h1 style="color: #1e293b; margin: 20px 0 10px 0; font-size: 32px; font-weight: bold;">Bem-vindo à BooyahStrike!</h1>
                        <p style="color: #06b6d4; margin: 0; font-size: 18px; font-weight: bold;">Mais Dimas, mais Robux, mais diversão!</p>
                      </td>
                    </tr>

                    <!-- Conteúdo -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">🎉 Promoção Especial de Boas-Vindas!</h2>
                        
                        <p style="color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
                          Obrigado por se inscrever na nossa newsletter! Como boas-vindas, preparamos ofertas especiais para você:
                        </p>

                        <!-- Ofertas -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #f97316 0%, #dc2626 100%); border-radius: 12px; padding: 20px; margin-bottom: 15px;">
                              <h3 style="color: white; margin: 0 0 10px 0; font-size: 20px;">💎 Free Fire</h3>
                              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">
                                <strong>Até 26% OFF</strong> em pacotes de diamantes!<br>
                                A partir de R$ 14,90
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td style="height: 15px;"></td>
                          </tr>
                          <tr>
                            <td style="background: linear-gradient(135deg, #dc2626 0%, #ec4899 100%); border-radius: 12px; padding: 20px;">
                              <h3 style="color: white; margin: 0 0 10px 0; font-size: 20px;">🎮 Robux</h3>
                              <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">
                                <strong>Até 23% OFF</strong> em pacotes de Robux!<br>
                                A partir de R$ 18,90
                              </p>
                            </td>
                          </tr>
                        </table>

                        <!-- CTA Button -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/loja" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                🛒 Ver Loja Completa
                              </a>
                            </td>
                          </tr>
                        </table>

                        <!-- Benefícios -->
                        <div style="background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 30px 0;">
                          <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">✨ Por que escolher a gente?</h3>
                          <ul style="color: #475569; line-height: 1.8; margin: 0; padding-left: 20px;">
                            <li>⚡ Entrega em até 5 minutos</li>
                            <li>🔒 Pagamento 100% seguro via PIX</li>
                            <li>✅ Garantia total ou dinheiro de volta</li>
                            <li>💬 Suporte 24/7</li>
                          </ul>
                        </div>

                        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                          Atenciosamente,<br>
                          <strong style="color: #1e293b;">Equipe Comprar Diamantes FF</strong>
                        </p>
                      </td>
                    </tr>

                    <!-- Footer com Background -->
                    <tr>
                      <td style="padding: 0; background-image: url('${process.env.NEXT_PUBLIC_BASE_URL}/images/products/backgroundFOOTER.png'); background-size: cover; background-position: center; background-repeat: no-repeat; background-color: #0f172a;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding: 50px 30px; text-align: center; background-color: rgba(15, 23, 42, 0.85);">
                              <!-- Logo no Footer -->
                              <h3 style="font-family: 'Metropolis', Arial, sans-serif; font-size: 32px; font-weight: 900; letter-spacing: -1px; margin: 0 0 15px 0; text-transform: uppercase; color: #dc2626;">
                                BooyahStrike
                              </h3>
                              
                              <p style="color: #06b6d4; font-size: 18px; font-weight: bold; margin: 0 0 15px 0;">
                                Mais Dimas, mais Robux, mais diversão!
                              </p>
                              
                              <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 20px 0;">
                                📧 contato@booyahstrikeforce.store<br />
                                📞 (75) 3465-3331
                              </p>
                              
                              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #94a3b8; font-size: 12px; text-decoration: underline; display: inline-block; margin-bottom: 15px;">
                                Cancelar inscrição
                              </a>
                              
                              <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                                © 2025 BooyahStrike - Todos os direitos reservados
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      return NextResponse.json(
        { error: 'Erro ao enviar email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Erro na API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
