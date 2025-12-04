export const metadata = {
  title: `Quem Somos - ${process.env.NEXT_PUBLIC_COMPANY_TRADE_NAME}`,
  description: `Conheça a ${process.env.NEXT_PUBLIC_COMPANY_TRADE_NAME}`
}

export default function QuemSomos() {
  const companyName = process.env.NEXT_PUBLIC_COMPANY_TRADE_NAME
  const companyEmail = process.env.NEXT_PUBLIC_COMPANY_EMAIL
  const companyCNPJ = process.env.NEXT_PUBLIC_COMPANY_CNPJ
  const companyLegalName = process.env.NEXT_PUBLIC_COMPANY_LEGAL_NAME
  const companyPhone = process.env.NEXT_PUBLIC_COMPANY_PHONE

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Quem Somos</h1>
          
          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Nossa Missão</h2>
              <p className="mb-2">Somos uma <strong>plataforma independente</strong> especializada em diamantes e créditos digitais para Free Fire.</p>
              <p>Oferecemos preços acessíveis, entrega rápida e total segurança.</p>
            </section>

            <section>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="font-semibold text-blue-800 mb-1">🛡️ Segurança</p>
                <p className="text-sm text-blue-700">Nunca solicitamos senha ou dados confidenciais. Transações 100% seguras.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Independência</h2>
              <p><strong>Importante:</strong> Não somos afiliados à Garena ou Free Fire. Atuamos como plataforma independente.</p>
            </section>

            <section className="bg-slate-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Dados da Empresa</h2>
              <p className="text-sm mb-1"><strong>{companyLegalName}</strong></p>
              <p className="text-sm mb-1">CNPJ: {companyCNPJ}</p>
              <p className="text-sm mb-1">Email: {companyEmail}</p>
              <p className="text-sm">Telefone: {companyPhone}</p>
            </section>

            <section className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Entre em Contato</h3>
              <p className="text-sm mb-1">📧 <a href={`mailto:${companyEmail}`} className="text-blue-600 hover:underline">{companyEmail}</a></p>
              <p className="text-sm">📞 <a href={`tel:${companyPhone}`} className="text-blue-600 hover:underline">{companyPhone}</a></p>
            </section>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-blue-600 hover:underline text-sm">← Voltar para o início</a>
          </div>
        </div>
      </div>
    </div>
  )
}
