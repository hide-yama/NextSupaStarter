# CLAUDE.md - 開発プロジェクト進行管理（AI用）

このファイルは、AIアシスタント（ClaudeやChatGPT等）と連携しながら開発を進めるための **プロジェクト進行のハブ** です。AIにこのファイルを読み込ませることで、適切な文脈のもとでタスク提案やコード生成が可能になります。

---

## 🧭 プロジェクト名

NextSupaStarter

## 🎯 プロジェクトの目的

Next.js × Supabase × Docker を使ったモダンなWebアプリケーションの開発を、最小構成から高速に立ち上げること。将来的に様々なサービスへ拡張可能な再利用性の高い構成を目指す。

## 🚀 このテンプレートの使い方

### 🆕 新しいアプリを作成する場合のファーストアクション

**AIへの最初の指示**：
```
CLAUDE.mdを読んで、このテンプレートの状況と使い方を理解してください。
今回は新しいアプリ「[アプリ名]」を作成します。
```

### 📋 作業フロー
1. **AIがCLAUDE.mdを読み込み**、テンプレートの目的と現状を把握
2. **新しいブランチ作成**（例：`feature/[アプリ名]`）
3. **外部サービス接続情報の準備**
   - GitHub: 新しいリポジトリ名
   - Supabase: プロジェクトURL、ANON_KEY、SERVICE_ROLE_KEY
   - Vercel: プロジェクト名（任意）
4. **環境変数設定とMCPサーバー接続**
   - `.env.local`に環境変数設定
   - `scripts/setup-mcp.sh`実行でClaude Code MCP設定
   - Claude Codeを再起動してSupabaseツール利用可能に
5. **AIが接続確認**
6. **アプリ固有の機能開発開始**

### 💡 利用者が準備するもの
- 作成したいアプリのアイデア・要件
- GitHub、Supabase、Vercelのアカウント
- 各サービスで作成したプロジェクトの接続情報

---

## 📦 採用技術スタック

* Next.js 15.x（App Router + TypeScript）
* Tailwind CSS 3.4.x
* Supabase（Auth / DB / Storage）
* Docker + Supabase CLI（ローカル環境）
* pnpm（パッケージ管理）
* Playwright（E2Eテスト）
* ESLint/Prettier（コード品質）
* GitHub Actions（CI/CD）

---

## 🔄 開発フェーズとステータス（PROCESS\_STATUS.mdと連動）

| フェーズ    | 内容                  | 状態 |
| ------- | ------------------- | -- |
| Phase 0 | テンプレート初期化とプロジェクト構成 | 🚧  |
| Phase 1 | MVP機能実装（認証・ダッシュボード） | ⬜  |
| Phase 2 | テスト・CI導入            | ⬜  |
| Phase 3 | セキュリティと運用設計         | ⬜  |
| Phase 4 | UI/UXブラッシュアップ       | ⬜  |

---

## ✅ 完了済みタスク

* [ ] リポジトリ作成・クローン
* [ ] Next.jsプロジェクト初期化（pnpm create next-app）
* [ ] .env.example作成・必要環境変数定義
* [ ] Docker + Supabase CLI 設定
* [ ] 基本フォルダ構成作成

---

## 🚧 次のステップ（AIに依頼したいこと）

1. Next.jsプロジェクトの初期セットアップとフォルダ構成作成
2. Supabase設定とDocker環境構築
3. 認証機能（email + magic link）を `/login` ページに実装
4. 認証済ユーザー専用 `/dashboard` ページの保護実装
5. Playwright E2Eテスト環境構築
6. GitHub Actions CI/CDパイプライン設定

---

## 📂 管理ファイル（AIが見るべき関連ファイル）

* `README.md`: セットアップガイド
* `docs/template-design.md`: 設計思想
* `docs/setup-guide.md`: 外部サービス連携手順
* `docs/mcp-setup.md`: Claude Code MCP設定手順
* `.env.example`: 必須環境変数一覧（Supabase接続情報）
* `scripts/setup-mcp.sh`: MCP自動設定スクリプト
* `supabase/`: マイグレーションや設定
* `tests/`: E2E テストファイル群
* `claude.md`: AI連携用の進行管理ファイル（このファイル）

---

## 📌 方針と注意事項

* デザインは後回し。まずは機能を最短で動かす。
* セキュリティはPhase 3で実装予定。初期は最低限でOK。
* 1ステップずつタスクを分割し、コードの検証とAIフィードバックを交互に行う。
* すべての指示はこのファイルの状態を基に判断すること。

### ⚠️ **重要：テンプレート完成の境界線**

**このテンプレートは外部サービス（GitHub/Supabase/Vercel/Docker）との接続直前まで実装して完成とする。**
実際の接続は利用者が行う。詳細は `docs/template-design.md` の「テンプレート完成の境界線」を参照。

---

## 🧠 ヒント（AI向けメタ情報）

### 🔧 必須環境要件
* **pnpm** - このプロジェクトは `pnpm` を使用。npmは使用しない
  - インストール: `npm install -g pnpm`
  - 使用例: `pnpm install`, `pnpm dev`
  - AIは必ず `pnpm` コマンドを使用すること
* **Node.js** 18.x以上
* **Docker** - Supabaseローカル環境用

### 📋 開発ルール
* `.env.local` は `.env.example` をコピーして作成される
* 開発ブランチは `develop`、本番ブランチは `main`
* すべてのパッケージ管理は `pnpm` で行う（npm/yarn禁止）

---

> 本ファイルは常にプロジェクトの現状とタスク状況を反映し、AIとの一貫した対話を支援します。
