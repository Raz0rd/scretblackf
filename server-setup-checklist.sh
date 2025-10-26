#!/bin/bash

# ============================================
# SCRIPT DE CHECKLIST PARA NOVO SERVIDOR
# ============================================
# Execute este script no novo servidor para verificar
# o que está instalado e o que precisa ser configurado

echo "======================================"
echo "🔍 CHECKLIST DE CONFIGURAÇÃO DO SERVIDOR"
echo "======================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 instalado${NC}"
        if [ "$1" = "node" ]; then
            echo -e "   Versão: $(node -v)"
        elif [ "$1" = "npm" ]; then
            echo -e "   Versão: $(npm -v)"
        elif [ "$1" = "nginx" ]; then
            echo -e "   Versão: $(nginx -v 2>&1)"
        elif [ "$1" = "git" ]; then
            echo -e "   Versão: $(git --version)"
        elif [ "$1" = "pm2" ]; then
            echo -e "   Versão: $(pm2 -v)"
        fi
        return 0
    else
        echo -e "${RED}❌ $1 NÃO instalado${NC}"
        return 1
    fi
}

# Função para verificar serviço
check_service() {
    if systemctl is-active --quiet $1; then
        echo -e "${GREEN}✅ $1 rodando${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 NÃO está rodando${NC}"
        return 1
    fi
}

# Função para verificar porta
check_port() {
    if netstat -tuln | grep -q ":$1 "; then
        echo -e "${GREEN}✅ Porta $1 em uso${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  Porta $1 livre${NC}"
        return 1
    fi
}

echo "======================================"
echo "📦 1. VERIFICANDO DEPENDÊNCIAS"
echo "======================================"
echo ""

check_command "node" || NODE_MISSING=1
check_command "npm" || NPM_MISSING=1
check_command "git" || GIT_MISSING=1
check_command "nginx" || NGINX_MISSING=1
check_command "pm2" || PM2_MISSING=1
check_command "curl" || CURL_MISSING=1

echo ""
echo "======================================"
echo "🔧 2. VERIFICANDO SERVIÇOS"
echo "======================================"
echo ""

check_service "nginx" || NGINX_SERVICE_DOWN=1

echo ""
echo "======================================"
echo "🌐 3. VERIFICANDO PORTAS"
echo "======================================"
echo ""

echo "Porta 80 (HTTP):"
check_port "80"

echo "Porta 443 (HTTPS):"
check_port "443"

echo "Porta 3000 (Next.js):"
check_port "3000"

echo ""
echo "======================================"
echo "📁 4. VERIFICANDO ESTRUTURA DE DIRETÓRIOS"
echo "======================================"
echo ""

if [ -d "/var/www" ]; then
    echo -e "${GREEN}✅ /var/www existe${NC}"
    echo "   Conteúdo:"
    ls -la /var/www/ | head -n 10
else
    echo -e "${RED}❌ /var/www NÃO existe${NC}"
    VARWWW_MISSING=1
fi

echo ""
echo "======================================"
echo "🔐 5. VERIFICANDO CERTIFICADOS SSL"
echo "======================================"
echo ""

if [ -d "/etc/letsencrypt/live" ]; then
    echo -e "${GREEN}✅ Let's Encrypt instalado${NC}"
    echo "   Certificados:"
    ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "   Nenhum certificado encontrado"
else
    echo -e "${YELLOW}⚠️  Let's Encrypt não configurado${NC}"
    SSL_MISSING=1
fi

echo ""
echo "======================================"
echo "📋 6. VERIFICANDO CONFIGURAÇÃO NGINX"
echo "======================================"
echo ""

if [ -d "/etc/nginx/sites-available" ]; then
    echo -e "${GREEN}✅ Diretório sites-available existe${NC}"
    echo "   Sites configurados:"
    ls -la /etc/nginx/sites-available/ | grep -v "^total" | grep -v "^d"
else
    echo -e "${RED}❌ Diretório sites-available NÃO existe${NC}"
fi

echo ""
if [ -d "/etc/nginx/sites-enabled" ]; then
    echo -e "${GREEN}✅ Diretório sites-enabled existe${NC}"
    echo "   Sites ativos:"
    ls -la /etc/nginx/sites-enabled/ | grep -v "^total" | grep -v "^d"
else
    echo -e "${RED}❌ Diretório sites-enabled NÃO existe${NC}"
fi

echo ""
echo "======================================"
echo "🔑 7. VERIFICANDO VARIÁVEIS DE AMBIENTE"
echo "======================================"
echo ""

echo "Verificando se .env existe no diretório atual:"
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ .env encontrado${NC}"
    echo "   Variáveis configuradas:"
    grep -v "^#" .env | grep -v "^$" | cut -d'=' -f1 | sed 's/^/   - /'
else
    echo -e "${YELLOW}⚠️  .env NÃO encontrado no diretório atual${NC}"
fi

echo ""
echo "======================================"
echo "📊 8. VERIFICANDO PM2"
echo "======================================"
echo ""

if command -v pm2 &> /dev/null; then
    echo "Processos PM2:"
    pm2 list
    echo ""
    echo "Startup configurado:"
    pm2 startup | grep -q "already" && echo -e "${GREEN}✅ PM2 startup configurado${NC}" || echo -e "${YELLOW}⚠️  PM2 startup NÃO configurado${NC}"
else
    echo -e "${RED}❌ PM2 não instalado${NC}"
fi

echo ""
echo "======================================"
echo "💾 9. VERIFICANDO ESPAÇO EM DISCO"
echo "======================================"
echo ""

