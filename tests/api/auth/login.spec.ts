import { test, expect } from '../../fixtures/api.fixture';
import { env } from '../../config/env';

test.describe('Auth / login', () => {
  test('valid admin can login and receive access token', async ({ auth }) => {
    const res = await auth.login(env.adminEmail, env.adminPassword);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.access_token).toBeTruthy();
  });

  test('invalid password cannot login', async ({ auth }) => {
    const res = await auth.login(env.adminEmail, 'wrong-password');

    expect([400, 401, 422]).toContain(res.status());
  });

  test('unknown user cannot login', async ({ auth }) => {
    const res = await auth.login('missing@example.test', 'Password123!Strong');

    expect([400, 401, 404, 422]).toContain(res.status());
  });
});
