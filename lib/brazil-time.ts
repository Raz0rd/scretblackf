/**
 * Função para obter timestamp em horário de Brasília (GMT-3)
 * Formato: YYYY-MM-DD HH:MM:SS
 * 
 * @param date - Data opcional (padrão: now)
 * @returns String no formato "2025-10-07 17:37:00"
 */
export function getBrazilTimestamp(date: Date = new Date()): string {
  // Converter para horário de Brasília (GMT-3)
  const brazilTime = new Date(date.toLocaleString('en-US', { 
    timeZone: 'America/Sao_Paulo' 
  }))
  
  const year = brazilTime.getFullYear()
  const month = String(brazilTime.getMonth() + 1).padStart(2, '0')
  const day = String(brazilTime.getDate()).padStart(2, '0')
  const hours = String(brazilTime.getHours()).padStart(2, '0')
  const minutes = String(brazilTime.getMinutes()).padStart(2, '0')
  const seconds = String(brazilTime.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * Função para obter timestamp em UTC (GMT+0) - Formato UTMify
 * Formato: YYYY-MM-DD HH:MM:SS
 * 
 * @param date - Data opcional (padrão: now)
 * @returns String no formato "2025-11-22 15:34:14" (UTC)
 */
export function getUTCTimestamp(date: Date = new Date()): string {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  const hours = String(date.getUTCHours()).padStart(2, '0')
  const minutes = String(date.getUTCMinutes()).padStart(2, '0')
  const seconds = String(date.getUTCSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
