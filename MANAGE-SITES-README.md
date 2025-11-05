# 🚀 Gerenciador de Sites - Guia de Uso

Script interativo para gerenciar múltiplos sites Next.js no Ubuntu.

---

## 📦 Instalação

```bash
# 1. Fazer upload do script
scp manage-sites.sh usuario@servidor:/home/usuario/

# 2. Conectar no servidor
ssh usuario@servidor

# 3. Dar permissão de execução
chmod +x manage-sites.sh

# 4. Executar
sudo ./manage-sites.sh
```

---

## 🎯 Funcionalidades

### **1️⃣ Atualizar site do Git**
- Faz `git pull` do repositório
- Instala dependências
- Faz build
- Recarrega aplicação com PM2 (sem downtime)

### **2️⃣ Configurar Nginx e SSL**
- Clona repositório (se novo site)
- Configura porta automaticamente (começa em 3050)
- Cria `.env.production`
- Faz build
- Configura PM2
- Configura Nginx
- Instala SSL com Let's Encrypt
- Salva configuração em JSON

### **3️⃣ Configurar Google Ads**
- Atualiza tag e conversão com 1 linha
- Ativa Google Ads automaticamente
- Faz build e reload

### **4️⃣ Atualizar Nginx**
- Testa configuração
- Recarrega Nginx
- Mostra status

### **5️⃣ Listar sites**
- Mostra todos os sites cadastrados
- Exibe porta de cada site

### **6️⃣ Ver status PM2**
- Mostra status de todas as aplicações

---

## 📋 Uso Detalhado

### **Opção 1: Atualizar Site**

```
1) Escolher opção 1
2) Digitar nome do site (ex: ffireshop)
3) Aguardar pull + build + reload
4) Pronto! ✅
```

**Exemplo:**
```
Digite o nome do site: ffireshop
📥 Fazendo pull do Git...
📦 Instalando dependências...
🔨 Fazendo build...
♻️  Recarregando aplicação...
✅ Site atualizado com sucesso!
```

---

### **Opção 2: Novo Site com Nginx e SSL**

```
1) Escolher opção 2
2) Informar:
   - Nome do site: ffireshop
   - Domínio: free-firesite.shop
   - URL do repo: https://github.com/Raz0rd/presellfgo.git
   - Branch: ffireshop
3) Script faz tudo automaticamente
4) Pronto! Site no ar com SSL ✅
```

**O que acontece:**
- ✅ Clona repositório
- ✅ Atribui porta automaticamente (3050, 3051, 3052...)
- ✅ Instala dependências
- ✅ Cria `.env.production`
- ✅ Faz build
- ✅ Configura PM2
- ✅ Configura Nginx
- ✅ Instala SSL
- ✅ Salva em `/var/www/sites-config.json`

---

### **Opção 3: Configurar Google Ads**

```
1) Escolher opção 3
2) Digitar nome do site: ffireshop
3) Digitar tag/conversão: AW-17707007127/PvJCCLXTirobEPrX3flB
4) Confirmar
5) Pronto! Google Ads ativado ✅
```

**Formato da tag:**
```
AW-12345678/AbCdEfGhIj
    ↑           ↑
   ID      Conversão
```

**O que é atualizado:**
```env
NEXT_PUBLIC_GOOGLE_ADS_ENABLED=true          # ← Ativado
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17707007127     # ← Tag
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=PvJCCLXTirobEPrX3flB  # ← Conversão
```

---

### **Opção 4: Atualizar Nginx**

```
1) Escolher opção 4
2) Nginx testa e recarrega automaticamente
3) Pronto! ✅
```

Útil após:
- Instalar SSL manualmente
- Editar configuração Nginx
- Configurar Cloudflare Full (Strict)

---

## 🗂️ Estrutura de Arquivos

### **Configuração Global:**
```
/var/www/sites-config.json
```

**Conteúdo:**
```json
{
  "next_port": 3052,
  "sites": [
    {
      "name": "ffireshop",
      "domain": "free-firesite.shop",
      "port": 3050,
      "repo": "https://github.com/Raz0rd/presellfgo.git"
    },
    {
      "name": "site2",
      "domain": "site2.com",
      "port": 3051,
      "repo": "https://github.com/user/repo2.git"
    }
  ]
}
```

### **Estrutura de cada site:**
```
/var/www/
├── ffireshop/
│   ├── .env.production
│   ├── ecosystem.config.js
│   ├── logs/
│   │   ├── err.log
│   │   ├── out.log
│   │   └── combined.log
│   └── ... (arquivos do projeto)
├── site2/
│   └── ...
└── sites-config.json
```

