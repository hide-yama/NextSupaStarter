/**
 * API レスポンス標準化ヘルパー
 * 
 * 一貫したAPIレスポンス形式を提供し、エラーハンドリングを簡素化します。
 * 
 * 使用例:
 * ```typescript
 * import { createApiResponse, handleApiError } from '@/lib/api-helpers'
 * 
 * export async function GET() {
 *   try {
 *     const data = await fetchSomeData()
 *     return createApiResponse(data, '取得に成功しました')
 *   } catch (error) {
 *     return handleApiError(error)
 *   }
 * }
 * ```
 */

import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

/**
 * 成功レスポンスを作成
 */
export function createApiResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  )
}

/**
 * エラーレスポンスを作成
 */
export function createApiError(
  error: string,
  status: number = 500,
  data?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      data,
    },
    { status }
  )
}

/**
 * エラーオブジェクトから適切なAPIレスポンスを生成
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API エラー:', error)

  if (error instanceof Error) {
    // Supabase エラーの場合
    if ('code' in error && 'message' in error) {
      const supabaseError = error as any
      
      // 認証エラー
      if (supabaseError.code === 'PGRST301' || supabaseError.message?.includes('JWT')) {
        return createApiError('認証が必要です', 401)
      }
      
      // 権限エラー
      if (supabaseError.code?.startsWith('42501') || supabaseError.message?.includes('permission')) {
        return createApiError('アクセス権限がありません', 403)
      }
      
      // データが見つからない
      if (supabaseError.code === 'PGRST116') {
        return createApiError('データが見つかりません', 404)
      }
      
      return createApiError(supabaseError.message, 400)
    }
    
    return createApiError(error.message, 500)
  }

  return createApiError('予期しないエラーが発生しました', 500)
}

/**
 * バリデーションエラーレスポンスを作成
 */
export function createValidationError(message: string): NextResponse<ApiResponse> {
  return createApiError(message, 400)
}

/**
 * 認証が必要なエラーレスポンスを作成
 */
export function createUnauthorizedError(message: string = '認証が必要です'): NextResponse<ApiResponse> {
  return createApiError(message, 401)
}

/**
 * アクセス権限がないエラーレスポンスを作成
 */
export function createForbiddenError(message: string = 'アクセス権限がありません'): NextResponse<ApiResponse> {
  return createApiError(message, 403)
}

/**
 * データが見つからないエラーレスポンスを作成
 */
export function createNotFoundError(message: string = 'データが見つかりません'): NextResponse<ApiResponse> {
  return createApiError(message, 404)
}