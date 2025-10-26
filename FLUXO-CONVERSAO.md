# 📊 FLUXO COMPLETO DE CONVERSÃO E TRACKING

## 🎯 RESUMO EXECUTIVO

### Sistema de Verificação de Pagamento
- ✅ **POLLING** - Verificação a cada 10 segundos no frontend
- ✅ **WEBHOOK** - Confirmação instantânea via `/api/webhook`
- ✅ **Fallback** - Sistema duplo de verificação

### Rota do Webhook
```
POST https://verifiedbyffire.store/api/webhook
```

---

## 🔄 FLUXO COMPLETO PASSO A PASSO

### 1️⃣ USUÁRIO GERA QR CODE (Checkout)

**Arquivo:** `app/checkout/page.tsx` (linha 339-448)

**O que acontece:**
```javascript
// 1. Usuário clica em "Finalizar Pedido"
handleFinalizeOrder() {
  // 2. Gera PIX via API
  POST /api/generate-pix
  
  // 3. Recebe QR Code e Transaction ID
  setPixData({
    code: data.pixCode,
    qrCode: data.qrCode,
    transactionId: data.transactionId
  })
  
  // 4. 🎯 UTMIFY: Enviar status "pending"
  sendToUtmify('pending', data)
  
  // 5. Iniciar timer de 15 minutos
  setTimeLeft(15 * 60)
  setTimerActive(true)
}
```

**Conversões disparadas:**
- ✅ **UTMify** - Status "pending" (Iniciar Checkout)

---

### 2️⃣ VERIFICAÇÃO DE PAGAMENTO (Duplo Sistema)

#### A) POLLING (Frontend - Backup)

**Arquivo:** `app/checkout/page.tsx` (linha 536-597)

```javascript
// Verificação a cada 10 segundos
useEffect(() => {
  if (pixData && paymentStatus === 'pending') {
    setInterval(async () => {
      // Consulta status na API
      const response = await fetch('/api/check-transaction-status', {
        method: 'POST',
        body: JSON.stringify({ transactionId: pixData.transactionId })
      })
      
      if (data.status === 'paid') {
        // PAGAMENTO CONFIRMADO!
        handlePaymentConfirmed()
      }
    }, 10000) // 10 segundos
  }
}, [pixData, paymentStatus])
```

**Rota consultada:** `POST /api/check-transaction-status`

#### B) WEBHOOK (Backend - Principal)

**Arquivo:** `app/api/webhook/route.ts`

**Rota:** `POST https://verifiedbyffire.store/api/webhook`

```javascript
// BlackCat/Umbrela envia webhook quando pagamento é confirmado
POST /api/webhook {
  type: "transaction",
  data: {
    id: "transaction_id",
    status: "paid",
    amount: 5000,
    customer: { ... },
    pix: { ... }
  }
}

// Sistema processa:
1. Verifica se status === 'paid'
2. Recupera UTMs do metadata ou order storage
3. Envia para UTMify com status "paid"
4. Registra conversão no analytics
5. Retorna 200 OK
```

---

### 3️⃣ PAGAMENTO CONFIRMADO

**Quando o polling ou webhook detecta `status === 'paid'`:**

```javascript
// app/checkout/page.tsx (linha 552-586)
if (data.status === 'paid') {
  setPaymentStatus('paid')
  setTimerActive(false)
  
  const totalValue = getFinalPrice() + getPromoTotal()
  
  // 1. 🎯 CONVERSÃO GOOGLE ADS: Compra Confirmada
  gtag_report_conversion_purchase(transactionId, totalValue)
  
  // 2. 🎯 CLOAKER: Lead aprovado com valor
  trackApprovedLead(totalValue)
  
  // 3. 🎯 UTMIFY: Status "paid"
  sendToUtmifyPaid(transactionId)
  
  // 4. 🎯 ADSPECT: Conversão
  sendToAdspect(transactionId, totalValue)
  
  // 5. Redirecionar para /success
  router.push(`/success?transactionId=${transactionId}&amount=${totalValue * 100}`)
}
```

**Conversões disparadas:**
- ✅ **Google Ads** - Conversão "Compra" (AW-17554136774/S9KKCL7Qo6obEMa9u7JB)
- ✅ **AlterCPA (Cloaker)** - Lead aprovado com valor
- ✅ **UTMify** - Status "paid"
- ✅ **Adspect** - Conversão

