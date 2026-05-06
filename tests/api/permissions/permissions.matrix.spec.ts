import { test, expect } from '../../fixtures/api.fixture';

import { routes } from '../../config/routes';
import { readJson } from '../../helpers/assertions';

const permissionCases = [
  {
    name: 'guest cannot access users list',
    method: 'GET',
    path: routes.users,
    expected: [401, 403],
  },
  {
    name: 'guest cannot access current profile',
    method: 'GET',
    path: routes.me,
    expected: [401, 403],
  },
];

test.describe('Permission matrix', () => {
  for (const item of permissionCases) {
    test(item.name, async ({ request }) => {
      const res = await request.fetch(item.path, {
        method: item.method,
      });
      const body = await readJson<any>(res);

      expect(item.expected).toContain(res.status());
      expect(body.success).toBe(false);
      expect(body.error?.code).toMatch(/UNAUTHENTICATED|FORBIDDEN/);
    });
  }
});
