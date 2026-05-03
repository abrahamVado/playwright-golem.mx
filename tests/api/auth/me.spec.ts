import { test, expect } from '../../fixtures/api.fixture';

test.describe('Auth / me', () => {
  test('authenticated user can read profile', async ({ users, adminToken }) => {
    const res = await users.me(adminToken);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.email || body.user?.email).toBeTruthy();
  });

  test('guest cannot read profile', async ({ request }) => {
    const res = await request.get('/me');

    expect([401, 403]).toContain(res.status());
  });
});
