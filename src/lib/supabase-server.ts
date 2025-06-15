import { createClient } from '@supabase/supabase-js'

/**
 * サーバーサイド用Supabaseクライアント
 * 
 * API Routes や Server Components で使用するためのクライアント。
 * Service Role キーを使用してRLS（Row Level Security）をバイパス可能。
 * 
 * 使用例:
 * ```typescript
 * import { createServerClient } from '@/lib/supabase-server'
 * 
 * export async function GET() {
 *   const supabase = createServerClient()
 *   const { data, error } = await supabase.from('table').select('*')
 *   // ...
 * }
 * ```
 */
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error(`
      ⚠️  NEXT_PUBLIC_SUPABASE_URL が設定されていません
      
      .env.local に以下を追加してください：
      NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
      
      詳細: docs/setup-guide.md を参照
    `)
  }

  if (!supabaseServiceKey) {
    throw new Error(`
      ⚠️  SUPABASE_SERVICE_ROLE_KEY が設定されていません
      
      .env.local に以下を追加してください：
      SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
      
      注意: Service Role キーは機密情報です。本番環境では適切に管理してください。
      詳細: docs/setup-guide.md を参照
    `)
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * クライアントサイド用Supabaseクライアント（再エクスポート）
 * 
 * ブラウザで使用する通常のクライアント。
 * 認証状態の管理やRLSが適用されます。
 */
export { supabase as createBrowserClient } from './supabase'