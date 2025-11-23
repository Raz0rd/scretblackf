/**
 * Footer de Compliance para Google Ads
 * Aviso obrigatório para evitar suspensões
 */

import { companyConfig } from '@/lib/company-config'

export default function ComplianceFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        {/* Aviso Obrigatório - SEMPRE VISÍVEL */}
        <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
          <p className="text-yellow-200 text-xs leading-relaxed text-center">
            <strong>⚠️ AVISO IMPORTANTE:</strong> Este site é independente e não é afiliado, administrado ou patrocinado por Garena, Free Fire ou qualquer desenvolvedora de jogos. 
            Vendemos apenas créditos digitais, itens virtuais e serviços complementares. 
            <strong> Nunca solicitamos senha, login ou informações sigilosas.</strong>
          </p>
        </div>

        {/* Informações da Empresa */}
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          {/* Sobre */}
          <div>
            <h3 className="text-white font-bold mb-3">{companyConfig.tradeName}</h3>
            <p className="text-slate-400 text-sm mb-3">
              Plataforma independente de créditos digitais. Não solicitamos login, senha ou dados sensíveis.
            </p>
            <div className="text-slate-400 text-xs space-y-1">
              <p><strong>CNPJ:</strong> {companyConfig.cnpj}</p>
              <p><strong>Razão Social:</strong> {companyConfig.legalName}</p>
              <p><strong>Email:</strong> {companyConfig.email}</p>
              <p><strong>Telefone:</strong> {companyConfig.phone}</p>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="text-white font-bold mb-3">Endereço</h3>
            <div className="text-slate-400 text-sm space-y-1">
              <p>{companyConfig.address.street}</p>
              <p>{companyConfig.address.neighborhood}</p>
              <p>{companyConfig.address.city} - {companyConfig.address.state}</p>
              <p>CEP: {companyConfig.address.zipCode}</p>
            </div>
          </div>

          {/* Links Legais */}
          <div>
            <h3 className="text-white font-bold mb-3">Informações Legais</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/termos-de-uso" className="text-slate-400 hover:text-white transition-colors">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="/politica-de-privacidade" className="text-slate-400 hover:text-white transition-colors">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="/politica-de-reembolso" className="text-slate-400 hover:text-white transition-colors">
                  Política de Reembolso
                </a>
              </li>
              <li>
                <a href="/quem-somos" className="text-slate-400 hover:text-white transition-colors">
                  Quem Somos
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-slate-500 text-sm">
            © {companyConfig.foundedYear} {companyConfig.tradeName} - {companyConfig.legalName}. Todos os direitos reservados.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Plataforma independente. Sem afiliação com Garena ou desenvolvedoras de jogos.
          </p>
        </div>
      </div>
    </footer>
  )
}
