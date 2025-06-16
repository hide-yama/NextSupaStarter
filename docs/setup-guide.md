# 外部サービス接続ガイド

このドキュメントは、NextSupaStarterテンプレートを使用して実際のアプリケーション開発を行う際の、外部サービスとの接続設定手順をまとめています。

## ✅ 前提条件

### 必須アカウント
- **GitHub** アカウント
- **Supabase** アカウント
- **Vercel** アカウント（デプロイ用、任意）

### 必須ツール
- **Node.js** 18.x以上
- **pnpm** 8.x以上
- **Docker** と Docker Compose
- **Git**

---

## 🚀 基本セットアップ

### 1. リポジトリのクローンとセットアップ

```bash
# リポジトリクローン
git clone https://github.com/YOUR_NAME/NextSupaStarter.git
cd NextSupaStarter

# 依存関係インストール
pnpm install

# 環境変数ファイル作成
cp .env.example .env.local
```

### 2. 開発環境の選択

#### Option A: ローカル開発環境（推奨）
**Docker + Supabase CLI**を使用した完全なローカル環境

```bash
# Supabaseローカル環境起動
pnpm supabase start

# 開発サーバー起動
pnpm dev
```

**メリット**: オフライン開発可能、データリセット簡単、料金不要

#### Option B: 本番Supabase環境
**Supabase Cloud**を使用した本番環境での開発

後述の「Supabase Cloud設定」に従って設定後、`.env.local`を本番環境用に更新

---

## 🔗 Supabase Cloud設定（本番環境用）

### 1. プロジェクト作成
1. [Supabase](https://app.supabase.com) にログイン
2. 「New Project」でプロジェクト作成
   - Organization選択
   - Project name入力
   - Database password設定
   - Region選択（Asia Pacific (Tokyo)推奨）

### 2. API Keys取得
プロジェクト作成後、**Settings > API**から以下を取得：

- **Project URL**: `https://[project-id].supabase.co`
- **Anon public key**: `eyJ...`（公開用）
- **Service role key**: `eyJ...`（管理用、要秘匿）

### 3. 環境変数設定
`.env.local`を以下のように更新：

```env
# 本番Supabase環境用設定
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...

# Next.js設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-for-nextauth
NODE_ENV=development
```

---

## 🔧 Playwright E2E テスト（任意）

### 1. Playwright MCP設定の実行
```bash
# Playwright MCP設定
bash scripts/setup-mcp.sh
```

### 2. Claude Code再起動
MCP設定反映のため、Claude Codeアプリケーションを再起動

### 3. 利用可能な機能
- **Playwright MCP**: E2Eテスト、ブラウザ自動化、リアルタイムテスト

詳細は[CLAUDE.md](../CLAUDE.md)を参照

---

## 🚀 Vercelデプロイ（任意）

### 1. Vercel連携
1. [Vercel](https://vercel.com/)にログイン
2. GitHubアカウントと連携
3. NextSupaStarterリポジトリを選択してインポート

### 2. 環境変数設定
Vercelダッシュボードの**Settings > Environment Variables**で設定：

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret
NODE_ENV=production
```

### 3. デプロイ確認
- 自動デプロイ完了後、Vercel URLでアクセス確認
- 認証機能とデータベース接続をテスト

---

## 📊 環境管理のベストプラクティス

### 開発フロー推奨構成
```
開発段階     | 環境              | 用途
-----------|------------------|------------------
ローカル開発  | Docker Supabase  | 日常的な開発・テスト
ステージング  | Supabase Cloud   | 機能テスト・レビュー
本番環境     | Supabase Cloud   | 実際のサービス運用
```

### Playwright MCPの管理
```bash
# Playwright MCP設定
bash scripts/setup-mcp.sh

# 設定確認
cat .claude/settings.json
```

**注意**: Playwright MCPはE2Eテストの効率化用です。Supabase操作はClaudeがCLIで直接実行します。

---

## 🔍 トラブルシューティング

### よくある問題

#### Supabaseローカル環境が起動しない
```bash
# Dockerの状態確認
docker info

# コンテナの状況確認
docker ps -a

# 環境リセット
pnpm supabase stop
pnpm supabase start
```

#### 認証エラーが発生する
- `.env.local`の環境変数確認
- Supabaseローカル環境が起動しているか確認
- APIキーの有効性確認

#### Playwright MCP接続ができない
```bash
# 設定ファイル確認
cat .claude/settings.json

# MCP設定を再実行
bash scripts/setup-mcp.sh
```

### サポート
- 詳細なトラブルシューティング: [CLAUDE.md](../CLAUDE.md)
- 開発環境確認手順: [test-handover.md](test-handover.md)
