#!/bin/bash

# NextSupaStarter - Playwright MCP設定スクリプト
# Claude Code用のPlaywright MCPサーバー設定を自動生成

set -e

CLAUDE_DIR=".claude"

# ヘルプ表示
show_help() {
    echo "🔧 NextSupaStarter Playwright MCP設定スクリプト"
    echo "=============================================="
    echo ""
    echo "使用方法:"
    echo "  bash scripts/setup-mcp.sh [オプション]"
    echo ""
    echo "オプション:"
    echo "  (なし)          Playwright MCP設定"
    echo "  --status        現在の設定を表示"
    echo "  --help, -h      このヘルプを表示"
    echo ""
    echo "説明:"
    echo "  このスクリプトはPlaywright MCPのみを設定します。"
    echo "  Supabase操作はClaude Code がCLIコマンドで直接実行します。"
    echo ""
}

# 現在の設定確認
show_status() {
    echo "📊 現在のMCP設定状況"
    echo "==================="
    
    if [ ! -f "$CLAUDE_DIR/settings.json" ]; then
        echo "❌ MCP設定ファイルが見つかりません"
        echo "   初期設定を実行してください: bash scripts/setup-mcp.sh"
        return 1
    fi
    
    # Playwright MCP確認
    if grep -q "playwright" "$CLAUDE_DIR/settings.json"; then
        echo "✅ Playwright MCP: 設定済み"
    else
        echo "❌ Playwright MCP: 未設定"
    fi
    
    echo ""
    echo "📁 設定ファイル一覧:"
    echo "   .claude/settings.json (現在アクティブな設定)"
    echo "   .claude/settings.template.json (テンプレート)"
    echo "   .claude/settings.local.json (権限設定)"
}

# コマンドライン引数の処理
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --status)
        show_status
        exit 0
        ;;
    "")
        # Playwright MCP設定（既存の処理）
        ;;
    *)
        echo "❌ 不明なオプション: $1"
        show_help
        exit 1
        ;;
esac

echo "🔧 NextSupaStarter Playwright MCP設定スクリプト"
echo "==============================================="

# 設定ディレクトリの確認
if [ ! -d "$CLAUDE_DIR" ]; then
    echo "📁 .claudeディレクトリを作成します..."
    mkdir -p "$CLAUDE_DIR"
fi

echo ""
echo "🎭 Playwright MCP設定を開始します..."

# Playwright MCP設定ファイル作成
cat > "$CLAUDE_DIR/settings.json" << 'EOF'
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ]
    }
  }
}
EOF

# 設定テンプレートファイル作成
cat > "$CLAUDE_DIR/settings.template.json" << 'EOF'
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-playwright"
      ]
    }
  }
}
EOF

# 権限設定ファイルの確認・作成
if [ ! -f "$CLAUDE_DIR/settings.local.json" ]; then
    echo "🔒 権限設定ファイルを作成中..."
    cat > "$CLAUDE_DIR/settings.local.json" << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(bash:*)",
      "Bash(pnpm supabase:*)"
    ]
  }
}
EOF
else
    echo "✅ 権限設定ファイルは既に存在します。"
fi

echo ""
echo "✅ Playwright MCP設定が完了しました！"
echo ""
echo "📋 設定内容:"
echo "   MCPサーバー: Playwright"
echo "   用途: E2Eテスト、ブラウザ自動化"
echo ""
echo "🔄 次のステップ:"
echo "   1. Claude Codeを再起動してください"
echo "   2. プロジェクトに再接続してください"
echo "   3. Playwright MCPツール（mcp__playwright_*）が利用可能になります"
echo ""
echo "💡 Supabase操作について:"
echo "   Supabase操作はClaude CodeがCLIコマンド経由で直接実行します。"
echo "   例: pnpm supabase status, psql, マイグレーション作成など"
echo ""
echo "📁 設定ファイル:"
echo "   .claude/settings.json (現在アクティブな設定)"
echo "   .claude/settings.template.json (テンプレート)"
echo "   .claude/settings.local.json (権限設定)"
echo ""