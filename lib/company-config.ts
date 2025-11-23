/**
 * Configurações centralizadas da empresa
 * Todos os dados são carregados das variáveis de ambiente
 */

export const companyConfig = {
  // Informações Legais
  legalName: process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME || '',
  cnpj: process.env.NEXT_PUBLIC_COMPANY_CNPJ || '',
  tradeName: process.env.NEXT_PUBLIC_COMPANY_TRADE_NAME || '',
  
  // Contato
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || '',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '',
  phoneRaw: process.env.NEXT_PUBLIC_COMPANY_PHONE_RAW || '',
  website: process.env.NEXT_PUBLIC_COMPANY_WEBSITE || '',
  
  // Endereço
  address: {
    street: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_STREET || '',
    neighborhood: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_NEIGHBORHOOD || '',
    city: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_CITY || '',
    state: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_STATE || '',
    zipCode: process.env.NEXT_PUBLIC_COMPANY_ADDRESS_ZIP || '',
  },
  
  // Informações Adicionais
  description: process.env.NEXT_PUBLIC_COMPANY_DESCRIPTION || '',
  businessHours: process.env.NEXT_PUBLIC_COMPANY_BUSINESS_HOURS || '',
  foundedYear: process.env.NEXT_PUBLIC_COMPANY_FOUNDED_YEAR || new Date().getFullYear().toString(),
}
