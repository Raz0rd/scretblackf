#!/bin/bash
# ========================================
# SCRIPT DE BACKUP DO SERVIDOR LINUX
# ========================================
# Este script faz backup completo de todas as configurações
# do servidor para facilitar migração/contingência
#
# Uso: sudo bash server-backup.sh
# ========================================

BACKUP_DIR="server-backup-$(date +%Y%m%d-%H%M%S)"
CURRENT_DIR=$(pwd)

echo "=========================================="
echo "🔧 BACKUP DO SERVIDOR LINUX"
echo "=========================================="
echo ""
echo "📁 Criando diretório de backup: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"
cd "$BACKUP_DIR"

# ========================================
# 1. INFORMAÇÕES DO SISTEMA
# ========================================
echo ""
echo "1️⃣ Coletando informações do sistema..."

cat > system-info.txt << EOF
# INFORMAÇÕES DO SISTEMA
# Gerado em: $(date)

## Sistema Operacional
$(cat /etc/os-release)

## Kernel
$(uname -a)

## Hostname
$(hostname)

## IP Addresses
$(ip addr show)

## Usuários do sistema
$(cat /etc/passwd)

## Grupos
$(cat /etc/group)

## Processos em execução
$(ps aux)

## Portas abertas
$(ss -tulpn)

## Serviços habilitados
$(systemctl list-unit-files --state=enabled)

## Disco
$(df -h)

## Memória
$(free -h)

## CPU
$(lscpu)
EOF

echo "   ✅ Informações do sistema salvas"

# ========================================
# 2. NGINX
# ========================================
echo ""
echo "2️⃣ Backup do NGINX..."

