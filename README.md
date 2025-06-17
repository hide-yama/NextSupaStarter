# NextSupaStarter

🚀 **Next.js × Supabase による高速開発テンプレート**

最小構成から本格的なWebアプリケーションまで、段階的にスケール可能なモダン開発環境を提供します。

[![GitHub](https://img.shields.io/github/license/hide-yama/NextSupaStarter)](https://github.com/hide-yama/NextSupaStarter)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

## ✨ 特徴

- **⚡ 即座に開始**: 必要な設定が事前完了済み
- **🔒 認証機能**: Supabaseマジックリンク認証を標準装備
- **🎨 美しいUI**: Tailwind CSSによるレスポンシブデザイン
- **☁️ クラウドファースト**: Supabase Cloudで統一された開発体験
- **🧪 品質保証**: TypeScript + ESLint + Prettier
- **📊 監視機能**: ヘルスチェックAPIで接続状況を可視化

## 🛠 技術スタック

| 技術 | バージョン | 用途 |
|-----|-----------|------|
| **Next.js** | 15.x | フロントエンド・API |
| **TypeScript** | 5.x | 型安全性 |
| **Supabase** | Latest | 認証・DB・ストレージ |
| **Tailwind CSS** | 3.4.x | スタイリング |
| **pnpm** | 10.x | パッケージ管理 |

## 📋 前提条件

以下のツールが必要です：

- **Node.js** 18.x以上
- **pnpm** 8.x以上 (`npm install -g pnpm`)
- **Git**

⚠️ **重要**: このプロジェクトは **pnpm** を使用します。npm や yarn は使用しないでください。

## 🔗 Claude Code連携 (MCP設定)

このテンプレートは[Claude Code](https://claude.ai/code)との強力な連携機能を提供します。

### MCP設定の実行

```bash
# Playwright MCP設定
bash scripts/setup-mcp.sh
```

### 利用可能な機能
- **Playwright MCP**: E2Eテスト、ブラウザ自動化
- **Supabase操作**: Claude CodeがCLIコマンド経由で直接実行

詳細は[CLAUDE.md](./CLAUDE.md)を参照してください。

## 🚀 クイックスタート

### 1. リポジトリのクローン

```bash
git clone https://github.com/hide-yama/NextSupaStarter.git
cd NextSupaStarter
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

```bash
cp .env.example .env.local
```

`.env.local`を編集してSupabaseの接続情報を設定：

```env
# あなたのSupabaseプロジェクト情報を設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> 📝 詳細な設定手順は [docs/setup-guide.md](docs/setup-guide.md) を参照

### 4. 開発サーバーの起動

```bash
pnpm dev
```

🎉 http://localhost:3000 でアプリケーションが起動します！

## 🔧 設定手順

### Supabaseプロジェクトの作成

1. [Supabase](https://app.supabase.com) にログイン
2. 新しいプロジェクトを作成
3. **Settings > API** から以下を取得：
   - Project URL
   - anon key  
   - service_role key
4. `.env.local` に設定

### 接続確認

システム状況は以下で確認できます：

- **ヘルスチェックページ**: http://localhost:3000/health
- **ヘルスチェックAPI**: http://localhost:3000/api/health

## 📂 プロジェクト構成

```
NextSupaStarter/
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── login/         # 認証ページ
│   │   ├── dashboard/     # ダッシュボード
│   │   ├── health/        # システム状況ページ
│   │   └── api/health/    # ヘルスチェックAPI
│   ├── components/        # 再利用コンポーネント
│   └── lib/              # ユーティリティ・設定
├── supabase/             # Supabase設定
├── docs/                 # ドキュメント
├── .env.example          # 環境変数テンプレート
└── CLAUDE.md             # AI連携管理ファイル
```

## ☁️ クラウド開発環境

このテンプレートはSupabase Cloudを使用したシンプルな開発体験を提供します：

```bash
# 1. 依存関係インストール
pnpm install

# 2. 環境変数設定
cp .env.example .env.local
# .env.localにあなたのSupabaseプロジェクト情報を設定

# 3. 開発サーバー起動
pnpm dev
```

- **アプリ**: http://localhost:3000
- **Supabase Dashboard**: https://app.supabase.com （プロジェクト管理）

## 🧪 テストと品質管理

```bash
# 型チェック
pnpm type-check

# Lintチェック
pnpm lint

# ビルドテスト
pnpm build
```

## 📖 ドキュメント

- **[設計思想](docs/template-design.md)**: テンプレートの設計方針
- **[セットアップガイド](docs/setup-guide.md)**: 詳細な設定手順
- **[プロジェクト管理](CLAUDE.md)**: AI連携開発情報

## 🎯 利用シーン

### 個人プロジェクト
- プロトタイプの高速開発
- ポートフォリオサイト
- SaaS MVP

### チーム開発
- スタートアップの初期開発
- ハッカソン
- 概念実証（PoC）

### 学習目的
- モダンWeb開発の学習
- Next.js + Supabase の実践
- フルスタック開発の習得

## ⚠️ 注意事項

### テンプレートの境界線

このテンプレートは **外部サービス接続直前まで** の実装を提供します：

✅ **含まれるもの**:
- 認証フローの実装
- UI コンポーネント
- エラーハンドリング
- 設定ファイル・ドキュメント

❌ **含まれないもの（利用者が設定）**:
- 実際のAPIキー
- 外部サービスアカウント
- 本番環境設定

## 🤝 コントリビューション

プルリクエストや Issue の報告を歓迎します。

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - React フレームワーク
- [Supabase](https://supabase.com/) - オープンソース Firebase 代替
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファースト CSS フレームワーク

---

<div align="center">

**[⭐ Star this repository](https://github.com/hide-yama/NextSupaStarter) if it helped you!**

Made with ❤️ and ☕ by [hide-yama](https://github.com/hide-yama)

</div>
