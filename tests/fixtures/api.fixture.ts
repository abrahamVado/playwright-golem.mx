import { test as base } from '@playwright/test';
import { AuthClient } from '../api-clients/auth.client';
import { UsersClient } from '../api-clients/users.client';
import { TestAdminClient } from '../api-clients/test-admin.client';
import { env } from '../config/env';

type ApiFixtures = {
  auth: AuthClient;
  users: UsersClient;
  testAdmin: TestAdminClient;
  adminToken: string;
};

export const test = base.extend<ApiFixtures>({
  auth: async ({ request }, use) => {
    await use(new AuthClient(request));
  },

  users: async ({ request }, use) => {
    await use(new UsersClient(request));
  },

  testAdmin: async ({ request }, use) => {
    await use(new TestAdminClient(request));
  },

  adminToken: async ({ request }, use) => {
    const auth = new AuthClient(request);
    const token = await auth.loginAndGetToken(env.adminEmail, env.adminPassword);
    await use(token);
  },
});

export { expect } from '@playwright/test';
