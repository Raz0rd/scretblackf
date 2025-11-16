/**
 * Gateway Mapper - Ofuscação de nomes de gateways
 * 
 * Não expor nomes reais dos gateways no localStorage do cliente
 * para evitar que concorrentes/bots identifiquem os provedores
 */

// Mapeamento de gateways para códigos ofuscados
const GATEWAY_MAP: Record<string, string> = {
  'ghostpay': 'gpxx',
  'ezzpag': 'ezxx',
  'umbrela': 'umxx',
  'nitro': 'ntxx',
}

const REVERSE_MAP: Record<string, string> = {
  'gpxx': 'ghostpay',
  'ezxx': 'ezzpag',
  'umxx': 'umbrela',
  'ntxx': 'nitro',
}

/**
 * Codificar nome real do gateway para código ofuscado
 * @param gateway - Nome real do gateway (ex: 'ghostpay')
 * @returns Código ofuscado (ex: 'gw_alpha')
 */
export function encodeGateway(gateway: string): string {
  return GATEWAY_MAP[gateway] || 'gw_unknown'
}

/**
 * Decodificar código ofuscado para nome real do gateway
 * @param encoded - Código ofuscado (ex: 'gw_alpha')
 * @returns Nome real do gateway (ex: 'ghostpay')
 */
export function decodeGateway(encoded: string): string {
  return REVERSE_MAP[encoded] || 'ezzpag'
}

/**
 * Para debug (apenas server-side)
 * @returns Mapeamento completo de gateways
 */
export function getGatewayMapping() {
  return GATEWAY_MAP
}

/**
 * Verificar se um código é válido
 * @param encoded - Código ofuscado
 * @returns true se o código existe no mapeamento
 */
export function isValidGatewayCode(encoded: string): boolean {
  return encoded in REVERSE_MAP
}