if [ -d /etc/nginx ]; then
    mkdir -p nginx
    cp -r /etc/nginx/* nginx/
    
    # Sites habilitados
    if [ -d /etc/nginx/sites-enabled ]; then
        mkdir -p nginx/sites-enabled
        cp -r /etc/nginx/sites-enabled/* nginx/sites-enabled/
    fi
    
    # Sites disponíveis
    if [ -d /etc/nginx/sites-available ]; then
        mkdir -p nginx/sites-available
        cp -r /etc/nginx/sites-available/* nginx/sites-available/
    fi
    
    # Versão do NGINX
    nginx -v > nginx/version.txt 2>&1
    
    echo "   ✅ NGINX backup completo"
else
    echo "   ⚠️  NGINX não encontrado"
fi

# ========================================
# 3. CERTBOT / SSL
# ========================================
echo ""
echo "3️⃣ Backup de certificados SSL..."

if [ -d /etc/letsencrypt ]; then
    mkdir -p letsencrypt
    cp -r /etc/letsencrypt/* letsencrypt/
    
    # Listar certificados
    certbot certificates > letsencrypt/certificates-list.txt 2>&1
    
    echo "   ✅ Certificados SSL salvos"
else
    echo "   ⚠️  Let's Encrypt não encontrado"
fi

# ========================================
# 4. NODE.JS / NPM / NVM
# ========================================
echo ""
echo "4️⃣ Backup de configurações Node.js..."

mkdir -p nodejs

# Versão do Node
node -v > nodejs/node-version.txt 2>&1
npm -v > nodejs/npm-version.txt 2>&1

# NVM
if [ -d ~/.nvm ]; then
    nvm --version > nodejs/nvm-version.txt 2>&1
    nvm list > nodejs/nvm-list.txt 2>&1
fi

# Pacotes globais
npm list -g --depth=0 > nodejs/npm-global-packages.txt 2>&1

# PM2 (se instalado)
if command -v pm2 &> /dev/null; then
    pm2 list > nodejs/pm2-list.txt 2>&1
    pm2 save > /dev/null 2>&1
    if [ -f ~/.pm2/dump.pm2 ]; then
        cp ~/.pm2/dump.pm2 nodejs/pm2-dump.pm2
    fi
    pm2 startup > nodejs/pm2-startup-command.txt 2>&1
fi

echo "   ✅ Node.js configurações salvas"

# ========================================
# 5. VARIÁVEIS DE AMBIENTE
# ========================================
echo ""
echo "5️⃣ Backup de variáveis de ambiente..."

mkdir -p environment

# .bashrc
if [ -f ~/.bashrc ]; then
    cp ~/.bashrc environment/bashrc
fi

# .bash_profile
if [ -f ~/.bash_profile ]; then
    cp ~/.bash_profile environment/bash_profile
fi

# .profile
if [ -f ~/.profile ]; then
    cp ~/.profile environment/profile
fi

# Environment variables
env > environment/env-vars.txt

echo "   ✅ Variáveis de ambiente salvas"

# ========================================
# 6. CRON JOBS
# ========================================
echo ""
echo "6️⃣ Backup de cron jobs..."

mkdir -p cron

# Crontab do usuário atual
crontab -l > cron/user-crontab.txt 2>&1

# Crontab do root (se executando como root)
if [ "$EUID" -eq 0 ]; then
    crontab -u root -l > cron/root-crontab.txt 2>&1
fi

# Cron system-wide
if [ -d /etc/cron.d ]; then
    cp -r /etc/cron.d cron/
fi

echo "   ✅ Cron jobs salvos"

# ========================================
# 7. FIREWALL (UFW)
# ========================================
echo ""
echo "7️⃣ Backup de configurações de firewall..."

if command -v ufw &> /dev/null; then
    mkdir -p firewall
    ufw status verbose > firewall/ufw-status.txt 2>&1
    ufw show raw > firewall/ufw-raw.txt 2>&1
    
    # Regras do UFW
    if [ -d /etc/ufw ]; then
        cp -r /etc/ufw firewall/
    fi
    
    echo "   ✅ Firewall configurações salvas"
else
    echo "   ⚠️  UFW não encontrado"
fi

# ========================================
# 8. DOCKER (se instalado)
# ========================================
echo ""
echo "8️⃣ Backup de configurações Docker..."

if command -v docker &> /dev/null; then
    mkdir -p docker
    
    docker --version > docker/version.txt
    docker ps -a > docker/containers.txt 2>&1
    docker images > docker/images.txt 2>&1
    docker network ls > docker/networks.txt 2>&1
    docker volume ls > docker/volumes.txt 2>&1
    
    # Docker Compose files (se existirem)
    find /opt /home -name "docker-compose.yml" -o -name "docker-compose.yaml" 2>/dev/null > docker/compose-files-locations.txt
    
    echo "   ✅ Docker configurações salvas"
else
    echo "   ⚠️  Docker não encontrado"
fi

# ========================================
# 9. BANCO DE DADOS (PostgreSQL/MySQL)
# ========================================
echo ""
echo "9️⃣ Verificando bancos de dados..."

mkdir -p database

# PostgreSQL
if command -v psql &> /dev/null; then
    psql --version > database/postgresql-version.txt 2>&1
    echo "   ⚠️  PostgreSQL encontrado - faça backup manual dos dados"
fi

# MySQL/MariaDB
if command -v mysql &> /dev/null; then
    mysql --version > database/mysql-version.txt 2>&1
    echo "   ⚠️  MySQL encontrado - faça backup manual dos dados"
fi

# ========================================
# 10. PACOTES INSTALADOS
# ========================================
echo ""
echo "🔟 Listando pacotes instalados..."

mkdir -p packages

# APT (Debian/Ubuntu)
if command -v apt &> /dev/null; then
    dpkg --get-selections > packages/apt-packages.txt
    apt list --installed > packages/apt-list.txt 2>&1
fi

# YUM/DNF (RedHat/CentOS)
if command -v yum &> /dev/null; then
    yum list installed > packages/yum-packages.txt 2>&1
fi

echo "   ✅ Lista de pacotes salva"

# ========================================
# 11. LOGS IMPORTANTES
# ========================================
echo ""
echo "1️⃣1️⃣ Copiando logs importantes..."

mkdir -p logs

# Últimas 1000 linhas de logs importantes
if [ -f /var/log/nginx/access.log ]; then
    tail -n 1000 /var/log/nginx/access.log > logs/nginx-access.log 2>&1
fi

if [ -f /var/log/nginx/error.log ]; then
    tail -n 1000 /var/log/nginx/error.log > logs/nginx-error.log 2>&1
fi

if [ -f /var/log/syslog ]; then
    tail -n 1000 /var/log/syslog > logs/syslog.log 2>&1
fi

echo "   ✅ Logs salvos"

# ========================================
# 12. CRIAR SCRIPT DE RESTAURAÇÃO
# ========================================
echo ""
echo "1️⃣2️⃣ Criando script de restauração..."

cat > restore.sh << 'RESTORE_SCRIPT'
#!/bin/bash
# ========================================
# SCRIPT DE RESTAURAÇÃO DO SERVIDOR
# ========================================
# Este script restaura as configurações do backup
#
# Uso: sudo bash restore.sh [novo_dominio]
# Exemplo: sudo bash restore.sh novosite.com
# ========================================

NEW_DOMAIN="${1}"
OLD_DOMAIN="verifiedbyffire.store"

if [ -z "$NEW_DOMAIN" ]; then
    echo "❌ Erro: Informe o novo domínio"
    echo "Uso: sudo bash restore.sh novosite.com"
    exit 1
fi

echo "=========================================="
echo "🔧 RESTAURAÇÃO DO SERVIDOR"
echo "=========================================="
echo ""
echo "🔄 Domínio antigo: $OLD_DOMAIN"
echo "🆕 Novo domínio: $NEW_DOMAIN"
echo ""
read -p "Confirma a restauração? (s/N): " confirm

if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    echo "❌ Restauração cancelada"
    exit 0
fi

# ========================================
# 1. INSTALAR PACOTES NECESSÁRIOS
# ========================================
echo ""
echo "1️⃣ Instalando pacotes necessários..."

if [ -f packages/apt-packages.txt ]; then
    echo "   📦 Instalando pacotes APT..."
    apt update
    apt install -y nginx certbot python3-certbot-nginx
fi

# ========================================
# 2. RESTAURAR NGINX
# ========================================
echo ""
echo "2️⃣ Restaurando NGINX..."

if [ -d nginx ]; then
    # Backup do NGINX atual
    if [ -d /etc/nginx ]; then
        mv /etc/nginx /etc/nginx.backup-$(date +%Y%m%d-%H%M%S)
    fi
    
    # Restaurar configurações
    cp -r nginx /etc/nginx
    
    # Substituir domínio antigo pelo novo
    find /etc/nginx -type f -exec sed -i "s/$OLD_DOMAIN/$NEW_DOMAIN/g" {} \;
    
    # Testar configuração
    nginx -t
    
    echo "   ✅ NGINX restaurado (domínio atualizado)"
fi

# ========================================
# 3. INSTALAR NODE.JS / NVM
# ========================================
echo ""
echo "3️⃣ Instalando Node.js..."

if [ -f nodejs/node-version.txt ]; then
    NODE_VERSION=$(cat nodejs/node-version.txt | tr -d 'v')
    
    # Instalar NVM
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Instalar Node
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
    nvm alias default $NODE_VERSION
    
    echo "   ✅ Node.js $NODE_VERSION instalado"
fi

# ========================================
# 4. INSTALAR PACOTES GLOBAIS NPM
# ========================================
echo ""
echo "4️⃣ Instalando pacotes globais NPM..."

if [ -f nodejs/npm-global-packages.txt ]; then
    # Extrair nomes dos pacotes (ignorar versões)
    grep -oP '(?<=── )[^@]+' nodejs/npm-global-packages.txt | while read package; do
        npm install -g "$package"
    done
    
    echo "   ✅ Pacotes NPM instalados"
fi

# ========================================
# 5. RESTAURAR PM2
# ========================================
echo ""
echo "5️⃣ Restaurando PM2..."

if [ -f nodejs/pm2-dump.pm2 ]; then
    cp nodejs/pm2-dump.pm2 ~/.pm2/dump.pm2
    pm2 resurrect
    pm2 startup
    pm2 save
    
    echo "   ✅ PM2 restaurado"
fi

# ========================================
# 6. CONFIGURAR SSL
# ========================================
echo ""
echo "6️⃣ Configurando SSL..."

echo "   ⚠️  Execute manualmente:"
echo "   sudo certbot --nginx -d $NEW_DOMAIN -d www.$NEW_DOMAIN"

# ========================================
# 7. CONFIGURAR FIREWALL
# ========================================
echo ""
echo "7️⃣ Configurando firewall..."

if [ -f firewall/ufw-status.txt ]; then
    ufw --force enable
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw reload
    
    echo "   ✅ Firewall configurado"
fi

# ========================================
# 8. RESTAURAR CRON JOBS
# ========================================
echo ""
echo "8️⃣ Restaurando cron jobs..."

if [ -f cron/user-crontab.txt ]; then
    # Substituir domínio nos cron jobs
    sed "s/$OLD_DOMAIN/$NEW_DOMAIN/g" cron/user-crontab.txt | crontab -
    
    echo "   ✅ Cron jobs restaurados"
fi

# ========================================
# FINALIZAÇÃO
# ========================================
echo ""
echo "=========================================="
echo "✅ RESTAURAÇÃO CONCLUÍDA!"
echo "=========================================="
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Configurar DNS apontando para este servidor:"
echo "   A    $NEW_DOMAIN    → $(curl -s ifconfig.me)"
echo "   A    www.$NEW_DOMAIN → $(curl -s ifconfig.me)"
echo ""
echo "2. Gerar certificado SSL:"
echo "   sudo certbot --nginx -d $NEW_DOMAIN -d www.$NEW_DOMAIN"
echo ""
echo "3. Clonar repositório e fazer deploy:"
echo "   git clone https://github.com/Raz0rd/scretblackf.git"
echo "   cd scretblackf"
echo "   npm install"
echo "   npm run build"
echo "   pm2 start npm --name 'app' -- start"
echo ""
echo "4. Configurar variáveis de ambiente (.env)"
echo ""
echo "5. Reiniciar serviços:"
echo "   sudo systemctl restart nginx"
echo "   pm2 restart all"
echo ""
echo "6. Verificar logs:"
echo "   pm2 logs"
echo "   sudo tail -f /var/log/nginx/error.log"
echo ""
RESTORE_SCRIPT

chmod +x restore.sh

echo "   ✅ Script de restauração criado"

# ========================================
# 13. CRIAR README
# ========================================
cat > README.md << 'README'
# 📦 BACKUP DO SERVIDOR

Este backup contém todas as configurações do servidor Linux.

## 📁 Estrutura do Backup

- `system-info.txt` - Informações do sistema
- `nginx/` - Configurações do NGINX
- `letsencrypt/` - Certificados SSL
- `nodejs/` - Configurações Node.js, NPM, PM2
- `environment/` - Variáveis de ambiente
- `cron/` - Cron jobs
- `firewall/` - Configurações UFW
- `docker/` - Configurações Docker (se aplicável)
- `database/` - Informações de bancos de dados
- `packages/` - Lista de pacotes instalados
- `logs/` - Logs importantes
- `restore.sh` - Script de restauração automática

## 🔄 Como Restaurar

### Opção 1: Restauração Automática (Recomendado)

```bash
# 1. Copiar backup para o novo servidor
scp -r server-backup-* user@novo-servidor:/root/

# 2. Conectar no novo servidor
ssh user@novo-servidor

# 3. Executar script de restauração
cd /root/server-backup-*
sudo bash restore.sh novodominio.com
```

### Opção 2: Restauração Manual

#### 1. Instalar pacotes base
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx git curl
```

#### 2. Instalar Node.js via NVM
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

#### 3. Instalar PM2
```bash
npm install -g pm2
```

#### 4. Restaurar NGINX
```bash
sudo cp -r nginx/* /etc/nginx/
# Editar manualmente e substituir domínio antigo pelo novo
sudo nano /etc/nginx/sites-available/default
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Configurar SSL
```bash
sudo certbot --nginx -d novodominio.com -d www.novodominio.com
```

#### 6. Clonar e fazer deploy
```bash
git clone https://github.com/Raz0rd/scretblackf.git
cd scretblackf
npm install
npm run build
pm2 start npm --name 'app' -- start
pm2 startup
pm2 save
```

## ⚙️ Variáveis de Ambiente

Não esqueça de configurar o arquivo `.env` com:

- Chaves de API (BlackCat, Umbrela, etc)
- Tokens (UTMify, Google Ads, etc)
- URLs e configurações específicas
- Credenciais de banco de dados

## 🔐 Segurança

- ⚠️ Este backup contém informações sensíveis
- 🔒 Mantenha em local seguro
- 🚫 Não compartilhe publicamente
- 🗑️ Delete após restauração bem-sucedida

## 📞 Suporte

Em caso de dúvidas, consulte a documentação completa no repositório.
README

echo "   ✅ README criado"

# ========================================
# 14. COMPACTAR BACKUP
# ========================================
echo ""
echo "1️⃣4️⃣ Compactando backup..."

cd "$CURRENT_DIR"
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"

echo "   ✅ Backup compactado: ${BACKUP_DIR}.tar.gz"

# ========================================
# FINALIZAÇÃO
# ========================================
echo ""
echo "=========================================="
echo "✅ BACKUP CONCLUÍDO COM SUCESSO!"
echo "=========================================="
echo ""
echo "📦 Arquivo de backup: ${BACKUP_DIR}.tar.gz"
echo "📁 Tamanho: $(du -h ${BACKUP_DIR}.tar.gz | cut -f1)"
echo ""
echo "📋 Para restaurar em outro servidor:"
echo ""
echo "1. Copie o arquivo para o novo servidor:"
echo "   scp ${BACKUP_DIR}.tar.gz user@novo-servidor:/root/"
echo ""
echo "2. No novo servidor, extraia e execute:"
echo "   tar -xzf ${BACKUP_DIR}.tar.gz"
echo "   cd ${BACKUP_DIR}"
echo "   sudo bash restore.sh novodominio.com"
echo ""
echo "🔐 IMPORTANTE: Guarde este backup em local seguro!"
echo ""
