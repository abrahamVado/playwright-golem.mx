import { test, expect } from '@playwright/test';

test('frontend loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('nextjs-golem.mx')).toBeVisible();
});

test('api health works through nginx', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok()).toBeTruthy();
  await expect(response).toHaveJSON({ status: 'ok' });
});
