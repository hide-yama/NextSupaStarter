'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  color: string
}

interface Ingredient {
  id?: string
  name: string
  amount: string
  unit: string
  order_index?: number
}

interface Instruction {
  id?: string
  step_number: number
  description: string
  timer_minutes?: number
}

interface Recipe {
  id: string
  title: string
  description: string | null
  category_id: string | null
  prep_time: number | null
  cook_time: number | null
  servings: number
  difficulty: number
  image_url: string | null
  notes: string | null
  is_public: boolean
  categories: Category | null
  ingredients: Ingredient[]
  instructions: Instruction[]
}

export default function EditRecipePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  
  // フォームデータ
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [instructions, setInstructions] = useState<Instruction[]>([])

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    fetchRecipe()
    fetchCategories()
  }, [params.id])

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, color')
      .order('name')

    if (error) {
      console.error('カテゴリー取得エラー:', error)
    } else {
      setCategories(data || [])
    }
  }

  const fetchRecipe = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: recipe, error } = await supabase
      .from('recipes')
      .select(`
        *,
        categories (
          id,
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
      .eq('user_id', user.id)
      .single()

    if (error || !recipe) {
      console.error('レシピ取得エラー:', error)
      router.push('/recipes')
      return
    }

    setRecipe(recipe)
    setTitle(recipe.title)
    setDescription(recipe.description || '')
    setCategoryId(recipe.category_id || '')
    setPrepTime(recipe.prep_time?.toString() || '')
    setCookTime(recipe.cook_time?.toString() || '')
    setServings(recipe.servings.toString())
    setDifficulty(recipe.difficulty.toString())
    setImageUrl(recipe.image_url || '')
    setNotes(recipe.notes || '')
    setIsPublic(recipe.is_public)
    setIngredients(recipe.ingredients || [])
    setInstructions(recipe.instructions || [])
    setIsLoading(false)
  }

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = ingredients.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    )
    setIngredients(updated)
  }

  const addInstruction = () => {
    setInstructions([
      ...instructions, 
      { step_number: instructions.length + 1, description: '' }
    ])
  }

  const removeInstruction = (index: number) => {
    const filtered = instructions.filter((_, i) => i !== index)
    const reordered = filtered.map((inst, i) => ({ ...inst, step_number: i + 1 }))
    setInstructions(reordered)
  }

  const updateInstruction = (index: number, field: keyof Instruction, value: string | number) => {
    const updated = instructions.map((inst, i) => 
      i === index ? { ...inst, [field]: value } : inst
    )
    setInstructions(updated)
  }

  const handleDelete = async () => {
    if (!confirm('このレシピを削除してもよろしいですか？')) {
      return
    }

    setIsSaving(true)
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('レシピ削除エラー:', error)
      alert('レシピの削除に失敗しました。')
      setIsSaving(false)
    } else {
      router.push('/recipes')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // レシピを更新
      const { error: recipeError } = await supabase
        .from('recipes')
        .update({
          title,
          description: description || null,
          category_id: categoryId || null,
          prep_time: prepTime ? parseInt(prepTime) : null,
          cook_time: cookTime ? parseInt(cookTime) : null,
          servings: parseInt(servings),
          difficulty: parseInt(difficulty),
          image_url: imageUrl || null,
          notes: notes || null,
          is_public: isPublic
        })
        .eq('id', params.id)

      if (recipeError) throw recipeError

      // 既存の材料を削除
      const { error: deleteIngredientsError } = await supabase
        .from('ingredients')
        .delete()
        .eq('recipe_id', params.id)

      if (deleteIngredientsError) throw deleteIngredientsError

      // 材料を再作成
      const validIngredients = ingredients.filter(ing => ing.name.trim())
      if (validIngredients.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(
            validIngredients.map((ing, index) => ({
              recipe_id: params.id,
              name: ing.name,
              amount: ing.amount || null,
              unit: ing.unit || null,
              order_index: index
            }))
          )

        if (ingredientsError) throw ingredientsError
      }

      // 既存の手順を削除
      const { error: deleteInstructionsError } = await supabase
        .from('instructions')
        .delete()
        .eq('recipe_id', params.id)

      if (deleteInstructionsError) throw deleteInstructionsError

      // 手順を再作成
      const validInstructions = instructions.filter(inst => inst.description.trim())
      if (validInstructions.length > 0) {
        const { error: instructionsError } = await supabase
          .from('instructions')
          .insert(
            validInstructions.map(inst => ({
              recipe_id: params.id,
              step_number: inst.step_number,
              description: inst.description,
              timer_minutes: inst.timer_minutes || null
            }))
          )

        if (instructionsError) throw instructionsError
      }

      router.push(`/recipes/${params.id}`)
    } catch (error) {
      console.error('レシピ更新エラー:', error)
      alert('レシピの更新に失敗しました。')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ✏️ レシピを編集
          </h1>
          <p className="mt-2 text-gray-600">
            レシピの内容を更新します
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 基本情報 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">基本情報</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  レシピ名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  説明
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  カテゴリー
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">カテゴリーを選択</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
                  画像URL
                </label>
                <input
                  type="url"
                  id="image_url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="prep_time" className="block text-sm font-medium text-gray-700 mb-2">
                  準備時間（分）
                </label>
                <input
                  type="number"
                  id="prep_time"
                  min="0"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="cook_time" className="block text-sm font-medium text-gray-700 mb-2">
                  調理時間（分）
                </label>
                <input
                  type="number"
                  id="cook_time"
                  min="0"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
                  何人分
                </label>
                <input
                  type="number"
                  id="servings"
                  min="1"
                  required
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  難易度（1-5）
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1">★☆☆☆☆ 簡単</option>
                  <option value="2">★★☆☆☆ やや簡単</option>
                  <option value="3">★★★☆☆ 普通</option>
                  <option value="4">★★★★☆ やや難しい</option>
                  <option value="5">★★★★★ 難しい</option>
                </select>
              </div>
            </div>
          </div>

          {/* 材料 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">材料</h2>
              <button
                type="button"
                onClick={addIngredient}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ➕ 追加
              </button>
            </div>

            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="材料名"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="分量"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="単位"
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 手順 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">作り方</h2>
              <button
                type="button"
                onClick={addInstruction}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                ➕ 追加
              </button>
            </div>

            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {instruction.step_number}
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="手順の説明を入力してください"
                      value={instruction.description}
                      onChange={(e) => updateInstruction(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                    <input
                      type="number"
                      placeholder="タイマー（分）"
                      value={instruction.timer_minutes || ''}
                      onChange={(e) => updateInstruction(index, 'timer_minutes', parseInt(e.target.value) || 0)}
                      className="mt-2 w-32 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                  {instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* その他の設定 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">その他の設定</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  メモ・コツ
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_public"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
                  このレシピを公開する
                </label>
              </div>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Link
                href={`/recipes/${params.id}`}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                キャンセル
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                🗑️ 削除
              </button>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSaving ? '保存中...' : 'レシピを更新'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}