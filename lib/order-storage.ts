// Sistema de armazenamento de pedidos com persistência em arquivo
// Usa arquivo JSON em desenvolvimento e memória em produção (Netlify)

import { TrackingParameters } from '../hooks/useTrackingParams'
import fs from 'fs'
import path from 'path'

interface OrderData {
  orderId: string
  transactionId?: string
  amount: number
  customerData: {
    name: string
    email: string
    phone: string
    document: string
  }
  trackingParameters: TrackingParameters
  productName?: string // Nome do produto (ex: "100 Diamantes", "eBook eSport Digital")
  gateway?: string // Gateway usado para gerar o PIX (ex: "ghostpay", "ezzpag", "umbrela")
  createdAt: string
  status: 'pending' | 'paid' | 'cancelled' | 'failed'
  paidAt?: string
  utmifySent?: boolean // Flag para evitar duplicação de conversões
  utmifyPaidSent?: boolean // Flag específica para status paid
}

// Armazenamento em memória (temporário)
const orderStorage = new Map<string, OrderData>()

// Caminho do arquivo de storage (apenas em desenvolvimento)
const STORAGE_FILE = path.join(process.cwd(), '.order-storage.json')

// Cache para evitar recarregar arquivo muito frequentemente
let lastLoadTime = 0
const LOAD_CACHE_MS = 1000 // Recarregar no máximo a cada 1 segundo

// Função para carregar dados do arquivo
function loadFromFile(): void {
  // Apenas em desenvolvimento (Node.js)
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
    const now = Date.now()
    
    // Se carregou recentemente, não recarregar
    if (now - lastLoadTime < LOAD_CACHE_MS) {
      return
    }
    
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const data = fs.readFileSync(STORAGE_FILE, 'utf-8')
        const orders: Array<[string, OrderData]> = JSON.parse(data)
        
        // Limpar storage antes de recarregar
        orderStorage.clear()
        orders.forEach(([key, value]) => orderStorage.set(key, value))
        
        lastLoadTime = now
        console.log('[STORAGE] 📂 Carregados', orderStorage.size, 'pedidos do arquivo')
      }
    } catch (error) {
      console.error('[STORAGE] ❌ Erro ao carregar arquivo:', error)
    }
  }
}

// Função para salvar dados no arquivo
function saveToFile(): void {
  // Apenas em desenvolvimento (Node.js)
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
    try {
      const orders = Array.from(orderStorage.entries())
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(orders, null, 2), 'utf-8')
    } catch (error) {
      console.error('[STORAGE] ❌ Erro ao salvar arquivo:', error)
    }
  }
}

// Carregar dados ao inicializar o módulo
loadFromFile()

export const orderStorageService = {
  // Salvar pedido
  saveOrder: (orderData: OrderData) => {
    console.log("[STORAGE] 💾 Salvando pedido:", orderData.orderId)
    console.log("[STORAGE] 🔑 TransactionId:", orderData.transactionId)
    orderStorage.set(orderData.orderId, orderData)
    
    // Se tiver transactionId, também indexar por ele
    if (orderData.transactionId) {
      orderStorage.set(orderData.transactionId, orderData)
      console.log("[STORAGE] ✅ Indexado por transactionId também")
    }
    
    console.log("[STORAGE] 📊 Total de pedidos no storage:", orderStorage.size)
    
    // Limpar pedidos antigos (mais de 24 horas)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    for (const [key, order] of orderStorage.entries()) {
      if (order.createdAt < oneDayAgo) {
        orderStorage.delete(key)
        console.log("[STORAGE] 🗑️ Pedido antigo removido:", key)
      }
    }
    
    // Persistir em arquivo
    saveToFile()
  },

  // Buscar pedido por orderId ou transactionId
  getOrder: (id: string): OrderData | null => {
    // Recarregar do arquivo antes de buscar (garante dados atualizados)
    loadFromFile()
    
    console.log("[STORAGE] 🔍 Buscando pedido:", id)
    console.log("[STORAGE] 📊 Total no storage:", orderStorage.size)
    const order = orderStorage.get(id)
    if (order) {
      console.log("[STORAGE] ✅ Pedido encontrado:", order.orderId)
      return order
    }
    console.log("[STORAGE] ❌ Pedido NÃO encontrado")
    console.log("[STORAGE] 🗂️ IDs disponíveis:", Array.from(orderStorage.keys()).slice(0, 5))
    return null
  },

  // Atualizar status do pedido
  updateOrderStatus: (id: string, status: OrderData['status']) => {
    loadFromFile()
    
    const order = orderStorage.get(id)
    if (order) {
      order.status = status
      orderStorage.set(id, order)
      
      // Se tiver transactionId, também atualizar
      if (order.transactionId) {
        orderStorage.set(order.transactionId, order)
      }
      
      // Persistir em arquivo
      saveToFile()
      
      //console.log("[v0] Order Storage - Status updated:", order.orderId, status)
      return true
    }
    return false
  },

  // Listar todos os pedidos (para debug)
  getAllOrders: (): OrderData[] => {
    const orders = Array.from(orderStorage.values())
    // Remover duplicatas (quando indexado por orderId e transactionId)
    const uniqueOrders = orders.filter((order, index, self) => 
      index === self.findIndex(o => o.orderId === order.orderId)
    )
    return uniqueOrders
  },

  // Limpar armazenamento
  clear: () => {
    orderStorage.clear()
    saveToFile()
    //console.log("[v0] Order Storage - Cleared all orders")
  }
}

export type { OrderData }
