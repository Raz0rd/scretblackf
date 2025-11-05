# 🚀 Script de Instalação Automática

Script para instalar sites Next.js automaticamente no Ubuntu com PM2, Nginx e SSL.

---

## 📋 Uso

```bash
sudo ./install-site.sh dominio.com porta nome-projeto repo-url branch
```

### Exemplo:
```bash
sudo ./install-site.sh free-firesite.shop 3044 ffireshop https://github.com/Raz0rd/presellfgo.git ffireshop
```

---

## 📦 O que o script faz automaticamente:

1. ✅ Verifica e instala Node.js (v20)
2. ✅ Verifica e instala PM2
3. ✅ Verifica e instala Nginx
4. ✅ Verifica e instala Certbot
5. ✅ Clona o repositório
6. ✅ Instala dependências
7. ✅ Cria `.env.production` com configurações básicas
8. ✅ Faz build do projeto
9. ✅ Cria `ecosystem.config.js` para PM2
10. ✅ Inicia aplicação com PM2
11. ✅ Configura PM2 startup (auto-start no boot)
12. ✅ Cria configuração Nginx
13. ✅ Ativa site no Nginx
14. ✅ Configura SSL com Let's Encrypt (Certbot)
15. ✅ Configura Firewall (UFW)

---

## 🔧 Preparação

### 1. No servidor Ubuntu:

```bash
# Fazer upload do script
scp install-site.sh usuario@servidor:/home/usuario/

# Conectar no servidor
ssh usuario@servidor

# Dar permissão de execução
chmod +x install-site.sh
```

### 2. Configurar DNS (ANTES de rodar o script):

**No provedor do domínio:**
- Tipo A: `@` → `IP_DO_SERVIDOR`
- Tipo A: `www` → `IP_DO_SERVIDOR`

**Aguardar propagação DNS (5-30 minutos)**

Verificar se propagou:
```bash
dig dominio.com +short
dig www.dominio.com +short
```

---

## 🎯 Executar Script

```bash
sudo ./install-site.sh dominio.com porta nome-projeto repo-url branch
```

### Parâmetros:

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `dominio.com` | Domínio do site | `free-firesite.shop` |
| `porta` | Porta do Node.js | `3044` |
| `nome-projeto` | Nome do projeto/app | `ffireshop` |
| `repo-url` | URL do repositório Git | `https://github.com/user/repo.git` |
| `branch` | Branch do Git | `ffireshop` ou `main` |

---

## 📝 Após a Instalação

### 1. Editar variáveis de ambiente:

```bash
sudo nano /var/www/nome-projeto/.env.production
```

**Adicione suas chaves reais:**
- `EZZPAG_API_AUTH`
- `UTMIFY_API_TOKEN`
- Outras configurações específicas

### 2. Reiniciar aplicação:

```bash
sudo pm2 restart nome-projeto
```

### 3. Verificar logs:

```bash
sudo pm2 logs nome-projeto
```

---

## 🌐 Configurar Cloudflare (Opcional)

Se usar Cloudflare:

### DNS:
- Tipo A: `@` → `IP_DO_SERVIDOR` (☁️ Proxy ON)
- Tipo A: `www` → `IP_DO_SERVIDOR` (☁️ Proxy ON)

### SSL/TLS:
- Overview → **Full (strict)**
- Edge Certificates → Always Use HTTPS: **ON**
- Edge Certificates → Automatic HTTPS Rewrites: **ON**

---

## 🔄 Instalar Múltiplos Sites

Você pode rodar o script várias vezes para diferentes sites:

```bash
# Site 1
sudo ./install-site.sh site1.com 3044 site1 https://github.com/user/repo1.git main

# Site 2
sudo ./install-site.sh site2.com 3045 site2 https://github.com/user/repo2.git main

# Site 3
sudo ./install-site.sh site3.com 3046 site3 https://github.com/user/repo3.git main
```

**Importante:** Use portas diferentes para cada site!

---

## 📊 Comandos Úteis

### PM2:
```bash
# Ver todos os sites
sudo pm2 list

# Ver logs de um site
sudo pm2 logs nome-projeto

# Reiniciar um site
sudo pm2 restart nome-projeto

# Parar um site
sudo pm2 stop nome-projeto

# Deletar um site
sudo pm2 delete nome-projeto
```

### Nginx:
```bash
# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs
sudo tail -f /var/log/nginx/nome-projeto-error.log
```

### SSL:
```bash
# Listar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew

# Testar renovação
sudo certbot renew --dry-run
```

---

## 🐛 Troubleshooting

### Site não abre:

```bash
# Verificar PM2
sudo pm2 status
sudo pm2 logs nome-projeto

# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx

# Verificar porta
sudo lsof -i :PORTA
```

### SSL não funciona:

```bash
# Verificar DNS
dig dominio.com +short

# Renovar certificado
sudo certbot renew --force-renewal
```

### Reinstalar site:

```bash
# Parar e deletar do PM2
sudo pm2 delete nome-projeto

# Remover diretório
sudo rm -rf /var/www/nome-projeto

# Remover config Nginx
sudo rm /etc/nginx/sites-enabled/nome-projeto
sudo rm /etc/nginx/sites-available/nome-projeto
sudo systemctl reload nginx

# Rodar script novamente
sudo ./install-site.sh dominio.com porta nome-projeto repo-url branch
```

---

## ✅ Checklist

Antes de rodar o script:
- [ ] DNS apontando para o servidor
- [ ] Porta escolhida não está em uso
- [ ] Repositório Git acessível
- [ ] Branch correto especificado

Após rodar o script:
- [ ] Editar `.env.production` com chaves reais
- [ ] Reiniciar aplicação: `sudo pm2 restart nome-projeto`
- [ ] Testar site: `https://dominio.com`
- [ ] Configurar Cloudflare (se usar)

---

## 📞 Exemplo Completo

```bash
# 1. Preparar
chmod +x install-site.sh

# 2. Verificar DNS
dig free-firesite.shop +short

# 3. Instalar
sudo ./install-site.sh free-firesite.shop 3044 ffireshop https://github.com/Raz0rd/presellfgo.git ffireshop

# 4. Editar .env
sudo nano /var/www/ffireshop/.env.production

# 5. Reiniciar
sudo pm2 restart ffireshop

# 6. Verificar
sudo pm2 logs ffireshop
curl https://free-firesite.shop

# 7. Pronto! 🎉
```

---

## 🎉 Pronto!

Seu site estará disponível em:
- `https://dominio.com`
- `https://www.dominio.com`

Com SSL configurado e renovação automática! 🚀
