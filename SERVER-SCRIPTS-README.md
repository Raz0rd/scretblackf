# 🖥️ SCRIPTS DE BACKUP E CONFIGURAÇÃO DO SERVIDOR

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Script de Backup](#script-de-backup)
3. [Script de Configuração Nova](#script-de-configuração-nova)
4. [Script de Restauração](#script-de-restauração)
5. [Cenários de Uso](#cenários-de-uso)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Três scripts para gerenciar servidores Linux:

| Script | Descrição | Quando Usar |
|--------|-----------|-------------|
| `server-backup.sh` | Faz backup completo do servidor atual | Antes de mudanças críticas ou periodicamente |
| `server-setup-new.sh` | Configura servidor novo do zero | Ao provisionar novo servidor |
| `restore.sh` | Restaura backup em servidor novo | Após backup, para migração/contingência |

---

## 📦 Script de Backup

### O que faz o backup?

✅ **Configurações do Sistema**
- Informações do OS, kernel, hostname
- Usuários e grupos
- Processos e portas abertas
- Serviços habilitados

✅ **NGINX**
- Todas as configurações (`/etc/nginx`)
- Sites habilitados e disponíveis
- Versão instalada

✅ **SSL / Let's Encrypt**
- Certificados (`/etc/letsencrypt`)
- Lista de certificados ativos

✅ **Node.js / NPM / PM2**
- Versões instaladas
- Pacotes globais
- Configurações PM2
- Processos salvos

✅ **Variáveis de Ambiente**
- `.bashrc`, `.bash_profile`, `.profile`
- Variáveis de ambiente atuais

✅ **Cron Jobs**
- Crontab do usuário e root
- Cron system-wide

✅ **Firewall (UFW)**
- Regras ativas
- Configurações

✅ **Docker** (se instalado)
- Containers, imagens, networks, volumes
- Localizações de docker-compose

✅ **Pacotes Instalados**
- Lista completa de pacotes APT/YUM

✅ **Logs Importantes**
- NGINX access/error
- Syslog

### Como usar

#### 1. No servidor atual (que está funcionando):

```bash
# Fazer upload do script
scp server-backup.sh user@servidor-atual:/root/

# Conectar no servidor
ssh user@servidor-atual

# Executar backup
cd /root
sudo bash server-backup.sh
```

#### 2. Resultado:

```
📦 Arquivo gerado: server-backup-20251026-120000.tar.gz
📁 Contém: Todas as configurações + script de restauração
```

#### 3. Baixar backup:

```bash
# Do seu computador local
scp user@servidor-atual:/root/server-backup-*.tar.gz ./
```

#### 4. Guardar em local seguro:

- ☁️ Cloud Storage (Google Drive, Dropbox, S3)
- 💾 Backup local
- 🔐 Criptografado (se contém dados sensíveis)

---

## 🚀 Script de Configuração Nova

### O que faz?

Configura um servidor Ubuntu/Debian do ZERO com:

1. ✅ Atualização do sistema
2. ✅ Instalação de pacotes essenciais
3. ✅ Configuração de firewall (UFW)
4. ✅ Instalação Node.js via NVM
5. ✅ Instalação PM2
6. ✅ Configuração NGINX
7. ✅ Configuração SSL (Let's Encrypt)
8. ✅ Clone do repositório
9. ✅ Instalação de dependências
10. ✅ Configuração .env
11. ✅ Build da aplicação
12. ✅ Inicialização com PM2
13. ✅ Cron jobs de manutenção

### Como usar

#### 1. Provisionar servidor novo:

- **Provedor**: DigitalOcean, AWS, Vultr, Contabo, etc.
- **OS**: Ubuntu 22.04 LTS (recomendado)
- **Specs mínimas**: 1 CPU, 1GB RAM, 25GB SSD
- **Acesso**: SSH com chave ou senha

#### 2. Configurar DNS:

Antes de executar o script, configure os registros DNS:

```
Tipo    Nome    Valor               TTL
A       @       IP_DO_SERVIDOR      300
A       www     IP_DO_SERVIDOR      300
```

Aguarde 5-10 minutos para propagação.

#### 3. Fazer upload do script:

```bash
scp server-setup-new.sh root@IP_NOVO_SERVIDOR:/root/
```

#### 4. Conectar e executar:

```bash
ssh root@IP_NOVO_SERVIDOR
cd /root
sudo bash server-setup-new.sh novodominio.com
```

#### 5. Acompanhar instalação:

O script vai:
- ✅ Instalar tudo automaticamente
- ⏸️ Pausar para você configurar o .env
- ✅ Fazer build e iniciar a aplicação

#### 6. Verificar:

```bash
# Ver logs
pm2 logs

# Testar site
curl https://novodominio.com

# Abrir no navegador
https://novodominio.com
```

---

## 🔄 Script de Restauração

### O que faz?

Restaura um backup em servidor novo, substituindo o domínio antigo pelo novo automaticamente.

### Como usar

#### 1. Já ter feito backup no servidor antigo

#### 2. Copiar backup para servidor novo:

```bash
scp server-backup-20251026-120000.tar.gz root@IP_NOVO_SERVIDOR:/root/
```

#### 3. No servidor novo:

```bash
ssh root@IP_NOVO_SERVIDOR
cd /root

# Extrair backup
tar -xzf server-backup-20251026-120000.tar.gz
cd server-backup-20251026-120000

# Executar restauração
sudo bash restore.sh novodominio.com
```

#### 4. O que acontece:

- ✅ Instala pacotes necessários
- ✅ Restaura configurações NGINX (com novo domínio)
- ✅ Instala Node.js na mesma versão
- ✅ Restaura pacotes NPM globais
- ✅ Restaura PM2
- ✅ Configura firewall
- ✅ Restaura cron jobs (com novo domínio)

#### 5. Passos manuais após restauração:

```bash
# 1. Gerar SSL
sudo certbot --nginx -d novodominio.com -d www.novodominio.com

# 2. Clonar repositório
cd /var/www
git clone https://github.com/Raz0rd/scretblackf.git novodominio.com
cd novodominio.com

# 3. Configurar .env
nano .env

# 4. Instalar e buildar
npm install
npm run build

# 5. Iniciar com PM2
pm2 start npm --name 'novodominio.com' -- start
pm2 save
```

---

## 🎬 Cenários de Uso

### Cenário 1: Migração Planejada

**Situação**: Trocar de servidor ou provedor

**Passos**:
1. Fazer backup do servidor atual
2. Provisionar servidor novo
3. Configurar DNS apontando para novo servidor
4. Executar `server-setup-new.sh` no novo servidor
5. Testar tudo funcionando
6. Desligar servidor antigo

**Tempo estimado**: 30-60 minutos

---

### Cenário 2: Contingência / Disaster Recovery

**Situação**: Servidor atual caiu ou foi comprometido

**Passos**:
1. Provisionar servidor novo urgentemente
2. Usar backup mais recente
3. Executar `restore.sh` no novo servidor
4. Atualizar DNS para novo IP
5. Configurar SSL e fazer deploy

**Tempo estimado**: 15-30 minutos

---

### Cenário 3: Servidor de Teste / Staging

**Situação**: Criar ambiente de testes idêntico ao produção

**Passos**:
1. Fazer backup do servidor de produção
2. Provisionar servidor de teste
3. Executar `restore.sh` com domínio de teste
4. Usar para testar mudanças antes de aplicar em produção

**Tempo estimado**: 20-40 minutos

---

### Cenário 4: Escalar Horizontalmente

**Situação**: Adicionar mais servidores para balanceamento de carga

**Passos**:
1. Fazer backup do servidor principal
2. Provisionar N servidores novos
3. Executar `restore.sh` em cada um
4. Configurar load balancer (NGINX, HAProxy, etc)

**Tempo estimado**: 30 minutos por servidor

---

## 🔧 Troubleshooting

### Problema: Backup muito grande

**Solução**: Excluir logs e arquivos temporários antes do backup

```bash
# Limpar logs antigos
sudo find /var/log -name "*.log" -mtime +7 -delete

# Limpar cache NPM
npm cache clean --force

# Limpar PM2 logs
pm2 flush
```

---

### Problema: Restauração falha no NGINX

**Solução**: Verificar sintaxe e testar manualmente

```bash
# Testar configuração
sudo nginx -t

# Ver erros específicos
sudo nginx -t 2>&1

# Editar manualmente se necessário
sudo nano /etc/nginx/sites-available/default
```

---

### Problema: SSL não gera automaticamente

**Solução**: Gerar manualmente após DNS propagar

```bash
# Verificar se DNS está propagado
dig novodominio.com +short
nslookup novodominio.com

# Gerar SSL manualmente
sudo certbot --nginx -d novodominio.com -d www.novodominio.com

# Ver logs de erro
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

---

### Problema: PM2 não inicia aplicação

**Solução**: Verificar logs e reiniciar

```bash
# Ver logs
pm2 logs

# Ver processos
pm2 list

# Reiniciar
pm2 restart all

# Deletar e recriar
pm2 delete all
pm2 start npm --name 'app' -- start
pm2 save
```

---

### Problema: Aplicação não responde

**Solução**: Verificar se está rodando na porta correta

```bash
# Ver portas abertas
sudo ss -tulpn | grep 3000

# Verificar se Next.js está rodando
curl http://localhost:3000

# Ver logs do NGINX
sudo tail -f /var/log/nginx/error.log

# Reiniciar tudo
pm2 restart all
sudo systemctl restart nginx
```

---

## 📝 Checklist de Migração Completa

### Antes da Migração

- [ ] Fazer backup completo do servidor atual
- [ ] Baixar backup para local seguro
- [ ] Provisionar servidor novo
- [ ] Anotar IP do servidor novo
- [ ] Ter acesso SSH ao servidor novo

### Durante a Migração

- [ ] Configurar DNS apontando para novo servidor
- [ ] Aguardar propagação DNS (5-10 min)
- [ ] Executar script de configuração/restauração
- [ ] Configurar .env com credenciais corretas
- [ ] Gerar certificado SSL
- [ ] Fazer deploy da aplicação
- [ ] Testar fluxo completo (checkout + pagamento)

### Após a Migração

- [ ] Verificar logs sem erros
- [ ] Testar todos os endpoints
- [ ] Verificar conversões Google Ads
- [ ] Verificar tracking UTMify
- [ ] Verificar webhook de pagamento
- [ ] Configurar monitoramento (opcional)
- [ ] Configurar backup automático
- [ ] Documentar novo IP e credenciais
- [ ] Desligar servidor antigo (após 24h de testes)

---

## 🆘 Suporte

Em caso de problemas:

1. **Verificar logs**:
   ```bash
   pm2 logs
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Verificar status**:
   ```bash
   pm2 status
   sudo systemctl status nginx
   ```

3. **Reiniciar serviços**:
   ```bash
   pm2 restart all
   sudo systemctl restart nginx
   ```

4. **Consultar documentação**:
   - NGINX: https://nginx.org/en/docs/
   - PM2: https://pm2.keymetrics.io/docs/
   - Let's Encrypt: https://letsencrypt.org/docs/

---

## 🔐 Segurança

**IMPORTANTE**:

- 🔒 Backups contêm informações sensíveis
- 🚫 Não compartilhe backups publicamente
- 🗑️ Delete backups após restauração bem-sucedida
- 🔑 Use chaves SSH ao invés de senhas
- 🛡️ Mantenha firewall ativo
- 📊 Monitore logs regularmente

---

## ✅ Conclusão

Com estes scripts você pode:

✅ Fazer backup completo do servidor em minutos  
✅ Configurar servidor novo automaticamente  
✅ Restaurar configurações rapidamente  
✅ Migrar entre servidores sem downtime  
✅ Ter contingência em caso de problemas  

**Recomendação**: Faça backups semanalmente e teste a restauração periodicamente!