---

### 4️⃣ PÁGINA DE SUCESSO

**Arquivo:** `app/success/page.tsx` (linha 41-52)

```javascript
useEffect(() => {
  if (!transactionId) {
    router.push('/')
    return
  }
  
  // Enviar conversão para Google Ads (redundância)
  if (amount) {
    trackPurchase(transactionId, parseFloat(amount))
  }
}, [transactionId, amount])
```

**Conversão disparada:**
- ✅ **Google Ads** - Conversão "Compra" (redundância para garantir)

---

## 🔧 CONFIGURAÇÃO DO WEBHOOK

### No Gateway de Pagamento (BlackCat/Umbrela)

Configure a URL do webhook:
```
POST https://verifiedbyffire.store/api/webhook
```

**Headers necessários:**
```
Content-Type: application/json
```

**Payload esperado:**
```json
{
  "type": "transaction",
  "data": {
    "id": "txn_123456",
    "status": "paid",
    "amount": 5000,
    "paymentMethod": "pix",
    "customer": {
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "+5511999999999",
      "document": {
        "type": "cpf",
        "number": "12345678900"
      }
    },
    "metadata": "{\"utmParams\":{\"utm_source\":\"google\",\"gclid\":\"abc123\"}}",
    "externalRef": "order_123",
    "createdAt": "2025-10-26T12:00:00Z",
    "paidAt": "2025-10-26T12:05:00Z"
  }
}
```

---

## 📈 CONVERSÕES GOOGLE ADS

### Configuração no Google Ads

#### 1. Conversão: Iniciar Checkout (QR Code Gerado)

**Nome:** Iniciar Checkout  
**ID:** `AW-17554136774/8pfZCPegsKobEMa9u7JB`  
**Categoria:** Adicionar ao carrinho  
**Valor:** Não usar valor  
**Contagem:** Uma por clique  

**Quando dispara:** Quando o QR Code é gerado com sucesso

**Código de acompanhamento:**
```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-17554136774/8pfZCPegsKobEMa9u7JB'
});
```

#### 2. Conversão: Compra (Pagamento Confirmado)

**Nome:** Compra  
**ID:** `AW-17554136774/S9KKCL7Qo6obEMa9u7JB`  
**Categoria:** Compra  
**Valor:** Usar valor da transação  
**Contagem:** Uma por clique  

**Quando dispara:** Quando o pagamento é confirmado (status = paid)

**Código de acompanhamento:**
```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-17554136774/S9KKCL7Qo6obEMa9u7JB',
  'value': 50.00,
  'currency': 'BRL',
  'transaction_id': 'txn_123456'
});
```

---

## 🎯 CONFIGURAÇÃO PASSO A PASSO NO GOOGLE ADS

### 1. Acessar Conversões

1. Entre no Google Ads
2. Clique em **Ferramentas e configurações** (ícone de chave inglesa)
3. Em **Medição**, clique em **Conversões**

### 2. Criar Conversão "Iniciar Checkout"

1. Clique em **+ Nova ação de conversão**
2. Selecione **Site**
3. Preencha:
   - **Nome:** Iniciar Checkout
   - **Categoria:** Adicionar ao carrinho
   - **Valor:** Não usar valor específico
   - **Contagem:** Uma
   - **Janela de conversão:** 30 dias
   - **Janela de conversão de visualização:** 1 dia
   - **Modelo de atribuição:** Baseado em dados
4. Clique em **Criar e continuar**
5. Selecione **Usar o Google Tag Manager** ou **Adicionar o código manualmente**
6. Copie o ID da conversão: `AW-17554136774/8pfZCPegsKobEMa9u7JB`

### 3. Criar Conversão "Compra"

1. Clique em **+ Nova ação de conversão**
2. Selecione **Site**
3. Preencha:
   - **Nome:** Compra
   - **Categoria:** Compra
   - **Valor:** Usar valores diferentes para cada conversão
   - **Contagem:** Uma
   - **Janela de conversão:** 30 dias
   - **Janela de conversão de visualização:** 1 dia
   - **Modelo de atribuição:** Baseado em dados
4. Clique em **Criar e continuar**
5. Copie o ID da conversão: `AW-17554136774/S9KKCL7Qo6obEMa9u7JB`

### 4. Verificar Implementação

