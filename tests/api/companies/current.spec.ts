import { test, expect } from '../../fixtures/api.fixture';
import { routes } from '../../config/routes';
import { expectSuccess, expectUnauthorized, readJson } from '../../helpers/assertions';

test.describe('Companies / current', () => {
  test('authenticated user can read current tenant', async ({ users, adminToken }) => {
    const res = await users.currentCompany(adminToken);
    const body = await expectSuccess<{ id: string; name: string; slug: string; status: string }>(res, 200);

    expect(body.data?.id).toBeTruthy();
    expect(body.data?.name).toBeTruthy();
    expect(body.data?.slug).toBeTruthy();
    expect(body.data?.status).toBeTruthy();
  });

  test('authenticated user can update current tenant name', async ({ users, adminToken }) => {
    const currentRes = await users.currentCompany(adminToken);
    const currentBody = await expectSuccess<{ name: string }>(currentRes, 200);
    const originalName = currentBody.data?.name ?? 'Company';
    const nextName = `${originalName} API`;

    const updateRes = await users.updateCurrentCompany({ name: nextName }, adminToken);
    const updateBody = await expectSuccess<{ name: string }>(updateRes, 200);

    expect(updateBody.data?.name).toBe(nextName);
  });

  test('guest cannot read current tenant', async ({ request }) => {
    const res = await request.get(routes.companies.current);

    await expectUnauthorized(res);
  });

  test('rejects empty company name', async ({ users, adminToken }) => {
    const res = await users.updateCurrentCompany({ name: '   ' }, adminToken);
    const body = await readJson<any>(res);

    expect(res.status()).toBe(400);
    expect(body.success).toBe(false);
  });
});
