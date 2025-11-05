#!/bin/bash

# Script para instalar sites Next.js no Ubuntu Server
# Uso: curl -fsSL https://raw.githubusercontent.com/Raz0rd/scretblackf/baseffshop/install-site.sh | sudo bash
# Ou baixar e executar: sudo bash install-site.sh

set -e

echo "=========================================="
echo "   🚀 INSTALADOR DE SITES NEXT.JS"
echo "=========================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
   echo "❌ Por favor, execute como root (sudo bash install-site.sh)"
   exit 1
fi

# 🚀 Script de Instalação Automática de Site Next.js
# Uso: sudo ./install-site.sh dominio.com porta nome-projeto repo-url branch
# Exemplo: sudo ./install-site.sh free-firesite.shop 3044 ffireshop https://github.com/Raz0rd/presellfgo.git ffireshop

set -e  # Parar em caso de erro

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se foram passados parâmetros ou modo interativo
if [ "$#" -eq 5 ]; then
    # Modo com parâmetros
    DOMAIN=$1
    PORT=$2
    PROJECT_NAME=$3
    REPO_URL=$4
    BRANCH=$5
else
    # Modo interativo (perguntar)
    echo "📝 Modo Interativo - Responda as perguntas abaixo:"
    echo ""
    
    read -p "🔗 URL do repositório Git: " REPO_URL
    read -p "🌿 Branch (padrão: main): " BRANCH
    BRANCH=${BRANCH:-main}
    
    read -p "🌐 Domínio (ex: exemplo.com): " DOMAIN
    read -p "🔌 Porta para o app (ex: 3000): " PORT
    
    # Nome do projeto baseado no domínio (remove www. e pontos)
    PROJECT_NAME=$(echo "$DOMAIN" | sed 's/^www\.//' | sed 's/\./-/g')
    
    read -p "📁 Nome do projeto (padrão: $PROJECT_NAME): " INPUT_PROJECT_NAME
    PROJECT_NAME=${INPUT_PROJECT_NAME:-$PROJECT_NAME}
    
    read -p "📧 Email para SSL (Let's Encrypt): " SSL_EMAIL
fi

PROJECT_DIR="/var/www/$PROJECT_NAME"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 INSTALAÇÃO AUTOMÁTICA DE SITE${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}📋 Configurações:${NC}"
echo -e "   Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "   Porta: ${YELLOW}$PORT${NC}"
echo -e "   Projeto: ${YELLOW}$PROJECT_NAME${NC}"
echo -e "   Repositório: ${YELLOW}$REPO_URL${NC}"
echo -e "   Branch: ${YELLOW}$BRANCH${NC}"
echo -e "   Diretório: ${YELLOW}$PROJECT_DIR${NC}"
echo ""
read -p "Continuar? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Instalação cancelada${NC}"
    exit 1
fi

# 1. Verificar se Node.js está instalado
echo ""
echo -e "${YELLOW}📦 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Node.js não encontrado. Instalando...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    echo -e "${GREEN}✅ Node.js instalado${NC}"
else
    echo -e "${GREEN}✅ Node.js já instalado: $(node -v)${NC}"
fi

# 2. Verificar se PM2 está instalado
echo ""
echo -e "${YELLOW}📦 Verificando PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 não encontrado. Instalando...${NC}"
    sudo npm install -g pm2
    echo -e "${GREEN}✅ PM2 instalado${NC}"
else
    echo -e "${GREEN}✅ PM2 já instalado: $(pm2 -v)${NC}"
fi

# 3. Verificar se Nginx está instalado
echo ""
echo -e "${YELLOW}📦 Verificando Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Nginx não encontrado. Instalando...${NC}"
    sudo apt install -y nginx
    echo -e "${GREEN}✅ Nginx instalado${NC}"
else
    echo -e "${GREEN}✅ Nginx já instalado${NC}"
fi

# 4. Verificar se Certbot está instalado
echo ""
echo -e "${YELLOW}📦 Verificando Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Certbot não encontrado. Instalando...${NC}"
    sudo apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✅ Certbot instalado${NC}"
else
    echo -e "${GREEN}✅ Certbot já instalado${NC}"
fi

# 5. Clonar repositório
echo ""
echo -e "${YELLOW}📥 Clonando repositório...${NC}"
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${RED}⚠️  Diretório $PROJECT_DIR já existe!${NC}"
    read -p "Deseja remover e reinstalar? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo rm -rf $PROJECT_DIR
    else
        echo -e "${RED}❌ Instalação cancelada${NC}"
        exit 1
    fi
fi

cd /var/www
sudo git clone $REPO_URL $PROJECT_NAME
cd $PROJECT_DIR
sudo git checkout $BRANCH
echo -e "${GREEN}✅ Repositório clonado${NC}"

# 6. Instalar dependências
echo ""
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
sudo npm install
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# 7. Criar .env.production
echo ""
echo -e "${YELLOW}📝 Criando .env.production...${NC}"
sudo tee .env.production > /dev/null <<EOF
# App
NEXT_PUBLIC_APP_URL=https://$DOMAIN
NODE_ENV=production
PORT=$PORT

# Google Ads
NEXT_PUBLIC_GOOGLE_ADS_ENABLED=false
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17703595002
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=PvJCCLXTirobEPrX3flB

# Gateway de Pagamento - EZZPAG
PAYMENT_GATEWAY=ezzpag
EZZPAG_API_AUTH=sua_auth_key_aqui

