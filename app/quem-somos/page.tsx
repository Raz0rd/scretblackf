import ComplianceFooter from '@/components/ComplianceFooter'

export const metadata = {
  title: 'Quem Somos - BooyahStrike',
  description: 'Conheça a BooyahStrike - Plataforma de créditos digitais'
}

export default function QuemSomos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Quem Somos</h1>
          
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Nossa Missão</h2>
            <p className="text-slate-700 mb-4">
              Somos uma <strong>plataforma independente</strong> especializada em créditos digitais, itens virtuais e benefícios para jogadores mobile.
            </p>
            <p className="text-slate-700 mb-4">
              Nossa missão é oferecer preços acessíveis, promoções exclusivas e entrega rápida com total segurança.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Transparência e Segurança</h2>
            <p className="text-slate-700 mb-4">
              Trabalhamos de forma transparente, sem solicitar informações sensíveis, e seguimos rigorosamente as políticas das plataformas de anúncios.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
              <p className="text-blue-800 font-bold mb-2">
                🛡️ Compromisso com a Segurança
              </p>
              <p className="text-blue-700">
                Nunca solicitamos senha, login ou dados confidenciais. Todas as transações são seguras e protegidas.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Independência</h2>
            <p className="text-slate-700 mb-4">
              <strong>Importante:</strong> Não somos afiliados, parceiros ou patrocinados por Garena, Free Fire, Roblox ou qualquer desenvolvedora de jogos.
            </p>
            <p className="text-slate-700 mb-4">
              Atuamos como uma plataforma independente de venda de créditos digitais.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Nossos Valores</h2>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li><strong>Transparência:</strong> Informações claras e honestas</li>
              <li><strong>Segurança:</strong> Proteção de dados e transações seguras</li>
              <li><strong>Agilidade:</strong> Entrega rápida e eficiente</li>
              <li><strong>Suporte:</strong> Atendimento dedicado ao cliente</li>
              <li><strong>Preço Justo:</strong> Ofertas competitivas e promoções</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Dados da Empresa</h2>
            <div className="bg-slate-100 rounded-lg p-6 text-slate-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Informações Legais</h3>
                  <p className="mb-2"><strong>Razão Social:</strong><br/>JULIA YOON SCAVASSA</p>
                  <p className="mb-2"><strong>CNPJ:</strong><br/>57.667.691/0001-00</p>
                  <p className="mb-2"><strong>Nome Fantasia:</strong><br/>Diamantes Profissional Jogos</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-900 mb-3">Contato</h3>
                  <p className="mb-2"><strong>Email:</strong><br/>contato@diamantesprofissionaljogos.store</p>
                  <p className="mb-2"><strong>Site:</strong><br/>diamantesprofissionaljogos.store</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-300">
                <h3 className="font-bold text-slate-900 mb-3">Endereço</h3>
                <p className="text-slate-700">
                  Av Paes de Barros, 2370<br/>
                  Parque da Mooca<br/>
                  São Paulo - SP<br/>
                  CEP: 03.149-000
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Entre em Contato</h2>
            <p className="text-slate-700 mb-4">
              Tem dúvidas ou sugestões? Entre em contato conosco:
            </p>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 border border-red-200">
              <p className="text-slate-700 mb-2">
                📧 <strong>Email:</strong> <a href="mailto:contato@diamantesprofissionaljogos.store" className="text-red-600 hover:underline">contato@diamantesprofissionaljogos.store</a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              Voltar para o Início
            </a>
          </div>
        </div>
      </div>

      <ComplianceFooter />
    </div>
  )
}
