-- レシピ管理アプリのデータベーススキーマ

-- カテゴリーテーブル
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- カテゴリーカラー（HEX）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- レシピテーブル
CREATE TABLE recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  prep_time INTEGER, -- 調理時間（分）
  cook_time INTEGER, -- 加熱時間（分）
  servings INTEGER DEFAULT 1, -- 何人分
  difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5), -- 難易度 1-5
  image_url TEXT, -- レシピ画像URL
  notes TEXT, -- メモ・コツ
  is_public BOOLEAN DEFAULT FALSE, -- 公開設定
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 材料テーブル
CREATE TABLE ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(100) NOT NULL,
  amount VARCHAR(50), -- 分量（例：100g、2個、少々）
  unit VARCHAR(20), -- 単位（g、ml、個、など）
  order_index INTEGER DEFAULT 0, -- 表示順序
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 手順テーブル
CREATE TABLE instructions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  step_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT, -- 手順画像URL
  timer_minutes INTEGER, -- タイマー時間（分）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- お気に入りテーブル（ユーザーがレシピをお気に入り登録）
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- インデックス作成
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_category_id ON recipes(category_id);
CREATE INDEX idx_recipes_created_at ON recipes(created_at DESC);
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
CREATE INDEX idx_instructions_recipe_id ON instructions(recipe_id);
CREATE INDEX idx_instructions_step_number ON instructions(recipe_id, step_number);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- RLS (Row Level Security) 設定
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLSポリシー

-- categories: 全ユーザーが読み取り可能、認証ユーザーのみ作成可能
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update categories" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

-- recipes: ユーザーは自分のレシピのみ操作可能、公開レシピは全員が閲覧可能
CREATE POLICY "Users can view own recipes" ON recipes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public recipes are viewable by everyone" ON recipes
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert own recipes" ON recipes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" ON recipes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" ON recipes
  FOR DELETE USING (auth.uid() = user_id);

-- ingredients: レシピの所有者のみ操作可能
CREATE POLICY "Users can view ingredients of accessible recipes" ON ingredients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND (recipes.user_id = auth.uid() OR recipes.is_public = true)
    )
  );

CREATE POLICY "Users can manage ingredients of own recipes" ON ingredients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = ingredients.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

-- instructions: レシピの所有者のみ操作可能
CREATE POLICY "Users can view instructions of accessible recipes" ON instructions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instructions.recipe_id 
      AND (recipes.user_id = auth.uid() OR recipes.is_public = true)
    )
  );

CREATE POLICY "Users can manage instructions of own recipes" ON instructions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM recipes 
      WHERE recipes.id = instructions.recipe_id 
      AND recipes.user_id = auth.uid()
    )
  );

-- favorites: ユーザーは自分のお気に入りのみ操作可能
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- デフォルトカテゴリーの挿入
INSERT INTO categories (name, description, color) VALUES
  ('和食', '日本の伝統的な料理', '#DC2626'),
  ('洋食', '西洋風の料理', '#2563EB'),
  ('中華', '中国料理', '#EAB308'),
  ('イタリアン', 'イタリア料理', '#16A34A'),
  ('デザート', 'スイーツ・お菓子', '#EC4899'),
  ('その他', 'その他のジャンル', '#6B7280');

-- ヘルスチェック用テーブル
CREATE TABLE _health_check_dummy (
  id SERIAL PRIMARY KEY,
  status TEXT DEFAULT 'ok',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

INSERT INTO _health_check_dummy (status) VALUES ('ok');