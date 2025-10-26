"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Analytics {
  total: number
  last24h: number
  humanAccess: number
  botAccess: number
  lastReset: string
  hourlyStats: Record<string, number>
  topPaths: [string, number][]
  topReferers: [string, number][]
  recentLogs: Array<{
    timestamp: string
    path: string
    userAgent: string
    ip: string
    referer: string
    query: string
  }>
}

export default function StatsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/s7k2m9p4')
      
      if (response.status === 403) {
        setError('IP não autorizado')
        setLoading(false)
        return
      }
      
      const result = await response.json()
      
      if (result.success) {
        setAnalytics(result.data)
        setError('')
      } else {
        setError('Erro ao carregar dados')
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  const resetAnalytics = async () => {
    if (!confirm('Resetar todos os dados?')) return
    
    try {
      const response = await fetch('/api/s7k2m9p4', { method: 'DELETE' })
      const result = await response.json()
      
      if (result.success) {
        alert('Dados resetados!')
        loadAnalytics()
      }
    } catch (error) {
      console.error('Erro ao resetar:', error)
    }
  }

  useEffect(() => {
    loadAnalytics()
    
    // Auto-refresh a cada 10 segundos
    const interval = setInterval(loadAnalytics, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Sem dados</div>
      </div>
    )
  }

  const botPercentage = analytics.last24h > 0 ? (analytics.botAccess / analytics.last24h * 100).toFixed(1) : 0
  const humanPercentage = analytics.last24h > 0 ? (analytics.humanAccess / analytics.last24h * 100).toFixed(1) : 0

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">📊 Stats</h1>
          <div className="flex gap-4">
            <button
              onClick={loadAnalytics}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              🔄
            </button>
            <button
              onClick={resetAnalytics}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              🗑️
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              ←
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Total</div>
            <div className="text-2xl font-bold text-blue-400">{analytics.total.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">24h</div>
            <div className="text-2xl font-bold text-green-400">{analytics.last24h.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Humanos</div>
            <div className="text-2xl font-bold text-purple-400">{analytics.humanAccess}</div>
            <div className="text-xs text-gray-500">{humanPercentage}%</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-xs mb-1">Bots</div>
            <div className="text-2xl font-bold text-orange-400">{analytics.botAccess}</div>
            <div className="text-xs text-gray-500">{botPercentage}%</div>
          </div>
        </div>

        {/* Gráfico de Acessos por Hora */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-bold mb-3">📈 Por Hora (24h)</h2>
          <div className="space-y-1">
            {Object.entries(analytics.hourlyStats)
              .sort(([a], [b]) => a.localeCompare(b))
              .slice(-12) // Últimas 12 horas
              .map(([hour, count]) => {
                const maxCount = Math.max(...Object.values(analytics.hourlyStats))
                const percentage = (count / maxCount) * 100
                
                return (
                  <div key={hour} className="flex items-center gap-2">
                    <div className="text-xs text-gray-400 w-24">{new Date(hour).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs font-bold w-10 text-right">{count}</div>
                  </div>
                )
              })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Top Paths */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3">🔥 Top Paths</h2>
            <div className="space-y-1">
              {analytics.topPaths.slice(0, 10).map(([path, count], index) => {
                const maxCount = analytics.topPaths[0][1]
                const percentage = (count / maxCount) * 100
                
                return (
                  <div key={path} className="flex items-center gap-2">
                    <div className="text-xs text-gray-400 w-6">#{index + 1}</div>
                    <div className="text-xs font-mono flex-1 truncate">{path}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-green-500 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs font-bold w-12 text-right">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Referers */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-lg font-bold mb-3">🔗 Origens</h2>
            <div className="space-y-1">
              {analytics.topReferers.map(([referer, count], index) => {
                const maxCount = analytics.topReferers[0][1]
                const percentage = (count / maxCount) * 100
                
                return (
                  <div key={referer} className="flex items-center gap-2">
                    <div className="text-xs text-gray-400 w-6">#{index + 1}</div>
                    <div className="text-xs flex-1 truncate">{referer}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-yellow-500 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs font-bold w-12 text-right">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Logs Recentes */}
        <div className="bg-gray-800 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-3">📝 Últimos Acessos</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">Hora</th>
                  <th className="text-left p-2">Path</th>
                  <th className="text-left p-2">IP</th>
                  <th className="text-left p-2">User Agent</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentLogs.slice(0, 50).map((log, index) => {
                  const isBot = /bot|crawler|spider/i.test(log.userAgent)
                  
                  return (
                    <tr key={index} className={`border-b border-gray-700 ${isBot ? 'bg-orange-900/20' : ''}`}>
                      <td className="p-2 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                      </td>
                      <td className="p-2 font-mono text-blue-400">{log.path}</td>
                      <td className="p-2 font-mono text-gray-400">{log.ip}</td>
                      <td className="p-2 truncate max-w-xs" title={log.userAgent}>
                        {isBot && <span className="text-orange-400 mr-1">🤖</span>}
                        {log.userAgent.slice(0, 40)}...
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-xs">
          Reset: {new Date(analytics.lastReset).toLocaleString('pt-BR')} | Auto-refresh: 10s
        </div>
      </div>
    </div>
  )
}
