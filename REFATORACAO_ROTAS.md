# Refatoração - Rotas Separadas por Jogo

## ✅ Estrutura Criada

```
app/loja/
├── page.tsx (atual - mantido temporariamente)
├── page-selector.tsx (novo - seletor de jogos)
├── freefire/
│   └── page.tsx ✅
├── robux/
│   └── page.tsx ✅
├── recarga-celular/
│   └── page.tsx ✅
├── deltaforce/
│   └── page.tsx (pendente)
└── haikyu/
    └── page.tsx (pendente)
```

## 🎯 Vantagens da Nova Estrutura

### 1. **Organização**
- Cada jogo tem seu próprio arquivo
- Código mais limpo e fácil de manter
- Menos condicionais aninhadas

### 2. **Performance**
- Apenas o código necessário é carregado
- Bundle menor por página
- Melhor code splitting

### 3. **SEO**
- URLs mais descritivas: `/loja/freefire`, `/loja/robux`
- Melhor indexação por jogo
- Meta tags específicas por jogo

### 4. **Manutenibilidade**
- Mudanças em um jogo não afetam outros
- Mais fácil adicionar novos jogos
- Testes isolados por jogo

## 📋 Próximos Passos

### 1. Completar Páginas Faltantes
- [ ] Criar `/loja/deltaforce/page.tsx`
- [ ] Criar `/loja/haikyu/page.tsx`

### 2. Criar Componentes Compartilhados
```
components/loja/
├── GameHeader.tsx (cabeçalho comum)
├── ValueCard.tsx (card de valor reutilizável)
├── OfferCard.tsx (card de oferta)
└── PaymentButton.tsx (botão de pagamento)
```

### 3. Atualizar Página Principal
Opção A: Redirecionar automaticamente para Free Fire
```tsx
// app/loja/page.tsx
export default function LojaPage() {
  redirect('/loja/freefire')
}
```

Opção B: Mostrar seletor de jogos
```tsx
// app/loja/page.tsx
import LojaSelector from './page-selector'
export default LojaSelector
```

### 4. Atualizar Navegação
- Atualizar menu de categorias para usar as novas rotas
- Adicionar breadcrumbs
- Implementar navegação entre jogos

### 5. Migrar Funcionalidades
- [ ] Sistema de login/autenticação
- [ ] Carrinho de compras
- [ ] Integração com pagamento
- [ ] Analytics e tracking
- [ ] Modais compartilhados

## 🔗 URLs Atuais vs Novas

### Antes
```
/loja?game=freefire
/loja?game=robux
/loja?game=recargacelular
```

### Depois
```
/loja/freefire
/loja/robux
/loja/recarga-celular
```

### Com Parâmetros
```
/loja/freefire?item=5.600&utm_source=facebook
/loja/robux?item=2000&utm_campaign=promo
/loja/recarga-celular?operadora=vivo&valor=30
```

## 🎨 Componentes Compartilhados Sugeridos

### GameLayout.tsx
```tsx
export default function GameLayout({
  children,
  gameName,
  gameIcon
}: {
  children: React.ReactNode
  gameName: string
  gameIcon: string
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header>{/* Header comum */}</header>
      <main>{children}</main>
      <footer>{/* Footer comum */}</footer>
    </div>
  )
}
```

### ValueSelector.tsx
```tsx
export default function ValueSelector({
  values,
  selected,
  onSelect,
  type = 'grid' // 'grid' | 'list'
}: ValueSelectorProps) {
  // Componente reutilizável para seleção de valores
}
```

## 🚀 Implementação Gradual

1. **Fase 1** (Atual): Criar estrutura de rotas ✅
2. **Fase 2**: Migrar funcionalidades para componentes compartilhados
3. **Fase 3**: Atualizar navegação e links
4. **Fase 4**: Remover página antiga (`page.tsx`)
5. **Fase 5**: Otimizações e testes

## 📝 Notas Importantes

- Manter UTMs em todas as navegações
- Preservar funcionalidade de tracking
- Garantir que modais funcionem em todas as páginas
- Testar fluxo completo de compra em cada jogo
- Atualizar documentação de parâmetros

## 🔄 Compatibilidade

Para manter compatibilidade com links antigos, podemos adicionar redirects:

```tsx
// middleware.ts ou app/loja/page.tsx
if (searchParams.get('game') === 'robux') {
  redirect('/loja/robux')
}
```
