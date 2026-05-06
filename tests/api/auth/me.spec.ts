import { test, expect } from '../../fixtures/api.fixture';
import { routes } from '../../config/routes';
import { expectSuccess, expectUnauthorized } from '../../helpers/assertions';

test.describe('Auth / me', () => {
  test('authenticated user can read profile', async ({ users, adminToken }) => {
    const res = await users.me(adminToken);
    const body = await expectSuccess<{
      user_id: string;
      company_id: string;
      branch_id?: string | null;
    }>(res, 200);

    expect(body.data?.user_id).toBeTruthy();
    expect(body.data?.company_id).toBeTruthy();
  });

  test('guest cannot read profile', async ({ request }) => {
    const res = await request.get(routes.me);

    await expectUnauthorized(res);
  });
});
