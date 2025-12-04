# Estrutura Final - Loja com Rotas Separadas

## 🎯 Conceito

- **Páginas de categoria** (`/loja/freefire`, `/loja/robux`, etc.) = **WHITE PAGES** (sempre mostram conteúdo)
- **Página raiz** (`/loja` ou `/`) = **Aplica lógica do cloaker**

## 📁 Estrutura de Arquivos

```
app/
├── loja/
│   ├── page.tsx (ou page-new.tsx) → Seletor/Redirect + Cloaker
│   ├── page-selector.tsx → Componente de seleção de jogos
│   ├── freefire/
│   │   └── page.tsx ✅ WHITE PAGE
│   ├── robux/
│   │   └── page.tsx ✅ WHITE PAGE
│   ├── vbucks/
│   │   └── page.tsx ✅ WHITE PAGE
│   ├── recarga-celular/
│   │   └── page.tsx ✅ WHITE PAGE
│   └── brainroots/
│       └── page.tsx ✅ WHITE PAGE
```

## 🔄 Fluxo de Navegação

### Cenário 1: Usuário vem por Sitelink Direto
```
URL: /loja/freefire?utm_source=google
     ↓
Mostra página Free Fire (WHITE PAGE)
Sem cloaker, sem verificação
```

### Cenário 2: Usuário vem pela Raiz
```
URL: /?utm_source=facebook
     ↓
Aplica lógica do cloaker
     ↓
Se aprovado: Mostra seletor de jogos
Se bloqueado: Mostra página genérica
```

### Cenário 3: Usuário vem com parâmetro game
```
URL: /loja?game=robux
     ↓
Redirect automático para /loja/robux
Preserva UTMs
```

## 🛠️ Implementação

### 1. Página Principal (`/loja/page.tsx`)

```tsx
"use client"

import { useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useUtmParams } from '@/hooks/useUtmParams'
import LojaSelector from './page-selector'

export default function LojaPage() {
  const router = useRouter()
  const { getUtmObject } = useUtmParams()

  useEffect(() => {
    // Redirect se vier com parâmetro ?game=
    const urlParams = new URLSearchParams(window.location.search)
    const gameParam = urlParams.get('game')
    
    const gameRoutes: { [key: string]: string } = {
      'freefire': '/loja/freefire',
      'robux': '/loja/robux',
      'vbucks': '/loja/vbucks',
      'recargacelular': '/loja/recarga-celular',
      'brainroots': '/loja/brainroots'
    }
    
    if (gameParam && gameRoutes[gameParam.toLowerCase()]) {
      const utms = getUtmObject()
      const params = new URLSearchParams(utms)
      const targetPath = gameRoutes[gameParam.toLowerCase()]
      const fullPath = params.toString() ? `${targetPath}?${params.toString()}` : targetPath
      router.push(fullPath)
    }
  }, [router, getUtmObject])

  // Aqui você pode adicionar lógica do cloaker
  // Se aprovado: return <LojaSelector />
  // Se bloqueado: return <PaginaGenerica />
  
  return <LojaSelector />
}
```

### 2. Páginas de Categoria (WHITE PAGES)

Cada página (`/loja/freefire/page.tsx`, etc.) é uma **white page** completa:
- Não tem cloaker
- Sempre mostra o conteúdo
- Ideal para sitelinks e tráfego direto

## 🎨 Categorias Disponíveis

1. **Free Fire** (`/loja/freefire`)
   - Diamantes e itens
   - Grid de valores
   - Carousel de skins

2. **Robux** (`/loja/robux`)
   - Roblox
   - Layout vertical limpo
   - Seção Premium

3. **V-Bucks** (`/loja/vbucks`)
   - Fortnite
   - Fundo azul escuro
   - Cards verdes

4. **Recarga Celular** (`/loja/recarga-celular`)
   - Operadoras (Vivo, Claro, TIM, Oi, Algar, Correios)
   - Input de telefone
   - Valores com bônus GB

5. **Brainroots Raros** (`/loja/brainroots`)
   - Itens exclusivos
   - Sistema de raridade
   - Cards premium

## 🔗 URLs e Parâmetros

### URLs Diretas (Sitelinks)
```
/loja/freefire
/loja/robux
/loja/vbucks
/loja/recarga-celular
/loja/brainroots
```

### Com Parâmetros
```
/loja/freefire?item=5.600&utm_source=google
/loja/robux?item=2000&utm_campaign=promo
/loja/recarga-celular?operadora=vivo
```

### Compatibilidade com URLs Antigas
```
/loja?game=freefire → Redirect para /loja/freefire
/loja?game=robux → Redirect para /loja/robux
```

## 🚀 Próximos Passos

1. **Substituir** `page.tsx` por `page-new.tsx`
2. **Adicionar lógica do cloaker** na página principal
3. **Testar** todos os fluxos de navegação
4. **Configurar** sitelinks no Google Ads
5. **Atualizar** links em campanhas existentes

## ⚙️ Configuração de Sitelinks

No Google Ads, configure sitelinks para:
- `/loja/freefire` - "Free Fire"
- `/loja/robux` - "Robux"
- `/loja/vbucks` - "V-Bucks Fortnite"
- `/loja/recarga-celular` - "Recarga Celular"
- `/loja/brainroots` - "Itens Raros"

## 📊 Vantagens

✅ **SEO**: URLs semânticas e específicas
✅ **Performance**: Code splitting por categoria
✅ **Sitelinks**: Páginas diretas para Google Ads
✅ **Cloaker**: Apenas na raiz, não nas categorias
✅ **Manutenção**: Código isolado por jogo
✅ **Escalabilidade**: Fácil adicionar novos jogos

## ⚠️ Importante

- **NUNCA** adicione cloaker nas páginas de categoria
- **SEMPRE** preserve UTMs ao navegar
- **TESTE** cada categoria individualmente
- **MANTENHA** código antigo comentado para referência
