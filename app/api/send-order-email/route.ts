import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  // Inicializar Resend dentro da função para garantir que a variável de ambiente seja lida
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
    const { type, email, customerName, product, orderId, amount } = await request.json()

    if (!email || !type) {
      return NextResponse.json(
        { error: 'Email e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    let subject = ''
    let htmlContent = ''

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`

    // Template base com tema do site
    const emailTemplate = (content: string) => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a;">
            <tr>
              <td align="center" style="padding: 20px 0;">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
                  
                  <!-- Banner -->
                  <tr>
                    <td style="padding: 0;">
                      <img src="${baseUrl}/images/products/banner.png" alt="BooyahStrike" width="600" style="width: 100%; max-width: 600px; height: auto; display: block; border: 0;" />
                    </td>
                  </tr>

                  <!-- Logo -->
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #1e293b;">
                      <h1 style="font-family: 'Metropolis', Arial, sans-serif; font-size: 36px; font-weight: 900; letter-spacing: -1px; margin: 0; text-transform: uppercase; color: #dc2626;">
                        BooyahStrike
                      </h1>
                    </td>
                  </tr>

                  <!-- Conteúdo -->
                  <tr>
                    <td style="padding: 30px; background-color: #1e293b;">
                      ${content}
                    </td>
                  </tr>

                  <!-- Footer com imagem de fundo -->
                  <tr>
                    <td style="padding: 0; position: relative;">
                      <div style="background-image: url('${baseUrl}/images/products/backgroundFOOTER.png'); background-size: cover; background-position: center; padding: 40px 30px; position: relative;">
                        <div style="background-color: rgba(15, 23, 42, 0.9); padding: 30px; border-radius: 12px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="text-align: center; padding-bottom: 20px;">
                                <h3 style="color: #06b6d4; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">AMANDA IZABEL DUTRA DA SILVA</h3>
                                <p style="color: #94a3b8; margin: 5px 0; font-size: 14px;">CNPJ: 60.730.759/0001-51</p>
                                <p style="color: #94a3b8; margin: 5px 0; font-size: 14px;">📧 contato@booyahstrikeforce.store</p>
                                <p style="color: #94a3b8; margin: 5px 0; font-size: 14px;">📞 (11) 94562-2020</p>
                                <p style="color: #94a3b8; margin: 5px 0; font-size: 14px;">📍 Avenida Santo Amaro, 765 - Vila Nova Conceição, São Paulo/SP</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="text-align: center; padding-top: 20px; border-top: 1px solid rgba(148, 163, 184, 0.2);">
                                <p style="color: #64748b; margin: 10px 0; font-size: 12px;">
                                  © ${new Date().getFullYear()} BooyahStrike. Todos os direitos reservados.
                                </p>
                                <p style="margin: 10px 0;">
                                  <a href="${unsubscribeUrl}" style="color: #06b6d4; text-decoration: none; font-size: 12px;">Cancelar inscrição</a>
                                </p>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `

    // Email 1: Pagamento Gerado (Pending)
    if (type === 'payment_pending') {
      subject = '🔒 Seu Pedido foi Gerado - Aguardando Pagamento'
      htmlContent = emailTemplate(`
        <h2 style="color: #06b6d4; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">Olá, ${customerName}! 👋</h2>
        
        <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
          Seu pedido foi gerado com sucesso! Agora é só realizar o pagamento via PIX para garantir sua compra.
        </p>

        <div style="background-color: #0f172a; border-left: 4px solid #06b6d4; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #06b6d4; margin: 0 0 15px 0; font-size: 18px;">📋 Detalhes do Pedido</h3>
          <p style="color: #cbd5e1; margin: 5px 0; font-size: 14px;"><strong>Pedido:</strong> #${orderId}</p>
          <p style="color: #cbd5e1; margin: 5px 0; font-size: 14px;"><strong>Produto:</strong> ${product}</p>
          <p style="color: #cbd5e1; margin: 5px 0; font-size: 14px;"><strong>Valor:</strong> R$ ${amount}</p>
        </div>

        <div style="background-color: #1e3a8a; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #3b82f6;">
          <p style="color: #93c5fd; margin: 0; font-size: 14px; line-height: 1.6;">
            ⏰ <strong>Importante:</strong> O pagamento via PIX expira em 30 minutos. Complete o pagamento o quanto antes para garantir seu pedido!
          </p>
        </div>

        <p style="color: #e2e8f0; margin: 20px 0; font-size: 16px; line-height: 1.6;">
          Após a confirmação do pagamento, você receberá outro email com as instruções de entrega.
        </p>

        <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 14px;">
          Atenciosamente,<br>
          <strong style="color: #06b6d4;">Equipe BooyahStrike</strong>
        </p>
      `)
    }

    // Email 2: Pagamento Confirmado
    if (type === 'payment_confirmed') {
      subject = '✅ Pagamento Confirmado - Pedido em Processamento'
      htmlContent = emailTemplate(`
        <h2 style="color: #10b981; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">Pagamento Confirmado! 🎉</h2>
        
        <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
          Olá, ${customerName}! Seu pagamento foi confirmado com sucesso!
        </p>

        <div style="background-color: #064e3b; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #10b981; margin: 0 0 15px 0; font-size: 18px;">📦 Status do Pedido</h3>
          <p style="color: #d1fae5; margin: 5px 0; font-size: 14px;"><strong>Pedido:</strong> #${orderId}</p>
          <p style="color: #d1fae5; margin: 5px 0; font-size: 14px;"><strong>Produto:</strong> ${product}</p>
          <p style="color: #d1fae5; margin: 5px 0; font-size: 14px;"><strong>Status:</strong> Em processamento ⏳</p>
        </div>

        <div style="background-color: #0f172a; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #06b6d4;">
          <h3 style="color: #06b6d4; margin: 0 0 15px 0; font-size: 16px;">⏰ Prazo de Entrega</h3>
          <p style="color: #cbd5e1; margin: 0; font-size: 14px; line-height: 1.6;">
            Seu pedido será processado em até <strong style="color: #06b6d4;">12 horas</strong>, mas geralmente entregamos em <strong style="color: #10b981;">poucos minutos</strong>! 🚀
          </p>
        </div>

        <div style="background-color: #1e3a8a; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #3b82f6;">
          <p style="color: #93c5fd; margin: 0; font-size: 14px; line-height: 1.6;">
            💡 <strong>Dica:</strong> Fique de olho no seu email! Você receberá uma notificação assim que seu pedido for entregue.
          </p>
        </div>

        <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 14px;">
          Obrigado pela confiança!<br>
          <strong style="color: #06b6d4;">Equipe BooyahStrike</strong>
        </p>
      `)
    }

    // Email 3: Instabilidades (30 minutos após pagamento)
    if (type === 'processing_delay') {
      subject = '⚠️ Atualização do Pedido - Processamento em Andamento'
      htmlContent = emailTemplate(`
        <h2 style="color: #f59e0b; margin: 0 0 20px 0; font-size: 24px; font-weight: bold;">Atualização do seu Pedido</h2>
        
        <p style="color: #e2e8f0; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
          Olá, ${customerName}!
        </p>

        <div style="background-color: #0f172a; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #f59e0b; margin: 0 0 15px 0; font-size: 18px;">📋 Pedido: #${orderId}</h3>
          <p style="color: #cbd5e1; margin: 5px 0; font-size: 14px;"><strong>Produto:</strong> ${product}</p>
          <p style="color: #cbd5e1; margin: 5px 0; font-size: 14px;"><strong>Status:</strong> Processando ⏳</p>
        </div>

        <p style="color: #e2e8f0; margin: 20px 0; font-size: 16px; line-height: 1.6;">
          Estamos processando seu pedido, mas identificamos algumas <strong style="color: #f59e0b;">instabilidades temporárias</strong> em nosso sistema de entrega.
        </p>

        <div style="background-color: #1e3a8a; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #3b82f6;">
          <p style="color: #93c5fd; margin: 0 0 10px 0; font-size: 14px; line-height: 1.6;">
            <strong>⚙️ O que está acontecendo?</strong>
          </p>
          <p style="color: #cbd5e1; margin: 0; font-size: 14px; line-height: 1.6;">
            Nossa equipe técnica está trabalhando para normalizar o sistema. Seu pedido está seguro e será entregue assim que possível.
          </p>
        </div>

        <div style="background-color: #064e3b; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #10b981;">
          <p style="color: #d1fae5; margin: 0; font-size: 14px; line-height: 1.6;">
            ✅ <strong>Não se preocupe:</strong> Seu pagamento foi confirmado e seu pedido será entregue dentro do prazo de até 12 horas.
          </p>
        </div>

        <p style="color: #e2e8f0; margin: 20px 0; font-size: 16px; line-height: 1.6;">
          Se tiver alguma dúvida, entre em contato conosco pelo WhatsApp: <strong style="color: #06b6d4;">(11) 94562-2020</strong>
        </p>

        <p style="color: #94a3b8; margin: 20px 0 0 0; font-size: 14px;">
          Agradecemos sua compreensão,<br>
          <strong style="color: #06b6d4;">Equipe BooyahStrike</strong>
        </p>
      `)
    }

    // Enviar email
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const fromName = process.env.RESEND_FROM_NAME || 'BooyahStrike'
    const fullFrom = `${fromName} <${fromEmail}>`
    
    const { data, error } = await resend.emails.send({
      from: fullFrom,
      to: [email],
      subject: subject,
      html: htmlContent,
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      return NextResponse.json({ error: 'Erro ao enviar email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Erro na API de email:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
