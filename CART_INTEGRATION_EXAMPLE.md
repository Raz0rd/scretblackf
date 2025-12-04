# 🛒 Integração do Carrinho - Guia de Uso

## 📦 Componentes Criados

### 1. **CartDrawer** (`components/loja/CartDrawer.tsx`)
Gaveta lateral que mostra os itens do carrinho.

### 2. **CartButton** (`components/loja/CartButton.tsx`)
Botão flutuante no canto inferior direito com badge de contagem.

### 3. **useCart Hook** (`hooks/useCart.ts`)
Hook customizado para gerenciar estado do carrinho.

---

## 🎨 Cores por Categoria

- **Free Fire**: Laranja (`bg-orange-500`)
- **Robux**: Escuro (`bg-gray-800`)
- **V-Bucks**: Azul (`bg-blue-500`)

---

## 💻 Como Integrar em uma Página

### Exemplo: Página de Free Fire

```tsx
"use client"

import { useCart } from '@/hooks/useCart'
import CartButton from '@/components/loja/CartButton'
import CartDrawer from '@/components/loja/CartDrawer'
import LojaLayout from '@/components/loja/LojaLayout'

export default function FreeFirePage() {
  const cart = useCart()
  
  // Função para adicionar item ao carrinho
  const handleAddToCart = (item: any) => {
    cart.addItem({
      id: item.id,
      name: item.name,
      image: item.image,
      price: item.price,
      originalPrice: item.originalPrice,
      category: 'freefire',
      details: {
        'Tipo': 'Item Especial',
        'Descrição': item.description
      }
    })
  }

  // Função de checkout
  const handleCheckout = () => {
    console.log('Finalizando compra com itens:', cart.items)
    // Redirecionar para página de checkout
    // window.location.href = '/checkout'
  }

  return (
    <LojaLayout>
      {/* Conteúdo da página */}
      
      {/* Exemplo: Botão em um card */}
      <button
        onClick={() => handleAddToCart(item)}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Adicionar ao Carrinho
      </button>

      {/* Indicador lateral com onda (LARANJA) */}
      <CartButton
        itemCount={cart.itemCount}
        onClick={cart.toggleDrawer}
        category="freefire"
      />

      {/* Drawer do carrinho */}
      <CartDrawer
        isOpen={cart.isOpen}
        onClose={cart.closeDrawer}
        items={cart.items}
        onRemoveItem={cart.removeItem}
        onCheckout={handleCheckout}
      />
    </LojaLayout>
  )
}
```

---

## 🎯 Exemplo: Robux (Escuro)

```tsx
const handleAddToCart = (robux: any) => {
  cart.addItem({
    id: robux.value,
    name: `${robux.value} Robux`,
    image: '/robux-icon.png',
    price: robux.realPrice,
    originalPrice: robux.originalPrice,
    category: 'robux',
    details: {
      'Quantidade': robux.value,
      'Desconto': `${robux.discount}%`
    }
  })
}

{/* Indicador lateral ESCURO */}
<CartButton
  itemCount={cart.itemCount}
  onClick={cart.toggleDrawer}
  category="robux"
/>
```

---

## 🎯 Exemplo: V-Bucks (Azul)

```tsx
const handleAddToCart = (vbucks: any) => {
  cart.addItem({
    id: vbucks.id,
    name: `${vbucks.amount} V-Bucks`,
    image: '/vbucks-icon.png',
    price: vbucks.price,
    originalPrice: vbucks.originalPrice,
    category: 'vbucks',
    details: {
      'Quantidade': vbucks.amount,
      'Plataforma': 'Todas'
    }
  })
}

{/* Indicador lateral AZUL */}
<CartButton
  itemCount={cart.itemCount}
  onClick={cart.toggleDrawer}
  category="vbucks"
/>
```

---

## 📱 Funcionalidades

### ✅ Implementado
- ✅ **Indicador lateral fixo** na direita da tela
- ✅ **Efeito de onda animado** ao adicionar item (3 ondas concêntricas)
- ✅ **Badge circular** com número de itens
- ✅ **Cores por categoria**:
  - 🟠 Free Fire: Laranja
  - ⚫ Robux: Escuro (cinza 800)
  - 🔵 V-Bucks: Azul
- ✅ Drawer lateral (desliza da direita)
- ✅ Resumo de cada item com imagem
- ✅ Cálculo de total e economia
- ✅ Remover itens individualmente
- ✅ Persistência no localStorage
- ✅ Animações suaves (800ms)
- ✅ Responsivo (mobile-first)
- ✅ Overlay escuro ao abrir drawer

### 🎨 Visual
- Badge animado (pulse) quando tem itens
- Borda colorida por categoria
- Ícones do lucide-react
- Transições suaves (300ms)
- Hover effects

### 📱 Mobile
- Drawer ocupa tela inteira no mobile
- 384px de largura no desktop (sm:w-96)
- Touch-friendly
- Scroll interno para muitos itens

---

## 🔧 Métodos do Hook useCart

```tsx
const cart = useCart()

// Adicionar item
cart.addItem(item)

// Remover item
cart.removeItem(itemId)

// Limpar carrinho
cart.clearCart()

// Abrir/fechar drawer
cart.openDrawer()
cart.closeDrawer()
cart.toggleDrawer()

// Estado
cart.items        // Array de itens
cart.itemCount    // Número de itens
cart.isOpen       // Drawer está aberto?
```

---

## 🚀 Próximos Passos

1. Integrar em todas as páginas (Free Fire, Robux, Brainrot)
2. Criar página de checkout (`/checkout`)
3. Adicionar validação de estoque
4. Implementar cupons de desconto
5. Integrar com gateway de pagamento
