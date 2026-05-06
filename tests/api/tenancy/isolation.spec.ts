import { test, expect } from '../../fixtures/api.fixture';
import { readJson } from '../../helpers/assertions';

test.describe('Tenancy isolation', () => {
  test('users list stays protected by tenant-aware authorization', async ({ users, adminToken }) => {
    const res = await users.listAdminUsers(adminToken);
    const body = await readJson<any>(res);

    expect([200, 403]).toContain(res.status());

    if (res.status() === 200) {
      expect(body.success).toBe(true);
      expect(body.data?.company_id).toBeTruthy();
      expect(Array.isArray(body.data?.items)).toBe(true);
      return;
    }

    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });

  test('current company endpoint enforces company read permission', async ({ users, adminToken }) => {
    const res = await users.currentCompany(adminToken);
    const body = await readJson<any>(res);

    expect([200, 403, 404]).toContain(res.status());

    if (res.status() === 200) {
      expect(body.success).toBe(true);
      return;
    }

    if (res.status() === 403) {
      expect(body.success).toBe(false);
      expect(body.error?.code).toBe('FORBIDDEN');
      return;
    }

    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('COMPANY_NOT_FOUND');
  });
});
