/**
 * Google Ads Conversion Tracking
 * 
 * Helper functions para disparar eventos de conversão do Google Ads
 * Inclui suporte para Enhanced Conversions (Conversões Otimizadas)
 */

// Declarar gtag no window
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Interface para dados do usuário (Enhanced Conversions)
 */
interface UserData {
  email?: string;
  phone_number?: string;
  address?: {
    first_name?: string;
    last_name?: string;
    street?: string;
    city?: string;
    region?: string;
    postal_code?: string;
    country?: string;
  };
}

/**
 * Função para hashear dados com SHA-256
 * Google Ads aceita dados em texto plano (faz hash automaticamente)
 * mas podemos normalizar antes de enviar
 */
function normalizeAndHash(value: string | undefined): string | undefined {
  if (!value) return undefined;
  
  // Normalizar: remover espaços, lowercase
  const normalized = value.trim().toLowerCase();
  
  // Google Ads faz o hash automaticamente quando usa gtag
  // Então retornamos apenas normalizado
  return normalized;
}

/**
 * Normalizar telefone para formato E.164
 * Exemplo: (11) 99999-9999 → +5511999999999
 */
function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  
  // Remover tudo que não é número
  const digits = phone.replace(/\D/g, '');
  
  // Se já tem código do país, retornar com +
  if (digits.startsWith('55')) {
    return `+${digits}`;
  }
  
  // Se não tem, adicionar +55 (Brasil)
  return `+55${digits}`;
}

/**
 * Verifica se o Google Ads está habilitado e o gtag está disponível
 */
function isGoogleAdsEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  
  const enabled = process.env.NEXT_PUBLIC_GOOGLE_ADS_ENABLED === 'true';
  const hasGtag = typeof window.gtag === 'function';
  
  if (enabled && !hasGtag) {
    console.warn('[Google Ads] Google Ads está habilitado mas gtag() não está disponível');
  }
  
  return enabled && hasGtag;
}

/**
 * Disparar conversão quando pagamento é confirmado (status PAID)
 * Evento: "Compra"
 * 
 * @param transactionId - ID da transação
 * @param value - Valor da compra em reais (ex: 14.24)
 * @param userData - Dados do usuário para Enhanced Conversions (opcional)
 */
export function trackPurchase(transactionId: string, value: number, userData?: UserData) {
  if (!isGoogleAdsEnabled()) {
    return;
  }

  try {
    // Pegar ID de conversão do .env
    const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
    const conversionLabel = process.env.NEXT_PUBLIC_GTAG_CONVERSION_COMPRA;
    
    if (!googleAdsId || !conversionLabel) {
      return;
    }
    const conversionId = `${googleAdsId}/${conversionLabel}`;
    
    // ✅ GARANTIR que o valor está no formato correto (número com 2 decimais)
    // Google Ads requer valor numérico, não string
    const formattedValue = parseFloat(value.toFixed(2));
    
    // ✅ Objeto exato conforme documentação oficial do Google Ads
    // Referência: https://support.google.com/google-ads/answer/6331304
    const conversionData = {
      'send_to': conversionId,
      'value': formattedValue,
      'currency': 'BRL',
      'transaction_id': transactionId
    }
    
    // ✅ ENHANCED CONVERSIONS: Enviar dados do usuário (se fornecidos)
    if (userData) {
      const enhancedData: any = {};
      
      if (userData.email) {
        enhancedData.email = normalizeAndHash(userData.email);
      }
      
      if (userData.phone_number) {
        enhancedData.phone_number = normalizePhone(userData.phone_number);
      }
      
      if (userData.address) {
        enhancedData.address = {};
        
        if (userData.address.first_name) {
          enhancedData.address.first_name = normalizeAndHash(userData.address.first_name);
        }
        if (userData.address.last_name) {
          enhancedData.address.last_name = normalizeAndHash(userData.address.last_name);
        }
        if (userData.address.street) {
          enhancedData.address.street = normalizeAndHash(userData.address.street);
        }
        if (userData.address.city) {
          enhancedData.address.city = normalizeAndHash(userData.address.city);
        }
        if (userData.address.region) {
          enhancedData.address.region = normalizeAndHash(userData.address.region);
        }
        if (userData.address.postal_code) {
          enhancedData.address.postal_code = userData.address.postal_code.replace(/\D/g, '');
        }
        if (userData.address.country) {
          enhancedData.address.country = userData.address.country.toUpperCase();
        }
      }
      
      if (Object.keys(enhancedData).length > 0) {
        window.gtag!('set', 'user_data', enhancedData);
      }
    }
    
    // ✅ Disparar evento de conversão (método oficial in-page)
    window.gtag!('event', 'conversion', conversionData);
  } catch (error) {
    // Erro ao disparar conversão
  }
}

/**
 * Disparar conversão customizada
 * 
 * @param conversionLabel - Label de conversão (ex: 'S9KKCL7Qo6obEMa9u7JB')
 * @param params - Parâmetros adicionais
 */
export function trackCustomConversion(conversionLabel: string, params: Record<string, any> = {}) {
  if (!isGoogleAdsEnabled()) {
    return;
  }

  try {
    const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
    
    if (!googleAdsId) {
      return;
    }
    const conversionId = `${googleAdsId}/${conversionLabel}`;
    
    window.gtag!('event', 'conversion', {
      'send_to': conversionId,
      ...params
    });
  } catch (error) {
    // Erro ao disparar conversão customizada
  }
}
