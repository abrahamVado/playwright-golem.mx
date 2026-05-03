import { test, expect } from '../../fixtures/api.fixture';

test.describe('Security basics', () => {
  test('rejects malformed bearer token', async ({ request }) => {
    const res = await request.get('/me', {
      headers: {
        Authorization: 'Bearer invalid.token.value',
      },
    });

    expect([401, 403]).toContain(res.status());
  });

  test('does not expose stack traces on invalid route', async ({ request }) => {
    const res = await request.get('/route-that-does-not-exist');
    const text = await res.text();

    expect([404, 405]).toContain(res.status());
    expect(text.toLowerCase()).not.toContain('panic');
    expect(text.toLowerCase()).not.toContain('stack trace');
    expect(text.toLowerCase()).not.toContain('gorm');
  });
});
