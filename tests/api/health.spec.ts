import { test, expect } from '../fixtures/api.fixture';
import { routes } from '../config/routes';

test.describe('Health', () => {
  test('GET /health returns healthy response', async ({ request }) => {
    const res = await request.get(routes.health);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.status).toBeTruthy();
  });
});
