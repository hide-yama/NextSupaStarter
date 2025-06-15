'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/login')
        } else if (session?.user) {
          setUser(session.user)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">NextSupaStarter Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 認証成功！
              </h2>
              <p className="text-gray-600 mb-6">
                Supabase認証が正常に動作しています。
              </p>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">ユーザー情報</h3>
                <div className="space-y-2 text-left">
                  <p><strong>ID:</strong> {user?.id}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>作成日:</strong> {new Date(user?.created_at || '').toLocaleString()}</p>
                  <p><strong>最終ログイン:</strong> {new Date(user?.last_sign_in_at || '').toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">🔗 接続状況テスト</h4>
                <div className="text-sm text-blue-700">
                  <p>✅ Supabase認証: 接続成功</p>
                  <p>✅ Next.js App Router: 動作中</p>
                  <p>✅ TypeScript: 型チェック完了</p>
                  <p>✅ Tailwind CSS: スタイル適用中</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}