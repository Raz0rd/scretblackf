import ComplianceFooter from '@/components/ComplianceFooter'

export const metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade da plataforma'
}

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Política de Privacidade</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 mb-4">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Informações que Coletamos</h2>
            <p className="text-slate-700 mb-4">
              Coletamos apenas informações necessárias para concluir a compra, como:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>E-mail para envio de confirmação e código (quando aplicável)</li>
              <li>ID do jogador para entrega dos créditos</li>
              <li>Nome para identificação do pedido</li>
            </ul>

            <div className="bg-red-50 border-l-4 border-red-600 p-4 my-6">
              <p className="text-red-800 font-bold">
                ⚠️ NÃO COLETAMOS:
              </p>
              <ul className="list-disc pl-6 text-red-700 mt-2 space-y-1">
                <li>Senha de jogos ou contas</li>
                <li>Login ou usuário</li>
                <li>Número de telefone</li>
                <li>Códigos de segurança ou verificação</li>
                <li>Informações confidenciais</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Como Usamos seus Dados</h2>
            <p className="text-slate-700 mb-4">
              Os dados são utilizados exclusivamente para:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Processar pedidos</li>
              <li>Enviar atualizações sobre o pedido</li>
              <li>Contato com o cliente em caso de dúvidas</li>
              <li>Suporte técnico quando necessário</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Compartilhamento de Dados</h2>
            <p className="text-slate-700 mb-4">
              <strong>Não vendemos, compartilhamos ou transferimos dados a terceiros.</strong>
            </p>
            <p className="text-slate-700 mb-4">
              Seus dados são mantidos em segurança e utilizados apenas internamente para processamento de pedidos.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Segurança</h2>
            <p className="text-slate-700 mb-4">
              Utilizamos medidas de segurança para proteger suas informações:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Criptografia SSL/TLS em todas as transações</li>
              <li>Servidores seguros e protegidos</li>
              <li>Acesso restrito aos dados</li>
              <li>Monitoramento constante de segurança</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Cookies</h2>
            <p className="text-slate-700 mb-4">
              Utilizamos cookies apenas para:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Melhorar a experiência de navegação</li>
              <li>Manter preferências do usuário</li>
              <li>Análise de tráfego do site</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Seus Direitos</h2>
            <p className="text-slate-700 mb-4">
              Você tem direito a:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Solicitar acesso aos seus dados</li>
              <li>Solicitar correção de dados incorretos</li>
              <li>Solicitar exclusão dos seus dados</li>
              <li>Revogar consentimento a qualquer momento</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Conformidade com LGPD</h2>
            <p className="text-slate-700 mb-4">
              Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Contato</h2>
            <div className="bg-slate-100 rounded-lg p-4 text-slate-700">
              <p className="mb-2"><strong>JULIA YOON SCAVASSA</strong></p>
              <p className="mb-1">CNPJ: 57.667.691/0001-00</p>
              <p className="mb-1">Email: contato@diamantesprofissionaljogos.store</p>
              <p className="mb-1">Endereço: Av Paes de Barros, 2370 - Parque da Mooca</p>
              <p>São Paulo - SP, CEP: 03.149-000</p>
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
