import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * ヘルスチェックAPI - 接続状況の確認
 * 
 * このエンドポイントは、テンプレートの各種接続状況を確認するために使用されます。
 * テンプレート利用者は、このAPIを叩いて設定が正しく行われているかを確認できます。
 */

export async function GET() {
  const startTime = Date.now()
  
  try {
    // 環境変数の確認
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NODE_ENV: process.env.NODE_ENV,
    }

    // 基本的な接続テスト結果
    const checks = {
      timestamp: new Date().toISOString(),
      environment: envCheck,
      nextjs: {
        status: 'ok',
        version: '15.x',
        mode: process.env.NODE_ENV,
      },
      database: {
        status: 'unknown',
        error: null as string | null,
      },
      auth: {
        status: 'unknown',
        error: null as string | null,
      }
    }

    // Supabase接続テスト (環境変数が設定されている場合のみ)
    if (envCheck.NEXT_PUBLIC_SUPABASE_URL && envCheck.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // データベース接続確認
        const { error: dbError } = await supabase
          .from('_health_check_dummy')
          .select('count')
          .limit(1)

        if (dbError && !dbError.message.includes('relation "_health_check_dummy" does not exist')) {
          checks.database.status = 'error'
          checks.database.error = dbError.message
        } else {
          checks.database.status = 'ok'
        }

        // 認証サービス確認
        const { error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          checks.auth.status = 'error'
          checks.auth.error = authError.message
        } else {
          checks.auth.status = 'ok'
        }

      } catch (error) {
        checks.database.status = 'error'
        checks.database.error = error instanceof Error ? error.message : 'Unknown database error'
        checks.auth.status = 'error'
        checks.auth.error = error instanceof Error ? error.message : 'Unknown auth error'
      }
    } else {
      checks.database.status = 'not_configured'
      checks.database.error = '環境変数が設定されていません。.env.local を確認してください。'
      checks.auth.status = 'not_configured'
      checks.auth.error = '環境変数が設定されていません。.env.local を確認してください。'
    }

    // レスポンス時間計算
    const responseTime = Date.now() - startTime

    // 全体のステータス判定
    const hasErrors = [checks.database.status, checks.auth.status].includes('error')
    const isConfigured = [checks.database.status, checks.auth.status].every(status => 
      status === 'ok' || status === 'not_configured'
    )

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' | 'not_configured'
    
    if (!isConfigured) {
      overallStatus = 'unhealthy'
    } else if (!envCheck.NEXT_PUBLIC_SUPABASE_URL || !envCheck.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      overallStatus = 'not_configured'
    } else if (hasErrors) {
      overallStatus = 'degraded'
    } else {
      overallStatus = 'healthy'
    }

    const response = {
      status: overallStatus,
      message: getStatusMessage(overallStatus),
      responseTime: `${responseTime}ms`,
      checks,
      template: {
        name: 'NextSupaStarter',
        version: '1.0.0',
        phase: 'Phase 0 - Template Complete',
      },
    }

    // ステータスコードの設定
    const statusCode = overallStatus === 'unhealthy' ? 500 : 200

    return NextResponse.json(response, { status: statusCode })

  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      status: 'unhealthy',
      message: 'システムエラーが発生しました',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${responseTime}ms`,
      template: {
        name: 'NextSupaStarter',
        version: '1.0.0',
        phase: 'Phase 0 - Template Complete',
      },
    }, { status: 500 })
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'healthy':
      return '✅ すべてのサービスが正常に動作しています'
    case 'degraded':
      return '⚠️ 一部のサービスで問題が発生していますが、基本機能は利用可能です'
    case 'unhealthy':
      return '❌ システムに重大な問題が発生しています'
    case 'not_configured':
      return '🔧 環境設定が必要です。docs/setup-guide.md を参照してください'
    default:
      return '❓ 不明な状態です'
  }
}