import { test, expect } from '@playwright/test';

const STUDENT_EMAIL = 'student@lms.com';
const STUDENT_PASSWORD = 'student123';

test.describe('Module 4 - Educate & Empower Teams', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should display Module 4 in sidebar navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: /module 4.*educate.*empower/i })).toBeVisible();
  });

  test('should navigate to Module 4 from sidebar', async ({ page }) => {
    await page.getByRole('link', { name: /module 4.*educate.*empower/i }).click();
    
    await expect(page).toHaveURL(/\/module\/4/);
  });

  test('should display Module 4 overview page', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByRole('heading', { name: /educate.*empower/i })).toBeVisible();
    await expect(page.getByText(/transition operational control/i)).toBeVisible();
  });

  test('should display module description', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/21-day sprint/i)).toBeVisible();
  });

  test('should display Start or Continue button', async ({ page }) => {
    await page.goto('/module/4');
    
    const startButton = page.getByRole('button', { name: /start module|continue learning/i });
    await expect(startButton).toBeVisible();
  });

  test('should display progress tracking', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/gates completed/i)).toBeVisible();
  });

  test('should display Team Champion badge section', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByRole('heading', { name: /team champion badge/i })).toBeVisible();
  });

  test('should display module progress bar', async ({ page }) => {
    await page.goto('/module/4');
    
    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeVisible();
  });

  test('should display 10 gates in progress section', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/\/10/).first()).toBeVisible();
  });

  test('should display learning objectives section', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/what you.*achieve|achieve|learning objectives/i).first()).toBeVisible();
  });

  test('should load module and show main content', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/module 4 of 5/i)).toBeVisible();
    await expect(page.getByText(/gates completed/i)).toBeVisible();
  });
});

test.describe('Module 4 - Direct Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should load Module 4 directly via URL', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByRole('heading', { name: /educate.*empower/i })).toBeVisible();
  });

  test('should have accessible main action button', async ({ page }) => {
    await page.goto('/module/4');
    
    const actionButton = page.getByRole('button', { name: /start module|continue learning/i });
    await expect(actionButton).toBeEnabled();
  });
});

test.describe('Module 4 - Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should display Module 4 on mobile', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByRole('heading', { name: /educate.*empower/i })).toBeVisible();
  });

  test('should have accessible action button on mobile', async ({ page }) => {
    await page.goto('/module/4');
    
    const actionButton = page.getByRole('button', { name: /start module|continue learning/i });
    await expect(actionButton).toBeEnabled();
  });

  test('should display module description on mobile', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/21-day sprint/i)).toBeVisible();
  });
});

test.describe('Module 4 - Module Content Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should show module badge info', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/team champion/i).first()).toBeVisible();
  });

  test('should display your progress section', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/your progress/i)).toBeVisible();
  });

  test('should show total gate count', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/gates completed/i)).toBeVisible();
  });

  test('should display indigo/purple theme colors', async ({ page }) => {
    await page.goto('/module/4');
    
    const heroSection = page.locator('[class*="from-indigo-500"]').first();
    await expect(heroSection).toBeVisible();
  });

  test('should display 3 phases', async ({ page }) => {
    await page.goto('/module/4');
    
    await expect(page.getByText(/phase 1/i)).toBeVisible();
    await expect(page.getByText(/phase 3/i)).toBeVisible();
  });
});
