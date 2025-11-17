"use client"

import { ArrowLeft, Building2, Shield, Zap, Users, Award, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SobrePage() {
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
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Quem Somos
            </h1>
          </div>

          <div className="space-y-8 text-slate-700">
            {/* Introdução */}
            <section>
              <p className="text-lg leading-relaxed mb-4">
                Somos uma <strong>plataforma independente</strong> especializada na venda de créditos digitais e itens para jogos mobile. 
                Nossa missão é oferecer uma experiência rápida, segura e acessível para jogadores de todo o Brasil.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Importante:</strong> Não somos afiliados, patrocinados ou administrados por nenhuma desenvolvedora de jogos. 
                  Operamos de forma totalmente independente.
                </p>
              </div>
            </section>

            {/* Nossos Valores */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Nossos Valores
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Segurança</h3>
                    <p className="text-sm text-slate-600">
                      Transações protegidas e dados criptografados
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <Zap className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Agilidade</h3>
                    <p className="text-sm text-slate-600">
                      Entrega digital em minutos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Suporte</h3>
                    <p className="text-sm text-slate-600">
                      Atendimento humanizado e eficiente
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <Award className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Qualidade</h3>
                    <p className="text-sm text-slate-600">
                      Compromisso com a excelência
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* O Que Fazemos */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                O Que Fazemos
              </h2>
              <p className="mb-4">
                Oferecemos uma plataforma digital para compra de créditos e itens para jogos mobile, com:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Entrega automática e rápida</li>
                <li>Preços competitivos e transparentes</li>
                <li>Múltiplas opções de pagamento</li>
                <li>Suporte dedicado ao cliente</li>
                <li>Processo 100% digital e seguro</li>
              </ul>
            </section>

            {/* Compromisso */}
            <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Nosso Compromisso
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Estamos comprometidos em oferecer a melhor experiência possível para nossos clientes, 
                    sempre respeitando as políticas de privacidade e segurança. Nunca solicitamos senhas, 
                    logins ou dados sensíveis de contas.
                  </p>
                </div>
              </div>
            </section>

            {/* Informações da Empresa */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Informações da Empresa
              </h2>
              <div className="bg-slate-50 rounded-lg p-6 space-y-2">
                <p><strong>Razão Social:</strong> JULIA YOON SCAVASSA</p>
                <p><strong>CNPJ:</strong> 57.667.691/0001-00</p>
                <p><strong>Endereço:</strong> Av Paes de Barros, 2370 - Parque da Mooca</p>
                <p><strong>Cidade:</strong> São Paulo - SP</p>
                <p><strong>CEP:</strong> 03.149-000</p>
                <p><strong>E-mail:</strong> contato@diamantesprofissionaljogos.store</p>
              </div>
            </section>

            {/* Aviso Legal */}
            <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="font-bold text-amber-900 mb-2">⚠️ Aviso Legal</h3>
              <p className="text-sm text-amber-900">
                Este site é independente e não possui qualquer vínculo com desenvolvedoras de jogos, 
                publishers ou marcas oficiais. Todos os nomes de jogos, marcas e logos mencionados 
                são propriedade de seus respectivos donos.
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
