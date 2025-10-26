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
  recentLogs: Array<{
    timestamp: string
    path: string
    userAgent: string
    ip: string
    referer: string
    query: string
  }>
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  // Senha simples (trocar por algo mais seguro em produção)
  const ANALYTICS_PASSWORD = 'admin123'

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      const result = await response.json()
      
      if (result.success) {
        setAnalytics(result.data)
      }
    } catch (error) {
      console.error('Erro ao carregar analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetAnalytics = async () => {
    if (!confirm('Tem certeza que deseja resetar todos os dados?')) return
    
    try {
      const response = await fetch('/api/analytics', { method: 'DELETE' })
      const result = await response.json()
      
      if (result.success) {
        alert('Analytics resetado com sucesso!')
        loadAnalytics()
      }
    } catch (error) {
      console.error('Erro ao resetar:', error)
    }
  }

  useEffect(() => {
    if (authenticated) {
      loadAnalytics()
      
      // Auto-refresh a cada 10 segundos
      const interval = setInterval(loadAnalytics, 10000)
      return () => clearInterval(interval)
    }
  }, [authenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ANALYTICS_PASSWORD) {
      setAuthenticated(true)
    } else {
      alert('Senha incorreta!')
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">🔒 Analytics Dashboard</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite a senha"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Erro ao carregar dados</div>
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
          <h1 className="text-3xl font-bold">📊 Analytics Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={loadAnalytics}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Atualizar
            </button>
            <button
              onClick={resetAnalytics}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              🗑️ Resetar
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
            >
              ← Voltar
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Total de Acessos</div>
            <div className="text-3xl font-bold text-blue-400">{analytics.total.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Últimas 24h</div>
            <div className="text-3xl font-bold text-green-400">{analytics.last24h.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Acessos Humanos</div>
            <div className="text-3xl font-bold text-purple-400">{analytics.humanAccess}</div>
            <div className="text-sm text-gray-500">{humanPercentage}%</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm mb-2">Bots Detectados</div>
            <div className="text-3xl font-bold text-orange-400">{analytics.botAccess}</div>
            <div className="text-sm text-gray-500">{botPercentage}%</div>
          </div>
        </div>

        {/* Gráfico de Acessos por Hora */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">📈 Acessos por Hora (Últimas 24h)</h2>
          <div className="space-y-2">
            {Object.entries(analytics.hourlyStats)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([hour, count]) => {
                const maxCount = Math.max(...Object.values(analytics.hourlyStats))
                const percentage = (count / maxCount) * 100
                
                return (
                  <div key={hour} className="flex items-center gap-4">
                    <div className="text-sm text-gray-400 w-32">{new Date(hour).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</div>
                    <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm font-bold w-12 text-right">{count}</div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Top Paths */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">🔥 Páginas Mais Acessadas</h2>
          <div className="space-y-2">
            {analytics.topPaths.map(([path, count], index) => {
              const maxCount = analytics.topPaths[0][1]
              const percentage = (count / maxCount) * 100
              
              return (
                <div key={path} className="flex items-center gap-4">
                  <div className="text-sm text-gray-400 w-8">#{index + 1}</div>
                  <div className="text-sm font-mono flex-1 truncate">{path}</div>
                  <div className="flex-1 bg-gray-700 rounded-full h-6 overflow-hidden">
                    <div 
                      className="bg-green-500 h-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-sm font-bold w-16 text-right">{count}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Logs Recentes */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">📝 Acessos Recentes (Últimos 50)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">Horário</th>
                  <th className="text-left p-2">Path</th>
                  <th className="text-left p-2">IP</th>
                  <th className="text-left p-2">User Agent</th>
                  <th className="text-left p-2">Referer</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentLogs.map((log, index) => {
                  const isBot = /bot|crawler|spider/i.test(log.userAgent)
                  
                  return (
                    <tr key={index} className={`border-b border-gray-700 ${isBot ? 'bg-orange-900/20' : ''}`}>
                      <td className="p-2 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-2 font-mono text-blue-400">{log.path}</td>
                      <td className="p-2 font-mono text-gray-400">{log.ip}</td>
                      <td className="p-2 truncate max-w-xs" title={log.userAgent}>
                        {isBot && <span className="text-orange-400 mr-2">🤖</span>}
                        {log.userAgent.slice(0, 50)}...
                      </td>
                      <td className="p-2 truncate max-w-xs text-gray-500">{log.referer || '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Último reset: {new Date(analytics.lastReset).toLocaleString('pt-BR')} | Auto-refresh a cada 10s
        </div>
      </div>
    </div>
  )
}
