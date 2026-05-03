import { test, expect } from '../../fixtures/tenant.fixture';
import { routes } from '../../config/routes';

test.describe('Tenancy isolation', () => {
  test('tenant A admin can list users from tenant A', async ({ request, tenantAAdmin }) => {
    const res = await request.get(routes.companies.users(tenantAAdmin.companyId), {
      headers: {
        Authorization: `Bearer ${tenantAAdmin.token}`,
      },
    });

    expect(res.status()).toBe(200);
  });

  test('tenant A admin cannot list users from tenant B', async ({ request, tenantAAdmin, tenantBAdmin }) => {
    const res = await request.get(routes.companies.users(tenantBAdmin.companyId), {
      headers: {
        Authorization: `Bearer ${tenantAAdmin.token}`,
      },
    });

    // For SaaS security, 404 is often safer than 403 because it does not reveal tenant existence.
    expect([403, 404]).toContain(res.status());
  });
});
