import { test, expect } from '../../fixtures/api.fixture';
import { routes } from '../../config/routes';
import { expectUnauthorized, readJson } from '../../helpers/assertions';
import { makeUserPayload } from '../../helpers/factories';

test.describe('RBAC / user detail routes', () => {
  test('user detail route returns authorization decision for authenticated user', async ({ users, adminToken }) => {
    const res = await users.getUser('user-test-id', adminToken);
    const body = await readJson<any>(res);

    expect([200, 403]).toContain(res.status());

    if (res.status() === 200) {
      expect(body.success).toBe(true);
      expect(body.data?.id).toBe('user-test-id');
      expect(body.data?.module).toBe('users');
      return;
    }

    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });

  test('guest cannot read user detail', async ({ request }) => {
    const res = await request.get(routes.userById('user-test-id'));
    await expectUnauthorized(res);
  });

  test('create user route returns authz decision and preserves response contract', async ({ users, adminToken }) => {
    const payload = makeUserPayload({ name: 'Playwright User' });
    const res = await users.createUser(payload, adminToken);
    const body = await readJson<any>(res);

    expect([201, 403]).toContain(res.status());

    if (res.status() === 201) {
      expect(body.success).toBe(true);
      expect(body.data?.id).toBeTruthy();
      expect(body.data?.email).toBe(payload.email);
      expect(body.data?.name).toBe(payload.name);
      expect(body.data?.status).toBe(payload.status ?? 'active');
      expect(Array.isArray(body.data?.role_names)).toBe(true);
      return;
    }

    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });

  test('update user route returns authz decision and preserves response contract', async ({ users, adminToken }) => {
    const res = await users.updateUser('user-test-id', { name: 'Updated User' }, adminToken);
    const body = await readJson<any>(res);

    expect([200, 403]).toContain(res.status());

    if (res.status() === 200) {
      expect(body.success).toBe(true);
      expect(body.data?.id).toBe('user-test-id');
      expect(body.data?.module).toBe('users');
      expect(body.data?.status).toBe('updated');
      return;
    }

    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });

  test('delete user route returns authz decision and preserves response contract', async ({ users, adminToken }) => {
    const res = await users.deleteUser('user-test-id', adminToken);
    const body = await readJson<any>(res);

    expect([200, 403]).toContain(res.status());

    if (res.status() === 200) {
      expect(body.success).toBe(true);
      expect(body.data?.id).toBe('user-test-id');
      expect(body.data?.module).toBe('users');
      expect(body.data?.status).toBe('deleted');
      return;
    }

    expect(body.success).toBe(false);
    expect(body.error?.code).toBe('FORBIDDEN');
  });
});
