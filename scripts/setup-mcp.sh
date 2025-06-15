#!/bin/bash

# NextSupaStarter - Claude Code MCP設定スクリプト
# .env.production.localからSupabase設定を読み取り、.claude/settings.jsonを生成

set -e

echo "🚀 Claude Code MCP設定セットアップ"
echo "=================================="

# .env.production.localの存在確認
if [ ! -f ".env.production.local" ]; then
    echo "❌ .env.production.local が見つかりません"
    echo "   先に本番環境の設定を行ってください"
    exit 1
fi

# 環境変数を読み込み
source .env.production.local

# 必要な変数の確認
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ 必要な環境変数が設定されていません"
    echo "   NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください"
    exit 1
fi

# .claudeディレクトリ作成
mkdir -p .claude

# settings.json生成
cat > .claude/settings.json << EOF
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase",
        "--supabase-url",
        "$NEXT_PUBLIC_SUPABASE_URL",
        "--service-role-key",
        "$SUPABASE_SERVICE_ROLE_KEY"
      ]
    }
  }
}
EOF

echo "✅ .claude/settings.json を生成しました"
echo ""
echo "🔍 生成された設定:"
echo "   URL: $NEXT_PUBLIC_SUPABASE_URL"
echo "   Key: ${SUPABASE_SERVICE_ROLE_KEY:0:20}... (一部表示)"
echo ""
echo "📌 次のステップ:"
echo "   1. Claude Codeを再起動"
echo "   2. 新しい会話を開始"
echo "   3. Supabase MCPツールが利用可能になります"
echo ""
echo "⚠️  注意: .claude/settings.json は機密情報を含むため、"
echo "   絶対にGitにコミットしないでください"