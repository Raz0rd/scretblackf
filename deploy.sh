#!/bin/bash

# 🚀 Script de Deploy Automático - ffireshop
# Domain: free-firesite.shop
# Porta: 3044
# Branch: ffireshop

set -e  # Parar em caso de erro

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOY AUTOMÁTICO - FFIRESHOP"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Diretório do projeto
PROJECT_DIR="/var/www/ffireshop"
BRANCH="ffireshop"
APP_NAME="ffireshop"

# Verificar se está no diretório correto
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Diretório $PROJECT_DIR não encontrado!${NC}"
    exit 1
fi

cd $PROJECT_DIR

# 1. Backup do .env
echo -e "${YELLOW}📦 Fazendo backup do .env...${NC}"
if [ -f ".env.production" ]; then
    sudo cp .env.production .env.production.backup
    echo -e "${GREEN}✅ Backup criado${NC}"
fi

# 2. Git pull
echo ""
echo -e "${YELLOW}📥 Baixando atualizações do Git...${NC}"
sudo git fetch origin
sudo git checkout $BRANCH
sudo git pull origin $BRANCH
echo -e "${GREEN}✅ Código atualizado${NC}"

# 3. Instalar dependências
echo ""
echo -e "${YELLOW}📦 Instalando dependências...${NC}"
sudo npm install --production=false
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# 4. Build
echo ""
echo -e "${YELLOW}🔨 Fazendo build do projeto...${NC}"
sudo npm run build
echo -e "${GREEN}✅ Build concluído${NC}"

# 5. Reiniciar PM2
echo ""
echo -e "${YELLOW}♻️  Reiniciando aplicação...${NC}"
sudo pm2 restart $APP_NAME
echo -e "${GREEN}✅ Aplicação reiniciada${NC}"

# 6. Salvar configuração PM2
sudo pm2 save

# 7. Verificar status
echo ""
echo -e "${YELLOW}📊 Status da aplicação:${NC}"
sudo pm2 status $APP_NAME

# 8. Mostrar logs recentes
echo ""
echo -e "${YELLOW}📋 Últimos logs:${NC}"
sudo pm2 logs $APP_NAME --lines 15 --nostream

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ DEPLOY CONCLUÍDO COM SUCESSO!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "🌐 Site: ${GREEN}https://free-firesite.shop${NC}"
echo -e "📊 Logs: ${YELLOW}sudo pm2 logs $APP_NAME${NC}"
echo -e "🔄 Restart: ${YELLOW}sudo pm2 restart $APP_NAME${NC}"
echo ""
