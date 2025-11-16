import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html } = body

    console.log('📧 [EMAIL] Solicitação de envio de email:')
    console.log('   - Para:', to)
    console.log('   - Assunto:', subject)

    // Verificar se a API key está configurada
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ [EMAIL] RESEND_API_KEY não configurada - email não será enviado')
      return NextResponse.json({
        success: false,
        message: 'RESEND_API_KEY não configurada'
      }, { status: 500 })
    }

    // Inicializar Resend apenas quando a API key existe
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Verificar se o domínio está configurado
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const fromName = process.env.RESEND_FROM_NAME || 'RecarGames'
    const fullFrom = `${fromName} <${fromEmail}>`
    
    console.log('📤 [EMAIL] Enviando via Resend...')
    console.log('   - From:', fullFrom)

    // Enviar email via Resend
    const { data, error } = await resend.emails.send({
      from: fullFrom,
      to: [to],
      subject: subject,
      html: html,
    })

    if (error) {
      console.error('❌ [EMAIL] Erro do Resend:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ [EMAIL] Email enviado com sucesso')
    console.log('   - ID:', data?.id)

    return NextResponse.json({
      success: true,
      message: 'Email enviado com sucesso',
      emailId: data?.id
    })
  } catch (error) {
    console.error('❌ [EMAIL] Erro ao enviar email:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao enviar email' },
      { status: 500 }
    )
  }
}
