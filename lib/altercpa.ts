/**
 * AlterCPA Postback Integration
 * 
 * Envia postbacks para o AlterCPA para rastreamento de conversões
 */

// Configurações do AlterCPA vindas do .env
// NEXT_PUBLIC_CLOAKER_TRACKING_ID formato: 969-8f076e082dbcb1d080037ec2c216d589-16317
const CLOAKER_TRACKING_ID = process.env.NEXT_PUBLIC_CLOAKER_TRACKING_ID || ''

// Extrair campaign ID e UID do tracking ID
// Formato: {campaignId}-{uid}
const parts = CLOAKER_TRACKING_ID.split('-')
const campaignId = parts.length >= 2 ? `${parts[0]}-${parts[1]}` : ''
const uid = parts.length >= 3 ? parts[2] : ''

const ALTERCPA_CONFIG = {
  id: campaignId,
  uid: uid,
  baseUrl: 'https://www.altercpa.one/api/filter/postback.json'
}

// Validar configurações
if (!ALTERCPA_CONFIG.id || !ALTERCPA_CONFIG.uid) {
  console.warn('⚠️ [AlterCPA] NEXT_PUBLIC_CLOAKER_TRACKING_ID não configurado corretamente no .env')
  console.warn('   Formato esperado: 969-8f076e082dbcb1d080037ec2c216d589-16317')
}

/**
 * Enviar postback de novo lead para AlterCPA
 * (Já é feito automaticamente pelo cloaker quando usuário acessa)
 */
export async function sendNewLeadPostback() {
  try {
    const url = `${ALTERCPA_CONFIG.baseUrl}?id=${ALTERCPA_CONFIG.id}&uid=${ALTERCPA_CONFIG.uid}&status=new`
    
    console.log('📤 [AlterCPA] Enviando postback: NEW LEAD')
    console.log('   - URL:', url)
    
    const response = await fetch(url, { method: 'GET' })
    
    if (response.ok) {
      console.log('✅ [AlterCPA] Postback NEW LEAD enviado com sucesso')
    } else {
      console.error('❌ [AlterCPA] Erro ao enviar postback NEW LEAD:', response.status)
    }
  } catch (error) {
    console.error('❌ [AlterCPA] Erro ao enviar postback NEW LEAD:', error)
  }
}

/**
 * Enviar postback de aprovação (pagamento confirmado) para AlterCPA
 * 
 * @param payout - Valor da conversão em reais (ex: 14.24)
 */
export async function sendApprovePostback(payout: number) {
  try {
    const url = `${ALTERCPA_CONFIG.baseUrl}?id=${ALTERCPA_CONFIG.id}&uid=${ALTERCPA_CONFIG.uid}&status=approve&payout=${payout.toFixed(2)}`
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📤 [AlterCPA] Enviando postback: APPROVE')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('   - URL:', url)
    console.log('   - Payout: R$', payout.toFixed(2))
    
    const response = await fetch(url, { method: 'GET' })
    
    if (response.ok) {
      const result = await response.text()
      console.log('✅ [AlterCPA] Postback APPROVE enviado com sucesso!')
      console.log('   - Response:', result)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return { success: true, response: result }
    } else {
      console.error('❌ [AlterCPA] Erro ao enviar postback APPROVE')
      console.error('   - Status:', response.status)
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      return { success: false, error: response.status }
    }
  } catch (error) {
    console.error('❌ [AlterCPA] Erro ao enviar postback APPROVE:', error)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    return { success: false, error }
  }
}

/**
 * Enviar postback de cancelamento para AlterCPA
 */
export async function sendCancelPostback() {
  try {
    const url = `${ALTERCPA_CONFIG.baseUrl}?id=${ALTERCPA_CONFIG.id}&uid=${ALTERCPA_CONFIG.uid}&status=cancel`
    
    console.log('📤 [AlterCPA] Enviando postback: CANCEL')
    console.log('   - URL:', url)
    
    const response = await fetch(url, { method: 'GET' })
    
    if (response.ok) {
      console.log('✅ [AlterCPA] Postback CANCEL enviado com sucesso')
    } else {
      console.error('❌ [AlterCPA] Erro ao enviar postback CANCEL:', response.status)
    }
  } catch (error) {
    console.error('❌ [AlterCPA] Erro ao enviar postback CANCEL:', error)
  }
}