---

## 🔄 Fluxo de Portas

O script gerencia portas automaticamente:

```
Primeiro site:  3050
Segundo site:   3051
Terceiro site:  3052
...e assim por diante
```

**Salvo em:** `/var/www/sites-config.json`

---

## 📊 Exemplos Práticos

### **Exemplo 1: Adicionar novo site**

```bash
sudo ./manage-sites.sh

# Escolher opção 2
# Nome: myshop
# Domínio: myshop.com
# Repo: https://github.com/user/myshop.git
# Branch: main

# Resultado:
# ✅ Site em https://myshop.com
# ✅ Porta: 3050
# ✅ SSL instalado
```

### **Exemplo 2: Atualizar site existente**

```bash
sudo ./manage-sites.sh

# Escolher opção 1
# Nome: myshop

# Resultado:
# ✅ Código atualizado
# ✅ Build feito
# ✅ Site recarregado
```

### **Exemplo 3: Ativar Google Ads**

```bash
sudo ./manage-sites.sh

# Escolher opção 3
# Nome: myshop
# Tag: AW-17707007127/PvJCCLXTirobEPrX3flB

# Resultado:
# ✅ Google Ads ativado
# ✅ Tag e conversão configuradas
# ✅ Site recarregado
```

---

## 🌐 Cloudflare Setup

Após usar opção 2 (Nginx + SSL):

### **DNS:**
```
Tipo: A
Host: @
Valor: IP_DO_SERVIDOR
Proxy: ☁️ ON (laranja)

Tipo: A
Host: www
Valor: IP_DO_SERVIDOR
Proxy: ☁️ ON (laranja)
```

### **SSL/TLS:**
```
Overview → Full (strict)
Edge Certificates → Always Use HTTPS: ON
Edge Certificates → Automatic HTTPS Rewrites: ON
```

### **Após configurar Cloudflare:**
```bash
sudo ./manage-sites.sh
# Escolher opção 4 (Atualizar Nginx)
```

---

## 🔍 Verificar Sites

### **Listar todos:**
```bash
sudo ./manage-sites.sh
# Escolher opção 5
```

### **Ver status PM2:**
```bash
sudo ./manage-sites.sh
# Escolher opção 6
```

### **Manualmente:**
```bash
# Ver todos os sites
sudo pm2 list

# Ver logs de um site
sudo pm2 logs ffireshop

# Testar site
curl https://free-firesite.shop
```

---

## 🐛 Troubleshooting

### **Site não atualiza após pull:**
```bash
# Verificar logs
sudo pm2 logs nome-do-site

# Reiniciar manualmente
cd /var/www/nome-do-site
sudo npm run build
sudo pm2 restart nome-do-site
```

### **Porta já em uso:**
```bash
# Ver qual processo está usando
sudo lsof -i :3050

# Matar processo
sudo kill -9 PID
```

### **SSL não funciona:**
```bash
# Verificar DNS
dig dominio.com +short

# Reinstalar SSL
sudo certbot --nginx -d dominio.com -d www.dominio.com --force-renewal
```

### **Nginx erro:**
```bash
# Testar configuração
sudo nginx -t

# Ver logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📝 Comandos Úteis

```bash
# Executar script
sudo ./manage-sites.sh

# Ver configuração de sites
cat /var/www/sites-config.json

# Ver todos os sites PM2
sudo pm2 list

# Reiniciar todos os sites
sudo pm2 restart all

# Ver logs de todos
sudo pm2 logs

# Parar todos
sudo pm2 stop all
```

---

## ✅ Checklist

### **Antes de adicionar novo site:**
- [ ] DNS apontando para servidor
- [ ] Repositório Git acessível
- [ ] Branch correto

### **Após adicionar site:**
- [ ] Editar `.env.production` com chaves reais
- [ ] Reiniciar: opção 1 do menu
- [ ] Testar: `https://dominio.com`
- [ ] Configurar Cloudflare (se usar)
- [ ] Opção 4 para atualizar Nginx

---

## 🎉 Resumo

**Menu Principal:**
```
1) 📥 Atualizar site (pull + build + reload)
2) 🌐 Novo site (Nginx + SSL)
3) 📊 Google Ads (tag/conversão)
4) 🔄 Atualizar Nginx
5) 📋 Listar sites
6) 📊 Status PM2
0) ❌ Sair
```

**Tudo em um único script interativo!** 🚀
