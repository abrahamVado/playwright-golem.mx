import { test, expect } from '../../fixtures/api.fixture';
import { routes } from '../../config/routes';
import { readJson } from '../../helpers/assertions';

test.describe('Auth header validation', () => {
  test('rejects missing bearer token value', async ({ request }) => {
    const res = await request.get(routes.me, {
      headers: {
        Authorization: 'Bearer',
      },
    });
    const body = await readJson<any>(res);

    expect(res.status()).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('INVALID_AUTH_HEADER');
  });

  test('rejects bearer header with extra segments', async ({ request }) => {
    const res = await request.get(routes.me, {
      headers: {
        Authorization: 'Bearer token extra',
      },
    });
    const body = await readJson<any>(res);

    expect(res.status()).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('INVALID_AUTH_HEADER');
  });
});
