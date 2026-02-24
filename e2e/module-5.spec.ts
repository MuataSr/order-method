import { test, expect } from '@playwright/test';

const STUDENT_EMAIL = 'student@lms.com';
const STUDENT_PASSWORD = 'student123';

test.describe('Module 5 - Results & Celebrate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should display Module 5 in sidebar navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: /module 5.*results.*celebrate/i })).toBeVisible();
  });

  test('should navigate to Module 5 from sidebar', async ({ page }) => {
    await page.getByRole('link', { name: /module 5.*results.*celebrate/i }).click();
    
    await expect(page).toHaveURL(/\/module\/5/);
  });

  test('should display Module 5 overview page', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByRole('heading', { name: /replace yourself|results.*celebrate/i })).toBeVisible();
    await expect(page.getByText(/2-day work week/i).first()).toBeVisible();
  });

  test('should display module description', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/30-day capstone/i)).toBeVisible();
  });

  test('should display Start or Continue button', async ({ page }) => {
    await page.goto('/module/5');
    
    const startButton = page.getByRole('button', { name: /start final module|continue learning/i });
    await expect(startButton).toBeVisible();
  });

  test('should display progress tracking', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/gates completed/i)).toBeVisible();
  });

  test('should display Freedom Founder badge section', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByRole('heading', { name: /freedom founder badge/i })).toBeVisible();
  });

  test('should display module progress bar', async ({ page }) => {
    await page.goto('/module/5');
    
    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeVisible();
  });

  test('should display 12 gates in progress section', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/\/12/).first()).toBeVisible();
  });

  test('should display learning objectives section', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/what you.*achieve|achieve|learning objectives/i).first()).toBeVisible();
  });

  test('should load module and show main content', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/module 5 of 5/i)).toBeVisible();
    await expect(page.getByText(/gates completed/i)).toBeVisible();
  });
});

test.describe('Module 5 - Direct Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should load Module 5 directly via URL', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByRole('heading', { name: /replace yourself|results.*celebrate/i })).toBeVisible();
  });

  test('should have accessible main action button', async ({ page }) => {
    await page.goto('/module/5');
    
    const actionButton = page.getByRole('button', { name: /start final module|continue learning/i });
    await expect(actionButton).toBeEnabled();
  });
});

test.describe('Module 5 - Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should display Module 5 on mobile', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByRole('heading', { name: /replace yourself|results.*celebrate/i })).toBeVisible();
  });

  test('should have accessible action button on mobile', async ({ page }) => {
    await page.goto('/module/5');
    
    const actionButton = page.getByRole('button', { name: /start final module|continue learning/i });
    await expect(actionButton).toBeEnabled();
  });

  test('should display module description on mobile', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/30-day capstone/i)).toBeVisible();
  });
});

test.describe('Module 5 - Module Content Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should show module badge info', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/freedom founder/i).first()).toBeVisible();
  });

  test('should display your progress section', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/your progress/i)).toBeVisible();
  });

  test('should show total gate count', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/gates completed/i)).toBeVisible();
  });

  test('should display emerald/teal theme colors', async ({ page }) => {
    await page.goto('/module/5');
    
    const heroSection = page.locator('[class*="from-emerald-500"]').first();
    await expect(heroSection).toBeVisible();
  });

  test('should display 4 phases', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/phase 1/i)).toBeVisible();
    await expect(page.getByText(/phase 4/i)).toBeVisible();
  });

  test('should show final module indicator', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/module 5 of 5/i)).toBeVisible();
  });

  test('should display 4-day work week reference', async ({ page }) => {
    await page.goto('/module/5');
    
    await expect(page.getByText(/4-day/i).first()).toBeVisible();
  });
});
