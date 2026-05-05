import { test, expect } from '@playwright/test';

test('frontend loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('nextjs-golem.mx')).toBeVisible();
});

test('api health works through nginx', async ({ request }) => {
  const response = await request.get('/api/v1/health');
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  expect(body.status).toBe('ok');
});
