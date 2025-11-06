#!/usr/bin/env node

/**
 * Webhook Listener para Deploy Automático
 * 
 * Este script cria um servidor HTTP que escuta webhooks do GitHub
 * e executa deploy apenas quando há push real na branch.
 * 
 * Vantagens:
 * - Deploy instantâneo (< 1 segundo após push)
 * - Zero overhead (só executa quando necessário)
 * - Não consome recursos em idle
 * - Logs detalhados
 */

const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

// Configuração
const PORT = process.env.WEBHOOK_PORT || 9000;
const SECRET = process.env.WEBHOOK_SECRET || 'seu-secret-aqui';
const PROJECT_PATH = process.env.PROJECT_PATH || '/var/www/gmeports-quiz';
const PM2_APP_NAME = process.env.PM2_APP_NAME || 'gmeports-quiz';
const BRANCH = process.env.BRANCH || 'baseffshop';

// Arquivos que devem acionar deploy automático
const AUTO_DEPLOY_FILES = [
  'app/api/generate-pix/route.ts',
  'app/api/check-transaction-status/route.ts',
  'lib/brazil-time.ts',
  'app/checkout/page.tsx'
];

// Arquivos que NÃO devem acionar deploy automático
const IGNORE_FILES = [
  'app/page.tsx',
  'components/UserVerification.tsx'
];

function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const emoji = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️';
  console.log(`[${timestamp}] ${emoji} ${message}`);
}

function verifySignature(payload, signature) {
  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function shouldDeploy(files) {
  // Verificar se algum arquivo ignorado foi modificado
  const hasIgnoredFiles = files.some(file => 
    IGNORE_FILES.some(ignored => file.includes(ignored))
  );
  
  if (hasIgnoredFiles) {
    log('Arquivos ignorados detectados (página inicial/tema) - deploy manual necessário', 'warning');
    return false;
  }
  
  // Verificar se algum arquivo de deploy automático foi modificado
  const hasAutoDeployFiles = files.some(file => 
    AUTO_DEPLOY_FILES.some(auto => file.includes(auto))
  );
  
  if (hasAutoDeployFiles) {
    log('Arquivos de deploy automático detectados', 'success');
    return true;
  }
  
  // Por padrão, fazer deploy de outros arquivos
  log('Outros arquivos modificados - fazendo deploy', 'info');
  return true;
}

function executeDeploy() {
  return new Promise((resolve, reject) => {
    const commands = `
      cd ${PROJECT_PATH}
      echo "🔄 Fetching latest changes..."
      git fetch origin ${BRANCH}
      echo "📥 Checking out specific files..."
      git checkout origin/${BRANCH} -- ${AUTO_DEPLOY_FILES.join(' ')}
      echo "📦 Installing dependencies..."
      npm install --production
      echo "🔨 Building..."
      npm run build
      echo "♻️ Restarting PM2..."
      pm2 restart ${PM2_APP_NAME}
      echo "✅ Deploy completed!"
    `;
    
    log('Iniciando deploy...');
    
    exec(commands, (error, stdout, stderr) => {
      if (error) {
        log(`Erro no deploy: ${error.message}`, 'error');
        reject(error);
        return;
      }
      
      if (stderr) {
        log(`Stderr: ${stderr}`, 'warning');
      }
      
      log('Deploy concluído com sucesso!', 'success');
      log(stdout);
      resolve(stdout);
    });
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404);
    res.end('Not Found');
    return;
  }
  
  let body = '';
  
  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
    try {
      // Verificar assinatura
      const signature = req.headers['x-hub-signature-256'];
      if (!signature || !verifySignature(body, signature)) {
        log('Assinatura inválida!', 'error');
        res.writeHead(401);
        res.end('Unauthorized');
        return;
      }
      
      const payload = JSON.parse(body);
      
      // Verificar se é um push na branch correta
      if (payload.ref !== `refs/heads/${BRANCH}`) {
        log(`Push ignorado - branch: ${payload.ref}`, 'warning');
        res.writeHead(200);
        res.end('OK - Branch ignored');
        return;
      }
      
      // Obter lista de arquivos modificados
      const files = payload.commits.reduce((acc, commit) => {
        return [...acc, ...commit.added, ...commit.modified, ...commit.removed];
      }, []);
      
      log(`Push recebido com ${files.length} arquivos modificados`);
      log(`Arquivos: ${files.join(', ')}`);
      
      // Verificar se deve fazer deploy
      if (!shouldDeploy(files)) {
        res.writeHead(200);
        res.end('OK - Deploy skipped (manual deploy required)');
        return;
      }
      
      // Executar deploy
      await executeDeploy();
      
      res.writeHead(200);
      res.end('OK - Deploy completed');
      
    } catch (error) {
      log(`Erro ao processar webhook: ${error.message}`, 'error');
      res.writeHead(500);
      res.end('Internal Server Error');
    }
  });
});

server.listen(PORT, () => {
  log(`🚀 Webhook listener rodando na porta ${PORT}`);
  log(`📁 Projeto: ${PROJECT_PATH}`);
  log(`🔀 Branch: ${BRANCH}`);
  log(`📦 PM2 App: ${PM2_APP_NAME}`);
});
