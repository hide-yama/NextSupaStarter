import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(`
    ⚠️  Supabase接続設定が不完全です

    以下の環境変数を .env.local に設定してください：
    - NEXT_PUBLIC_SUPABASE_URL
    - NEXT_PUBLIC_SUPABASE_ANON_KEY

    詳細な設定手順: docs/setup-guide.md を参照
    環境変数テンプレート: .env.example を .env.local にコピーして使用
  `)
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)