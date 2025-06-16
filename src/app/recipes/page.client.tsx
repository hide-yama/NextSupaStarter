'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface Recipe {
  id: string
  title: string
  description: string | null
  prep_time: number | null
  cook_time: number | null
  servings: number
  difficulty: number
  image_url: string | null
  created_at: string
  categories: {
    name: string
    color: string
  } | null
}

export default function RecipesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserAndLoadRecipes = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      setUser(user)

      const { data, error } = await supabase
        .from('recipes')
        .select(`
          id,
          title,
          description,
          prep_time,
          cook_time,
          servings,
          difficulty,
          image_url,
          created_at,
          categories (
            name,
            color
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('レシピ取得エラー:', error)
      } else {
        setRecipes(data || [])
      }
      
      setLoading(false)
    }

    checkUserAndLoadRecipes()
  }, [router])

  const getDifficultyStars = (difficulty: number) => {
    return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty)
  }

  const formatTime = (minutes: number | null) => {
    if (!minutes) return '-'
    if (minutes < 60) return `${minutes}分`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🍳 レシピ管理
              </h1>
              <p className="mt-2 text-gray-600">
                あなたのオリジナルレシピを管理しましょう
              </p>
            </div>
            <Link
              href="/recipes/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ➕ 新しいレシピ
            </Link>
          </div>
        </div>

        {/* レシピ一覧 */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                {/* レシピ画像 */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {recipe.image_url ? (
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                      <span className="text-4xl text-gray-400">🍽️</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {/* カテゴリー */}
                  {recipe.categories && (
                    <div className="mb-2">
                      <span
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: recipe.categories.color }}
                      >
                        {recipe.categories.name}
                      </span>
                    </div>
                  )}

                  {/* タイトル */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {recipe.title}
                  </h3>

                  {/* 説明 */}
                  {recipe.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}

                  {/* メタ情報 */}
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center justify-between">
                      <span>⏱️ 調理時間</span>
                      <span>{formatTime(recipe.prep_time)} + {formatTime(recipe.cook_time)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>👥 {recipe.servings}人分</span>
                      <span>難易度: {getDifficultyStars(recipe.difficulty)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              レシピがまだありません
            </h3>
            <p className="text-gray-600 mb-6">
              最初のレシピを作成して料理の記録を始めましょう！
            </p>
            <Link
              href="/recipes/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              ➕ 新しいレシピを作成
            </Link>
          </div>
        )}

        {/* ナビゲーション */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-center space-x-6">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
              ← ダッシュボードに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}