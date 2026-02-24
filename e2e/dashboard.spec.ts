import { test, expect } from '@playwright/test';

const STUDENT_EMAIL = 'student@lms.com';
const STUDENT_PASSWORD = 'student123';

test.describe('Student Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
  });

  test('should display dashboard after login', async ({ page }) => {
    await expect(page.getByText(/welcome back/i)).toBeVisible();
  });

  test('should display O.R.D.E.R. Framework stats', async ({ page }) => {
    await expect(page.getByText(/modules complete/i)).toBeVisible();
    await expect(page.getByText(/gates completed/i)).toBeVisible();
    await expect(page.getByText(/overall progress/i)).toBeVisible();
  });

  test('should display module progress cards', async ({ page }) => {
    await expect(page.getByText(/module 1.*own your clock/i)).toBeVisible();
    await expect(page.getByText(/module 5.*results.*celebrate/i)).toBeVisible();
  });

  test('should display profile page', async ({ page }) => {
    await page.goto('/profile');
    
    await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible();
  });

  test('should navigate to module from dashboard', async ({ page }) => {
    await page.getByRole('link', { name: /module 1.*own your clock/i }).first().click();
    
    await expect(page).toHaveURL(/\/module\/1/);
    await expect(page.getByRole('heading', { name: /own your clock/i })).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/admin');
    
    await expect(page).toHaveURL(/login/);
  });

  test('should deny student access to admin page', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(STUDENT_EMAIL);
    await page.getByLabel(/password/i).fill(STUDENT_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.waitForURL(/dashboard/);
    
    await page.goto('/admin');
    
    await expect(page).toHaveURL(/login/);
  });
});
