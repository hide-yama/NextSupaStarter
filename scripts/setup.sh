#!/bin/bash

# NextSupaStarter - 環境セットアップスクリプト
# このスクリプトは開発環境の前提条件をチェック・セットアップします

set -e

echo "🚀 NextSupaStarter - セットアップスクリプト"
echo "========================================"

# Node.js バージョンチェック
echo "📋 Node.js バージョンをチェック中..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js がインストールされていません"
    echo "   Node.js 18.x以上をインストールしてください: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//')
NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)

if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "❌ Node.js のバージョンが古すぎます (現在: v$NODE_VERSION)"
    echo "   Node.js 18.x以上が必要です"
    exit 1
fi

echo "✅ Node.js v$NODE_VERSION - OK"

# pnpm チェック・インストール
echo "📋 pnpm をチェック中..."
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm がインストールされていません。インストール中..."
    npm install -g pnpm
    echo "✅ pnpm インストール完了"
else
    PNPM_VERSION=$(pnpm -v)
    echo "✅ pnpm v$PNPM_VERSION - OK"
fi

# Docker チェック
echo "📋 Docker をチェック中..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker がインストールされていません"
    echo "   Docker をインストールしてください: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker が起動していません"
    echo "   Docker を起動してください"
    exit 1
fi

echo "✅ Docker - OK"

# Supabase CLI チェック
echo "📋 Supabase CLI をチェック中..."
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI がインストールされていません。インストール中..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install supabase/tap/supabase
        else
            echo "❌ Homebrew がインストールされていません"
            echo "   Supabase CLI を手動でインストールしてください: https://supabase.com/docs/guides/cli"
            exit 1
        fi
    else
        # Linux
        curl -sSL https://supabase.com/install.sh | bash
    fi
    echo "✅ Supabase CLI インストール完了"
else
    echo "✅ Supabase CLI - OK"
fi

echo ""
echo "🎉 環境チェック完了！"
echo ""
echo "次のステップ："
echo "1. pnpm install          # 依存関係をインストール"
echo "2. cp .env.example .env.local  # 環境変数ファイルを作成"
echo "3. supabase start        # ローカルSupabase環境を起動"
echo "4. pnpm dev              # 開発サーバーを起動"
echo ""
echo "詳細は README.md を参照してください。"