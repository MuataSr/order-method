import { test, expect } from '@playwright/test';

const ADMIN_EMAIL = 'admin@lms.com';
const ADMIN_PASSWORD = 'admin123';

test.describe('Admin Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
    await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard|admin/);
  });

  test('should display analytics tab in admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    
    await expect(page.getByRole('tab', { name: /analytics/i })).toBeVisible();
  });

  test('should show analytics overview after clicking tab', async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('tab', { name: /analytics/i }).click();
    
    await expect(page.getByText(/total students/i)).toBeVisible();
    await expect(page.getByText(/active learners/i)).toBeVisible();
    await expect(page.getByText(/completion rate/i)).toBeVisible();
    await expect(page.getByText(/certificates issued/i)).toBeVisible();
  });

  test('should have date range picker', async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('tab', { name: /analytics/i }).click();
    
    await expect(page.getByRole('combobox')).toBeVisible();
  });

  test('should have export button', async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('tab', { name: /analytics/i }).click();
    
    await expect(page.getByRole('button', { name: /export csv/i })).toBeVisible();
  });
});

test.describe('Instructor Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(ADMIN_EMAIL);
    await page.getByLabel(/password/i).fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard|admin/);
  });

  test('should display instructor analytics page', async ({ page }) => {
    await page.goto('/instructor/analytics');
    
    await expect(page.getByRole('heading', { name: /your analytics/i })).toBeVisible();
    await expect(page.getByText(/total courses/i)).toBeVisible();
    await expect(page.getByText(/total enrollments/i)).toBeVisible();
  });
});
