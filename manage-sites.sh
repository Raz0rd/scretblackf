#!/bin/bash

# 🚀 Script de Gerenciamento de Sites Next.js
# Autor: Sistema de Deploy Automático
# Versão: 1.0

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Arquivo de configuração
CONFIG_FILE="/var/www/sites-config.json"
BASE_DIR="/var/www"

# Repositório e Branch padrão (fixo)
DEFAULT_REPO="https://github.com/Raz0rd/presellfgo.git"
DEFAULT_BRANCH="ffireshop"

# Inicializar arquivo de configuração se não existir
if [ ! -f "$CONFIG_FILE" ]; then
    echo '{"next_port": 3050, "sites": []}' | sudo tee $CONFIG_FILE > /dev/null
fi

# Funções auxiliares
get_next_port() {
    cat $CONFIG_FILE | grep -o '"next_port": [0-9]*' | grep -o '[0-9]*'
}

update_next_port() {
    local new_port=$1
    sudo sed -i "s/\"next_port\": [0-9]*/\"next_port\": $new_port/" $CONFIG_FILE
}

add_site_to_config() {
    local site_name=$1
    local domain=$2
    local port=$3
    local repo=$4
    
    # Adicionar site ao JSON (simplificado)
    local temp_file=$(mktemp)
    cat $CONFIG_FILE | sed "s/\"sites\": \[/\"sites\": [{\"name\": \"$site_name\", \"domain\": \"$domain\", \"port\": $port, \"repo\": \"$repo\"},/" > $temp_file
    sudo mv $temp_file $CONFIG_FILE
}

