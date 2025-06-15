/**
 * 共通型定義
 * 
 * アプリケーション全体で使用される共通の型定義をまとめています。
 */

import type { User } from '@supabase/supabase-js'

/**
 * データベースのテーブル型定義
 * 
 * Supabaseで生成される型定義と併用してください。
 * 例: supabase gen types typescript --project-id your-project-id
 */

/**
 * API関連の型定義
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

/**
 * 認証関連の型定義
 */
export interface AuthUser extends User {
  // 追加のユーザー情報がある場合はここに定義
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
}

/**
 * フォーム関連の型定義
 */
export interface FormField {
  id: string
  label: string
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
}

export interface FormData {
  [key: string]: string | number | boolean | string[]
}

export interface FormError {
  field: string
  message: string
}

/**
 * 共通のイベント型定義
 */
export interface BaseEvent {
  id: string
  createdAt: string
  updatedAt: string
}

/**
 * 操作結果の型定義
 */
export interface OperationResult<T = any> {
  success: boolean
  data?: T
  error?: string
}

/**
 * ページネーション関連の型定義
 */
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * フィルタリング関連の型定義
 */
export interface FilterParams {
  search?: string
  category?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

/**
 * 設定関連の型定義
 */
export interface AppConfig {
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string
  features: {
    enableRegistration: boolean
    enableEmailVerification: boolean
    enableSocialLogin: boolean
  }
}

/**
 * ユーティリティ型定義
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
export type KeysOfType<T, U> = { [K in keyof T]: T[K] extends U ? K : never }[keyof T]

/**
 * 環境変数の型定義
 */
export interface EnvConfig {
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  NEXT_PUBLIC_SITE_URL: string
}