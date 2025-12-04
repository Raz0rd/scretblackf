"use client"

import { X } from 'lucide-react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
}

export default function ErrorModal({ isOpen, onClose, title = 'Atenção', message }: ErrorModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <button
          onClick={onClose}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  )
}
