#!/bin/bash
echo "🚀 Atualizando projeto blueshiftgames.com..."
cd /var/www/blueshiftgames && \
echo "📥 Fazendo pull do branch blueshiftgames..." && \
git pull origin blueshiftgames && \
echo "📦 Instalando dependências..." && \
npm install && \
echo "🗑️ Limpando cache..." && \
rm -rf .next && \
echo "🔨 Buildando..." && \
npm run build && \
echo "🔄 Reiniciando PM2..." && \
pm2 restart blueshiftgames && \
echo "🧹 Limpando logs..." && \
pm2 flush && \
sleep 2 && \
echo "✅ Atualizado com sucesso!" && \
echo "📊 Logs:" && \
pm2 logs blueshiftgames --lines 30
