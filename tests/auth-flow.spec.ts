import { test, expect } from '@playwright/test';

test.describe('NextSupaStarter 認証フロー E2Eテスト', () => {
  
  test.beforeEach(async ({ page }) => {
    // テスト開始前にローカルStorageをクリア
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('ホームページが正常に表示される', async ({ page }) => {
    await page.goto('/');
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/NextSupaStarter/);
    
    // メインコンテンツの確認
    await expect(page.locator('h1')).toContainText('NextSupaStarter');
    await expect(page.locator('text=Next.js × Supabase × Docker')).toBeVisible();
  });

  test('ログインページへのナビゲーション', async ({ page }) => {
    await page.goto('/login');
    
    // ログインフォームの表示確認
    await expect(page.locator('h2')).toContainText('NextSupaStarter');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('マジックリンク送信フロー', async ({ page }) => {
    await page.goto('/login');
    
    // メールアドレス入力
    const email = 'test@example.com';
    await page.fill('input[type="email"]', email);
    
    // マジックリンク送信ボタンクリック
    await page.click('button[type="submit"]');
    
    // 成功メッセージの確認
    await expect(page.locator('text=マジックリンクをメールに送信しました')).toBeVisible();
  });

  test('認証が必要なページへの直接アクセス', async ({ page }) => {
    // 認証なしでダッシュボードにアクセス
    await page.goto('/dashboard');
    
    // ログインページにリダイレクトされることを確認
    await page.waitForURL('**/login');
    await expect(page.locator('h2')).toContainText('NextSupaStarter');
  });

  test('認証テストページの基本表示', async ({ page }) => {
    await page.goto('/');
    
    // 認証テストページへのリンクをクリック
    await page.click('text=認証テストページへ');
    
    // ログインページに遷移することを確認
    await expect(page.locator('h2')).toContainText('NextSupaStarter');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('フォームバリデーション（メール必須）', async ({ page }) => {
    await page.goto('/login');
    
    // メールアドレスを空のままで送信
    await page.click('button[type="submit"]');
    
    // HTML5バリデーションで阻止される
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required');
  });

  test('ページのレスポンシブデザイン', async ({ page }) => {
    // モバイルサイズでテスト
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    
    // モバイルでも要素が表示されることを確認
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // デスクトップサイズに戻す
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('アクセシビリティ基本チェック', async ({ page }) => {
    await page.goto('/login');
    
    // ラベルとインプットの関連性確認
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('id', 'email');
    
    // ボタンのテキスト確認
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toContainText('マジックリンクを送信');
  });

  test('ページ読み込み性能', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // 3秒以内で読み込まれることを確認
    expect(loadTime).toBeLessThan(3000);
  });

  test('ヘルスチェックエンドポイント', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('status', 'ok');
  });
});