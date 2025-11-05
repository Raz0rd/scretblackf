# 🚀 QUICK START - Instalação Rápida

## ⚡ Instalar Site DIRETO do GitHub (Recomendado)

Execute este comando ÚNICO no servidor Ubuntu:

```bash
curl -fsSL https://raw.githubusercontent.com/Raz0rd/scretblackf/baseffshop/install-site.sh | sudo bash
```

### O que vai acontecer:
1. ✅ Script baixa automaticamente do GitHub
2. ✅ Pergunta: domínio, porta, branch
3. ✅ Cria pasta em `/var/www/SEU-DOMINIO`
4. ✅ Clona o repositório DIRETO na pasta do domínio
5. ✅ Instala, builda, configura PM2, Nginx e SSL
6. ✅ Site pronto em HTTPS!

---

## 📋 Exemplo Completo:

```bash
# No servidor Ubuntu (como root)
curl -fsSL https://raw.githubusercontent.com/Raz0rd/scretblackf/baseffshop/install-site.sh | sudo bash

# Vai perguntar:
🔗 URL do repositório Git: https://github.com/Raz0rd/scretblackf.git
🌿 Branch: baseffshop
🌐 Domínio: promocoes.qpon
🔌 Porta: 3045
📧 Email para SSL: seu@email.com

# Pronto! Site instalado em:
# 📂 /var/www/promocoes.qpon
# 🔗 https://promocoes.qpon
```

---

## 🔄 Atualizar Site (Depois de Push)

```bash
# Baixar script de update
curl -fsSL https://raw.githubusercontent.com/Raz0rd/scretblackf/baseffshop/update-site.sh -o /tmp/update-site.sh

# Executar
sudo bash /tmp/update-site.sh

# Escolher o domínio da lista
# Pronto! Pull + Build + Restart automático
```

---

## 🎯 Estrutura Final:

```
/var/www/
├── promocoes.qpon/          ← Site 1 (repo clonado aqui)
│   ├── .git/
│   ├── components/
│   ├── app/
│   ├── package.json
│   └── .env
│
├── outro-dominio.com/       ← Site 2 (repo clonado aqui)
│   ├── .git/
│   └── ...
│
└── mais-um-site.com/        ← Site 3 (repo clonado aqui)
    └── ...
```

**Cada site fica na sua própria pasta em `/var/www/`!**

---

## 🔧 Gerenciar Sites

```bash
# Baixar script de gerenciamento
curl -fsSL https://raw.githubusercontent.com/Raz0rd/scretblackf/baseffshop/manage-sites.sh -o /tmp/manage-sites.sh

# Executar
sudo bash /tmp/manage-sites.sh

# Menu interativo:
# 1. Listar sites
# 2. Ver status
# 3. Ver logs
# 4. Parar/Iniciar
# 5. Remover site
```

---

## 💡 Comandos Úteis:

### Ver todos os sites:
```bash
ls -la /var/www/
```

### Ver processos PM2:
```bash
pm2 list
```

### Ver logs de um site:
```bash
pm2 logs promocoes-qpon
```

### Reiniciar um site:
```bash
pm2 restart promocoes-qpon
```

### Fazer pull manual:
```bash
cd /var/www/promocoes.qpon
git pull origin baseffshop
npm install
npm run build
pm2 restart promocoes-qpon
```

---

## 🆘 Problemas Comuns:

### Porta já em uso:
```bash
# Ver o que está usando a porta
sudo lsof -i :3045

# Matar processo
sudo kill -9 PID
```

### Site não carrega:
```bash
# Ver logs
pm2 logs promocoes-qpon

# Verificar Nginx
sudo nginx -t
sudo systemctl status nginx
```

### SSL não funciona:
```bash
# Renovar certificado
sudo certbot renew

# Verificar certificados
sudo certbot certificates
```

---

## 📞 Suporte Rápido:

1. **Instalar**: `curl -fsSL https://raw.githubusercontent.com/Raz0rd/scretblackf/baseffshop/install-site.sh | sudo bash`
2. **Atualizar**: `curl -fsSL https://raw.githubusercontent.com/Raz0rd/scretblackf/baseffshop/update-site.sh | sudo bash`
3. **Gerenciar**: `curl -fsSL https://raw.githubusercontent.com/Raz0rd/scretblackf/baseffshop/manage-sites.sh | sudo bash`

**Simples assim!** 🎉
