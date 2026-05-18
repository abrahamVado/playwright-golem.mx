import { test, expect } from '@playwright/test';

const liveFrontendURL = (process.env.LIVE_FRONTEND_URL || 'https://paladin.mx').replace(/\/+$/, '');
const liveAPIURL = (process.env.LIVE_API_URL || 'https://api.paladin.mx').replace(/\/+$/, '');

test.describe('live deployment smoke', () => {
  test('public site responds successfully', async ({ page }) => {
    const response = await page.goto(liveFrontendURL, {
      waitUntil: 'domcontentloaded',
    });

    expect(response, 'expected the live frontend to return a response').not.toBeNull();
    expect(response!.ok(), `expected ${liveFrontendURL} to respond with 2xx/3xx`).toBeTruthy();

    await expect(page.locator('body')).toBeVisible();
    await expect.poll(async () => page.title()).not.toBe('');
  });

  test('api health endpoint responds successfully', async ({ request }) => {
    const response = await request.get(`${liveAPIURL}/api/v1/health`);
    expect(response.ok(), `expected ${liveAPIURL}/api/v1/health to respond with 2xx`).toBeTruthy();

    const body = await response.json();
    expect(body.data?.status ?? body.status).toBe('ok');
  });
});
