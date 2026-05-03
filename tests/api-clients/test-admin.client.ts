import { APIRequestContext } from '@playwright/test';
import { routes } from '../config/routes';

export class TestAdminClient {
  constructor(private request: APIRequestContext) {}

  async reset() {
    return this.request.post(routes.test.reset);
  }

  async seed(payload?: Record<string, unknown>) {
    return this.request.post(routes.test.seed, {
      data: payload || {},
    });
  }

  async createTenant(payload: Record<string, unknown>) {
    return this.request.post(routes.test.tenants, {
      data: payload,
    });
  }

  async createUser(payload: Record<string, unknown>) {
    return this.request.post(routes.test.users, {
      data: payload,
    });
  }
}
