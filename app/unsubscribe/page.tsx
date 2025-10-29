"use client"

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Mail, Check } from 'lucide-react'

export default function UnsubscribePage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [unsubscribed, setUnsubscribed] = useState(false)

  const handleUnsubscribe = () => {
    // Aqui você pode integrar com sua API para remover o email
    console.log('Email removido:', email)
    setUnsubscribed(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #13141F 0%, #191A23 76.1%, #1E1F2A 100%)' }}>
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 text-center">
          {!unsubscribed ? (
            <>
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-red-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Cancelar Inscrição
              </h1>
              
              <p className="text-slate-300 mb-6">
                Tem certeza que deseja cancelar a inscrição da newsletter?
              </p>
              
              {email && (
                <p className="text-slate-400 text-sm mb-6">
                  Email: <strong className="text-white">{email}</strong>
                </p>
              )}
              
              <div className="flex gap-4">
                <button
                  onClick={handleUnsubscribe}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
                >
                  Sim, cancelar
                </button>
                <a
                  href="/"
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors text-center"
                >
                  Voltar
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                Inscrição Cancelada
              </h1>
              
              <p className="text-slate-300 mb-6">
                Você foi removido da nossa lista de emails com sucesso.
              </p>
              
              <a
                href="/"
                className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-bold rounded-lg transition-all"
              >
                Voltar para o site
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
