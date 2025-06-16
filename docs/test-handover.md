# NextSupaStarter - テスト実行の申し送り事項

## 🎯 テスト目的
NextSupaStarterテンプレートの完全な機能検証と、Playwright MCP連携の動作確認を行う。

## 🔄 テスト環境の前提条件

### 必須確認事項
```bash
# 1. Docker起動確認
docker info && echo "Docker OK" || echo "Docker NG"

# 2. 基本ツール確認
node --version  # 18.x以上
pnpm --version  # 8.x以上
git --version
```

### 環境構築手順（必ず順番通りに実行）
```bash
# 1. リポジトリクローン
git clone <repo-url>
cd NextSupaStarter

# 2. ブランチ作成
git checkout -b feature/test-$(date +%Y%m%d)

# 3. 依存関係インストール
pnpm install

# 4. 環境変数設定
cp .env.example .env.local
# ローカル開発用設定が有効化されていることを確認

# 5. Playwright MCP設定（任意）
bash scripts/setup-mcp.sh
# → Playwright MCPを設定

# 6. Claude Code再起動（MCP使用時のみ）
# Playwright MCP接続を有効化

# 7. Supabase環境起動
pnpm supabase start

# 8. 開発サーバー起動（バックグラウンド）
pnpm dev > dev.log 2>&1 &
sleep 60  # 起動待機
curl -f http://localhost:3000 # ヘルスチェック
```

## 🧪 実行すべきテスト項目

### Phase 1: 基本環境確認
- [ ] Dockerコンテナ起動確認（`pnpm supabase status`）
- [ ] Next.js開発サーバー起動確認（http://localhost:3000）
- [ ] Inbucket起動確認（http://127.0.0.1:54324）
- [ ] Supabase Studio起動確認（http://127.0.0.1:54323）

### Phase 2: Playwright MCP接続確認（任意）
- [ ] Playwright MCPツール利用可能確認（`mcp__playwright_*`）
- [ ] Playwright MCP経由でのブラウザ操作テスト

### Phase 3: アプリケーション実装
#### 認証機能
- [ ] ログインページ作成（`/login`）
- [ ] マジックリンク認証実装
- [ ] 認証後リダイレクト機能（`/auth/callback`）
- [ ] 認証保護ページ実装（`/dashboard`）

#### テンプレート基本機能
- [ ] ダッシュボードページ実装（認証確認用）
- [ ] 認証保護機能の動作確認
- [ ] テンプレート用UI表示確認

### Phase 4: テストと品質確認
- [ ] Playwright E2Eテスト実装
- [ ] 全テストスイート実行（10件程度）
- [ ] エラーハンドリングの確認
- [ ] レスポンシブデザインの確認

### Phase 5: 環境管理テスト
- [ ] .env.localでの環境切り替え確認
- [ ] Supabase CLI経由でのデータベース操作
- [ ] シンプルな環境管理の検証

## ⚠️ 注意事項とトラブルシューティング

### 既知の問題と対策
1. **開発サーバー起動時間**: 初回は55-90秒かかる
2. **Docker起動確認**: MCPやSupabase前に必ずDockerの状態確認
3. **環境変数の一貫性**: アプリとMCPで同じSupabase環境を使用
4. **ポート競合**: 3000, 54321-54324ポートの空き確認

### エラー時のデバッグ手順
```bash
# 1. 環境状態確認
bash scripts/setup-mcp.sh --status
pnpm supabase status
curl -I http://localhost:3000

# 2. ログ確認
tail -f dev.log
docker logs supabase_db_NextSupaStarter

# 3. 環境リセット
pnpm supabase stop
pnpm supabase start
pkill -f "next dev" && pnpm dev &
```

## 🎯 成功の定義

### 必須達成項目
- [ ] 認証フロー完全動作（ログイン→ダッシュボード）
- [ ] データベース操作（作成・読取・更新・削除）
- [ ] E2Eテスト全件パス
- [ ] MCP環境切り替え機能動作

### 推奨達成項目
- [ ] エラーハンドリング適切
- [ ] パフォーマンス良好（3秒以内）
- [ ] レスポンシブデザイン対応
- [ ] アクセシビリティ基本対応

## 📝 報告事項

### テスト完了時に報告すべき内容
1. **実行環境情報**（OS、Node.js、Docker版数）
2. **各フェーズの実行結果**（成功/失敗と所要時間）
3. **発生した問題と解決方法**
4. **改善提案**（ユーザビリティ、ドキュメント等）
5. **MCPツールの使用感**（利便性、課題等）

### テスト失敗時の情報収集
- エラーメッセージの詳細
- 実行したコマンドの履歴
- 環境設定の状態（`bash scripts/setup-mcp.sh --status`）
- ログファイルの内容

## 💡 このテストの価値

- **テンプレート品質の向上**
- **ドキュメント精度の検証**
- **MCP連携機能の実用性評価**
- **新規利用者体験の検証**

---

**重要**: このテストは「全くの新規ユーザーがテンプレートを使用する」想定で実行してください。先入観を排除し、ドキュメント通りに実行することで、真の使いやすさを評価できます。