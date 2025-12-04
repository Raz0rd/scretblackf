/**
 * Script para buscar TODAS as páginas de itens de Brainrot da API
 * com proxy e salvamento progressivo
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const API_BASE_URL = 'https://www.eldorado.gg/api/flexibleOffers';
const GAME_ID = '259'; // Steal a Brainrot
const CATEGORY = 'CustomItem';
const PAGE_SIZE = 24;
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const PROGRESS_FILE = path.join(OUTPUT_DIR, 'brainrot-progress.json');
const CONSOLIDATED_FILE = path.join(OUTPUT_DIR, 'brainrot-all-pages.json');
const DELAY_BETWEEN_REQUESTS = 2000; // 2 segundos entre requisições

// Configuração do Proxy
const PROXY_CONFIG = {
  host: '2521b1c087ea390c.ika.na.pyproxy.io',
  port: 16666,
  auth: 'postman2025-zone-resi:postman2025'
};

// Criar diretório data se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Carregar progresso anterior se existir
let progress = {
  lastPage: 0,
  totalPages: 0,
  items: [],
  errors: []
};

if (fs.existsSync(PROGRESS_FILE)) {
  try {
    progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    console.log(`📂 Progresso anterior encontrado! Última página: ${progress.lastPage}`);
  } catch (err) {
    console.log('⚠️  Erro ao ler progresso anterior, iniciando do zero');
  }
}

/**
 * Salvar progresso
 */
function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
}

/**
 * Faz requisição GET para a API usando proxy HTTP
 */
function fetchPage(pageIndex) {
  return new Promise((resolve, reject) => {
    const apiUrl = `${API_BASE_URL}?gameId=${GAME_ID}&category=${CATEGORY}&usePerGameScore=false&pageIndex=${pageIndex}&pageSize=${PAGE_SIZE}`;
    
    const options = {
      hostname: PROXY_CONFIG.host,
      port: PROXY_CONFIG.port,
      path: apiUrl,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Proxy-Authorization': 'Basic ' + Buffer.from(PROXY_CONFIG.auth).toString('base64')
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (err) {
            reject(new Error(`Erro ao parsear JSON: ${err.message}`));
          }
        } else if (res.statusCode === 301 || res.statusCode === 302) {
          reject(new Error(`Redirect ${res.statusCode}. Location: ${res.headers.location || 'N/A'}`));
        } else {
          reject(new Error(`Status HTTP ${res.statusCode}: ${data.substring(0, 200)}`));
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout na requisição'));
    });

    req.end();
  });
}

/**
 * Aguardar um tempo
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Buscar todas as páginas
 */
async function fetchAllPages() {
  console.log('🚀 Iniciando busca de todas as páginas com proxy...\n');
  console.log(`🔒 Proxy: ${PROXY_CONFIG.host}:${PROXY_CONFIG.port}\n`);

  try {
    // Se não temos o total de páginas, buscar a primeira página
    if (progress.totalPages === 0) {
      console.log('📥 Buscando primeira página para descobrir total...');
      const firstPage = await fetchPage(1);
      
      progress.totalPages = firstPage.totalPages || 0;
      progress.lastPage = 1;
      
      if (firstPage.data && Array.isArray(firstPage.data)) {
        progress.items.push(...firstPage.data);
      }
      
      saveProgress();
      
      console.log(`✅ Primeira página carregada!`);
      console.log(`📊 Total de páginas disponíveis: ${progress.totalPages}`);
      console.log(`📦 Total de registros: ${firstPage.totalRecords || 0}`);
      console.log(`🎯 Páginas a buscar: ${progress.totalPages}\n`);
      
      await delay(DELAY_BETWEEN_REQUESTS);
    }

    // Continuar de onde parou
    const startPage = progress.lastPage + 1;
    
    for (let page = startPage; page <= progress.totalPages; page++) {
      try {
        console.log(`📥 Buscando página ${page}/${progress.totalPages}...`);
        
        const pageData = await fetchPage(page);
        
        if (pageData.data && Array.isArray(pageData.data)) {
          progress.items.push(...pageData.data);
          progress.lastPage = page;
          
          // Salvar progresso a cada 10 páginas
          if (page % 10 === 0) {
            saveProgress();
            console.log(`   💾 Progresso salvo! Total de itens: ${progress.items.length}`);
          } else {
            console.log(`   ✅ ${pageData.data.length} itens adicionados (Total: ${progress.items.length})`);
          }
        }
        
        // Delay entre requisições
        await delay(DELAY_BETWEEN_REQUESTS);
        
      } catch (error) {
        console.log(`   ❌ Erro na página ${page}: ${error.message}`);
        progress.errors.push({ page, error: error.message, timestamp: new Date().toISOString() });
        saveProgress();
        
        // Se tiver muitos erros seguidos, parar
        const recentErrors = progress.errors.filter(e => {
          const errorTime = new Date(e.timestamp);
          const now = new Date();
          return (now - errorTime) < 60000; // Últimos 60 segundos
        });
        
        if (recentErrors.length >= 5) {
          console.log('\n❌ Muitos erros consecutivos. Parando o script.');
          console.log('💾 Progresso salvo. Execute novamente para continuar.\n');
          break;
        }
        
        // Aumentar delay após erro
        await delay(DELAY_BETWEEN_REQUESTS * 2);
      }
    }

    // Salvar arquivo final consolidado
    console.log('\n💾 Salvando arquivo consolidado...');
    
    const consolidatedData = {
      metadata: {
        extractedAt: new Date().toISOString(),
        totalPages: progress.totalPages,
        pagesCollected: progress.lastPage,
        totalItems: progress.items.length,
        errors: progress.errors.length
      },
      items: progress.items
    };
    
    fs.writeFileSync(CONSOLIDATED_FILE, JSON.stringify(consolidatedData, null, 2), 'utf8');
    saveProgress();
    
    console.log('\n✨ Busca concluída!');
    console.log(`📊 Resumo:`);
    console.log(`   • Páginas coletadas: ${progress.lastPage} de ${progress.totalPages}`);
    console.log(`   • Total de itens: ${progress.items.length}`);
    console.log(`   • Erros: ${progress.errors.length}`);
    console.log(`\n📁 Arquivos salvos:`);
    console.log(`   • Progresso: ${PROGRESS_FILE}`);
    console.log(`   • Dados consolidados: ${CONSOLIDATED_FILE}`);
    
  } catch (error) {
    console.error('\n❌ Erro fatal:', error.message);
    console.log('💾 Progresso salvo. Execute novamente para continuar.\n');
    saveProgress();
    process.exit(1);
  }
}

// Executar
fetchAllPages();
