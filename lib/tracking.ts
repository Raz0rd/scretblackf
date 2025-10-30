// Utilitário para rastreamento de conversões

// Tipos para os parâmetros UTM
type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  network?: string;
  placement?: string;
  device?: string;
  [key: string]: string | undefined;
};

// Função para extrair parâmetros UTM da URL
export function getUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: UtmParams = {};
  
  // Parâmetros UTM padrão
  const utmKeys = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'utm_id', 'network', 'placement', 'device', 'gclid', 'fbclid', 'msclkid'
  ];
  
  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) utmParams[key] = value;
  });
  
  return utmParams;
}

// Ratoeira ADS removido - não é mais necessário
