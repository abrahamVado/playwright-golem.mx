import { test, expect } from '../../fixtures/api.fixture';
import { makeRegisterPayload } from '../../helpers/factories';

test.describe('Auth / register', () => {
  test('can register a valid user', async ({ auth }) => {
    const payload = makeRegisterPayload();

    const res = await auth.register(payload);

    expect([200, 201]).toContain(res.status());

    const body = await res.json();
    expect(body.email || body.user?.email).toBe(payload.email);
  });

  test('rejects invalid email', async ({ auth }) => {
    const payload = makeRegisterPayload({ email: 'not-an-email' });

    const res = await auth.register(payload);

    expect([400, 422]).toContain(res.status());
  });

  test('rejects weak password', async ({ auth }) => {
    const payload = makeRegisterPayload({
      password: '123',
      password_confirmation: '123',
    });

    const res = await auth.register(payload);

    expect([400, 422]).toContain(res.status());
  });
});
