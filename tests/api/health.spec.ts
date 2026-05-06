import { test, expect } from '../fixtures/api.fixture';
import { routes } from '../config/routes';
import { expectSuccess } from '../helpers/assertions';

test.describe('Health', () => {
  test('GET /health returns healthy response', async ({ request }) => {
    const res = await request.get(routes.health);
    const body = await expectSuccess<{ status: string }>(res, 200);

    expect(body.data?.status).toBe('ok');
  });
});
