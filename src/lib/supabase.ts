import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

function createSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
      console.error(`
        ⚠️  Supabase接続設定が不完全です

        以下の環境変数を設定してください：
        - NEXT_PUBLIC_SUPABASE_URL
        - NEXT_PUBLIC_SUPABASE_ANON_KEY

        詳細な設定手順: docs/setup-guide.md を参照
        環境変数テンプレート: .env.example を .env.local にコピーして使用
      `)
    }
    // ビルド時にはダミーのクライアントを返す
    return createClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()