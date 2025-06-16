import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

interface Recipe {
  id: string
  title: string
  description: string | null
  prep_time: number | null
  cook_time: number | null
  servings: number
  difficulty: number
  image_url: string | null
  notes: string | null
  is_public: boolean
  created_at: string
  categories: {
    name: string
    color: string
  } | null
  ingredients: Array<{
    id: string
    name: string
    amount: string | null
    unit: string | null
    order_index: number
  }>
  instructions: Array<{
    id: string
    step_number: number
    description: string
    timer_minutes: number | null
  }>
}

export default async function RecipeDetailPage({
  params
}: {
  params: { id: string }
}) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: recipe, error } = await supabase
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
      notes,
      is_public,
      created_at,
      categories (
        name,
        color
      ),
      ingredients (
        id,
        name,
        amount,
        unit,
        order_index
      ),
      instructions (
        id,
        step_number,
        description,
        timer_minutes
      )
    `)
    .eq('id', params.id)
    .single()

  if (error || !recipe) {
    notFound()
  }

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

  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <Link
                href="/recipes"
                className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
              >
                ← レシピ一覧に戻る
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">
                {recipe.title}
              </h1>
              {recipe.description && (
                <p className="mt-2 text-gray-600">
                  {recipe.description}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ✏️ 編集
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メイン情報 */}
          <div className="lg:col-span-2 space-y-6">
            {/* レシピ画像 */}
            {recipe.image_url && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-64 object-cover"
                />
              </div>
            )}

            {/* 材料 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">材料</h2>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="space-y-2">
                  {recipe.ingredients
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((ingredient) => (
                      <li key={ingredient.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-900">{ingredient.name}</span>
                        <span className="text-gray-600">
                          {ingredient.amount} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">材料が登録されていません</p>
              )}
            </div>

            {/* 作り方 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">作り方</h2>
              {recipe.instructions && recipe.instructions.length > 0 ? (
                <div className="space-y-4">
                  {recipe.instructions
                    .sort((a, b) => a.step_number - b.step_number)
                    .map((instruction) => (
                      <div key={instruction.id} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {instruction.step_number}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900 leading-relaxed">
                            {instruction.description}
                          </p>
                          {instruction.timer_minutes && (
                            <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              ⏱️ {instruction.timer_minutes}分
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">作り方が登録されていません</p>
              )}
            </div>

            {/* メモ・コツ */}
            {recipe.notes && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">メモ・コツ</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {recipe.notes}
                </p>
              </div>
            )}
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* レシピ情報 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">レシピ情報</h3>
              
              <div className="space-y-3">
                {recipe.categories && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">カテゴリー</span>
                    <span
                      className="inline-block px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: recipe.categories.color }}
                    >
                      {recipe.categories.name}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">人数</span>
                  <span className="font-medium">{recipe.servings}人分</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">難易度</span>
                  <span className="font-medium">{getDifficultyStars(recipe.difficulty)}</span>
                </div>
                
                {recipe.prep_time && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">準備時間</span>
                    <span className="font-medium">{formatTime(recipe.prep_time)}</span>
                  </div>
                )}
                
                {recipe.cook_time && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">調理時間</span>
                    <span className="font-medium">{formatTime(recipe.cook_time)}</span>
                  </div>
                )}
                
                {totalTime > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-gray-900 font-semibold">合計時間</span>
                    <span className="font-semibold text-blue-600">{formatTime(totalTime)}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">公開設定</span>
                  <span className={`font-medium ${recipe.is_public ? 'text-green-600' : 'text-gray-600'}`}>
                    {recipe.is_public ? '公開' : '非公開'}
                  </span>
                </div>
              </div>
            </div>

            {/* 作成日時 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">作成情報</h3>
              <p className="text-gray-600">
                作成日: {new Date(recipe.created_at).toLocaleDateString('ja-JP')}
              </p>
            </div>

            {/* アクション */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">アクション</h3>
              <div className="space-y-3">
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  ✏️ 編集
                </Link>
                <button
                  onClick={() => window.print()}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  🖨️ 印刷
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}