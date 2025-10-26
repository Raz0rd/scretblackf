#!/bin/bash
# ========================================
# SCRIPT DE CONFIGURAÇÃO SERVIDOR NOVO
# ========================================
# Configura um servidor Linux do zero para rodar a aplicação
#
# Uso: sudo bash server-setup-new.sh [dominio]
# Exemplo: sudo bash server-setup-new.sh novosite.com
# ========================================

DOMAIN="${1}"

if [ -z "$DOMAIN" ]; then
    echo "❌ Erro: Informe o domínio"
    echo "Uso: sudo bash server-setup-new.sh novosite.com"
    exit 1
fi

echo "=========================================="
echo "🚀 CONFIGURAÇÃO DE SERVIDOR NOVO"
echo "=========================================="
echo ""
echo "🌐 Domínio: $DOMAIN"
echo "📍 IP do servidor: $(curl -s ifconfig.me)"
echo ""
read -p "Confirma a configuração? (s/N): " confirm

if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    echo "❌ Configuração cancelada"
    exit 0
fi

# ========================================
# 1. ATUALIZAR SISTEMA
# ========================================
echo ""
echo "1️⃣ Atualizando sistema..."
apt update && apt upgrade -y
echo "   ✅ Sistema atualizado"

# ========================================
# 2. INSTALAR PACOTES ESSENCIAIS
# ========================================
echo ""
echo "2️⃣ Instalando pacotes essenciais..."
apt install -y \
    nginx \
    certbot \
    python3-certbot-nginx \
    git \
    curl \
    wget \
    ufw \
    htop \
    vim \
    build-essential \
    software-properties-common

echo "   ✅ Pacotes instalados"

# ========================================
# 3. CONFIGURAR FIREWALL
# ========================================
echo ""
echo "3️⃣ Configurando firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw reload
ufw status

echo "   ✅ Firewall configurado"

# ========================================
# 4. INSTALAR NODE.JS VIA NVM
# ========================================
echo ""
echo "4️⃣ Instalando Node.js..."

# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Carregar NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instalar Node.js LTS
nvm install 20
nvm use 20
nvm alias default 20

# Verificar instalação
node -v
npm -v

echo "   ✅ Node.js instalado"

# ========================================
# 5. INSTALAR PM2
# ========================================
echo ""
echo "5️⃣ Instalando PM2..."
npm install -g pm2
pm2 startup
pm2 save

echo "   ✅ PM2 instalado"

# ========================================
# 6. CONFIGURAR NGINX
# ========================================
echo ""
echo "6️⃣ Configurando NGINX..."

# Backup da configuração padrão
mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Criar nova configuração
cat > /etc/nginx/sites-available/default << NGINX_CONFIG
server {
    listen 80;
    listen [::]:80;
    
    server_name $DOMAIN www.$DOMAIN;
    
    # Logs
    access_log /var/log/nginx/${DOMAIN}_access.log;
    error_log /var/log/nginx/${DOMAIN}_error.log;
    
    # Proxy para Next.js (porta 3000)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
    
    # Aumentar tamanho máximo de upload
    client_max_body_size 10M;
}
NGINX_CONFIG

# Testar configuração
nginx -t

# Reiniciar NGINX
systemctl restart nginx
systemctl enable nginx

echo "   ✅ NGINX configurado"

# ========================================
# 7. CONFIGURAR SSL
# ========================================
echo ""
echo "7️⃣ Configurando SSL..."

# Aguardar DNS propagar
echo "   ⏳ Aguarde o DNS propagar antes de continuar..."
echo "   📍 Configure os registros DNS:"
echo "      A    $DOMAIN    → $(curl -s ifconfig.me)"
echo "      A    www.$DOMAIN → $(curl -s ifconfig.me)"
echo ""
read -p "DNS já está configurado? (s/N): " dns_ready

if [ "$dns_ready" = "s" ] || [ "$dns_ready" = "S" ]; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    # Renovação automática
    systemctl enable certbot.timer
    systemctl start certbot.timer
    
    echo "   ✅ SSL configurado"
else
    echo "   ⚠️  Configure o DNS e execute manualmente:"
    echo "   sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
fi

# ========================================
# 8. CLONAR REPOSITÓRIO
# ========================================
echo ""
echo "8️⃣ Clonando repositório..."

cd /var/www
git clone https://github.com/Raz0rd/scretblackf.git $DOMAIN
cd $DOMAIN

echo "   ✅ Repositório clonado"

# ========================================
# 9. INSTALAR DEPENDÊNCIAS
# ========================================
echo ""
echo "9️⃣ Instalando dependências..."

npm install

echo "   ✅ Dependências instaladas"

# ========================================
# 10. CONFIGURAR .ENV
# ========================================
echo ""
echo "🔟 Configurando variáveis de ambiente..."

cat > .env << ENV_FILE
# ========================================
# VARIÁVEIS DE AMBIENTE
# ========================================
# IMPORTANTE: Preencha com suas credenciais reais!

# Node Environment
NODE_ENV=production

