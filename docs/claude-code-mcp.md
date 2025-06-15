# Claude Code MCP設定ガイド

## 概要

Claude Code（CLI）でSupabaseプロジェクトと直接連携するためのMCP（Model Context Protocol）サーバー設定方法です。

## 🚀 クイックセットアップ

### 自動セットアップ（推奨）

```bash
# 本番環境設定後に実行
./scripts/setup-mcp.sh
```

このスクリプトは：
1. `.env.production.local`から設定を読み取り
2. `.claude/settings.json`を自動生成
3. 必要な設定を検証

### 手動セットアップ

1. `.claude/settings.json.example`をコピー
```bash
cp .claude/settings.json.example .claude/settings.json
```

2. 以下の値を置き換え
- `YOUR_SUPABASE_URL` → 実際のプロジェクトURL
- `YOUR_SERVICE_ROLE_KEY` → Service Role Key

## 🔧 利用可能な機能

MCPサーバー接続後、以下の操作が可能：

- **データベース操作**
  - テーブル作成・更新・削除
  - データの挿入・更新・削除
  - SQLクエリの実行

- **認証・セキュリティ**
  - Row Level Securityポリシー設定
  - ユーザー管理

- **ストレージ**
  - バケット作成・管理
  - ファイルアップロード設定

## 📝 使用例

新しい会話で以下のような指示が可能：

```
「todosテーブルにマイグレーションを実行してください」
「RLSポリシーを確認してください」
「現在のテーブル一覧を表示してください」
```

## ⚠️ セキュリティ注意事項

1. **Service Role Keyは機密情報**
   - 本番環境の全権限を持つ
   - 絶対に公開リポジトリにコミットしない

2. **`.gitignore`の確認**
   ```
   .claude/settings.json
   ```
   が必ず含まれていることを確認

3. **定期的なキーローテーション**
   - Supabaseダッシュボードから定期的に更新
   - 更新後は`setup-mcp.sh`を再実行

## 🔄 プロジェクト間の切り替え

複数のSupabaseプロジェクトを扱う場合：

1. プロジェクトごとに`.env.production.local`を設定
2. `./scripts/setup-mcp.sh`を実行
3. Claude Codeを再起動

## トラブルシューティング

### MCPツールが表示されない
- Claude Codeを完全に再起動
- 新しい会話を開始
- `.claude/settings.json`の構文を確認

### 接続エラーが発生する
- Supabaseプロジェクトの状態を確認
- Service Role Keyの有効性を確認
- ネットワーク接続を確認