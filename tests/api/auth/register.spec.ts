import { test, expect } from '@playwright/test';
import { ApiFixture } from '../../fixtures/api.fixture';
import { makeRegisterPayload } from '../../helpers/factories';
import { expectSuccess } from '../../helpers/assertions';
import { assertError } from '../../helpers/assertions';

const companyPrefix = process.env.E2E_REGISTER_COMPANY_PREFIX || 'Paladin Live Test Company';

test.describe('Auth / register', () => {
  test('registers a new company owner with valid payload', async ({ auth }) => {
    const payload = makeRegisterPayload({
      company_name: `${companyPrefix} ${Date.now()}`,
    });

    const res = await auth.register(payload);
    const body = await expectSuccess<{ message: string }>(res, 201);

    expect(body.data?.message).toBe('registered');
  });

  test.each([
    ['not-an-email', 'BAD_REQUEST'],
    ['missing@domain.com', 'BAD_REQUEST'],
    ['invalid@domain', 'BAD_REQUEST'],
  ])('rejects invalid email: %s', async ({ auth }: { auth: ApiFixture }, [emailValue, errorCode]: [string, string]) => {
    const payload = makeRegisterPayload({ email: emailValue });

    const res = await auth.register(payload);

    await assertError(res, 400, errorCode);
  });

  test('rejects weak password', async ({ auth }) => {
    const payload = makeRegisterPayload({ password: '123' });

    const res = await auth.register(payload);

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('BAD_REQUEST');
  });

  test('rejects missing company name before business logic runs', async ({ auth }) => {
    const payload = makeRegisterPayload({ company_name: '' });

    const res = await auth.register(payload);

    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('BAD_REQUEST');
  });
});