# Domain
NEXT_PUBLIC_SITE_URL=https://$DOMAIN

# Payment Gateway (blackcat, umbrela, ghostpay)
PAYMENT_GATEWAY=blackcat

# BlackCat API
BLACKCAT_API_AUTH=Basic SEU_TOKEN_AQUI
BLACKCAT_WEBHOOK_URL=https://$DOMAIN/api/webhook

# Umbrela API (se usar)
UMBRELA_API_KEY=sua_chave_aqui

# GhostPay API (se usar)
GHOSTPAY_API_KEY=sua_chave_aqui

# UTMify
UTMIFY_ENABLED=true
UTMIFY_API_TOKEN=seu_token_aqui
NEXT_PUBLIC_PIXELID_UTMFY=seu_pixel_id

# Google Ads
NEXT_PUBLIC_GOOGLE_ADS_ENABLED=true
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17554136774
NEXT_PUBLIC_ADS_INDIVIDUAL=true

# Cloaker / AlterCPA
NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED=true

# Ratoeira ADS
NEXT_PUBLIC_RATOEIRA_ENABLED=false

# ========================================
ENV_FILE

echo "   ⚠️  IMPORTANTE: Edite o arquivo .env com suas credenciais:"
echo "   nano /var/www/$DOMAIN/.env"
echo ""
read -p "Pressione ENTER após configurar o .env..."

# ========================================
# 11. BUILD DA APLICAÇÃO
# ========================================
echo ""
echo "1️⃣1️⃣ Fazendo build da aplicação..."

npm run build

echo "   ✅ Build concluído"

# ========================================
# 12. INICIAR COM PM2
# ========================================
echo ""
echo "1️⃣2️⃣ Iniciando aplicação com PM2..."

pm2 start npm --name "$DOMAIN" -- start
pm2 save

echo "   ✅ Aplicação iniciada"

# ========================================
# 13. CONFIGURAR AUTO-DEPLOY (OPCIONAL)
# ========================================
echo ""
echo "1️⃣3️⃣ Configurar auto-deploy via webhook?"
read -p "Deseja configurar? (s/N): " auto_deploy

if [ "$auto_deploy" = "s" ] || [ "$auto_deploy" = "S" ]; then
    # Criar script de deploy
    cat > /var/www/$DOMAIN/deploy.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
cd /var/www/$DOMAIN
git pull origin main
npm install
npm run build
pm2 restart $DOMAIN
DEPLOY_SCRIPT
    
    chmod +x /var/www/$DOMAIN/deploy.sh
    
    echo "   ✅ Script de deploy criado: /var/www/$DOMAIN/deploy.sh"
    echo "   📝 Configure webhook no GitHub apontando para:"
    echo "      https://$DOMAIN/api/deploy"
fi

# ========================================
# 14. CONFIGURAR CRON PARA LIMPEZA
# ========================================
echo ""
echo "1️⃣4️⃣ Configurando cron jobs..."

# Limpeza de logs antigos (manter últimos 7 dias)
(crontab -l 2>/dev/null; echo "0 2 * * * find /var/log/nginx -name '*.log' -mtime +7 -delete") | crontab -

# Renovação SSL automática (já configurado pelo certbot)

echo "   ✅ Cron jobs configurados"

# ========================================
# FINALIZAÇÃO
# ========================================
echo ""
echo "=========================================="
echo "✅ SERVIDOR CONFIGURADO COM SUCESSO!"
echo "=========================================="
echo ""
echo "📋 INFORMAÇÕES DO SERVIDOR:"
echo ""
echo "🌐 Domínio: https://$DOMAIN"
echo "📍 IP: $(curl -s ifconfig.me)"
echo "📁 Diretório: /var/www/$DOMAIN"
echo ""
echo "📊 COMANDOS ÚTEIS:"
echo ""
echo "Ver logs da aplicação:"
echo "  pm2 logs $DOMAIN"
echo ""
echo "Ver logs do NGINX:"
echo "  sudo tail -f /var/log/nginx/${DOMAIN}_error.log"
echo ""
echo "Reiniciar aplicação:"
echo "  pm2 restart $DOMAIN"
echo ""
echo "Reiniciar NGINX:"
echo "  sudo systemctl restart nginx"
echo ""
echo "Atualizar aplicação:"
echo "  cd /var/www/$DOMAIN"
echo "  git pull"
echo "  npm install"
echo "  npm run build"
echo "  pm2 restart $DOMAIN"
echo ""
echo "Ver status dos serviços:"
echo "  pm2 status"
echo "  sudo systemctl status nginx"
echo ""
echo "🔐 PRÓXIMOS PASSOS:"
echo ""
echo "1. ✅ Verifique se o site está acessível: https://$DOMAIN"
echo "2. ✅ Configure as variáveis de ambiente no .env"
echo "3. ✅ Teste o fluxo de pagamento completo"
echo "4. ✅ Configure monitoramento (opcional)"
echo "5. ✅ Configure backup automático (opcional)"
echo ""
echo "🎉 Servidor pronto para uso!"
echo ""
