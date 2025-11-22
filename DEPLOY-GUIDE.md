# 🚀 Guia de Deploy - Novo Servidor

## 📋 Pré-requisitos

- Servidor Ubuntu 22.04 ou 24.04
- Acesso root (SSH)
- Domínio apontando para o IP do servidor
- Repositório Git configurado

---

## 🎯 Opção 1: Checklist Manual

### 1. Fazer upload do script de checklist

```bash
# No seu computador
scp server-setup-checklist.sh root@SEU_IP:/root/

# No servidor
cd /root
chmod +x server-setup-checklist.sh
./server-setup-checklist.sh
```

### 2. Seguir as instruções do output

O script vai mostrar o que está faltando e os comandos para instalar.

---

## 🤖 Opção 2: Instalação Automática

### 1. Fazer upload do script de instalação

```bash
# No seu computador
scp server-auto-setup.sh root@SEU_IP:/root/

# No servidor
cd /root
chmod +x server-auto-setup.sh
sudo bash server-auto-setup.sh
```

### 2. Aguardar instalação (5-10 minutos)

---

## 📦 Deploy da Aplicação

### 1. Clonar repositório

```bash
cd /var/www
git clone https://github.com/Raz0rd/scretblackf.git
cd scretblackf
```

### 2. Criar arquivo .env

```bash
nano .env
```

Cole o conteúdo:

```env
NODE_ENV=production
BLACKCAT_API_AUTH=SEU_TOKEN_BLACKCAT_AQUI
GHOSTPAY_API_KEY=SEU_TOKEN_GHOSTPAY_AQUI
UTMIFY_API_TOKEN=SEU_TOKEN_UTMIFY_AQUI
UTMIFY_ENABLED=true
UTMIFY_TEST_MODE=false
NEXT_PUBLIC_GOOGLE_ADS_ENABLED=true
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
NEXT_PUBLIC_ADS_INDIVIDUAL=true
NEXT_PUBLIC_GTAG_CONVERSION_COMPRA=SEU_ID_CONVERSAO_AQUI
UTMIFY_WHITEPAGE_URL=https://seudominio.com/
NEXT_PUBLIC_UTMIFY_WHITEPAGE_URL=https://seudominio.com/
PAYMENT_GATEWAY=umbrela
UMBRELA_API_KEY=SEU_TOKEN_UMBRELA_AQUI
NEXT_PUBLIC_PIXELID_UTMFY=
NEXT_PUBLIC_ENABLE_USER_VERIFICATION=false
NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED=true
```

**IMPORTANTE:** 
- Copie as chaves do arquivo `.env` do servidor atual
- Altere `seudominio.com` para seu domínio real!

### 3. Instalar dependências

```bash
npm install
```

### 4. Build do projeto

```bash
npm run build
```

### 5. Iniciar com PM2

```bash
pm2 start npm --name 'seu-app' -- start
pm2 save
pm2 list
```

---

## 🌐 Configurar Nginx

### 1. Criar arquivo de configuração

```bash
nano /etc/nginx/sites-available/seudominio.com
```

Cole o conteúdo:

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seudominio.com www.seudominio.com;

    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/seudominio.com.access.log;
    error_log /var/log/nginx/seudominio.com.error.log;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. Ativar site

```bash
ln -s /etc/nginx/sites-available/seudominio.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## 🔐 Configurar SSL

```bash
certbot --nginx -d seudominio.com -d www.seudominio.com
```

Siga as instruções do Certbot.

---

## 🛡️ Configurar Cloaker (AlterCPA)

### 1. Acessar painel AlterCPA

https://www.altercpa.one/

### 2. Criar novo filtro

- **URL do site:** https://seudominio.com/
- **White page:** / (página principal)
- **Offer page:** /promo

### 3. Configurar filtros

Selecionar:
- ✅ AlterCPA One IPv4
- ✅ AlterCPA One Net
- ✅ Smart IPv4
- ✅ Smart Net

### 4. Configurar whitelist

Adicionar (uma palavra por linha):
```
gclid
gbraid
wbraid
utm_source=google
utm_medium
criativo=promo1
```

### 5. Copiar URL do filtro

Exemplo: `https://www.altercpa.one/fltr/969-xxx-15047`

### 6. Atualizar middleware.ts

No código, linha 6:
```typescript
url: 'https://www.altercpa.one/fltr/SEU-ID-AQUI',
```

---

## 📊 Configurar Analytics

### 1. Adicionar seu IP na whitelist

Editar `app/api/s7k2m9p4/route.ts`, linha 7:

```typescript
const ALLOWED_IPS = ['SEU_IP_AQUI', '127.0.0.1', 'localhost']
```

### 2. Acessar painel

```
https://seudominio.com/analytics
```

---

## ✅ Checklist Final

- [ ] Node.js instalado
- [ ] Nginx instalado e rodando
- [ ] PM2 instalado
- [ ] Repositório clonado
- [ ] .env configurado
- [ ] npm install executado
- [ ] npm run build executado
- [ ] PM2 iniciado
- [ ] Nginx configurado
- [ ] SSL configurado
- [ ] Cloaker configurado
- [ ] IP adicionado na whitelist
- [ ] Testar site: https://seudominio.com/
- [ ] Testar analytics: https://seudominio.com/analytics
- [ ] Testar com ?gclid=test
- [ ] Configurar Google Ads

---

## 🔧 Comandos Úteis

### Ver logs

```bash
# PM2
pm2 logs

# Nginx
tail -f /var/log/nginx/seudominio.com.access.log
tail -f /var/log/nginx/seudominio.com.error.log
```

### Reiniciar serviços

```bash
# PM2
pm2 restart all

# Nginx
systemctl reload nginx
```

### Atualizar código

```bash
cd /var/www/scretblackf
git pull
npm install
npm run build
pm2 restart all
```

### Ver status

```bash
pm2 status
systemctl status nginx
```

---

## 🆘 Troubleshooting

### Site não carrega

1. Verificar PM2: `pm2 list`
2. Verificar Nginx: `systemctl status nginx`
3. Verificar logs: `pm2 logs`

### SSL não funciona

1. Verificar certificado: `certbot certificates`
2. Renovar: `certbot renew`
3. Verificar Nginx: `nginx -t`

### Cloaker não funciona

1. Verificar URL do filtro no middleware.ts
2. Verificar logs: `pm2 logs | grep Cloaker`
3. Testar com: `/?gclid=test`

---

## 📞 Suporte

Se algo não funcionar:

1. Executar checklist: `./server-setup-checklist.sh`
2. Ver logs: `pm2 logs`
3. Verificar Nginx: `nginx -t`

---

**Tempo estimado de deploy: 30-45 minutos** ⏱️
