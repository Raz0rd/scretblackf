/**
 * Script completo para atualizar dados dos Brainroots no site
 * Executa: fetch -> process -> atualiza site
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'brainrot-progress.json');
const ALL_PAGES_FILE = path.join(__dirname, '..', 'data', 'brainrot-all-pages.json');
const ITEMS_FILE = path.join(__dirname, '..', 'data', 'brainrot-items.json');

console.log('🚀 Iniciando atualização dos dados de Brainroots...\n');

// Verificar se já tem dados coletados
let needsFetch = true;
if (fs.existsSync(PROGRESS_FILE)) {
  const progress = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  console.log(`📂 Progresso encontrado: ${progress.lastPage}/${progress.totalPages} páginas`);
  console.log(`📦 Itens coletados: ${progress.items.length}\n`);
  
  if (progress.lastPage === progress.totalPages && progress.totalPages > 0) {
    console.log('✅ Coleta completa! Pulando para processamento...\n');
    needsFetch = false;
  }
}

try {
  // Passo 1: Buscar dados (se necessário)
  if (needsFetch) {
    console.log('📥 PASSO 1: Buscando dados da API...');
    console.log('⏳ Isso pode levar alguns minutos...\n');
    
    execSync('node scripts/fetch-all-brainrot-pages.js', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('\n✅ Dados coletados com sucesso!\n');
  }
  
  // Passo 2: Processar dados
  console.log('🔄 PASSO 2: Processando dados e aplicando descontos...\n');
  
  execSync('node scripts/process-brainrot-data.js', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });
  
  console.log('\n✅ Dados processados com sucesso!\n');
  
  // Passo 3: Verificar resultado
  if (fs.existsSync(ITEMS_FILE)) {
    const itemsData = JSON.parse(fs.readFileSync(ITEMS_FILE, 'utf8'));
    
    console.log('═══════════════════════════════════════');
    console.log('✨ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO! ✨');
    console.log('═══════════════════════════════════════\n');
    console.log('📊 Resumo Final:');
    console.log(`   • Total de itens: ${itemsData.items.length}`);
    console.log(`   • Itens com desconto: ${itemsData.metadata.itemsWithDiscount}`);
    console.log(`   • Desconto: ${itemsData.metadata.discountPercentage}% OFF`);
    console.log(`   • Preço mínimo: R$ ${itemsData.metadata.discountMinPrice}\n`);
    console.log('📁 Arquivo atualizado:');
    console.log(`   ${ITEMS_FILE}\n`);
    console.log('🎉 O site já está usando os dados atualizados!');
    console.log('💡 Recarregue a página /loja/brainroots para ver as mudanças.\n');
  }
  
} catch (error) {
  console.error('\n❌ Erro durante a atualização:', error.message);
  console.log('\n💡 Dicas:');
  console.log('   • Verifique sua conexão com a internet');
  console.log('   • A API pode estar bloqueando requisições (erro 403)');
  console.log('   • Execute novamente para continuar de onde parou\n');
  process.exit(1);
}
