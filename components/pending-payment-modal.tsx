"use client"

import React from "react"

interface PendingPaymentModalProps {
  isOpen: boolean
  onContinue: () => void
  onStartNew: () => void
}

export default function PendingPaymentModal({ isOpen, onContinue, onStartNew }: PendingPaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header com gradiente vermelho FF */}
        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 p-6 border-b border-red-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Pagamento Pendente</h3>
                <p className="text-sm text-gray-400">Você tem um pagamento em andamento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-4">
          <p className="text-gray-300 text-center">
            Detectamos que você tem um pagamento PIX pendente. Deseja continuar de onde parou?
          </p>

          {/* Botões */}
          <div className="space-y-3 pt-4">
            {/* Botão Continuar - Vermelho FF */}
            <button
              onClick={onContinue}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50"
            >
              ✅ Sim, continuar pagamento
            </button>

            {/* Botão Novo Pagamento */}
            <button
              onClick={onStartNew}
              className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300 border border-gray-700"
            >
              🔄 Não, fazer nova recarga
            </button>
          </div>

          {/* Info adicional */}
          <p className="text-xs text-gray-500 text-center pt-2">
            O QR Code anterior ainda está válido se não expirou
          </p>
        </div>
      </div>
    </div>
  )
}
