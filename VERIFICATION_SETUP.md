# 🔒 Configuração da Verificação de Usuário (Pre-Land)

## 📋 O que é?

O sistema de verificação força todos os usuários a passar por um fluxo de validação antes de acessar a página de recarga:

1. **Verificação de Segurança** - Tela inicial
2. **Termos de Uso** - Aceitar termos e política
3. **Verificação de Usuário** - Inserir ID do jogador
4. **Página de Recarga** - Acesso liberado

---

## ⚙️ Como Ativar

### 1. No arquivo `.env` local (Windows)

Abra o arquivo `d:\LIMPO\.env` e adicione:

```env
NEXT_PUBLIC_ENABLE_USER_VERIFICATION=true
```

### 2. No servidor (aaPanel/Linux)

```bash
# Editar .env
nano /www/wwwroot/project/scretblackf-main/.env

# Adicionar esta linha:
NEXT_PUBLIC_ENABLE_USER_VERIFICATION=true

# Salvar: Ctrl+O, Enter, Ctrl+X
```

### 3. Rebuild e Restart

**No servidor:**

```bash
cd /www/wwwroot/project/scretblackf-main

# Limpar cache
rm -rf .next/cache

# Rebuild
npm run build

# Reiniciar via aaPanel ou PM2
pm2 restart all
```

**Localmente (para testar):**

```bash
npm run dev
```

---

## ✅ Verificar se está funcionando

1. Limpe o localStorage do navegador:
   - Abra DevTools (F12)
   - Console → Digite: `localStorage.clear()`
   - Recarregue a página

2. Acesse o site normalmente (sem parâmetros)
   - Deve aparecer a tela de "Verificação de Segurança"

3. Acesse com parâmetros `?app=100153`
   - Também deve aparecer a verificação

---

## 🚨 Importante

- A variável **DEVE** começar com `NEXT_PUBLIC_` para funcionar no client-side
- Após adicionar, é **OBRIGATÓRIO** fazer rebuild (`npm run build`)
- Sem rebuild, a variável não será aplicada

---

## 🔧 Desativar Verificação

Para desativar temporariamente:

```env
NEXT_PUBLIC_ENABLE_USER_VERIFICATION=false
```

Ou simplesmente remova/comente a linha.
