'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  color: string
}

interface Ingredient {
  name: string
  amount: string
  unit: string
}

interface Instruction {
  step_number: number
  description: string
  timer_minutes?: number
}

export default function NewRecipePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  
  // フォームデータ
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [prepTime, setPrepTime] = useState('')
  const [cookTime, setCookTime] = useState('')
  const [servings, setServings] = useState('4')
  const [difficulty, setDifficulty] = useState('3')
  const [imageUrl, setImageUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  
  // 材料と手順
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '' }
  ])
  const [instructions, setInstructions] = useState<Instruction[]>([
    { step_number: 1, description: '' }
  ])


  useEffect(() => {
    fetchCategories()
  }, [])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // レシピを保存
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
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
        .select()
        .single()

      if (recipeError) throw recipeError

      // 材料を保存
      const validIngredients = ingredients.filter(ing => ing.name.trim())
      if (validIngredients.length > 0) {
        const { error: ingredientsError } = await supabase
          .from('ingredients')
          .insert(
            validIngredients.map((ing, index) => ({
              recipe_id: recipe.id,
              name: ing.name,
              amount: ing.amount || null,
              unit: ing.unit || null,
              order_index: index
            }))
          )

        if (ingredientsError) throw ingredientsError
      }

      // 手順を保存
      const validInstructions = instructions.filter(inst => inst.description.trim())
      if (validInstructions.length > 0) {
        const { error: instructionsError } = await supabase
          .from('instructions')
          .insert(
            validInstructions.map(inst => ({
              recipe_id: recipe.id,
              step_number: inst.step_number,
              description: inst.description,
              timer_minutes: inst.timer_minutes || null
            }))
          )

        if (instructionsError) throw instructionsError
      }

      router.push(`/recipes/${recipe.id}`)
    } catch (error) {
      console.error('レシピ保存エラー:', error)
      alert('レシピの保存に失敗しました。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ➕ 新しいレシピを作成
          </h1>
          <p className="mt-2 text-gray-600">
            あなたのオリジナルレシピを記録しましょう
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
                  placeholder="例: 鶏の唐揚げ"
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
                  placeholder="レシピの特徴やポイントを説明してください"
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
                  placeholder="https://example.com/image.jpg"
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
                  placeholder="調理のコツやポイントがあれば記載してください"
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
            <Link
              href="/recipes"
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              キャンセル
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? '保存中...' : 'レシピを保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}