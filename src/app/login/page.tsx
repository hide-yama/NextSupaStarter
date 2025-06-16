'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      console.log('送信中のメールアドレス:', email)
      console.log('リダイレクトURL:', `${window.location.origin}/auth/callback`)
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error('認証エラー:', error)
        setMessage(`エラー: ${error.message}`)
      } else {
        console.log('マジックリンク送信成功')
        setMessage('マジックリンクをメールに送信しました。メールをご確認ください。')
      }
    } catch (err) {
      console.error('予期しないエラー:', err)
      setMessage('ログインに失敗しました。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            NextSupaStarter
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            メールアドレスでログイン
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="sr-only">
              メールアドレス
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'マジックリンクを送信中...' : 'マジックリンクを送信'}
            </button>
          </div>

          {message && (
            <div className={`text-center text-sm ${
              message.includes('エラー') ? 'text-red-600' : 'text-green-600'
            }`}>
              {message}
            </div>
          )}
        </form>

        <div className="text-center text-xs text-gray-500">
          <p>🏗️ NextSupaStarter テンプレート</p>
          <p>接続テスト: Supabase認証機能</p>
        </div>
      </div>
    </div>
  )
}