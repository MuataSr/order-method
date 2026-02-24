import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByRole('link', { name: /sign up/i }).click();
    
    await expect(page).toHaveURL('/signup');
    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible();
  });
});

test.describe('Signup Flow', () => {
  test('should display signup page', async ({ page }) => {
    await page.goto('/signup');
    
    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible();
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/signup');
    
    await page.getByRole('link', { name: /sign in/i }).click();
    
    await expect(page).toHaveURL('/login');
  });
});
