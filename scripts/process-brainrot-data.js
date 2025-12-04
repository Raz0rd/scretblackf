/**
 * Script para processar dados brutos do brainrot-all-pages.json
 * e gerar o arquivo brainrot-items.json com descontos aplicados
 */

const fs = require('fs');
const path = require('path');

const PROGRESS_FILE = path.join(__dirname, '..', 'data', 'brainrot-progress.json');
const INPUT_FILE = path.join(__dirname, '..', 'data', 'brainrot-all-pages.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'brainrot-items.json');
const IMAGE_BASE_URL = 'https://assetsdelivery.eldorado.gg/v7/_offers-v2_/';

console.log('🔄 Processando dados dos Brainroots...\n');

// Tentar ler do arquivo de progresso primeiro (dados em tempo real)
let rawData;
let items = [];

if (fs.existsSync(PROGRESS_FILE)) {
  console.log('📂 Lendo dados do arquivo de progresso (tempo real)...');
  rawData = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  items = rawData.items || [];
  console.log(`📊 Progresso: ${rawData.lastPage}/${rawData.totalPages} páginas`);
} else if (fs.existsSync(INPUT_FILE)) {
  console.log('📂 Lendo dados do arquivo consolidado...');
  rawData = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
  items = rawData.items || rawData.results || [];
} else {
  console.error('❌ Nenhum arquivo de dados encontrado!');
  console.log('Execute primeiro: node scripts/fetch-all-brainrot-pages.js');
  process.exit(1);
}

console.log(`📦 Total de itens brutos: ${items.length}`);

// Processar e formatar itens
const processedItems = items.map(item => {
  const offer = item.offer || {};
  const user = item.user || {};
  const userOrderInfo = item.userOrderInfo || {};
  
  // Extrair valores dos atributos
  const tradeEnvValues = offer.tradeEnvironmentValues || [];
  const offerAttrValues = offer.offerAttributeIdValues || [];
  
  // Encontrar raridade
  const rarityObj = tradeEnvValues.find(v => v.name === 'Rarity');
  const rarity = rarityObj?.value || 'Comum';
  
  // Encontrar nome do brainrot
  const brainrotObj = tradeEnvValues.find(v => v.name === 'Brainrot');
  const brainrotName = brainrotObj?.value || offer.offerTitle || '';
  
  // Encontrar MS
  const msObj = offerAttrValues.find(v => v.name === 'M/s');
  let msValue = msObj?.value || '0-24 M/s';
  let msNumeric = 0;
  
  // Se não tiver valor, usar o menor range
  if (!msObj || !msObj.value) {
    msValue = '0-24 M/s';
    msNumeric = 12; // Média do range 0-24
  } else {
    // Extrair números do formato "250-499 M/s" ou "25-49 M/s"
    const numbers = msValue.match(/(\d+)/g);
    if (numbers && numbers.length > 0) {
      // Pegar o primeiro número do range
      msNumeric = parseInt(numbers[0]);
    }
  }
  
  // Encontrar mutações
  const mutationsObj = offerAttrValues.find(v => v.name === 'Mutations');
  const mutations = mutationsObj?.value || 'None';
  
  // Preço
  const price = parseFloat(offer.pricePerUnit?.amount || 0);
  
  // Aplicar desconto de 45% se preço > R$ 50
  let finalPrice = price;
  let originalPrice = null;
  let hasDiscount = false;
  let discountPercentage = 0;
  
  if (price > 50) {
    originalPrice = price;
    finalPrice = price * 0.55; // 45% de desconto
    hasDiscount = true;
    discountPercentage = 45;
  }
  
  // Imagem
  const mainImage = offer.mainOfferImage?.largeImage || offer.mainOfferImage?.originalSizeImage || '';
  const imageUrl = mainImage ? `${IMAGE_BASE_URL}${mainImage}` : '';
  
  return {
    id: offer.id || '',
    title: offer.offerTitle || '',
    brainrotName: brainrotName,
    rarity: rarity,
    ms: msValue,
    msNumeric: msNumeric,
    mutations: mutations,
    hasMutation: mutations !== 'None' && mutations !== 'Nenhuma',
    priceAmount: finalPrice,
    priceCurrency: offer.pricePerUnit?.currency || 'BRL',
    priceUSD: offer.pricePerUnitInUSD?.amount || 0,
    imageUrl: imageUrl,
    description: offer.description || '',
    quantity: offer.quantity || 1,
    isTrending: offer.isTrending || false,
    seller: {
      username: user.username || 'Vendedor',
      isVerified: user.isVerifiedSeller || false,
      feedbackScore: userOrderInfo.feedbackScore || 0
    },
    originalPrice: originalPrice,
    hasDiscount: hasDiscount,
    discountPercentage: discountPercentage
  };
});

console.log(`✅ Itens processados: ${processedItems.length}`);

// Contar itens com desconto
const itemsWithDiscount = processedItems.filter(item => item.hasDiscount);
console.log(`💰 Itens com desconto (45%): ${itemsWithDiscount.length}`);

// Extrair opções únicas para filtros
const rarities = [...new Set(processedItems.map(item => item.rarity))].filter(r => r).sort();
const brainrots = [...new Set(processedItems.map(item => item.brainrotName))].filter(b => b).sort();
const mutations = [...new Set(processedItems.map(item => item.mutations))].filter(m => m && m !== 'Nenhuma' && m !== 'None').sort();
const msRanges = ['0-999 MS', '1000-1999 MS', '2000-2999 MS', '3000+ MS'];

console.log(`🎨 Raridades encontradas: ${rarities.length}`);
console.log(`🧠 Brainrots encontrados: ${brainrots.length}`);
console.log(`🧬 Mutações encontradas: ${mutations.length}`);

// Criar estrutura final
const outputData = {
  metadata: {
    extractedAt: new Date().toISOString(),
    totalPages: rawData.totalPages || rawData.lastPage || 0,
    recordCount: processedItems.length,
    totalItems: processedItems.length,
    itemsWithDiscount: itemsWithDiscount.length,
    discountPercentage: 45,
    discountMinPrice: 50
  },
  filterOptions: {
    rarities: rarities,
    brainrots: brainrots,
    mutations: mutations,
    msRanges: msRanges
  },
  items: processedItems
};

// Salvar arquivo processado
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2), 'utf8');

console.log('\n✨ Processamento concluído!');
console.log(`📁 Arquivo salvo em: ${OUTPUT_FILE}`);
console.log(`\n📊 Estatísticas:`);
console.log(`   • Total de itens: ${processedItems.length}`);
console.log(`   • Itens com desconto: ${itemsWithDiscount.length} (${((itemsWithDiscount.length / processedItems.length) * 100).toFixed(1)}%)`);
console.log(`   • Desconto aplicado: 45% OFF em itens acima de R$ 50`);
console.log(`\n🎉 Dados prontos para uso no site!`);