list_sites() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}📋 SITES CADASTRADOS${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if [ -d "$BASE_DIR" ]; then
        for dir in $BASE_DIR/*/; do
            if [ -f "$dir/ecosystem.config.js" ]; then
                site_name=$(basename "$dir")
                port=$(grep -o "PORT: [0-9]*" "$dir/ecosystem.config.js" | grep -o "[0-9]*" | head -1)
                echo -e "${GREEN}📦 $site_name${NC} - Porta: ${YELLOW}$port${NC}"
            fi
        done
    fi
    
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Opção 1: Pull do Git
git_pull() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📥 ATUALIZAR SITE DO GIT${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    list_sites
    
    read -p "Digite o nome do site: " site_name
    
    site_dir="$BASE_DIR/$site_name"
    
    if [ ! -d "$site_dir" ]; then
        echo -e "${RED}❌ Site não encontrado!${NC}"
        return 1
    fi
    
    echo ""
    echo -e "${YELLOW}📥 Verificando repositório...${NC}"
    cd $site_dir
    
    # Verificar se é um repositório git
    if [ ! -d ".git" ]; then
        echo -e "${RED}❌ Não é um repositório Git!${NC}"
        return 1
    fi
    
    # Mostrar informações do repositório
    repo_url=$(sudo git config --get remote.origin.url)
    current_branch=$(sudo git branch --show-current)
    
    echo -e "${CYAN}📋 Repositório:${NC} $repo_url"
    echo -e "${CYAN}📋 Branch atual:${NC} $current_branch"
    echo ""
    
    read -p "Fazer pull do origin/$current_branch? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Cancelado${NC}"
        return 1
    fi
    
    echo ""
    echo -e "${YELLOW}📥 Fazendo pull do Git...${NC}"
    sudo git pull origin $current_branch
    
    echo ""
    echo -e "${YELLOW}📦 Instalando dependências...${NC}"
    sudo npm install
    
    echo ""
    echo -e "${YELLOW}🔨 Fazendo build...${NC}"
    sudo npm run build
    
    echo ""
    echo -e "${YELLOW}♻️  Recarregando aplicação...${NC}"
    sudo pm2 reload $site_name
    
    echo ""
    echo -e "${GREEN}✅ Site atualizado com sucesso!${NC}"
    echo ""
    echo -e "${CYAN}📊 Status:${NC}"
    sudo pm2 status $site_name
    
    echo ""
    echo -e "${CYAN}📋 Últimos logs:${NC}"
    sudo pm2 logs $site_name --lines 15 --nostream
}

# Opção 2: Configurar Nginx e SSL
configure_nginx_ssl() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🌐 CONFIGURAR NGINX E SSL${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    list_sites
    
    # Repositório e branch fixos do projeto atual
    REPO_URL="https://github.com/Raz0rd/presellfgo.git"
    BRANCH="ffireshop"
    
    read -p "Digite o nome do site: " site_name
    read -p "Digite o domínio (ex: site.com): " domain
    
    repo_url=$REPO_URL
    branch=$BRANCH
    
    site_dir="$BASE_DIR/$site_name"
    
    # Verificar se já existe
    if [ -d "$site_dir" ]; then
        echo -e "${YELLOW}⚠️  Site já existe! Pulando clone...${NC}"
    else
        # Obter próxima porta disponível
        port=$(get_next_port)
        
        echo ""
        echo -e "${CYAN}📋 Configuração:${NC}"
        echo -e "   Nome: ${YELLOW}$site_name${NC}"
        echo -e "   Domínio: ${YELLOW}$domain${NC}"
        echo -e "   Porta: ${YELLOW}$port${NC}"
        echo -e "   Repositório: ${YELLOW}$repo_url${NC}"
        echo -e "   Branch: ${YELLOW}$branch${NC}"
        echo ""
        
        read -p "Continuar? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo -e "${RED}❌ Cancelado${NC}"
            return 1
        fi
        
        # Clonar repositório
        echo ""
        echo -e "${YELLOW}📥 Clonando repositório...${NC}"
        cd $BASE_DIR
        sudo git clone $repo_url $site_name
        cd $site_dir
        sudo git checkout $branch
        
        # Instalar e buildar
        echo ""
        echo -e "${YELLOW}📦 Instalando dependências...${NC}"
        sudo npm install
        
        # Criar .env.production
        echo ""
        echo -e "${YELLOW}📝 Criando .env.production...${NC}"
        sudo tee .env.production > /dev/null <<EOF
NEXT_PUBLIC_APP_URL=https://$domain
NODE_ENV=production
PORT=$port
NEXT_PUBLIC_GOOGLE_ADS_ENABLED=false
NEXT_PUBLIC_GOOGLE_ADS_ID=
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=
PAYMENT_GATEWAY=ezzpag
EZZPAG_API_AUTH=
UTMIFY_API_TOKEN=
UTMIFY_ENABLED=false
UTMIFY_TEST_MODE=false
NEXT_PUBLIC_ENABLE_USER_VERIFICATION=true
NEXT_PUBLIC_BASE_URL=https://$domain
NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED=false
EOF
        
        echo ""
        echo -e "${YELLOW}🔨 Fazendo build...${NC}"
        sudo npm run build
        
        # Criar ecosystem.config.js
        echo ""
        echo -e "${YELLOW}📝 Criando ecosystem.config.js...${NC}"
        sudo mkdir -p logs
        sudo tee ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [{
    name: '$site_name',
    script: 'npm',
    args: 'start',
    cwd: '$site_dir',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: $port
    },
    error_file: '$site_dir/logs/err.log',
    out_file: '$site_dir/logs/out.log',
    log_file: '$site_dir/logs/combined.log',
    time: true
  }]
}
EOF
        
        # Iniciar com PM2
        echo ""
        echo -e "${YELLOW}🚀 Iniciando com PM2...${NC}"
        sudo pm2 start ecosystem.config.js --env production
        sudo pm2 save
        
        # Atualizar próxima porta
        next_port=$((port + 1))
        update_next_port $next_port
        
        # Adicionar ao config
        add_site_to_config "$site_name" "$domain" "$port" "$repo_url"
    fi
    
    # Obter porta do site
    port=$(grep -o "PORT: [0-9]*" "$site_dir/ecosystem.config.js" | grep -o "[0-9]*" | head -1)
    
    # Configurar Nginx
    echo ""
    echo -e "${YELLOW}🌐 Configurando Nginx...${NC}"
    sudo tee /etc/nginx/sites-available/$site_name > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $domain www.$domain;

    access_log /var/log/nginx/$site_name-access.log;
    error_log /var/log/nginx/$site_name-error.log;

    location / {
        proxy_pass http://localhost:$port;
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
        proxy_pass http://localhost:$port;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600, immutable";
    }

    client_max_body_size 10M;
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
EOF
    
    sudo ln -sf /etc/nginx/sites-available/$site_name /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx
    
    # Configurar SSL
    echo ""
    echo -e "${YELLOW}🔐 Configurando SSL...${NC}"
    sudo certbot --nginx -d $domain -d www.$domain --register-unsafely-without-email --agree-tos --redirect --non-interactive
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ SITE CONFIGURADO COM SUCESSO!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}🌐 Site:${NC} ${GREEN}https://$domain${NC}"
    echo -e "${CYAN}🔌 Porta:${NC} ${YELLOW}$port${NC}"
    echo -e "${CYAN}📁 Diretório:${NC} $site_dir"
    echo ""
    echo -e "${YELLOW}⚠️  Configure Cloudflare:${NC}"
    echo -e "   1. DNS: A @ → IP do servidor (Proxy ON)"
    echo -e "   2. DNS: A www → IP do servidor (Proxy ON)"
    echo -e "   3. SSL/TLS: Full (strict)"
    echo ""
}

# Opção 3: Configurar Google Ads
configure_google_ads() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📊 CONFIGURAR GOOGLE ADS${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    list_sites
    
    read -p "Digite o nome do site: " site_name
    
    site_dir="$BASE_DIR/$site_name"
    
    if [ ! -d "$site_dir" ]; then
        echo -e "${RED}❌ Site não encontrado!${NC}"
        return 1
    fi
    
    echo ""
    echo -e "${CYAN}📋 Formato: AW-12345678/AbCdEfGhIj${NC}"
    echo -e "${CYAN}Exemplo: AW-17707007127/PvJCCLXTirobEPrX3flB${NC}"
    echo ""
    read -p "Digite a Tag/Conversão (formato: AW-xxxxx/yyyyy): " tag_conversion
    
    # Separar tag e conversão
    ads_id=$(echo $tag_conversion | cut -d'/' -f1)
    conversion_label=$(echo $tag_conversion | cut -d'/' -f2)
    
    echo ""
    echo -e "${CYAN}📋 Configuração:${NC}"
    echo -e "   Google Ads ID: ${YELLOW}$ads_id${NC}"
    echo -e "   Conversion Label: ${YELLOW}$conversion_label${NC}"
    echo ""
    
    read -p "Confirmar? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Cancelado${NC}"
        return 1
    fi
    
    # Atualizar .env.production
    echo ""
    echo -e "${YELLOW}📝 Atualizando .env.production...${NC}"
    cd $site_dir
    
    sudo sed -i "s/NEXT_PUBLIC_GOOGLE_ADS_ENABLED=.*/NEXT_PUBLIC_GOOGLE_ADS_ENABLED=true/" .env.production
    sudo sed -i "s/NEXT_PUBLIC_GOOGLE_ADS_ID=.*/NEXT_PUBLIC_GOOGLE_ADS_ID=$ads_id/" .env.production
    sudo sed -i "s/NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=.*/NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=$conversion_label/" .env.production
    
    # Build e reload
    echo ""
    echo -e "${YELLOW}🔨 Fazendo build...${NC}"
    sudo npm run build
    
    echo ""
    echo -e "${YELLOW}♻️  Recarregando aplicação...${NC}"
    sudo pm2 reload $site_name
    
    echo ""
    echo -e "${GREEN}✅ Google Ads configurado e ativado!${NC}"
    echo ""
    echo -e "${CYAN}📋 Configuração aplicada:${NC}"
    echo -e "   ENABLED: ${GREEN}true${NC}"
    echo -e "   ID: ${YELLOW}$ads_id${NC}"
    echo -e "   LABEL: ${YELLOW}$conversion_label${NC}"
    echo ""
}

