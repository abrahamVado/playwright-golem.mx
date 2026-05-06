import { test, expect } from '../../fixtures/api.fixture';
import { routes } from '../../config/routes';
import { readJson } from '../../helpers/assertions';

test.describe('Security basics', () => {
  test('rejects malformed bearer token', async ({ request }) => {
    const res = await request.get(routes.me, {
      headers: {
        Authorization: 'Bearer invalid.token.value',
      },
    });
    const body = await readJson<any>(res);

    expect(res.status()).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('INVALID_TOKEN');
  });

  test('rejects malformed authorization header shape', async ({ request }) => {
    const res = await request.get(routes.me, {
      headers: {
        Authorization: 'Token not-a-bearer-token',
      },
    });
    const body = await readJson<any>(res);

    expect(res.status()).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('INVALID_AUTH_HEADER');
  });

  test('does not expose stack traces on invalid route', async ({ request }) => {
    const res = await request.get(routes.invalid.route);
    const text = await res.text();

    expect([404, 405]).toContain(res.status());
    expect(text.toLowerCase()).not.toContain('panic');
    expect(text.toLowerCase()).not.toContain('stack trace');
    expect(text.toLowerCase()).not.toContain('gorm');
  });
});
