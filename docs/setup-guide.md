# setup-guide.md - 外部サービス接続ガイド（作成中）

このドキュメントは、テンプレートを使用する際に必要な外部サービスとの接続設定をまとめた手順書です。主に Supabase / GitHub / Vercel / MCPサーバー などの連携について記載しています。

> ⚠️ 本ガイドは作成途中です。内容に変更が加わる可能性があります。

---

## ✅ 前提条件

* GitHub アカウントを所持していること
* Supabase アカウントを所持していること
* Vercel アカウントを所持していること（Next.js のホスティング用）
* Node.js 18.x以上がインストールされていること

---

## 1. GitHub リポジトリの作成とクローン

```bash
git clone https://github.com/YOUR_NAME/NextSupaStarter.git
cd NextSupaStarter
```

---

## 2. `.env.local` の作成

`.env.example` をコピーして `.env.local` にリネームします：

```bash
cp .env.example .env.local
```

必要な環境変数を以下に従って入力します（後述の各ステップで取得）：

---

## 3. Supabase プロジェクトの作成と設定

1. [Supabase](https://app.supabase.com) にログイン
2. 新しいプロジェクトを作成（プロジェクト名・パスワード・リージョンを指定）
3. プロジェクト作成後、**Project API Keys** ページから以下を取得：

   * `SUPABASE_URL`
   * `SUPABASE_ANON_KEY`

`.env.local` に以下を記述：

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

4. `supabase` ディレクトリがある場合：

```bash
supabase start
```

> ローカルDBを使用したい場合は Supabase CLI が必要です。

---

## 4. Vercel と GitHub の連携

1. [Vercel](https://vercel.com/) にログインし、GitHub アカウントと連携
2. GitHubのリポジトリを選択し、プロジェクトを作成
3. 環境変数は Vercel の「Environment Variables」セクションに `.env.local` の内容を転記

---

## 5. その他の設定（任意）

必要に応じて以下の設定を追加できます：

* **アナリティクス**: Google Analytics, Vercel Analytics
* **モニタリング**: Sentry, LogRocket
* **AI連携**: OpenAI API, Anthropic Claude API

これらの機能はPhase 4での拡張機能として追加できます。

---

## 🔁 動作確認

```bash
pnpm install
pnpm dev
```

正常に表示されれば接続成功です。

---

> 本ガイドはプロジェクト構成の変化に応じて随時更新されます。Pull Requestでの修正提案も歓迎します。
