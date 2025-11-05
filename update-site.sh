#!/bin/bash

# Script para atualizar sites existentes
# Uso: sudo bash update-site.sh

set -e

echo "=========================================="
echo "   🔄 ATUALIZAR SITE EXISTENTE"
echo "=========================================="
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
   echo "❌ Por favor, execute como root (sudo bash update-site.sh)"
   exit 1
fi

# Listar sites disponíveis
echo "📂 Sites disponíveis em /var/www:"
echo ""
ls -d /var/www/*/ 2>/dev/null | while read site; do
    domain=$(basename "$site")
    if [ -d "$site/.git" ]; then
        echo "  ✅ $domain"
    fi
done
echo ""

# Solicitar domínio
read -p "🌐 Digite o domínio do site a atualizar: " DOMAIN

# Validar se o site existe
SITE_DIR="/var/www/$DOMAIN"
if [ ! -d "$SITE_DIR" ]; then
    echo "❌ Erro: Site $DOMAIN não encontrado em /var/www/"
    exit 1
fi

if [ ! -d "$SITE_DIR/.git" ]; then
    echo "❌ Erro: $DOMAIN não é um repositório Git"
    exit 1
fi

echo ""
echo "📍 Site encontrado: $SITE_DIR"
echo ""

# Perguntar qual branch
CURRENT_BRANCH=$(cd "$SITE_DIR" && git branch --show-current)
echo "🌿 Branch atual: $CURRENT_BRANCH"
read -p "🌿 Deseja mudar de branch? (deixe vazio para manter atual): " NEW_BRANCH

# Perguntar se quer fazer backup
read -p "💾 Fazer backup antes de atualizar? (s/N): " DO_BACKUP
DO_BACKUP=${DO_BACKUP:-n}

# Fazer backup se solicitado
if [[ "$DO_BACKUP" =~ ^[Ss]$ ]]; then
    BACKUP_DIR="/var/backups/sites"
    mkdir -p "$BACKUP_DIR"
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/${DOMAIN}_${TIMESTAMP}.tar.gz"
    
    echo ""
    echo "📦 Criando backup..."
    tar -czf "$BACKUP_FILE" -C /var/www "$DOMAIN" 2>/dev/null
    echo "✅ Backup criado: $BACKUP_FILE"
fi

echo ""
echo "🔄 Iniciando atualização..."
echo ""

# Ir para o diretório do site
cd "$SITE_DIR"

# Mostrar status atual
echo "📊 Status atual do Git:"
git status --short

# Stash de mudanças locais se houver
if ! git diff-index --quiet HEAD --; then
    echo ""
    echo "⚠️  Há mudanças locais não commitadas"
    read -p "💾 Fazer stash das mudanças locais? (S/n): " DO_STASH
    DO_STASH=${DO_STASH:-s}
    
    if [[ "$DO_STASH" =~ ^[Ss]$ ]]; then
        echo "📦 Salvando mudanças locais..."
        git stash save "Auto-stash antes de update $(date +%Y%m%d_%H%M%S)"
        echo "✅ Mudanças salvas (use 'git stash pop' para recuperar)"
    fi
fi

# Mudar de branch se solicitado
if [ ! -z "$NEW_BRANCH" ]; then
    echo ""
    echo "🌿 Mudando para branch: $NEW_BRANCH"
    git fetch origin
    git checkout "$NEW_BRANCH"
fi

# Fazer pull
echo ""
echo "⬇️  Baixando atualizações..."
git pull origin $(git branch --show-current)

# Verificar se há mudanças no package.json
if git diff HEAD@{1} --name-only | grep -q "package.json"; then
    echo ""
    echo "📦 Detectadas mudanças em package.json"
    echo "🔧 Instalando/atualizando dependências..."
    npm install
else
    echo ""
    echo "ℹ️  Sem mudanças em package.json, pulando npm install"
fi

# Build do projeto
echo ""
echo "🏗️  Fazendo build do projeto..."
npm run build

# Encontrar processo PM2
echo ""
echo "🔍 Procurando processo PM2..."
PM2_PROCESS=$(pm2 list | grep "$DOMAIN" | awk '{print $2}' | head -n 1)

if [ -z "$PM2_PROCESS" ]; then
    # Tentar encontrar por porta ou nome alternativo
    echo "⚠️  Processo não encontrado pelo domínio"
    echo "📋 Processos PM2 disponíveis:"
    pm2 list
    echo ""
    read -p "Digite o nome ou ID do processo PM2: " PM2_PROCESS
fi

if [ ! -z "$PM2_PROCESS" ]; then
    echo ""
    echo "🔄 Reiniciando PM2: $PM2_PROCESS"
    pm2 restart "$PM2_PROCESS"
    pm2 save
    echo "✅ Processo reiniciado"
else
    echo "⚠️  Nenhum processo PM2 encontrado"
    echo "ℹ️  Você pode iniciar manualmente com: pm2 start npm --name \"$DOMAIN\" -- start"
fi

# Verificar Nginx
echo ""
echo "🔍 Verificando configuração do Nginx..."
if nginx -t 2>/dev/null; then
    echo "✅ Configuração do Nginx OK"
    echo "🔄 Recarregando Nginx..."
    systemctl reload nginx
else
    echo "⚠️  Erro na configuração do Nginx"
    echo "ℹ️  Execute: sudo nginx -t"
fi

# Resumo
echo ""
echo "=========================================="
echo "   ✅ ATUALIZAÇÃO CONCLUÍDA!"
echo "=========================================="
echo ""
echo "📊 Informações:"
echo "  🌐 Domínio: $DOMAIN"
echo "  📂 Diretório: $SITE_DIR"
echo "  🌿 Branch: $(git branch --show-current)"
echo "  📝 Último commit: $(git log -1 --pretty=format:'%h - %s')"
echo ""
echo "🔗 Acesse: https://$DOMAIN"
echo ""

# Mostrar logs recentes se houver processo PM2
if [ ! -z "$PM2_PROCESS" ]; then
    echo "📋 Últimas 10 linhas do log:"
    pm2 logs "$PM2_PROCESS" --lines 10 --nostream
fi

echo ""
echo "✅ Script finalizado!"