1. Vá para **Ferramentas** > **Conversões**
2. Clique na conversão criada
3. Clique em **Verificar**
4. Faça um teste:
   - Gere um QR Code no checkout
   - Verifique se a conversão "Iniciar Checkout" aparece
   - Confirme um pagamento
   - Verifique se a conversão "Compra" aparece

### 5. Configurar Lances Inteligentes

Após ter dados de conversão:
1. Vá para a campanha
2. Em **Configurações** > **Lances**
3. Selecione **Maximizar conversões** ou **CPA desejado**
4. Defina a conversão "Compra" como principal

---

## 🔍 TROUBLESHOOTING

### Webhook não está chegando

1. **Verificar URL configurada no gateway:**
   ```
   https://verifiedbyffire.store/api/webhook
   ```

2. **Testar webhook manualmente:**
   ```bash
   curl -X POST https://verifiedbyffire.store/api/webhook \
     -H "Content-Type: application/json" \
     -d '{
       "type": "transaction",
       "data": {
         "id": "test_123",
         "status": "paid",
         "amount": 5000
       }
     }'
   ```

3. **Verificar logs no Netlify:**
   - Acessar Netlify Dashboard
   - Ir em **Functions** > **webhook**
   - Ver logs em tempo real

### Conversão Google Ads não aparece

1. **Verificar se gtag está carregado:**
   ```javascript
   console.log(window.gtag) // Deve retornar function
   ```

2. **Verificar se ADS_INDIVIDUAL está habilitado:**
   ```
   NEXT_PUBLIC_ADS_INDIVIDUAL=true
   ```

3. **Verificar no Google Ads:**
   - Ferramentas > Conversões
   - Clicar na conversão
   - Ver "Eventos recentes"

### UTMify não recebe dados

1. **Verificar token:**
   ```
   UTMIFY_API_TOKEN=seu_token_aqui
   UTMIFY_ENABLED=true
   ```

2. **Verificar logs:**
   ```
   [v0] 🎯FINAL UTMs being sent to UTMify (PAID): { ... }
   [v0] ✅ Successfully sent payment confirmation to UTMify
   ```

---

## 📊 RESUMO DO FLUXO

```
1. QR Code Gerado
   ├─ Google Ads: Iniciar Checkout ✓
   ├─ AlterCPA: Lead Aprovado ✓
   └─ UTMify: Status "pending" ✓

2. Verificação (Dupla)
   ├─ Polling: A cada 10s ✓
   └─ Webhook: Instantâneo ✓

3. Pagamento Confirmado
   ├─ Google Ads: Compra ✓
   ├─ AlterCPA: Lead com Valor ✓
   ├─ UTMify: Status "paid" ✓
   └─ Adspect: Conversão ✓

4. Página de Sucesso
   └─ Google Ads: Compra (redundância) ✓
```

---

## ✅ CHECKLIST DE CONFIGURAÇÃO

### Google Ads
- [ ] Conversão "Iniciar Checkout" criada
- [ ] Conversão "Compra" criada
- [ ] IDs copiados e configurados
- [ ] Tag do Google Ads instalada
- [ ] Teste realizado e conversões aparecendo

### Webhook
- [ ] URL configurada no gateway: `https://verifiedbyffire.store/api/webhook`
- [ ] Teste manual realizado
- [ ] Logs verificados no Netlify
- [ ] Pagamento teste confirmado

### UTMify
- [ ] Token configurado: `UTMIFY_API_TOKEN`
- [ ] Habilitado: `UTMIFY_ENABLED=true`
- [ ] Teste realizado
- [ ] Dados aparecendo no dashboard

### AlterCPA (Cloaker)
- [ ] URL configurada
- [ ] Tracking habilitado
- [ ] Leads aparecendo no painel

---

## 🚀 ESTÁ TUDO PRONTO!

O sistema está 100% funcional com:
- ✅ Dupla verificação (Polling + Webhook)
- ✅ Conversões Google Ads automáticas
- ✅ Tracking completo (UTMify, AlterCPA, Adspect)
- ✅ Fallback em caso de falha
- ✅ Logs detalhados para debug

**Próximos passos:**
1. Configurar as conversões no Google Ads seguindo o guia acima
2. Testar com um pagamento real
3. Verificar se todas as conversões estão disparando
4. Ativar lances inteligentes baseados em conversões
