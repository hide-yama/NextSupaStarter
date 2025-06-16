import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🏗️ NextSupaStarter
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Next.js × Supabase × Docker を使ったモダンな<br />
            Webアプリケーション開発のスターターテンプレート
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">⚡ 高速セットアップ</h3>
              <p className="text-gray-600">
                Docker + Supabase CLI で<br />
                ローカル環境を即座に構築
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">🔐 認証機能内蔵</h3>
              <p className="text-gray-600">
                マジックリンク認証と<br />
                ページ保護機能を標準実装
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">🎭 AI連携対応</h3>
              <p className="text-gray-600">
                Playwright MCP で<br />
                E2Eテストを効率化
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg mb-12">
            <h2 className="text-2xl font-bold mb-6">🚀 開発を始める</h2>
            <p className="text-gray-600 mb-6">
              認証機能をテストして、アプリ開発の基盤を確認しましょう
            </p>
            <Link
              href="/login"
              className="inline-block bg-blue-600 text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
            >
              認証テストページへ →
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600">
        <p>🏗️ NextSupaStarter Template - powered by Next.js × Supabase</p>
      </footer>
    </div>
  );
}