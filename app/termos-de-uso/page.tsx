import ComplianceFooter from '@/components/ComplianceFooter'

export const metadata = {
  title: 'Termos de Uso',
  description: 'Termos de uso da plataforma'
}

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Termos de Uso</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 mb-4">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>

            <p className="text-slate-700 mb-6">
              Ao utilizar este site, você concorda com os seguintes termos:
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Sobre Nossa Plataforma</h2>
            <p className="text-slate-700 mb-4">
              Somos uma <strong>plataforma independente</strong> especializada na venda de créditos digitais e itens virtuais para diversos jogos mobile. 
            </p>
            <p className="text-slate-700 mb-4">
              <strong>Não somos afiliados, parceiros, representantes ou patrocinados</strong> por Garena, Free Fire, Roblox ou qualquer desenvolvedora de jogos.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Compras e Entregas</h2>
            <p className="text-slate-700 mb-4">
              As compras são processadas de forma segura e a entrega ocorre após a confirmação do pagamento. 
            </p>
            <p className="text-slate-700 mb-4">
              O usuário é responsável por fornecer corretamente o ID ou informação necessária para entrega do produto adquirido.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Segurança e Privacidade</h2>
            <p className="text-slate-700 mb-4">
              <strong className="text-red-600">IMPORTANTE:</strong> Não solicitamos senha, login, código de verificação, número de celular ou qualquer dado sensível. 
            </p>
            <p className="text-slate-700 mb-4">
              Qualquer tentativa de solicitação desses dados deve ser ignorada e reportada imediatamente.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Responsabilidades do Usuário</h2>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Fornecer informações corretas no momento da compra</li>
              <li>Verificar o ID do jogador antes de finalizar o pedido</li>
              <li>Não compartilhar dados de acesso com terceiros</li>
              <li>Utilizar os créditos de acordo com as regras dos jogos</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Limitações de Responsabilidade</h2>
            <p className="text-slate-700 mb-4">
              Não nos responsabilizamos por:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>IDs incorretos fornecidos pelo usuário</li>
              <li>Banimentos ou suspensões aplicadas pelas desenvolvedoras dos jogos</li>
              <li>Alterações nas políticas dos jogos</li>
              <li>Problemas técnicos dos servidores dos jogos</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Aceitação dos Termos</h2>
            <p className="text-slate-700 mb-4">
              A utilização deste site implica aceitação total dos termos aqui descritos.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Contato</h2>
            <div className="bg-slate-100 rounded-lg p-4 text-slate-700">
              <p className="mb-2"><strong>JARDIELE DOS ANJOS LIMA</strong></p>
              <p className="mb-1">CNPJ: 37.945.848/0001-01</p>
              <p className="mb-1">Email: contato@gameprofissionaldigital.site</p>
              <p className="mb-1">Endereço: R Principal da Quadra 6, S/N - Conj Residencial Nascimento Alves</p>
              <p>Salgado - SE, CEP: 49.390-000</p>
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
