# 🚀 Deploy no Ubuntu - free-firesite.shop

## 📋 Informações do Deploy
- **Domain:** free-firesite.shop
- **Porta:** 3044
- **Branch:** ffireshop
- **PM2:** Gerenciador de processos
- **Servidor:** Ubuntu 24

---

## 1️⃣ Preparar Servidor Ubuntu

### Atualizar sistema
```bash
sudo apt update && sudo apt upgrade -y
```

### Instalar Node.js (v20 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v  # Verificar versão
npm -v   # Verificar npm
```

### Instalar PM2 globalmente
```bash
sudo npm install -g pm2
pm2 -v  # Verificar instalação
```

### Instalar Nginx
```bash
sudo apt install -y nginx
sudo systemctl status nginx  # Verificar status
```

### Instalar Certbot (SSL grátis)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## 2️⃣ Clonar Projeto no Servidor

### Criar diretório para projetos
```bash
sudo mkdir -p /var/www
cd /var/www
```

### Clonar repositório
```bash
# Substitua pela URL do seu repositório
sudo git clone https://github.com/SEU-USUARIO/SEU-REPO.git ffireshop
cd ffireshop
```

### Fazer checkout do branch correto
```bash
sudo git checkout ffireshop
```

---

## 3️⃣ Configurar Projeto

### Instalar dependências
```bash
sudo npm install
```

### Criar arquivo .env
```bash
sudo nano .env.production
```

**Conteúdo do .env.production:**
```env
# App
NEXT_PUBLIC_APP_URL=https://free-firesite.shop
NODE_ENV=production
PORT=3044

# Google Ads
NEXT_PUBLIC_GOOGLE_ADS_ENABLED=true
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17703595002
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=PvJCCLXTirobEPrX3flB

# Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=sua_public_key
MERCADOPAGO_ACCESS_TOKEN=seu_access_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_key

# Outras configurações
NEXT_PUBLIC_UTMIFY_PIXEL_ID=seu_pixel_id
NEXT_PUBLIC_ADS_INDIVIDUAL=false
```

Salvar: `Ctrl+O` → Enter → `Ctrl+X`

### Build do projeto
```bash
sudo npm run build
```

---

## 4️⃣ Configurar PM2

### Criar arquivo de configuração PM2
```bash
sudo nano ecosystem.config.js
```

**Conteúdo do ecosystem.config.js:**
```javascript
module.exports = {
  apps: [{
    name: 'ffireshop',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/ffireshop',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3044
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3044
    },
    error_file: '/var/www/ffireshop/logs/err.log',
    out_file: '/var/www/ffireshop/logs/out.log',
    log_file: '/var/www/ffireshop/logs/combined.log',
    time: true
  }]
}
```

Salvar: `Ctrl+O` → Enter → `Ctrl+X`

### Criar diretório de logs
```bash
sudo mkdir -p /var/www/ffireshop/logs
```

### Iniciar aplicação com PM2
```bash
cd /var/www/ffireshop
sudo pm2 start ecosystem.config.js --env production
```

### Verificar status
```bash
sudo pm2 status
sudo pm2 logs ffireshop --lines 50
```

### Salvar configuração PM2 (auto-start no boot)
```bash
sudo pm2 save
sudo pm2 startup
# Copiar e executar o comando que aparecer
```

---

## 5️⃣ Configurar Nginx (Reverse Proxy)

### Criar configuração do site
```bash
sudo nano /etc/nginx/sites-available/ffireshop
```

**Conteúdo do arquivo:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name free-firesite.shop www.free-firesite.shop;

    # Logs
    access_log /var/log/nginx/ffireshop-access.log;
    error_log /var/log/nginx/ffireshop-error.log;

    # Proxy para Next.js
    location / {
        proxy_pass http://localhost:3044;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache para assets estáticos
    location /_next/static {
        proxy_pass http://localhost:3044;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    # Aumentar limite de upload
    client_max_body_size 10M;
}
```

Salvar: `Ctrl+O` → Enter → `Ctrl+X`

### Ativar site
```bash
sudo ln -s /etc/nginx/sites-available/ffireshop /etc/nginx/sites-enabled/
```

### Testar configuração
```bash
sudo nginx -t
```

### Reiniciar Nginx
```bash
sudo systemctl restart nginx
```

---

## 6️⃣ Configurar SSL (HTTPS) com Certbot

### Obter certificado SSL grátis
```bash
sudo certbot --nginx -d free-firesite.shop -d www.free-firesite.shop
```

**Durante o processo:**
- Digite seu email
- Aceite os termos (Y)
- Escolha se quer compartilhar email (N ou Y)
- Escolha opção 2: Redirecionar HTTP para HTTPS

