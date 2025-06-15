'use client'

import { useEffect, useState } from 'react'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured'
  message: string
  responseTime: string
  checks: {
    timestamp: string
    environment: Record<string, boolean | string>
    nextjs: {
      status: string
      version: string
      mode: string
    }
    database: {
      status: string
      error: string | null
    }
    auth: {
      status: string
      error: string | null
    }
  }
  template: {
    name: string
    version: string
    phase: string
  }
}

export default function HealthPage() {
  const [health, setHealth] = useState<HealthCheck | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealth(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Health check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'unhealthy':
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'not_configured':
      case 'unknown':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'ok':
        return '✅'
      case 'degraded':
        return '⚠️'
      case 'unhealthy':
      case 'error':
        return '❌'
      case 'not_configured':
      case 'unknown':
        return '🔧'
      default:
        return '❓'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">システム状況を確認中...</p>
        </div>
      </div>
    )
  }

  if (!health) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">ヘルスチェックの取得に失敗しました</p>
          <button 
            onClick={fetchHealth}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            再試行
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">システム状況</h1>
            <button
              onClick={fetchHealth}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🔄 更新
            </button>
          </div>

          {/* 全体ステータス */}
          <div className={`p-4 rounded-lg border mb-6 ${getStatusColor(health.status)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold flex items-center">
                  {getStatusIcon(health.status)} 全体ステータス: {health.status.toUpperCase()}
                </h2>
                <p className="text-sm mt-1">{health.message}</p>
              </div>
              <div className="text-right text-sm">
                <p>応答時間: {health.responseTime}</p>
                {lastUpdate && (
                  <p>更新: {lastUpdate.toLocaleTimeString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* テンプレート情報 */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">🏗️ テンプレート情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>名前:</strong> {health.template.name}
              </div>
              <div>
                <strong>バージョン:</strong> {health.template.version}
              </div>
              <div>
                <strong>フェーズ:</strong> {health.template.phase}
              </div>
            </div>
          </div>

          {/* 詳細チェック */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">詳細チェック</h3>

            {/* Next.js */}
            <div className={`p-4 rounded-lg border ${getStatusColor(health.checks.nextjs.status)}`}>
              <h4 className="font-semibold flex items-center">
                {getStatusIcon(health.checks.nextjs.status)} Next.js
              </h4>
              <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div><strong>バージョン:</strong> {health.checks.nextjs.version}</div>
                <div><strong>モード:</strong> {health.checks.nextjs.mode}</div>
              </div>
            </div>

            {/* データベース */}
            <div className={`p-4 rounded-lg border ${getStatusColor(health.checks.database.status)}`}>
              <h4 className="font-semibold flex items-center">
                {getStatusIcon(health.checks.database.status)} データベース接続
              </h4>
              {health.checks.database.error && (
                <p className="text-sm mt-2 font-mono bg-white p-2 rounded">
                  {health.checks.database.error}
                </p>
              )}
            </div>

            {/* 認証 */}
            <div className={`p-4 rounded-lg border ${getStatusColor(health.checks.auth.status)}`}>
              <h4 className="font-semibold flex items-center">
                {getStatusIcon(health.checks.auth.status)} 認証サービス
              </h4>
              {health.checks.auth.error && (
                <p className="text-sm mt-2 font-mono bg-white p-2 rounded">
                  {health.checks.auth.error}
                </p>
              )}
            </div>

            {/* 環境変数 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">🔑 環境変数設定状況</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                {Object.entries(health.checks.environment).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-mono">{key}:</span>
                    <span className={value === true ? 'text-green-600' : value === false ? 'text-red-600' : 'text-blue-600'}>
                      {typeof value === 'boolean' ? (value ? '✅ 設定済み' : '❌ 未設定') : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 設定ガイド */}
          {health.status === 'not_configured' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">🔧 設定が必要です</h4>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. <code className="bg-yellow-100 px-1 rounded">.env.example</code> を <code className="bg-yellow-100 px-1 rounded">.env.local</code> にコピー</li>
                <li>2. Supabaseプロジェクトを作成</li>
                <li>3. APIキーを <code className="bg-yellow-100 px-1 rounded">.env.local</code> に設定</li>
                <li>4. 詳細な手順は <code className="bg-yellow-100 px-1 rounded">docs/setup-guide.md</code> を参照</li>
              </ol>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>最終確認: {health.checks.timestamp}</p>
            <p>このページは開発・テスト用です</p>
          </div>
        </div>
      </div>
    </div>
  )
}