/**
 * Script para aplicar desconto de 45% em itens acima de R$ 50
 */

const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, '..', 'data', 'brainrot-items.json');
const DISCOUNT_PERCENTAGE = 45; // 45% de desconto
const MIN_PRICE = 50; // Preço mínimo para aplicar desconto

console.log('💰 Aplicando desconto de 45% em itens acima de R$ 50...\n');

// Ler arquivo
const rawData = fs.readFileSync(INPUT_FILE, 'utf8');
const data = JSON.parse(rawData);

let itemsWithDiscount = 0;
let totalSaved = 0;

// Aplicar desconto
data.items = data.items.map(item => {
  if (item.priceAmount > MIN_PRICE) {
    const originalPrice = item.priceAmount;
    const discountAmount = originalPrice * (DISCOUNT_PERCENTAGE / 100);
    const newPrice = originalPrice - discountAmount;
    
    // Atualizar preços
    item.originalPrice = originalPrice;
    item.priceAmount = newPrice;
    item.discountPercentage = DISCOUNT_PERCENTAGE;
    item.hasDiscount = true;
    
    // Atualizar preço em USD proporcionalmente
    if (item.priceUSD > 0) {
      const usdDiscountAmount = item.priceUSD * (DISCOUNT_PERCENTAGE / 100);
      item.originalPriceUSD = item.priceUSD;
      item.priceUSD = item.priceUSD - usdDiscountAmount;
    }
    
    itemsWithDiscount++;
    totalSaved += discountAmount;
    
    console.log(`✅ ${item.title}`);
    console.log(`   De: R$ ${originalPrice.toFixed(2)} → Por: R$ ${newPrice.toFixed(2)} (Economia: R$ ${discountAmount.toFixed(2)})`);
  } else {
    item.hasDiscount = false;
  }
  
  return item;
});

// Atualizar estatísticas de preço
data.statistics.priceRange = {
  min: Math.min(...data.items.map(i => i.priceAmount)),
  max: Math.max(...data.items.map(i => i.priceAmount)),
  minUSD: Math.min(...data.items.map(i => i.priceUSD)),
  maxUSD: Math.max(...data.items.map(i => i.priceUSD))
};

// Adicionar metadata do desconto
data.metadata.discountApplied = {
  date: new Date().toISOString(),
  percentage: DISCOUNT_PERCENTAGE,
  minPrice: MIN_PRICE,
  itemsAffected: itemsWithDiscount,
  totalSaved: totalSaved
};

// Salvar arquivo atualizado
fs.writeFileSync(INPUT_FILE, JSON.stringify(data, null, 2), 'utf8');

console.log('\n✨ Desconto aplicado com sucesso!');
console.log(`📊 Resumo:`);
console.log(`   • Itens com desconto: ${itemsWithDiscount} de ${data.items.length}`);
console.log(`   • Economia total: R$ ${totalSaved.toFixed(2)}`);
console.log(`   • Desconto aplicado: ${DISCOUNT_PERCENTAGE}%`);
console.log(`   • Novo range de preços: R$ ${data.statistics.priceRange.min.toFixed(2)} - R$ ${data.statistics.priceRange.max.toFixed(2)}`);
console.log(`\n📁 Arquivo atualizado: ${INPUT_FILE}`);
