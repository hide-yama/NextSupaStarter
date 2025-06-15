-- =============================================================================
-- NextSupaStarter - 初期データ設定
-- =============================================================================
-- 開発環境用の初期データとテーブル設定
-- 実際の本番環境では、利用者が必要に応じて作成
-- =============================================================================

-- 認証設定のテスト用ポリシー
-- (Supabaseの認証機能動作確認用)

-- プロファイルテーブル例 (必要に応じて利用者が作成)
-- CREATE TABLE IF NOT EXISTS profiles (
--   id UUID REFERENCES auth.users ON DELETE CASCADE,
--   updated_at TIMESTAMP WITH TIME ZONE,
--   username TEXT UNIQUE,
--   full_name TEXT,
--   avatar_url TEXT,
--   website TEXT,
--   
--   PRIMARY KEY (id),
--   CONSTRAINT username_length CHECK (char_length(username) >= 3)
-- );

-- Row Level Security 設定例
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ポリシー設定例
-- CREATE POLICY "Public profiles are viewable by everyone." ON profiles
--   FOR SELECT USING (true);

-- CREATE POLICY "Users can insert their own profile." ON profiles
--   FOR INSERT WITH CHECK (auth.uid() = id);

-- CREATE POLICY "Users can update own profile." ON profiles
--   FOR UPDATE USING (auth.uid() = id);

-- =============================================================================
-- テンプレート境界線
-- =============================================================================
-- 上記のテーブル作成は「例」として提供されています
-- 実際のアプリケーション開発時に、利用者が必要に応じて有効化してください
-- 
-- テンプレートとしては、認証機能の動作確認ができる状態で完了です
-- =============================================================================