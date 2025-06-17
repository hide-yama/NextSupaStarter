import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  // 環境変数が設定されていない場合は警告を表示
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.warn(
        '⚠️  Supabase環境変数が設定されていません。',
        '\n',
        '以下の手順で設定してください：',
        '\n1. Supabaseプロジェクトを作成',
        '\n2. .env.localファイルを作成',
        '\n3. 環境変数を設定',
        '\n',
        '詳細: https://supabase.com/dashboard/project/_/settings/api'
      )
    }
    // ビルド時にはダミーのクライアントを返す
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// ブラウザ用クライアント（レガシー互換性のため保持）
export const supabase = createClient()