df -h / | awk 'NR==1 {print "   "$0} NR==2 {print "   "$0; if (substr($5,1,length($5)-1)+0 > 80) print "   ⚠️  Espaço em disco baixo!"; else print "   ✅ Espaço em disco OK"}'

echo ""
echo "======================================"
echo "🧠 10. VERIFICANDO MEMÓRIA"
echo "======================================"
echo ""

free -h | awk 'NR==1 {print "   "$0} NR==2 {print "   "$0}'

echo ""
echo "======================================"
echo "📝 RESUMO E PRÓXIMOS PASSOS"
echo "======================================"
echo ""

MISSING_COUNT=0

if [ ! -z "$NODE_MISSING" ]; then
    echo -e "${RED}❌ Instalar Node.js:${NC}"
    echo "   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "   sudo apt-get install -y nodejs"
    echo ""
    MISSING_COUNT=$((MISSING_COUNT+1))
fi

if [ ! -z "$GIT_MISSING" ]; then
    echo -e "${RED}❌ Instalar Git:${NC}"
    echo "   sudo apt-get install -y git"
    echo ""
    MISSING_COUNT=$((MISSING_COUNT+1))
fi

if [ ! -z "$NGINX_MISSING" ]; then
    echo -e "${RED}❌ Instalar Nginx:${NC}"
    echo "   sudo apt-get install -y nginx"
    echo ""
    MISSING_COUNT=$((MISSING_COUNT+1))
fi

if [ ! -z "$PM2_MISSING" ]; then
    echo -e "${RED}❌ Instalar PM2:${NC}"
    echo "   sudo npm install -g pm2"
    echo "   pm2 startup"
    echo ""
    MISSING_COUNT=$((MISSING_COUNT+1))
fi

if [ ! -z "$SSL_MISSING" ]; then
    echo -e "${YELLOW}⚠️  Configurar SSL (Certbot):${NC}"
    echo "   sudo apt-get install -y certbot python3-certbot-nginx"
    echo "   sudo certbot --nginx -d seudominio.com"
    echo ""
    MISSING_COUNT=$((MISSING_COUNT+1))
fi

if [ ! -z "$VARWWW_MISSING" ]; then
    echo -e "${RED}❌ Criar diretório /var/www:${NC}"
    echo "   sudo mkdir -p /var/www"
    echo ""
    MISSING_COUNT=$((MISSING_COUNT+1))
fi

if [ $MISSING_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ TUDO PRONTO! Servidor configurado corretamente.${NC}"
    echo ""
    echo "Próximos passos para deploy:"
    echo "1. cd /var/www"
    echo "2. git clone seu-repositorio.git"
    echo "3. cd seu-projeto"
    echo "4. npm install"
    echo "5. Criar arquivo .env com as variáveis necessárias"
    echo "6. npm run build"
    echo "7. pm2 start npm --name 'seu-app' -- start"
    echo "8. pm2 save"
    echo "9. Configurar Nginx (ver arquivo de exemplo abaixo)"
else
    echo -e "${YELLOW}⚠️  Encontrados $MISSING_COUNT itens para configurar.${NC}"
    echo "Execute os comandos acima para completar a configuração."
fi

echo ""
echo "======================================"
echo "📄 EXEMPLO DE CONFIGURAÇÃO NGINX"
echo "======================================"
echo ""

cat << 'EOF'
# Arquivo: /etc/nginx/sites-available/seudominio.com

server {
    listen 80;
    server_name seudominio.com www.seudominio.com;
    
    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seudominio.com www.seudominio.com;

    # Certificados SSL (será configurado pelo Certbot)
    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
    
    # Configurações SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logs
    access_log /var/log/nginx/seudominio.com.access.log;
    error_log /var/log/nginx/seudominio.com.error.log;

    # Proxy para Next.js
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

    # Cache para arquivos estáticos
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}

# Comandos para ativar:
# sudo ln -s /etc/nginx/sites-available/seudominio.com /etc/nginx/sites-enabled/
# sudo nginx -t
# sudo systemctl reload nginx
EOF

echo ""
echo "======================================"
echo "📋 CHECKLIST COMPLETO"
echo "======================================"
echo ""

cat << 'EOF'
□ 1. Instalar Node.js 20+
□ 2. Instalar Git
□ 3. Instalar Nginx
□ 4. Instalar PM2
□ 5. Configurar SSL (Certbot)
□ 6. Criar diretório /var/www
□ 7. Clonar repositório
□ 8. Instalar dependências (npm install)
□ 9. Criar arquivo .env com:
     - NODE_ENV=production
     - BLACKCAT_API_AUTH=...
     - GHOSTPAY_API_KEY=...
     - UTMIFY_API_TOKEN=...
     - UTMIFY_ENABLED=true
     - NEXT_PUBLIC_CLOAKER_TRACKING_ENABLED=true
     - PAYMENT_GATEWAY=umbrela
     - UMBRELA_API_KEY=...
     - NEXT_PUBLIC_GOOGLE_ADS_ENABLED=true
     - NEXT_PUBLIC_GOOGLE_ADS_ID=...
□ 10. Build do projeto (npm run build)
□ 11. Iniciar com PM2
□ 12. Configurar Nginx
□ 13. Configurar SSL com Certbot
□ 14. Testar site
□ 15. Configurar cloaker (AlterCPA)
□ 16. Adicionar whitelist de IPs no código
□ 17. Testar conversões Google Ads
EOF

echo ""
echo "======================================"
echo "✅ CHECKLIST COMPLETO!"
echo "======================================"
echo ""
echo "Salve este output para referência futura."
echo ""
