/**
 * Script para buscar TODAS as páginas de itens de Brainrot da API
 * e consolidar em um único arquivo
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'https://www.eldorado.gg/api/flexibleOffers';
const GAME_ID = '259'; // Steal a Brainrot
const CATEGORY = 'CustomItem';
const PAGE_SIZE = 24;
const OUTPUT_DIR = path.join(__dirname, '..', 'data');
const PROGRESS_FILE = path.join(OUTPUT_DIR, 'brainrot-progress.json');
const CONSOLIDATED_FILE = path.join(OUTPUT_DIR, 'brainrot-all-pages.json');
const DELAY_BETWEEN_REQUESTS = 1000; // 1 segundo entre requisições

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
 * Faz requisição GET para a API
 */
function fetchPage(pageIndex) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}?gameId=${GAME_ID}&category=${CATEGORY}&usePerGameScore=false&pageIndex=${pageIndex}&pageSize=${PAGE_SIZE}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(new Error(`Erro ao parsear JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Aguarda um tempo em milissegundos
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Salvar progresso
 */
function saveProgress() {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
}

/**
 * Busca todas as páginas
 */
async function fetchAllPages(maxPages = null) {
  console.log('🚀 Iniciando busca de todas as páginas...\n');
  
  // Se não temos o total de páginas, buscar a primeira página
  if (progress.totalPages === 0) {
    console.log('📥 Buscando página 1 para descobrir total...');
    const firstPage = await fetchPage(1);
    
    progress.totalPages = maxPages || firstPage.totalPages;
    progress.lastPage = 1;
    
    if (firstPage.results && Array.isArray(firstPage.results)) {
      progress.items.push(...firstPage.results);
    }
    
    saveProgress();
    
    console.log(`✅ Primeira página carregada!`);
    console.log(`📊 Total de páginas disponíveis: ${firstPage.totalPages}`);
    console.log(`📦 Total de registros: ${firstPage.recordCount}`);
    console.log(`🎯 Páginas a buscar: ${progress.totalPages}\n`);
    
    await sleep(DELAY_BETWEEN_REQUESTS);
  }
  
  // Continuar de onde parou
  const startPage = progress.lastPage + 1;
  
  // Buscar páginas restantes
  for (let page = startPage; page <= progress.totalPages; page++) {
    try {
      console.log(`📥 Buscando página ${page}/${progress.totalPages}...`);
      
      const pageData = await fetchPage(page);
      
      if (pageData.results && Array.isArray(pageData.results)) {
        progress.items.push(...pageData.results);
        progress.lastPage = page;
        
        // Salvar progresso a cada 10 páginas
        if (page % 10 === 0) {
          saveProgress();
          console.log(`   💾 Progresso salvo! Total de itens: ${progress.items.length}`);
        } else {
          console.log(`   ✅ ${pageData.results.length} itens adicionados (Total: ${progress.items.length})`);
        }
      }
      
      // Aguardar antes da próxima requisição
      if (page < progress.totalPages) {
        await sleep(DELAY_BETWEEN_REQUESTS);
      }
    } catch (error) {
      console.error(`   ❌ Erro na página ${page}:`, error.message);
      progress.errors.push({
        page,
        error: error.message,
        timestamp: new Date().toISOString()
      });
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
      await sleep(DELAY_BETWEEN_REQUESTS * 2);
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
      errors: progress.errors.length,
      gameId: GAME_ID,
      category: CATEGORY
    },
    items: progress.items
  };
  
  fs.writeFileSync(CONSOLIDATED_FILE, JSON.stringify(consolidatedData, null, 2), 'utf8');
  saveProgress();
  
  console.log('\n✨ Busca concluída!');
  console.log(`� Resumo:`);
  console.log(`   • Páginas coletadas: ${progress.lastPage} de ${progress.totalPages}`);
  console.log(`   • Total de itens: ${progress.items.length}`);
  console.log(`   • Erros: ${progress.errors.length}`);
  console.log(`\n📁 Arquivos salvos:`);
  console.log(`   • Progresso: ${PROGRESS_FILE}`);
  console.log(`   • Dados consolidados: ${CONSOLIDATED_FILE}`);
  
  return consolidatedData;
}

// Executar
const args = process.argv.slice(2);
const maxPages = args[0] ? parseInt(args[0]) : null;

if (maxPages) {
  console.log(`⚠️  Limitando busca a ${maxPages} páginas\n`);
}

fetchAllPages(maxPages)
  .then(() => {
    console.log('\n🎉 Processo finalizado com sucesso!');
    console.log('💡 Agora execute: node scripts/extract-brainrot-items.js');
  })
  .catch(error => {
    console.error('\n❌ Erro fatal:', error.message);
    process.exit(1);
  });
