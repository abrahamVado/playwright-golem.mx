import { APIRequestContext } from '@playwright/test';
import { BaseClient } from './base.client';
import { routes } from '../config/routes';

export class UsersClient extends BaseClient {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async me(token: string) {
    return this.get(routes.me, token);
  }

  async listAdminUsers(token: string) {
    return this.get(routes.admin.users, token);
  }

  async listCompanyUsers(companyId: string, token: string) {
    return this.get(routes.companies.users(companyId), token);
  }

  async createTestUser(payload: Record<string, unknown>, token?: string) {
    return this.post(routes.test.users, payload, token);
  }
}
