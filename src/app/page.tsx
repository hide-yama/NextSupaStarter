import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            NextSupaStarter
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Next.js × Supabase × Docker による<br />
            モダンWebアプリテンプレート
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">⚡ 高速セットアップ</h3>
              <p className="text-gray-600">
                必要な設定が事前に完了。<br />
                環境変数を入力するだけで即座に開始可能。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">🔒 認証機能内蔵</h3>
              <p className="text-gray-600">
                Supabase認証によるマジックリンクログイン。<br />
                セキュアな認証フローを簡単実装。
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">🎨 Tailwind CSS</h3>
              <p className="text-gray-600">
                美しいUIを素早く構築。<br />
                レスポンシブ対応も標準装備。
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-bold mb-6">🚀 今すぐ体験</h2>
            <p className="text-gray-600 mb-6">
              認証機能のデモを体験してみてください
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ログインページへ →
            </Link>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold mb-3">⚠️ 設定が必要です</h3>
            <p className="text-gray-700 mb-4">
              実際に認証機能を使用するには、Supabaseの設定が必要です：
            </p>
            <ol className="text-left text-sm text-gray-600 space-y-1 max-w-md mx-auto">
              <li>1. .env.example を .env.local にコピー</li>
              <li>2. Supabaseプロジェクトを作成</li>
              <li>3. APIキーを .env.local に設定</li>
              <li>4. 詳細手順: docs/setup-guide.md</li>
            </ol>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600">
        <p>🏗️ NextSupaStarter - Next.js × Supabase テンプレート</p>
        <p className="mt-2">Phase 0: 基本実装完了 | 接続テスト用デモ</p>
      </footer>
    </div>
  );
}
