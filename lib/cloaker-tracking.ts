/**
 * Sistema de Tracking do Cloaker (AlterCPA)
 * 
 * Envia postbacks para o sistema de cloaker conforme o status do lead:
 * - new: Novo lead (usuário acessou a página)
 * - approve: Lead aprovado (pagamento confirmado)
 * - cancel: Lead cancelado (pagamento expirado/falhou)
 */

type CloakerStatus = 'new' | 'approve' | 'cancel'

interface CloakerPostbackOptions {
  status: CloakerStatus
  payout?: number // Valor em reais (opcional, apenas para approve)
}

// Configurações hardcoded do cloaker
const CLOAKER_CONFIG = {
  apiUrl: 'https://www.altercpa.one/api/filter/postback.json',
  campaignId: '969-8f076e082dbcb1d080037ec2c216d589',
  uid: '15093'
}

/**
 * Verifica se o tracking do cloaker está habilitado
 */
export function isCloakerTrackingEnabled(): boolean {
  // Não enviar postbacks em modo desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log('[Cloaker] Tracking desabilitado em modo desenvolvimento')
    return false
  }
  
  return process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED === 'true'
}

/**
 * Envia postback para o sistema de cloaker
 */
export async function sendCloakerPostback(options: CloakerPostbackOptions): Promise<boolean> {
  // Verificar se está habilitado
  if (!isCloakerTrackingEnabled()) {
    console.log('[Cloaker] Tracking desabilitado')
    return false
  }

  try {
    // Construir URL do postback
    const url = new URL(CLOAKER_CONFIG.apiUrl)
    url.searchParams.set('id', CLOAKER_CONFIG.campaignId)
    url.searchParams.set('uid', CLOAKER_CONFIG.uid)
    url.searchParams.set('status', options.status)

    // Adicionar payout se fornecido (apenas para approve)
    if (options.status === 'approve' && options.payout) {
      url.searchParams.set('payout', options.payout.toFixed(2))
    }

    console.log(`[Cloaker] Enviando postback: ${options.status}`, {
      url: url.toString(),
      payout: options.payout
    })

    // Enviar postback
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'CloakerTracking/1.0'
      }
    })

    if (response.ok) {
      console.log(`[Cloaker] ✅ Postback enviado com sucesso: ${options.status}`)
      return true
    } else {
      console.error(`[Cloaker] ❌ Erro ao enviar postback: ${response.status}`)
      return false
    }
  } catch (error) {
    console.error('[Cloaker] ❌ Erro ao enviar postback:', error)
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
