#!/bin/bash

# Script para configurar Google Ads TAG e LABEL no .env
# Uso: sudo bash configure-google-ads.sh [dominio]

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=========================================="
echo "   🎯 CONFIGURAR GOOGLE ADS TAG & LABEL"
echo "=========================================="
echo ""

# Verificar se foi passado o domínio
if [ -z "$1" ]; then
    echo "📂 Sites disponíveis em /var/www:"
    echo ""
    ls -d /var/www/*/ 2>/dev/null | while read site; do
        domain=$(basename "$site")
        if [ -d "$site/.git" ]; then
            echo "  ✅ $domain"
        fi
    done
    echo ""
    read -p "🌐 Digite o domínio do site: " DOMAIN
else
    DOMAIN=$1
fi

SITE_DIR="/var/www/$DOMAIN"
ENV_FILE="$SITE_DIR/.env"

# Validar se o site existe
if [ ! -d "$SITE_DIR" ]; then
    echo -e "${RED}❌ Erro: Site $DOMAIN não encontrado em /var/www/${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}📍 Site encontrado: $SITE_DIR${NC}"
echo ""

# Verificar se .env existe, senão criar do .env.example
if [ ! -f "$ENV_FILE" ]; then
    if [ -f "$SITE_DIR/.env.example" ]; then
        echo -e "${YELLOW}📝 Criando .env a partir do .env.example...${NC}"
        cp "$SITE_DIR/.env.example" "$ENV_FILE"
        echo -e "${GREEN}✅ .env criado${NC}"
    else
        echo -e "${RED}❌ Erro: .env.example não encontrado${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   📋 CONFIGURAÇÃO DO GOOGLE ADS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Perguntar configurações
read -p "🎯 Ativar Google Ads? (s/N): " ENABLE_ADS
ENABLE_ADS=${ENABLE_ADS:-n}

if [[ "$ENABLE_ADS" =~ ^[Ss]$ ]]; then
    GOOGLE_ADS_ENABLED="true"
    
    echo ""
    echo -e "${YELLOW}📝 Digite as informações do Google Ads:${NC}"
    echo ""
    
    read -p "🏷️  Google Ads Conversion ID (AW-XXXXXXXXXX): " CONVERSION_ID
    read -p "🎯 Google Ads Conversion Label: " CONVERSION_LABEL
    
    echo ""
    echo -e "${YELLOW}📝 Configurações de Whitepage:${NC}"
    echo ""
    
    read -p "🔗 URL da Whitepage (ex: https://whitepage.com): " WHITEPAGE_URL
    read -p "🌐 Base URL do site (ex: https://$DOMAIN): " BASE_URL
    BASE_URL=${BASE_URL:-https://$DOMAIN}
    
else
    GOOGLE_ADS_ENABLED="false"
    CONVERSION_ID=""
    CONVERSION_LABEL=""
    WHITEPAGE_URL=""
    BASE_URL="https://$DOMAIN"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   📝 RESUMO DAS CONFIGURAÇÕES${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  Google Ads Ativado: ${YELLOW}$GOOGLE_ADS_ENABLED${NC}"
if [[ "$GOOGLE_ADS_ENABLED" == "true" ]]; then
    echo -e "  Conversion ID: ${YELLOW}$CONVERSION_ID${NC}"
    echo -e "  Conversion Label: ${YELLOW}$CONVERSION_LABEL${NC}"
    echo -e "  Whitepage URL: ${YELLOW}$WHITEPAGE_URL${NC}"
fi
echo -e "  Base URL: ${YELLOW}$BASE_URL${NC}"
echo ""

read -p "Confirmar configurações? (s/N): " CONFIRM
CONFIRM=${CONFIRM:-n}

if [[ ! "$CONFIRM" =~ ^[Ss]$ ]]; then
    echo -e "${RED}❌ Configuração cancelada${NC}"
    exit 1
fi

# Fazer backup do .env
BACKUP_FILE="$SITE_DIR/.env.backup.$(date +%Y%m%d_%H%M%S)"
cp "$ENV_FILE" "$BACKUP_FILE"
echo ""
echo -e "${GREEN}💾 Backup criado: $BACKUP_FILE${NC}"

# Atualizar ou adicionar variáveis no .env
echo ""
echo -e "${YELLOW}📝 Atualizando .env...${NC}"

# Função para atualizar ou adicionar variável
update_env_var() {
    local key=$1
    local value=$2
    local file=$3
    
    if grep -q "^${key}=" "$file"; then
        # Atualizar existente
        sed -i "s|^${key}=.*|${key}=${value}|" "$file"
    else
        # Adicionar nova
        echo "${key}=${value}" >> "$file"
    fi
}

# Atualizar variáveis do Google Ads
update_env_var "NEXT_PUBLIC_GOOGLE_ADS_ENABLED" "$GOOGLE_ADS_ENABLED" "$ENV_FILE"

if [[ "$GOOGLE_ADS_ENABLED" == "true" ]]; then
    update_env_var "NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID" "$CONVERSION_ID" "$ENV_FILE"
    update_env_var "NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL" "$CONVERSION_LABEL" "$ENV_FILE"
    update_env_var "UTMIFY_WHITEPAGE_URL" "$WHITEPAGE_URL" "$ENV_FILE"
    update_env_var "NEXT_PUBLIC_UTMIFY_WHITEPAGE_URL" "$WHITEPAGE_URL" "$ENV_FILE"
fi

update_env_var "NEXT_PUBLIC_BASE_URL" "$BASE_URL" "$ENV_FILE"

echo -e "${GREEN}✅ Variáveis atualizadas no .env${NC}"

# Perguntar se quer fazer rebuild
echo ""
read -p "🏗️  Fazer rebuild do projeto? (S/n): " DO_REBUILD
DO_REBUILD=${DO_REBUILD:-s}

if [[ "$DO_REBUILD" =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${YELLOW}🏗️  Fazendo rebuild...${NC}"
    cd "$SITE_DIR"
    npm run build
    echo -e "${GREEN}✅ Build concluído${NC}"
    
    # Reiniciar PM2
    echo ""
    echo -e "${YELLOW}🔄 Reiniciando PM2...${NC}"
    
    # Tentar encontrar processo PM2
    PM2_PROCESS=$(pm2 list | grep "$DOMAIN" | awk '{print $2}' | head -n 1)
    
    if [ -z "$PM2_PROCESS" ]; then
        echo "📋 Processos PM2 disponíveis:"
        pm2 list
        echo ""
        read -p "Digite o nome ou ID do processo PM2: " PM2_PROCESS
    fi
    
    if [ ! -z "$PM2_PROCESS" ]; then
        pm2 restart "$PM2_PROCESS"
        pm2 save
        echo -e "${GREEN}✅ PM2 reiniciado${NC}"
    fi
fi

# Mostrar .env atualizado
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   📄 VARIÁVEIS CONFIGURADAS${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
grep -E "GOOGLE_ADS|WHITEPAGE|BASE_URL" "$ENV_FILE" | while read line; do
    echo "  $line"
done

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}   ✅ CONFIGURAÇÃO CONCLUÍDA!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "📂 Arquivo .env: ${YELLOW}$ENV_FILE${NC}"
echo -e "💾 Backup: ${YELLOW}$BACKUP_FILE${NC}"
echo -e "🔗 Site: ${YELLOW}https://$DOMAIN${NC}"
echo ""

if [[ "$GOOGLE_ADS_ENABLED" == "true" ]]; then
    echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
    echo -e "   1. Verifique se o Conversion ID e Label estão corretos no Google Ads"
    echo -e "   2. Teste a conversão fazendo uma compra de teste"
    echo -e "   3. Monitore as conversões no painel do Google Ads"
    echo ""
fi

echo "✅ Script finalizado!"
