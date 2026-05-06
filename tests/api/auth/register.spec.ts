import { test, expect } from '../../fixtures/api.fixture';
import { makeRegisterPayload } from '../../helpers/factories';
import { expectError } from '../../helpers/assertions';

test.describe('Auth / register', () => {
  test('returns scaffold error for valid-looking registration while flow is not implemented', async ({ auth }) => {
    const payload = makeRegisterPayload();

    const res = await auth.register(payload);
    const body = await expectError(res, 400, 'BAD_REQUEST');

    expect(String(body.error?.message || '').toLowerCase()).toContain('register scaffold');
  });

  test('rejects invalid email', async ({ auth }) => {
    const payload = makeRegisterPayload({ email: 'not-an-email' });

    const res = await auth.register(payload);
    const body = await expectError(res, 400, 'BAD_REQUEST');

    expect(String(body.error?.message || '').toLowerCase()).toContain('invalid request');
  });

  test('rejects weak password', async ({ auth }) => {
    const payload = makeRegisterPayload({ password: '123' });

    const res = await auth.register(payload);
    const body = await expectError(res, 400, 'BAD_REQUEST');

    expect(String(body.error?.message || '').toLowerCase()).toContain('invalid request');
  });

  test('rejects missing company name before business logic runs', async ({ auth }) => {
    const payload = makeRegisterPayload({ company_name: '' });

    const res = await auth.register(payload);
    const body = await expectError(res, 400, 'BAD_REQUEST');

    expect(String(body.error?.message || '').toLowerCase()).toContain('invalid request');
  });
});
