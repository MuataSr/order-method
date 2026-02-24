import { test, expect } from '@playwright/test';

const STUDENT_EMAIL = 'student@lms.com';
const STUDENT_PASSWORD = 'student123';

test.describe('Module 2 - Review What Works', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should display Module 2 in sidebar navigation', async ({ page }) => {
    await expect(page.getByRole('link', { name: /module 2.*review what works/i })).toBeVisible();
  });

  test('should navigate to Module 2 from sidebar', async ({ page }) => {
    await page.getByRole('link', { name: /module 2.*review what works/i }).click();
    
    await expect(page).toHaveURL(/\/module\/2/);
  });

  test('should display Module 2 overview page', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByRole('heading', { name: /review what works/i })).toBeVisible();
    await expect(page.getByText(/workflow analysis & optimization/i)).toBeVisible();
  });

  test('should display module description', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByText(/analyze your existing workflows/i)).toBeVisible();
  });

  test('should display Start or Continue button', async ({ page }) => {
    await page.goto('/module/2');
    
    const startButton = page.getByRole('button', { name: /start module|continue learning/i });
    await expect(startButton).toBeVisible();
  });

  test('should display progress tracking', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByText(/gates completed/i)).toBeVisible();
  });

  test('should display Workflow Analyst badge section', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByRole('heading', { name: /workflow analyst badge/i })).toBeVisible();
  });

  test('should display module progress bar', async ({ page }) => {
    await page.goto('/module/2');
    
    const progressBar = page.locator('[role="progressbar"]');
    await expect(progressBar).toBeVisible();
  });

  test('should display 10 gates in progress section', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByText(/\/10/).first()).toBeVisible();
  });

  test('should display learning objectives section', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByText(/what you.*achieve|achieve|learning objectives/i).first()).toBeVisible();
  });

  test('should load module and show main content', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByText(/module 2 of 5/i)).toBeVisible();
    await expect(page.getByText(/gates completed/i)).toBeVisible();
  });
});

test.describe('Module 2 - Direct Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should load Module 2 directly via URL', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByRole('heading', { name: /review what works/i })).toBeVisible();
  });

  test('should have accessible main action button', async ({ page }) => {
    await page.goto('/module/2');
    
    const actionButton = page.getByRole('button', { name: /start module|continue learning/i });
    await expect(actionButton).toBeEnabled();
  });
});

test.describe('Module 2 - Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should display Module 2 on mobile', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByRole('heading', { name: /review what works/i })).toBeVisible();
  });

  test('should have accessible action button on mobile', async ({ page }) => {
    await page.goto('/module/2');
    
    const actionButton = page.getByRole('button', { name: /start module|continue learning/i });
    await expect(actionButton).toBeEnabled();
  });

  test('should display module description on mobile', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByText(/analyze your existing workflows/i)).toBeVisible();
  });
});

test.describe('Module 2 - Module Content Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should show module badge info', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByText(/workflow analyst/i).first()).toBeVisible();
  });

  test('should display your progress section', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByText(/your progress/i)).toBeVisible();
  });

  test('should show total gate count', async ({ page }) => {
    await page.goto('/module/2');
    
    await expect(page.getByText(/gates completed/i)).toBeVisible();
  });

  test('should display emerald/teal theme colors', async ({ page }) => {
    await page.goto('/module/2');
    
    const heroSection = page.locator('[class*="from-emerald-500"]').first();
    await expect(heroSection).toBeVisible();
  });
});
