// Sistema simples de armazenamento de pedidos em memória
// Em produção, isso deveria ser um banco de dados

import { TrackingParameters } from '../hooks/useTrackingParams'

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
  },

  // Buscar pedido por orderId ou transactionId
  getOrder: (id: string): OrderData | null => {
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
    const order = orderStorage.get(id)
    if (order) {
      order.status = status
      orderStorage.set(id, order)
      
      // Se tiver transactionId, também atualizar
      if (order.transactionId) {
        orderStorage.set(order.transactionId, order)
      }
      
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
    //console.log("[v0] Order Storage - Cleared all orders")
  }
}

export type { OrderData }
