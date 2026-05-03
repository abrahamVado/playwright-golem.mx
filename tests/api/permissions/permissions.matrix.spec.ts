import { test, expect } from '../../fixtures/api.fixture';

const permissionCases = [
  {
    name: 'guest cannot access admin users',
    method: 'GET',
    path: '/admin/users',
    expected: [401, 403],
  },
  {
    name: 'guest cannot access current profile',
    method: 'GET',
    path: '/me',
    expected: [401, 403],
  },
];

test.describe('Permission matrix', () => {
  for (const item of permissionCases) {
    test(item.name, async ({ request }) => {
      const res = await request.fetch(item.path, {
        method: item.method,
      });

      expect(item.expected).toContain(res.status());
    });
  }
});
