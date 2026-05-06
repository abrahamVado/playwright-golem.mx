import { test, expect } from '@playwright/test';

const nginxBaseURL = (process.env.BASE_URL || 'http://127.0.0.1').replace(/\/+$/, '');

test('frontend loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Larago App' })).toBeVisible();
  await expect(page.getByRole('button', { name: /log in to dashboard/i })).toBeVisible();
});

test('api health works through nginx', async ({ request }) => {
  const response = await request.get(`${nginxBaseURL}/health`);
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.success).toBe(true);
  expect(body.data?.status).toBe('ok');
});
