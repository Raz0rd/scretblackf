/**
 * Script para extrair e formatar itens de Brainrot do JSON da API
 * Extrai: título, imagem, preço, M/s, mutações, descrição
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '..', 'brainroots.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'brainrot-items.json');
const IMAGE_BASE_URL = 'https://assetsdelivery.eldorado.gg/v7/_offers-v2_/';

// Criar diretório data se não existir
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Extrai informações relevantes de um item
 */
function extractItemData(result) {
  const offer = result.offer;
  const user = result.user;
  const userOrderInfo = result.userOrderInfo;
  
  // Extrair tipo de item
  const tipoItem = offer.tradeEnvironmentValues.find(v => v.name === 'Tipo de item');
  
  // Extrair raridade
  const raridade = offer.tradeEnvironmentValues.find(v => v.name === 'Raridade');
  
  // Extrair nome do brainrot
  const brainrotName = offer.tradeEnvironmentValues.find(v => v.name === 'Brainrot');
  
  // Extrair M/s
  const msAttribute = offer.offerAttributeIdValues.find(v => v.name === 'M/s');
  
  // Extrair mutações
  const mutationsAttribute = offer.offerAttributeIdValues.find(v => v.name === 'Mutations');
  
  // Construir URL da imagem
  const imageUrl = offer.mainOfferImage.originalSizeImage 
    ? `${IMAGE_BASE_URL}${offer.mainOfferImage.originalSizeImage}`
    : null;
  
  // Extrair valor numérico de M/s para ordenação
  const msValue = msAttribute?.value || '0';
  let msNumeric = 0;
  if (msValue.includes('-')) {
    // Pegar o valor máximo do range (ex: "0-24 M/s" -> 24)
    const parts = msValue.split('-');
    msNumeric = parseFloat(parts[1]) || 0;
  } else if (msValue !== '0') {
    msNumeric = parseFloat(msValue) || 0;
  }
  
  return {
    // Identificação
    id: offer.id,
    
    // Títulos
    title: offer.offerTitle,
    titleOriginal: offer.offerTitleOriginal,
    
    // Filtros principais
    itemType: tipoItem?.value || 'Brainrot',
    rarity: raridade?.value || 'Desconhecido',
    brainrotName: brainrotName?.value || 'Outro',
    ms: msAttribute?.value || '0',
    msNumeric: msNumeric, // Para ordenação
    mutations: mutationsAttribute?.value || 'Nenhum',
    hasMutation: mutationsAttribute?.value !== 'Nenhum',
    
    // IDs dos filtros (para facilitar busca)
    itemTypeId: tipoItem?.id || null,
    rarityId: raridade?.id || null,
    brainrotId: brainrotName?.id || null,
    msId: msAttribute?.id || null,
    mutationsId: mutationsAttribute?.id || null,
    
    // Preço
    priceAmount: offer.pricePerUnit.amount,
    priceCurrency: offer.pricePerUnit.currency,
    priceUSD: offer.pricePerUnitInUSD?.amount || 0,
    
    // Imagens
    imageUrl: imageUrl,
    imageSmall: offer.mainOfferImage.smallImage,
    imageLarge: offer.mainOfferImage.largeImage,
    imageOriginal: offer.mainOfferImage.originalSizeImage,
    
    // Descrição
    description: offer.description,
    
    // Estoque e disponibilidade
    quantity: offer.quantity,
    isTrending: offer.isTrending,
    deliveryTime: offer.guaranteedDeliveryTime,
    
    // Informações do vendedor
    seller: {
      id: user.id,
      username: user.username,
      isVerified: user.isVerifiedSeller,
      feedbackScore: userOrderInfo.feedbackScore,
      positiveCount: userOrderInfo.positiveCount,
      negativeCount: userOrderInfo.negativeCount,
      ratingCount: userOrderInfo.ratingCount
    },
    
    // Data de expiração
    expireDate: offer.expireDate,
    
    // Todos os atributos (para referência)
    allAttributes: offer.offerAttributeIdValues,
    allEnvironmentValues: offer.tradeEnvironmentValues
  };
}

/**
 * Processa o arquivo JSON
 */