# Opção 4: Atualizar Nginx após SSL
update_nginx_after_ssl() {
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🔄 ATUALIZAR NGINX APÓS SSL${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    echo -e "${YELLOW}🔍 Testando configuração Nginx...${NC}"
    sudo nginx -t
    
    echo ""
    echo -e "${YELLOW}♻️  Recarregando Nginx...${NC}"
    sudo systemctl reload nginx
    
    echo ""
    echo -e "${GREEN}✅ Nginx atualizado!${NC}"
    echo ""
    echo -e "${CYAN}📋 Status:${NC}"
    sudo systemctl status nginx --no-pager -l
    echo ""
}

# Menu Principal
show_menu() {
    clear
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}🚀 GERENCIADOR DE SITES NEXT.JS${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}1)${NC} 📥 Atualizar site do Git (pull + build + reload)"
    echo -e "${GREEN}2)${NC} 🌐 Configurar Nginx e instalar SSL"
    echo -e "${GREEN}3)${NC} 📊 Configurar Google Ads (tag/conversão)"
    echo -e "${GREEN}4)${NC} 🔄 Atualizar Nginx e restart"
    echo -e "${GREEN}5)${NC} 📋 Listar todos os sites"
    echo -e "${GREEN}6)${NC} 📊 Ver status PM2"
    echo -e "${GREEN}0)${NC} ❌ Sair"
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Loop principal
while true; do
    show_menu
    read -p "Escolha uma opção: " choice
    echo ""
    
    case $choice in
        1)
            git_pull
            read -p "Pressione Enter para continuar..."
            ;;
        2)
            configure_nginx_ssl
            read -p "Pressione Enter para continuar..."
            ;;
        3)
            configure_google_ads
            read -p "Pressione Enter para continuar..."
            ;;
        4)
            update_nginx_after_ssl
            read -p "Pressione Enter para continuar..."
            ;;
        5)
            list_sites
            read -p "Pressione Enter para continuar..."
            ;;
        6)
            sudo pm2 status
            echo ""
            read -p "Pressione Enter para continuar..."
            ;;
        0)
            echo -e "${GREEN}👋 Até logo!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opção inválida!${NC}"
            read -p "Pressione Enter para continuar..."
            ;;
    esac
done
