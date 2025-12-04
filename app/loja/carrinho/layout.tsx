export default function CarrinhoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // O carrinho usa o layout pai da loja automaticamente
  return <>{children}</>
}
