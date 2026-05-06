import { test, expect } from '../../fixtures/api.fixture';
import { routes } from '../../config/routes';
import { expectUnauthorized, readJson } from '../../helpers/assertions';

test.describe('RBAC / roles', () => {
  test('authenticated user receives an authorization decision for roles list', async ({ users, adminToken }) => {
    const res = await users.listRoles(adminToken);
    const body = await readJson<any>(res);

    expect([200, 403]).toContain(res.status());

    if (res.status() === 200) {
      expect(body.success).toBe(true);
      expect(body.data?.module).toBe('roles');
      expect(Array.isArray(body.data?.items)).toBe(true);
      return;
    }

    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });

  test('guest cannot list roles', async ({ request }) => {
    const res = await request.get(routes.roles);
    await expectUnauthorized(res);
  });

  test('role detail route returns authorization decision for authenticated user', async ({ users, adminToken }) => {
    const res = await users.getRole('role-test-id', adminToken);
    const body = await readJson<any>(res);

    expect([200, 403]).toContain(res.status());

    if (res.status() === 200) {
      expect(body.success).toBe(true);
      expect(body.data?.id).toBe('role-test-id');
      expect(body.data?.module).toBe('roles');
      return;
    }

    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });
});
