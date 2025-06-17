# CLAUDE.md - 開発プロジェクト進行管理（AI用）

このファイルは、AIアシスタント（ClaudeやChatGPT等）と連携しながら開発を進めるための **プロジェクト進行のハブ** です。AIにこのファイルを読み込ませることで、適切な文脈のもとでタスク提案やコード生成が可能になります。

---

## 🧭 プロジェクト名

NextSupaStarter

## 🎯 プロジェクトの目的

Next.js × Supabase を使ったモダンなWebアプリケーションの開発を、最小構成から高速に立ち上げること。将来的に様々なサービスへ拡張可能な再利用性の高い構成を目指す。

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
4. **環境変数設定**
   - `.env.example`を`.env.local`にコピー
   - 作成したSupabaseプロジェクトの接続情報を設定
   - Settings > API から URL、ANON_KEY、SERVICE_ROLE_KEY をコピー
5. **Playwright E2E テスト設定（任意）**
   - `scripts/setup-mcp.sh`実行でPlaywright MCP設定
   - Claude Codeを再起動してE2Eテスト自動化が利用可能に
6. **AIが接続確認**（`pnpm dev`でアプリ起動・Auth動作確認）
7. **アプリ固有の機能開発開始**
8. **テンプレート→アプリ変換**（ユーザーの希望時）
   - テンプレート専用ファイル・記述の削除
   - アプリ用ドキュメントへの書き換え

### 💡 利用者が準備するもの
- 作成したいアプリのアイデア・要件
- GitHub、Supabase、Vercelのアカウント
- 各サービスで作成したプロジェクトの接続情報

### 🔄 テンプレート→アプリ変換（詳細手順）

ユーザーが「このテンプレートを実際のアプリとして完成させたい」と要望した時の具体的な作業内容：

#### 削除対象ファイル
```
docs/template-design.md    # テンプレート設計思想
docs/mcp-setup.md         # MCP設定手順（開発完了後は不要）
```

#### 書き換え対象ファイル

**1. CLAUDE.md**
- テンプレート利用手順セクションを削除
- プロジェクト名を実際のアプリ名に変更
- プロジェクト目的を実アプリの目的に変更
- 完了済みタスクを実際の進捗に更新

**2. README.md**
- テンプレート説明をアプリ説明に変更
- セットアップ手順をアプリ固有に調整
- 機能説明を実装済み機能に更新

**3. package.json**
- `name` フィールドを実アプリ名に変更
- `description` を実アプリの説明に変更

#### 削除対象コード・コメント
- テンプレート用のサンプルコメント
- 説明用のUI要素（「🏗️ NextSupaStarter テンプレート」等）
- テスト用・デモ用のコンテンツ

#### AIへの具体的指示例
```
このテンプレートを「[アプリ名]」として完成させてください。
テンプレート専用の記述やファイルを削除し、実際のアプリとして適切な状態にしてください。
```

---

## 📦 採用技術スタック

* Next.js 15.x（App Router + TypeScript）
* Tailwind CSS 3.4.x
* Supabase（Auth / DB / Storage）
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

## 🔗 Playwright E2E テスト（任意）

### 🛠️ Playwright MCP設定手順

#### 自動設定（推奨）
```bash
# Playwright MCP設定スクリプト実行
bash scripts/setup-mcp.sh
```

#### 手動設定
```bash
# テンプレートファイルをコピー
cp .claude/settings.template.json .claude/settings.json
```

### ⚙️ MCP設定ファイル構成
```
.claude/
├── settings.json              # MCP接続設定（Git除外）
├── settings.template.json     # テンプレート
└── settings.local.json        # 権限設定
```

### 🎯 E2Eテストの利点
- **Claude Code連携**: ブラウザ操作を自動化
- **リアルタイム確認**: 実際のユーザー操作をテスト
- **回帰テスト**: 機能追加時の既存機能チェック

---

## 📂 管理ファイル（AIが見るべき関連ファイル）

* `README.md`: セットアップガイド
* `docs/template-design.md`: 設計思想
* `docs/setup-guide.md`: 外部サービス連携手順
* `.env.example`: 必須環境変数一覧（Supabase接続情報）
* `scripts/setup-mcp.sh`: Playwright MCP設定スクリプト
* `.claude/settings.template.json`: MCP設定テンプレート
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

### 📋 開発ルール
* `.env.local` は `.env.example` をコピーして作成される
* 開発ブランチは `develop`、本番ブランチは `main`
* すべてのパッケージ管理は `pnpm` で行う（npm/yarn禁止）
* **Supabase環境の管理**：
  - 開発・本番共にSupabase Cloudを使用
  - `.env.local`に開発用プロジェクト情報を設定
  - 本番デプロイ: Vercel環境変数で本番用プロジェクト情報を設定

### 🚨 環境構築時のトラブル回避チェックリスト

**開発サーバー起動手順**
```bash
# 1. 依存関係インストール
pnpm install

# 2. 環境変数設定（オプション）
cp .env.example .env.local
# .env.localにSupabaseプロジェクト情報を設定

# 3. 開発サーバー起動
pnpm dev
```

**重要：環境変数未設定時の動作**
このテンプレートは**環境変数なしでも起動可能**に設計されています：
- ✅ ページ表示・ルーティングは正常動作
- ⚠️ 認証機能は動作しない（警告メッセージが表示される）
- 💡 middleware.tsとlib/supabase.tsには環境変数チェック処理実装済み

**エラー防止のための設計ポイント**
```typescript
// middleware.ts の環境変数チェック
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('⚠️  Supabase環境変数が設定されていません')
  return NextResponse.next() // エラーではなくスキップ
}

// lib/supabase.ts のフォールバック処理
if (!supabaseUrl || !supabaseAnonKey) {
  return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
}
```

**接続確認**
- ブラウザで http://localhost:3000 にアクセス
- `/login` でSupabase Auth動作確認（環境変数設定時のみ）
- 認証後 `/dashboard` アクセス可能（環境変数設定時のみ）

---

> 本ファイルは常にプロジェクトの現状とタスク状況を反映し、AIとの一貫した対話を支援します。
