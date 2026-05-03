import { test, expect } from '../../fixtures/api.fixture';

test.describe('RBAC / admin users', () => {
  test('admin can list users', async ({ users, adminToken }) => {
    const res = await users.listAdminUsers(adminToken);

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(Array.isArray(body.data || body.users || body)).toBeTruthy();
  });

  test('guest cannot list users', async ({ request }) => {
    const res = await request.get('/admin/users');

    expect([401, 403]).toContain(res.status());
  });
});
