import { createServerClient } from '@/lib/supabase-ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createServerClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  // リダイレクト先URL（デフォルトはダッシュボード）
  const redirectTo = requestUrl.searchParams.get('redirect_to') || '/dashboard'
  
  return NextResponse.redirect(new URL(redirectTo, request.url))
}