#!/bin/bash

# ============================================
# SCRIPT DE INSTALAÇÃO AUTOMÁTICA
# ============================================
# Execute este script para instalar tudo automaticamente
# ATENÇÃO: Requer sudo

set -e  # Parar em caso de erro

echo "======================================"
echo "🚀 INSTALAÇÃO AUTOMÁTICA DO SERVIDOR"
echo "======================================"
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Este script precisa ser executado como root (sudo)"
    echo "Execute: sudo bash server-auto-setup.sh"
    exit 1
fi

echo "✅ Rodando como root"
echo ""

# Atualizar sistema
echo "======================================"
echo "📦 1. ATUALIZANDO SISTEMA"
echo "======================================"
apt-get update
apt-get upgrade -y

# Instalar dependências básicas
echo ""
echo "======================================"
echo "📦 2. INSTALANDO DEPENDÊNCIAS BÁSICAS"
echo "======================================"
apt-get install -y curl wget git build-essential

# Instalar Node.js 20
echo ""
echo "======================================"
echo "📦 3. INSTALANDO NODE.JS 20"
echo "======================================"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo "✅ Node.js instalado: $(node -v)"
else
    echo "✅ Node.js já instalado: $(node -v)"
fi

# Instalar Nginx
echo ""
echo "======================================"
echo "📦 4. INSTALANDO NGINX"
echo "======================================"
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo "✅ Nginx instalado e iniciado"
else
    echo "✅ Nginx já instalado"
fi

# Instalar PM2
echo ""
echo "======================================"
echo "📦 5. INSTALANDO PM2"
echo "======================================"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo "✅ PM2 instalado: $(pm2 -v)"
else
    echo "✅ PM2 já instalado: $(pm2 -v)"
fi

# Instalar Certbot
echo ""
echo "======================================"
echo "📦 6. INSTALANDO CERTBOT (SSL)"
echo "======================================"
if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
    echo "✅ Certbot instalado"
else
    echo "✅ Certbot já instalado"
fi

# Criar estrutura de diretórios
echo ""
echo "======================================"
echo "📁 7. CRIANDO ESTRUTURA DE DIRETÓRIOS"
echo "======================================"
mkdir -p /var/www
mkdir -p /var/log/nginx
echo "✅ Diretórios criados"

# Configurar firewall (UFW)
echo ""
echo "======================================"
echo "🔥 8. CONFIGURANDO FIREWALL"
echo "======================================"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    echo "✅ Firewall configurado"
else
    echo "⚠️  UFW não instalado, pulando configuração de firewall"
fi

# Configurar PM2 startup
echo ""
echo "======================================"
echo "🔧 9. CONFIGURANDO PM2 STARTUP"
echo "======================================"
pm2 startup systemd -u root --hp /root
echo "✅ PM2 startup configurado"

echo ""
echo "======================================"
echo "✅ INSTALAÇÃO COMPLETA!"
echo "======================================"
echo ""
echo "Próximos passos manuais:"
echo ""
echo "1. Clonar seu repositório:"
echo "   cd /var/www"
echo "   git clone https://github.com/seu-usuario/seu-repo.git"
echo "   cd seu-repo"
echo ""
echo "2. Criar arquivo .env:"
echo "   nano .env"
echo "   (Cole as variáveis de ambiente)"
echo ""
echo "3. Instalar dependências:"
echo "   npm install"
echo ""
echo "4. Build do projeto:"
echo "   npm run build"
echo ""
echo "5. Iniciar com PM2:"
echo "   pm2 start npm --name 'seu-app' -- start"
echo "   pm2 save"
echo ""
echo "6. Configurar Nginx:"
echo "   nano /etc/nginx/sites-available/seudominio.com"
echo "   (Cole a configuração do Nginx)"
echo "   ln -s /etc/nginx/sites-available/seudominio.com /etc/nginx/sites-enabled/"
echo "   nginx -t"
echo "   systemctl reload nginx"
echo ""
echo "7. Configurar SSL:"
echo "   certbot --nginx -d seudominio.com -d www.seudominio.com"
echo ""
echo "======================================"
echo "📋 INFORMAÇÕES DO SISTEMA"
echo "======================================"
echo ""
echo "Node.js: $(node -v)"
echo "NPM: $(npm -v)"
echo "PM2: $(pm2 -v)"
echo "Nginx: $(nginx -v 2>&1)"
echo "Certbot: $(certbot --version 2>&1 | head -n1)"
echo ""
echo "======================================"