### Verificar renovação automática
```bash
sudo certbot renew --dry-run
```

---

## 7️⃣ Configurar DNS (no provedor do domínio)

### Adicionar registros DNS:

**Tipo A:**
```
Host: @
Valor: IP_DO_SEU_SERVIDOR
TTL: 3600
```

**Tipo A (www):**
```
Host: www
Valor: IP_DO_SEU_SERVIDOR
TTL: 3600
```

**Tipo CNAME (opcional):**
```
Host: www
Valor: free-firesite.shop
TTL: 3600
```

---

## 8️⃣ Comandos Úteis PM2

### Ver logs em tempo real
```bash
sudo pm2 logs ffireshop
```

### Reiniciar aplicação
```bash
sudo pm2 restart ffireshop
```

### Parar aplicação
```bash
sudo pm2 stop ffireshop
```

### Deletar aplicação do PM2
```bash
sudo pm2 delete ffireshop
```

### Ver uso de recursos
```bash
sudo pm2 monit
```

### Listar todas as aplicações
```bash
sudo pm2 list
```

---

## 9️⃣ Atualizar Projeto (Deploy de novas versões)

### Script de atualização rápida
```bash
cd /var/www/ffireshop
sudo git pull origin ffireshop
sudo npm install
sudo npm run build
sudo pm2 restart ffireshop
sudo pm2 logs ffireshop --lines 50
```

### Criar script de deploy automático
```bash
sudo nano /var/www/ffireshop/deploy.sh
```

**Conteúdo:**
```bash
#!/bin/bash
echo "🚀 Iniciando deploy..."

cd /var/www/ffireshop

echo "📥 Baixando atualizações..."
sudo git pull origin ffireshop

echo "📦 Instalando dependências..."
sudo npm install

echo "🔨 Fazendo build..."
sudo npm run build

echo "♻️ Reiniciando aplicação..."
sudo pm2 restart ffireshop

echo "📊 Verificando logs..."
sudo pm2 logs ffireshop --lines 20

echo "✅ Deploy concluído!"
```

### Dar permissão de execução
```bash
sudo chmod +x /var/www/ffireshop/deploy.sh
```

### Executar deploy
```bash
sudo /var/www/ffireshop/deploy.sh
```

---

## 🔟 Firewall (Opcional mas Recomendado)

### Configurar UFW
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
sudo ufw status
```

---

## 🔍 Verificar se está funcionando

### Testar localmente no servidor
```bash
curl http://localhost:3044
```

### Testar via domínio
```bash
curl http://free-firesite.shop
curl https://free-firesite.shop
```

### Ver logs do Nginx
```bash
sudo tail -f /var/log/nginx/ffireshop-access.log
sudo tail -f /var/log/nginx/ffireshop-error.log
```

---

## ⚠️ Troubleshooting

### Aplicação não inicia
```bash
# Ver logs detalhados
sudo pm2 logs ffireshop --err

# Verificar se a porta está em uso
sudo lsof -i :3044

# Matar processo na porta
sudo kill -9 $(sudo lsof -t -i:3044)
```

### Nginx não funciona
```bash
# Verificar configuração
sudo nginx -t

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log

# Reiniciar Nginx
sudo systemctl restart nginx
```

### SSL não funciona
```bash
# Renovar certificado
sudo certbot renew

# Verificar certificados
sudo certbot certificates
```

---

## 📊 Monitoramento

### Instalar PM2 Web Dashboard (opcional)
```bash
sudo pm2 install pm2-server-monit
```

### Ver métricas
```bash
sudo pm2 monit
```

---

## ✅ Checklist Final

- [ ] Node.js instalado (v20+)
- [ ] PM2 instalado e configurado
- [ ] Projeto clonado no branch `ffireshop`
- [ ] Dependências instaladas
- [ ] `.env.production` configurado
- [ ] Build executado com sucesso
- [ ] PM2 rodando na porta 3044
- [ ] Nginx configurado como reverse proxy
- [ ] SSL configurado com Certbot
- [ ] DNS apontando para o servidor
- [ ] Firewall configurado
- [ ] Site acessível via HTTPS

---

## 🎉 Pronto!

Seu site estará disponível em:
- **HTTP:** http://free-firesite.shop (redireciona para HTTPS)
- **HTTPS:** https://free-firesite.shop ✅
- **WWW:** https://www.free-firesite.shop ✅

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs do PM2: `sudo pm2 logs ffireshop`
2. Logs do Nginx: `sudo tail -f /var/log/nginx/ffireshop-error.log`
3. Status do serviço: `sudo pm2 status`
4. Porta aberta: `sudo lsof -i :3044`
