/**
 * Sistema de Tracking do Cloaker (AlterCPA)
 * 
 * Envia postbacks para o sistema de cloaker conforme o status do lead:
 * - new: Novo lead (usuário acessou a página)
 * - approve: Lead aprovado (pagamento confirmado)
 * - cancel: Lead cancelado (pagamento expirado/falhou)
 * 
 * IMPORTANTE: Faz requisição direta do client para manter IP real do usuário
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
  if (typeof window === 'undefined') return false
  if (process.env.NODE_ENV === 'development') return false
  return process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED === 'true'
}

/**
 * Extrai configurações do Filter ID
 */
function getCloakerConfig() {
  const filterId = process.env.NEXT_PUBLIC_CLOAKER_FILTER_ID
  if (!filterId) return null

  const parts = filterId.split('-')
  const uid = parts[parts.length - 1]
  const campaignId = parts.slice(0, -1).join('-')

  return {
    apiUrl: 'https://www.altercpa.one/api/filter/postback.json',
    campaignId,
    uid
  }
}

/**
 * Envia postback para o sistema de cloaker (client-side para manter IP real)
 */
export async function sendCloakerPostback(options: CloakerPostbackOptions): Promise<boolean> {
  if (!isCloakerTrackingEnabled()) return false

  const config = getCloakerConfig()
  if (!config) return false

  try {
    const url = new URL(config.apiUrl)
    url.searchParams.set('id', config.campaignId)
    url.searchParams.set('uid', config.uid)
    url.searchParams.set('status', options.status)

    if (options.status === 'approve' && options.payout) {
      url.searchParams.set('payout', options.payout.toFixed(2))
    }

    // Fetch direto do client (mantém IP real do usuário)
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: { 'User-Agent': 'CloakerTracking/1.0' }
    })

    return response.ok
  } catch {
    return false // Silencioso - sem logs
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