# UTMify
UTMIFY_API_TOKEN=seu_token_aqui
UTMIFY_ENABLED=false
UTMIFY_TEST_MODE=false
UTMIFY_WHITEPAGE_URL=https://recarga-jogoff.shop
NEXT_PUBLIC_UTMIFY_WHITEPAGE_URL=https://recarga-jogoff.shop

# Verificação de Usuário
NEXT_PUBLIC_ENABLE_USER_VERIFICATION=true

# Base URL
NEXT_PUBLIC_BASE_URL=https://$DOMAIN

# Whitepage
NEXT_PUBLIC_WHITEPAGE_URL=https://recarga-jogoff.shop

# Cloaker
NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED=false
EOF
echo -e "${GREEN}✅ .env.production criado${NC}"
echo -e "${YELLOW}⚠️  IMPORTANTE: Edite $PROJECT_DIR/.env.production com suas chaves reais!${NC}"

# 8. Build do projeto
echo ""
echo -e "${YELLOW}🔨 Fazendo build...${NC}"
sudo npm run build
echo -e "${GREEN}✅ Build concluído${NC}"

# 9. Criar diretório de logs
echo ""
echo -e "${YELLOW}📁 Criando diretório de logs...${NC}"
sudo mkdir -p logs
echo -e "${GREEN}✅ Diretório de logs criado${NC}"

# 10. Criar ecosystem.config.js
echo ""
echo -e "${YELLOW}📝 Criando ecosystem.config.js...${NC}"
sudo tee ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$PROJECT_DIR',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT
    },
    error_file: '$PROJECT_DIR/logs/err.log',
    out_file: '$PROJECT_DIR/logs/out.log',
    log_file: '$PROJECT_DIR/logs/combined.log',
    time: true
  }]
}
EOF
echo -e "${GREEN}✅ ecosystem.config.js criado${NC}"

# 11. Iniciar com PM2
echo ""
echo -e "${YELLOW}🚀 Iniciando aplicação com PM2...${NC}"
sudo pm2 start ecosystem.config.js --env production
sudo pm2 save
echo -e "${GREEN}✅ Aplicação iniciada${NC}"

# 12. Configurar PM2 startup
echo ""
echo -e "${YELLOW}⚙️  Configurando PM2 startup...${NC}"
sudo pm2 startup systemd -u $USER --hp $HOME
echo -e "${GREEN}✅ PM2 startup configurado${NC}"

# 13. Criar configuração Nginx
echo ""
echo -e "${YELLOW}📝 Criando configuração Nginx...${NC}"
sudo tee /etc/nginx/sites-available/$PROJECT_NAME > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    access_log /var/log/nginx/$PROJECT_NAME-access.log;
    error_log /var/log/nginx/$PROJECT_NAME-error.log;

    location / {
        proxy_pass http://localhost:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://localhost:$PORT;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
        proxy_pass http://localhost:$PORT;
        proxy_cache_valid 200 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    client_max_body_size 10M;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF
echo -e "${GREEN}✅ Configuração Nginx criada${NC}"

# 14. Ativar site no Nginx
echo ""
echo -e "${YELLOW}🔗 Ativando site no Nginx...${NC}"
sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
echo -e "${GREEN}✅ Site ativado no Nginx${NC}"

# 15. Configurar SSL com Certbot
echo ""
echo -e "${YELLOW}🔐 Configurando SSL com Certbot...${NC}"
echo -e "${BLUE}Obtendo certificado SSL para $DOMAIN e www.$DOMAIN...${NC}"
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --register-unsafely-without-email --agree-tos --redirect --non-interactive
echo -e "${GREEN}✅ SSL configurado${NC}"

# 16. Configurar Firewall (se UFW estiver instalado)
if command -v ufw &> /dev/null; then
    echo ""
    echo -e "${YELLOW}🔥 Configurando Firewall...${NC}"
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    echo -e "${GREEN}✅ Firewall configurado${NC}"
fi

# 17. Verificar status
echo ""
echo -e "${YELLOW}📊 Verificando status...${NC}"
sudo pm2 status

# Resumo final
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🌐 Site:${NC} ${GREEN}https://$DOMAIN${NC}"
echo -e "${BLUE}🌐 WWW:${NC} ${GREEN}https://www.$DOMAIN${NC}"
echo -e "${BLUE}📁 Diretório:${NC} $PROJECT_DIR"
echo -e "${BLUE}🔌 Porta:${NC} $PORT"
echo -e "${BLUE}📦 PM2 App:${NC} $PROJECT_NAME"
echo ""
echo -e "${YELLOW}⚠️  PRÓXIMOS PASSOS:${NC}"
echo -e "1. Edite as variáveis de ambiente:"
echo -e "   ${BLUE}sudo nano $PROJECT_DIR/.env.production${NC}"
echo ""
echo -e "2. Após editar, reinicie a aplicação:"
echo -e "   ${BLUE}sudo pm2 restart $PROJECT_NAME${NC}"
echo ""
echo -e "3. Configure Cloudflare (se usar):"
echo -e "   - DNS: A @ → IP do servidor (Proxy ON)"
echo -e "   - DNS: A www → IP do servidor (Proxy ON)"
echo -e "   - SSL/TLS: Full (strict)"
echo ""
echo -e "${BLUE}📋 Comandos úteis:${NC}"
echo -e "   Ver logs: ${YELLOW}sudo pm2 logs $PROJECT_NAME${NC}"
echo -e "   Reiniciar: ${YELLOW}sudo pm2 restart $PROJECT_NAME${NC}"
echo -e "   Status: ${YELLOW}sudo pm2 status${NC}"
echo ""