function processJSON() {
  console.log('📖 Lendo arquivo JSON...');
  
  // Ler arquivo
  const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
  const data = JSON.parse(rawData);
  
  console.log(`✅ Arquivo lido com sucesso!`);
  console.log(`📊 Total de páginas: ${data.totalPages}`);
  console.log(`📦 Total de registros: ${data.recordCount}`);
  console.log(`📄 Itens nesta página: ${data.results.length}`);
  
  // Extrair dados de cada item
  const extractedItems = data.results.map(result => extractItemData(result));
  
  // Coletar valores únicos para cada filtro
  const uniqueItemTypes = new Set();
  const uniqueRarities = new Set();
  const uniqueBrainrots = new Set();
  const uniqueMs = new Set();
  const uniqueMutations = new Set();
  
  const statsByRarity = {};
  const statsByBrainrot = {};
  const statsByMs = {};
  const statsByMutation = {};
  
  extractedItems.forEach(item => {
    // Coletar valores únicos
    uniqueItemTypes.add(item.itemType);
    uniqueRarities.add(item.rarity);
    uniqueBrainrots.add(item.brainrotName);
    uniqueMs.add(item.ms);
    uniqueMutations.add(item.mutations);
    
    // Contar por categoria
    statsByRarity[item.rarity] = (statsByRarity[item.rarity] || 0) + 1;
    statsByBrainrot[item.brainrotName] = (statsByBrainrot[item.brainrotName] || 0) + 1;
    statsByMs[item.ms] = (statsByMs[item.ms] || 0) + 1;
    statsByMutation[item.mutations] = (statsByMutation[item.mutations] || 0) + 1;
  });
  
  // Estatísticas
  const stats = {
    totalItems: extractedItems.length,
    byRarity: statsByRarity,
    byBrainrot: statsByBrainrot,
    byMs: statsByMs,
    byMutation: statsByMutation,
    priceRange: {
      min: Math.min(...extractedItems.map(i => i.priceAmount)),
      max: Math.max(...extractedItems.map(i => i.priceAmount)),
      minUSD: Math.min(...extractedItems.map(i => i.priceUSD)),
      maxUSD: Math.max(...extractedItems.map(i => i.priceUSD))
    }
  };
  
  // Opções de filtros disponíveis
  const filterOptions = {
    itemTypes: Array.from(uniqueItemTypes).sort(),
    rarities: Array.from(uniqueRarities).sort(),
    brainrots: Array.from(uniqueBrainrots).sort(),
    msRanges: Array.from(uniqueMs).sort((a, b) => {
      // Ordenar por valor numérico
      const getMax = (str) => {
        if (str === '0') return 0;
        const parts = str.split('-');
        return parseFloat(parts[parts.length - 1]) || 0;
      };
      return getMax(a) - getMax(b);
    }),
    mutations: Array.from(uniqueMutations).sort()
  };
  
  // Preparar output
  const output = {
    metadata: {
      extractedAt: new Date().toISOString(),
      pageIndex: data.pageIndex,
      totalPages: data.totalPages,
      recordCount: data.recordCount,
      pageSize: data.pageSize,
      imageBaseUrl: IMAGE_BASE_URL
    },
    filterOptions: filterOptions,
    statistics: stats,
    items: extractedItems
  };
  
  // Salvar arquivo
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
  
  console.log('\n✨ Extração concluída!');
  console.log(`📁 Arquivo salvo em: ${OUTPUT_FILE}`);
  console.log('\n📊 Estatísticas:');
  console.log(`   • Total de itens: ${stats.totalItems}`);
  
  console.log(`\n   🎯 Filtros disponíveis:`);
  console.log(`   • Tipos de item: ${filterOptions.itemTypes.length}`);
  console.log(`   • Raridades: ${filterOptions.rarities.length} (${filterOptions.rarities.join(', ')})`);
  console.log(`   • Brainrots únicos: ${filterOptions.brainrots.length}`);
  console.log(`   • Ranges de M/s: ${filterOptions.msRanges.length}`);
  console.log(`   • Tipos de mutação: ${filterOptions.mutations.length} (${filterOptions.mutations.join(', ')})`);
  
  console.log(`\n   📈 Por raridade:`);
  Object.entries(stats.byRarity).sort((a, b) => b[1] - a[1]).forEach(([rarity, count]) => {
    console.log(`     - ${rarity}: ${count}`);
  });
  
  console.log(`\n   🧬 Por mutação:`);
  Object.entries(stats.byMutation).forEach(([mutation, count]) => {
    console.log(`     - ${mutation}: ${count}`);
  });
  
  console.log(`\n   💰 Preços:`);
  console.log(`     - BRL: R$ ${stats.priceRange.min.toFixed(2)} - R$ ${stats.priceRange.max.toFixed(2)}`);
  console.log(`     - USD: $ ${stats.priceRange.minUSD.toFixed(2)} - $ ${stats.priceRange.maxUSD.toFixed(2)}`);
  
  // Mostrar alguns exemplos
  console.log('\n🎯 Exemplos de itens extraídos:');
  extractedItems.slice(0, 3).forEach((item, index) => {
    console.log(`\n${index + 1}. ${item.title}`);
    console.log(`   • Brainrot: ${item.brainrotName}`);
    console.log(`   • Raridade: ${item.rarity}`);
    console.log(`   • M/s: ${item.ms}`);
    console.log(`   • Mutação: ${item.mutations}`);
    console.log(`   • Preço: R$ ${item.priceAmount.toFixed(2)}`);
    console.log(`   • Vendedor: ${item.seller.username} (${item.seller.feedbackScore.toFixed(2)}%)`);
    console.log(`   • Imagem: ${item.imageUrl}`);
  });
}

// Executar
try {
  processJSON();
} catch (error) {
  console.error('❌ Erro ao processar JSON:', error.message);
  process.exit(1);
}
