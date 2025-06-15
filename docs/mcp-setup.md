# Supabase MCP サーバーセットアップガイド

## MCPサーバーとは
MCP (Model Context Protocol) サーバーは、AIアシスタントが外部サービスと直接やり取りできるようにする仕組みです。

## Supabase MCPサーバーの追加方法

### 1. Claude Desktopの設定ファイルを開く

macOSの場合：
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### 2. Supabase MCPサーバーを追加

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase",
        "--supabase-url",
        "https://nkdvglphervlddacozlr.supabase.co",
        "--service-role-key",
        "YOUR_SERVICE_ROLE_KEY"
      ]
    }
  }
}
```

### 3. サービスロールキーの設定

`.env.production.local`から`SUPABASE_SERVICE_ROLE_KEY`の値をコピーして、上記の`YOUR_SERVICE_ROLE_KEY`を置き換えてください。

### 4. Claude Desktopを再起動

設定を反映させるために、Claude Desktopを完全に終了して再起動してください。

## 利用可能になる機能

- データベーステーブルの作成・更新
- SQLクエリの実行
- Row Level Securityポリシーの設定
- ストレージバケットの管理
- その他Supabase APIの操作

## セキュリティ注意事項

⚠️ **重要**: Service Role Keyは非常に強力な権限を持つため、以下の点に注意してください：

1. このキーは絶対に公開リポジトリにコミットしない
2. 本番環境でのみ使用し、開発環境では使わない
3. 定期的にキーをローテーションする
4. アクセスログを監視する

## トラブルシューティング

MCPサーバーが正しく動作しない場合：

1. Claude Desktopのログを確認
2. npxコマンドが正しく実行できるか確認
3. ネットワーク接続を確認
4. Supabaseプロジェクトの状態を確認