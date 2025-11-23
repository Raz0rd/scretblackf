import ComplianceFooter from '@/components/ComplianceFooter'

export const metadata = {
  title: 'Política de Reembolso - BooyahStrike',
  description: 'Política de reembolso da plataforma BooyahStrike'
}

export default function PoliticaDeReembolso() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Política de Reembolso</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 mb-4">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Reembolso Antes da Entrega</h2>
            <p className="text-slate-700 mb-4">
              Pedidos podem ser reembolsados <strong>enquanto não forem entregues</strong>.
            </p>
            <p className="text-slate-700 mb-4">
              Se você deseja cancelar seu pedido antes da entrega dos créditos, entre em contato imediatamente através do email: <strong>contato@booyahstrikeforce.store</strong>
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Após a Entrega</h2>
            <p className="text-slate-700 mb-4">
              Após a entrega dos créditos digitais ou itens virtuais, <strong>não é possível solicitar reembolso</strong> devido à natureza digital do produto.
            </p>
            <p className="text-slate-700 mb-4">
              Produtos digitais são considerados consumidos imediatamente após a entrega.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. ID Incorreto</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-6">
              <p className="text-yellow-800 font-bold mb-2">
                ⚠️ ATENÇÃO: Verifique o ID antes de finalizar
              </p>
              <p className="text-yellow-700">
                Caso tenha inserido o ID incorreto, entre em contato <strong>imediatamente</strong> através do nosso suporte.
              </p>
              <p className="text-yellow-700 mt-2">
                Não nos responsabilizamos por créditos entregues em IDs incorretos fornecidos pelo usuário.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Erro da Plataforma</h2>
            <p className="text-slate-700 mb-4">
              Em caso de erro da plataforma, realizaremos:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Reenvio dos créditos para o ID correto, ou</li>
              <li>Reembolso total do valor pago</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Prazo de Reembolso</h2>
            <p className="text-slate-700 mb-4">
              Reembolsos aprovados são processados em até:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li><strong>PIX:</strong> Até 24 horas</li>
              <li><strong>Cartão de Crédito:</strong> Até 7 dias úteis (conforme operadora)</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. Como Solicitar Reembolso</h2>
            <p className="text-slate-700 mb-4">
              Para solicitar reembolso, envie um email para <strong>contato@booyahstrikeforce.store</strong> com:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Número do pedido</li>
              <li>Email usado na compra</li>
              <li>Motivo do reembolso</li>
              <li>Comprovante de pagamento (se necessário)</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">7. Situações Sem Reembolso</h2>
            <p className="text-slate-700 mb-4">
              Não realizamos reembolso nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 text-slate-700 mb-4 space-y-2">
              <li>Créditos já entregues e utilizados</li>
              <li>ID incorreto fornecido pelo usuário (sem contato prévio)</li>
              <li>Banimento ou suspensão aplicada pela desenvolvedora do jogo</li>
              <li>Arrependimento após recebimento dos créditos</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">8. Contato</h2>
            <div className="bg-slate-100 rounded-lg p-4 text-slate-700">
              <p className="mb-2"><strong>VALTER OPITZ JUNIOR</strong></p>
              <p className="mb-1">CNPJ: 42.047.382/0001-51</p>
              <p className="mb-1">Email: contato@booyahstrikeforce.store</p>
              <p className="mb-1">Telefone: (11) 94562-2020</p>
              <p className="mb-1">Endereço: R. Edson Luiz Favarin, 885 - Universitário</p>
              <p>Cascavel - PR, CEP: 85.819-130</p>
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
