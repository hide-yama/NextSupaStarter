# README\_draft.md - プロジェクト利用者向けドキュメント（作成途中）

> ⚠️ **注意：このREADMEは作成途中のドラフトです。AIアシスタントはこの内容を前提に行動しないでください。最新情報は `CLAUDE.md` を参照してください。**

---

## 🏷️ プロジェクト概要

このテンプレートは、以下の技術スタックを使ったWebアプリケーションの開発初期構築を効率化することを目的としています：

* Next.js (App Router)
* Supabase（Auth / DB / Storage）
* Docker（ローカル環境再現）
* pnpm

---

## ⚙️ 技術スタック

* Next.js 15.x（App Router + TypeScript）
* Supabase（Auth / DB / Storage）
* Tailwind CSS 3.4.x
* pnpm（パッケージ管理）
* Docker + Supabase CLI（ローカル環境）
* Playwright（E2Eテスト）
* ESLint/Prettier（コード品質）

---

## 🚀 使用方法（予定）

1. このテンプレートをGitHubからクローン
2. `.env.example` をコピーして `.env.local` を作成
3. 各種APIキー（Supabase等）を設定
4. `pnpm install`
5. `pnpm dev` で開発を開始

（※ 詳細な設定手順は `docs/setup-guide.md` に記載）

---

## 🗂️ フォルダ構成（予定）

```bash
NextSupaStarter/
├── src/
├── public/
├── supabase/
├── tests/
├── .env.example
├── CLAUDE.md
├── README_draft.md
└── docs/
```

---

## 📘 関連ドキュメント

* `CLAUDE.md`：AIとの連携進行管理
* `docs/template-design.md`：テンプレートの設計思想
* `docs/setup-guide.md`：SupabaseやMCPなど外部連携の詳細

---

> 本ドキュメントはテンプレート完成後に正式な `README.md` に統合予定です。
