/**
 * Sistema de Tracking do Cloaker (AlterCPA)
 * 
 * Envia postbacks para o sistema de cloaker conforme o status do lead:
 * - new: Novo lead (usuário acessou a página)
 * - approve: Lead aprovado (pagamento confirmado)
 * - cancel: Lead cancelado (pagamento expirado/falhou)
 * 
 * IMPORTANTE: Usa API route (/api/cloaker-postback) para manter configurações no backend
 */

type CloakerStatus = 'new' | 'approve' | 'cancel'

interface CloakerPostbackOptions {
  status: CloakerStatus
  payout?: number // Valor em reais (opcional, apenas para approve)
}

/**
 * Verifica se o tracking do cloaker está habilitado
 */
export function isCloakerTrackingEnabled(): boolean {
  // Não enviar postbacks em modo desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    return false
  }
  
  return process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED === 'true'
}

/**
 * Envia postback para o sistema de cloaker via API route
 */
export async function sendCloakerPostback(options: CloakerPostbackOptions): Promise<boolean> {
  // Verificar se está habilitado
  if (!isCloakerTrackingEnabled()) {
    return false
  }

  try {
    // Chamar API route (backend) para enviar postback
    const response = await fetch('/api/cloaker-postback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options)
    })

    return response.ok
  } catch (error) {
    // Silencioso - não mostrar erro no console do client
    return false
  }
}

/**
 * Envia postback de novo lead
 * Chamar quando o usuário acessar a página principal
 */
export async function trackNewLead(): Promise<boolean> {
  return sendCloakerPostback({ status: 'new' })
}

/**
 * Envia postback de lead aprovado
 * Chamar quando o pagamento for confirmado
 */
export async function trackApprovedLead(payout?: number): Promise<boolean> {
  return sendCloakerPostback({ 
    status: 'approve',
    payout 
  })
}

/**
 * Envia postback de lead cancelado
 * Chamar quando o pagamento expirar ou falhar
 */
export async function trackCancelledLead(): Promise<boolean> {
  return sendCloakerPostback({ status: 'cancel' })
}
