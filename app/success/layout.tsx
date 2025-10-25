import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pagamento Confirmado',
  description: 'Página de sucesso do pagamento',
}

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
