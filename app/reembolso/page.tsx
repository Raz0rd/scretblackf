"use client"

import { ArrowLeft, Shield, Clock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ReembolsoPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Política de Reembolso
            </h1>
          </div>

          <p className="text-slate-600 mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <div className="space-y-8 text-slate-700">
            {/* Seção 1 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                1. Direito de Arrependimento
              </h2>
              <p className="mb-4">
                De acordo com o Código de Defesa do Consumidor (Lei nº 8.078/1990), você tem o direito de desistir da compra no prazo de <strong>7 (sete) dias corridos</strong> a partir do recebimento do produto digital, sem necessidade de justificativa.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Importante:</strong> Para produtos digitais já entregues e utilizados, o direito de arrependimento pode não se aplicar conforme Art. 49 do CDC.
                </p>
              </div>
            </section>

            {/* Seção 2 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-amber-600" />
                2. Prazo para Solicitação
              </h2>
              <p className="mb-4">
                Solicitações de reembolso devem ser feitas através dos nossos canais de atendimento:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>E-mail: contato@booyahstrikeforce.store</li>
                <li>Telefone: (75) 3465-3331</li>
                <li>Horário de atendimento: Segunda a Sexta, das 9h às 18h</li>
              </ul>
            </section>

            {/* Seção 3 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Condições para Reembolso
              </h2>
              <p className="mb-4">
                O reembolso será processado nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Produto digital não entregue no prazo estipulado</li>
                <li>Erro no processamento do pedido</li>
                <li>Cobrança duplicada ou incorreta</li>
                <li>Produto diferente do anunciado</li>
              </ul>
            </section>

            {/* Seção 4 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Situações Não Reembolsáveis
              </h2>
              <p className="mb-4">
                Não será possível realizar reembolso nos seguintes casos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Produto digital já entregue e utilizado</li>
                <li>Informações incorretas fornecidas pelo cliente (ID/UID errado)</li>
                <li>Arrependimento após utilização do produto</li>
                <li>Banimento ou suspensão de conta por violação de termos de terceiros</li>
              </ul>
            </section>

            {/* Seção 5 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                5. Prazo de Processamento
              </h2>
              <p className="mb-4">
                Após aprovação da solicitação de reembolso:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>O valor será estornado em até <strong>7 dias úteis</strong></li>
                <li>Para pagamentos via PIX: estorno em até 2 dias úteis</li>
                <li>Para cartão de crédito: o prazo pode variar conforme a operadora</li>
              </ul>
            </section>

            {/* Seção 6 */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                6. Como Solicitar Reembolso
              </h2>
              <div className="bg-slate-50 rounded-lg p-6 space-y-3">
                <p className="font-semibold text-slate-900">Siga estes passos:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Entre em contato através dos canais oficiais</li>
                  <li>Informe o número do pedido e motivo da solicitação</li>
                  <li>Aguarde análise da nossa equipe (até 48h úteis)</li>
                  <li>Receba confirmação e prazo de estorno</li>
                </ol>
              </div>
            </section>

            {/* Aviso Legal */}
            <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 mb-2">⚠️ Aviso Importante</h3>
              <p className="text-sm text-amber-900">
                Esta política de reembolso está em conformidade com o Código de Defesa do Consumidor brasileiro. 
                Em caso de dúvidas, entre em contato com nossa equipe de suporte.
              </p>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            © 2025 - Todos os direitos reservados
          </p>
        </footer>
      </div>
    </div>
  )
}
