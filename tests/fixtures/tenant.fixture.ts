import { test as base } from './api.fixture';
import { AuthClient } from '../api-clients/auth.client';
import { env } from '../config/env';

type TenantUser = {
  email: string;
  password: string;
  token: string;
  companyId: string;
  role: string;
};

type TenantFixtures = {
  tenantAAdmin: TenantUser;
  tenantBAdmin: TenantUser;
};

export const test = base.extend<TenantFixtures>({
  tenantAAdmin: async ({ request }, use) => {
    const auth = new AuthClient(request);

    // Prefer seeding this user in your Go backend test seed.
    const user = {
      email: 'tenant-a.admin@example.com',
      password: 'Password123!Strong',
      companyId: env.tenantAId,
      role: 'admin',
      token: '',
    };

    user.token = await auth.loginAndGetToken(user.email, user.password);
    await use(user);
  },

  tenantBAdmin: async ({ request }, use) => {
    const auth = new AuthClient(request);

    const user = {
      email: 'tenant-b.admin@example.com',
      password: 'Password123!Strong',
      companyId: env.tenantBId,
      role: 'admin',
      token: '',
    };

    user.token = await auth.loginAndGetToken(user.email, user.password);
    await use(user);
  },
});

export { expect } from '@playwright/test';
