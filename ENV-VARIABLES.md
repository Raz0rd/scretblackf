# Variáveis de Ambiente

## 🔧 User Verification (Redirecionamento para Subdomínio)

### `NEXT_PUBLIC_ENABLE_USER_VERIFICATION`
**Tipo:** `boolean` (string)  
**Valores:** `true` | `false`  
**Padrão:** `false`  
**Descrição:** Habilita o redirecionamento automático para subdomínio após validação do usuário.

**Exemplo:**
```env
NEXT_PUBLIC_ENABLE_USER_VERIFICATION=true
```

**Comportamento:**
- `false`: Usuário permanece no domínio principal (ex: `recargacomdescontos.shop`)
- `true`: Após validação, usuário é redirecionado para subdomínio (ex: `recarga.recargacomdescontos.shop`)

---

### `NEXT_PUBLIC_USER_SUBDOMAIN`
**Tipo:** `string`  
**Padrão:** `recarga`  
**Descrição:** Define o subdomínio para onde o usuário será redirecionado após validação.

**Exemplo:**
```env
NEXT_PUBLIC_USER_SUBDOMAIN=recarga
```

**Resultado:**
- Domínio principal: `recargacomdescontos.shop`
- Após validação: `recarga.recargacomdescontos.shop`

---

## 🎯 Fluxo Completo com User Verification

### 1️⃣ Usuário acessa domínio principal
```
https://recargacomdescontos.shop?gclid=...&utm_source=google
```

### 2️⃣ Middleware valida referer + UTMs
- ✅ Referer do Google detectado
- ✅ UTMs completos (gclid, gad_source, etc.)
- ✅ Cookies salvos com `domain: .recargacomdescontos.shop`

### 3️⃣ Se `NEXT_PUBLIC_ENABLE_USER_VERIFICATION=true`
```
Redireciona para: https://recarga.recargacomdescontos.shop?gclid=...
```
- ✅ Todos os cookies são preservados (mesmo domain base)
- ✅ UTMs são mantidos na URL
- ✅ Origem da whitepage é preservada

### 4️⃣ Usuário usa o site normalmente no subdomínio
```
https://recarga.recargacomdescontos.shop/checkout
```
- ✅ Acessa cookies normalmente
- ✅ Gera PIX
- ✅ Faz pagamento

### 5️⃣ Pagamento confirmado → Redireciona para /success
```
De: https://recarga.recargacomdescontos.shop/success?...
Para: https://recargacomdescontos.shop/success?transactionId=...&gclid=...
```
- ✅ Middleware detecta que está em subdomínio
- ✅ Redireciona automaticamente para domínio base
- ✅ Conversão Google Ads é registrada no domínio principal

---

## 🍪 Cookies Compartilhados entre Domínios

Todos os cookies são configurados com `domain: .recargacomdescontos.shop` para funcionar em:
- ✅ `recargacomdescontos.shop`
- ✅ `recarga.recargacomdescontos.shop`
- ✅ `www.recargacomdescontos.shop`
- ✅ Qualquer subdomínio de `recargacomdescontos.shop`

### Cookies configurados:
1. **`_ref_origin`** - Origem da whitepage (codificado em base64)
2. **`referer_verified`** - Validação de referer
3. **`source_referer`** - Referer original do Google
4. **`cloaker_verified`** - Validação do cloaker

---

## ⚠️ Importante

### HTTPS Obrigatório
Os cookies com `domain` só funcionam em **HTTPS**. Em desenvolvimento local (HTTP), os cookies podem não funcionar corretamente.

### Mesmo Domínio Base
O compartilhamento de cookies só funciona com o **mesmo domínio base**:
- ✅ `recargacomdescontos.shop` → `recarga.recargacomdescontos.shop`
- ❌ `recargacomdescontos.shop` → `outrodominio.com`

### Conversão Google Ads
A conversão **SEMPRE** deve ser registrada no **domínio base** (sem subdomínio) para garantir que o Google Ads reconheça corretamente.

---

## 📝 Exemplo Completo de .env

```env
# User Verification
NEXT_PUBLIC_ENABLE_USER_VERIFICATION=true
NEXT_PUBLIC_USER_SUBDOMAIN=recarga

# Ezzpag (Gateway de Pagamento)
EZZPAG_API_KEY=sua_api_key_aqui
EZZPAG_API_URL=https://api.ezzypag.com.br/v1

# UTMify (Rastreamento)
UTMIFY_API_TOKEN=sua_api_token_aqui
UTMIFY_API_URL=https://api.utmify.com.br/api-credentials/orders
UTMIFY_ENABLED=true

# Whitepage (Conversão)
NEXT_PUBLIC_WHITEPAGE_URL=https://recargajogom.click
NEXT_PUBLIC_UTMIFY_WHITEPAGE_URL=https://recargajogom.click
```

---

## 🚀 Deploy

Após configurar as variáveis:

1. **Build:**
   ```bash
   npm run build
   ```

2. **Restart:**
   ```bash
   pm2 restart recargacomdescontos
   ```

3. **Verificar logs:**
   ```bash
   pm2 logs recargacomdescontos --lines 50
   ```

Você verá nos logs:
```
🔄 [USER VERIFICATION] Redirecionando para subdomínio
📍 De: recargacomdescontos.shop
📍 Para: recarga.recargacomdescontos.shop
✅ Cookies preservados via domain: .recargacomdescontos.shop
```
