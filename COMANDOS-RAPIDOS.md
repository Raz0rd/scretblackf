# ⚡ Comandos Rápidos - Deploy Ubuntu

## 🚀 Deploy Inicial (Primeira vez)

```bash
# 1. Conectar no servidor
ssh usuario@IP_DO_SERVIDOR

# 2. Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Instalar PM2
sudo npm install -g pm2

# 4. Instalar Nginx
sudo apt install -y nginx

# 5. Clonar projeto
cd /var/www
sudo git clone URL_DO_REPOSITORIO ffireshop
cd ffireshop
sudo git checkout ffireshop

# 6. Instalar dependências
sudo npm install

# 7. Criar .env.production
sudo nano .env.production
# Colar as variáveis de ambiente e salvar (Ctrl+O, Enter, Ctrl+X)

# 8. Build
sudo npm run build

# 9. Criar diretório de logs
sudo mkdir -p logs

# 10. Iniciar com PM2
sudo pm2 start ecosystem.config.js --env production
sudo pm2 save
sudo pm2 startup
# Executar o comando que aparecer

# 11. Configurar Nginx
sudo cp nginx-config.conf /etc/nginx/sites-available/ffireshop
sudo ln -s /etc/nginx/sites-available/ffireshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 12. Configurar SSL
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d free-firesite.shop -d www.free-firesite.shop

# 13. Configurar Firewall
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 🔄 Deploy de Atualização (Próximas vezes)

```bash
# Método 1: Script automático
cd /var/www/ffireshop
sudo chmod +x deploy.sh
sudo ./deploy.sh

# Método 2: Manual
cd /var/www/ffireshop
sudo git pull origin ffireshop
sudo npm install
sudo npm run build
sudo pm2 restart ffireshop
sudo pm2 logs ffireshop --lines 20
```

---

## 📊 Monitoramento

```bash
# Ver status
sudo pm2 status

# Ver logs em tempo real
sudo pm2 logs ffireshop

# Ver logs com filtro
sudo pm2 logs ffireshop --lines 50
sudo pm2 logs ffireshop --err  # Só erros

# Monitoramento de recursos
sudo pm2 monit

# Ver informações detalhadas
sudo pm2 show ffireshop
```

---

## 🔧 Comandos PM2

```bash
# Reiniciar
sudo pm2 restart ffireshop

# Parar
sudo pm2 stop ffireshop

# Iniciar
sudo pm2 start ffireshop

# Deletar
sudo pm2 delete ffireshop

# Recarregar (zero downtime)
sudo pm2 reload ffireshop

# Salvar configuração
sudo pm2 save

# Listar apps
sudo pm2 list
```

---

## 🌐 Comandos Nginx

```bash
# Testar configuração
sudo nginx -t

# Reiniciar
sudo systemctl restart nginx

# Recarregar (sem downtime)
sudo systemctl reload nginx

# Ver status
sudo systemctl status nginx

# Ver logs
sudo tail -f /var/log/nginx/ffireshop-access.log
sudo tail -f /var/log/nginx/ffireshop-error.log
```

---

## 🔐 Comandos SSL

```bash
# Renovar certificado
sudo certbot renew

# Renovar forçado
sudo certbot renew --force-renewal

# Testar renovação
sudo certbot renew --dry-run

# Listar certificados
sudo certbot certificates

# Deletar certificado
sudo certbot delete --cert-name free-firesite.shop
```

---

## 🐛 Debug

```bash
# Verificar se porta está em uso
sudo lsof -i :3044

# Matar processo na porta
sudo kill -9 $(sudo lsof -t -i:3044)

# Ver processos Node
ps aux | grep node

# Testar aplicação local
curl http://localhost:3044

# Testar via domínio
curl http://free-firesite.shop
curl https://free-firesite.shop

# Ver uso de memória
free -h

# Ver uso de disco
df -h

# Ver processos
top
htop  # Se instalado
```

---

## 📦 Git

```bash
# Ver branch atual
git branch

# Trocar de branch
git checkout ffireshop

# Atualizar
git pull origin ffireshop

# Ver status
git status

# Ver últimos commits
git log --oneline -10

# Resetar mudanças locais
git reset --hard origin/ffireshop
```

---

## 🔥 Firewall

```bash
# Ver status
sudo ufw status

# Permitir porta
sudo ufw allow 3044/tcp

# Bloquear porta
sudo ufw deny 3044/tcp

# Deletar regra
sudo ufw delete allow 3044/tcp

# Habilitar
sudo ufw enable

# Desabilitar
sudo ufw disable
```

---

## 📁 Arquivos Importantes

```bash
# Editar .env
sudo nano /var/www/ffireshop/.env.production

# Ver logs PM2
sudo tail -f /var/www/ffireshop/logs/out.log
sudo tail -f /var/www/ffireshop/logs/err.log

# Ver config Nginx
sudo nano /etc/nginx/sites-available/ffireshop

# Ver config PM2
sudo nano /var/www/ffireshop/ecosystem.config.js
```

---

## 🆘 Emergência (Site fora do ar)

```bash
# 1. Verificar PM2
sudo pm2 status
sudo pm2 logs ffireshop --err --lines 50

# 2. Reiniciar aplicação
sudo pm2 restart ffireshop

# 3. Verificar Nginx
sudo nginx -t
sudo systemctl status nginx
sudo systemctl restart nginx

# 4. Verificar porta
sudo lsof -i :3044

# 5. Se nada funcionar, reiniciar tudo
sudo pm2 restart all
sudo systemctl restart nginx

# 6. Último recurso: rebuild
cd /var/www/ffireshop
sudo npm run build
sudo pm2 restart ffireshop
```

---

## ✅ Checklist Rápido

```bash
# Verificar se tudo está OK
sudo pm2 status                    # PM2 rodando?
sudo systemctl status nginx        # Nginx ativo?
sudo lsof -i :3044                 # Porta aberta?
curl http://localhost:3044         # App respondendo?
curl https://free-firesite.shop    # Site acessível?
sudo certbot certificates          # SSL válido?
```

---

## 📞 Informações do Projeto

- **Domain:** free-firesite.shop
- **Porta:** 3044
- **Branch:** ffireshop
- **Diretório:** /var/www/ffireshop
- **PM2 App:** ffireshop
- **Nginx Config:** /etc/nginx/sites-available/ffireshop
- **Logs PM2:** /var/www/ffireshop/logs/
- **Logs Nginx:** /var/log/nginx/ffireshop-*.log
