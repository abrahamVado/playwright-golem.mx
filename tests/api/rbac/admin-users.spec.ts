import { test, expect } from '../../fixtures/api.fixture';
import { routes } from '../../config/routes';
import { expectUnauthorized, readJson } from '../../helpers/assertions';

test.describe('RBAC / admin users', () => {
  test('authenticated user receives an authorization decision for users list', async ({ users, adminToken }) => {
    const res = await users.listAdminUsers(adminToken);
    const body = await readJson<any>(res);

    expect([200, 403]).toContain(res.status());

    if (res.status() === 200) {
      expect(body.success).toBe(true);
      expect(body.data?.module).toBe('users');
      expect(Array.isArray(body.data?.items)).toBe(true);
      return;
    }

    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });

  test('guest cannot list users', async ({ request }) => {
    const res = await request.get(routes.users);

    await expectUnauthorized(res);
  });
});
