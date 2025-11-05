# 🔄 Script de Atualização de Sites - UPDATE-SITE.SH

Script para atualizar sites Next.js já instalados no servidor Ubuntu.

## 📋 Quando Usar

- ✅ **Atualizar código** após fazer push de mudanças
- ✅ **Mudar de branch** (ex: de `main` para `baseffshop`)
- ✅ **Atualizar dependências** quando houver mudanças no `package.json`
- ✅ **Rebuild** após alterações no código

## 🚀 Como Usar

### 1. No Servidor Ubuntu

```bash
# Ir para o diretório do projeto
cd /var/www/seu-dominio

# Executar o script
sudo bash update-site.sh
```

### 2. O Script Vai Perguntar

1. **Domínio do site** - Escolha da lista de sites disponíveis
2. **Mudar branch?** - Deixe vazio para manter o atual
3. **Fazer backup?** - Recomendado para segurança
4. **Stash mudanças locais?** - Se houver arquivos modificados

## 🔧 O Que o Script Faz

1. ✅ **Valida** se o site existe
2. 📦 **Backup** (opcional) do site atual
3. 💾 **Stash** de mudanças locais (se houver)
4. 🌿 **Checkout** para nova branch (se solicitado)
5. ⬇️ **Git pull** das últimas mudanças
6. 📦 **npm install** (se package.json mudou)
7. 🏗️ **npm run build** do projeto
8. 🔄 **PM2 restart** do processo
9. 🔄 **Nginx reload** da configuração

## 📊 Exemplo de Uso

```bash
$ sudo bash update-site.sh

========================================
   🔄 ATUALIZAR SITE EXISTENTE
========================================

📂 Sites disponíveis em /var/www:

  ✅ promocoes.qpon
  ✅ free-firesite.shop

🌐 Digite o domínio do site a atualizar: promocoes.qpon

📍 Site encontrado: /var/www/promocoes.qpon

🌿 Branch atual: baseffshop
🌿 Deseja mudar de branch? (deixe vazio para manter atual): 

💾 Fazer backup antes de atualizar? (s/N): s

📦 Criando backup...
✅ Backup criado: /var/backups/sites/promocoes.qpon_20250105_191500.tar.gz

🔄 Iniciando atualização...

📊 Status atual do Git:
 M components/UserVerification.tsx

⚠️  Há mudanças locais não commitadas
💾 Fazer stash das mudanças locais? (S/n): s

📦 Salvando mudanças locais...
✅ Mudanças salvas (use 'git stash pop' para recuperar)

⬇️  Baixando atualizações...
remote: Enumerating objects: 25, done.
Receiving objects: 100% (25/25), done.
✅ Atualizado para: 9063247

📦 Detectadas mudanças em package.json
🔧 Instalando/atualizando dependências...
✅ Dependências atualizadas

🏗️  Fazendo build do projeto...
✅ Build concluído

🔄 Reiniciando PM2: promocoes-qpon
✅ Processo reiniciado

🔍 Verificando configuração do Nginx...
✅ Configuração do Nginx OK
🔄 Recarregando Nginx...

========================================
   ✅ ATUALIZAÇÃO CONCLUÍDA!
========================================

📊 Informações:
  🌐 Domínio: promocoes.qpon
  📂 Diretório: /var/www/promocoes.qpon
  🌿 Branch: baseffshop
  📝 Último commit: 9063247 - Add: Scripts de instalação

🔗 Acesse: https://promocoes.qpon

✅ Script finalizado!
```

## 🆚 Diferença Entre Scripts

### `install-site.sh` - INSTALAÇÃO DO ZERO
```bash
# Usar quando:
- ✅ Criar um site NOVO
- ✅ Primeira instalação
- ✅ Configurar domínio novo
- ✅ Configurar SSL pela primeira vez
```

### `update-site.sh` - ATUALIZAÇÃO
```bash
# Usar quando:
- ✅ Atualizar código existente
- ✅ Fazer pull de mudanças
- ✅ Mudar de branch
- ✅ Rebuild após alterações
```

### `manage-sites.sh` - GERENCIAMENTO
```bash
# Usar quando:
- ✅ Listar todos os sites
- ✅ Ver status dos sites
- ✅ Parar/Iniciar sites
- ✅ Ver logs
- ✅ Remover sites
```

## 🔒 Segurança

### Backups Automáticos
- Backups salvos em: `/var/backups/sites/`
- Formato: `dominio_YYYYMMDD_HHMMSS.tar.gz`
- Recomendado: Sempre fazer backup antes de atualizar

### Recuperar de Backup
```bash
# Listar backups
ls -lh /var/backups/sites/

# Restaurar backup
cd /var/www
sudo tar -xzf /var/backups/sites/promocoes.qpon_20250105_191500.tar.gz
```

## 🐛 Solução de Problemas

### Erro: "Site não encontrado"
```bash
# Verificar sites instalados
ls -la /var/www/
```

### Erro: "Processo PM2 não encontrado"
```bash
# Listar processos PM2
pm2 list

# Iniciar manualmente
cd /var/www/seu-dominio
pm2 start npm --name "seu-dominio" -- start -- -p 3045
pm2 save
```

### Erro: "Conflito no Git"
```bash
# Descartar mudanças locais
cd /var/www/seu-dominio
git reset --hard origin/baseffshop

# Ou fazer stash
git stash
git pull
```

### Erro: "Build falhou"
```bash
# Ver logs completos
cd /var/www/seu-dominio
npm run build

# Limpar cache e tentar novamente
rm -rf .next node_modules
npm install
npm run build
```

## 📝 Workflow Recomendado

### 1. Desenvolvimento Local
```bash
# Fazer mudanças
git add .
git commit -m "Sua mensagem"
git push origin baseffshop
```

### 2. Atualizar no Servidor
```bash
# SSH no servidor
ssh root@seu-servidor

# Executar update
cd /var/www/seu-dominio
sudo bash update-site.sh
```

### 3. Verificar
```bash
# Ver logs
pm2 logs seu-dominio

# Testar site
curl https://seu-dominio.com
```

## 🎯 Dicas

1. **Sempre faça backup** antes de atualizar em produção
2. **Teste localmente** antes de fazer push
3. **Use branches** para testar mudanças grandes
4. **Monitore os logs** após atualização
5. **Mantenha backups** por pelo menos 7 dias

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs: `pm2 logs`
2. Verifique o Nginx: `sudo nginx -t`
3. Verifique o status: `pm2 status`
4. Restaure backup se necessário
