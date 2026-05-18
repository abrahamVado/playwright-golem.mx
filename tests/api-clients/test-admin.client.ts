import { APIRequestContext, APIResponse } from '@playwright/test';

export class TestAdminClient {
  constructor(private request: APIRequestContext) {}

  private async safePost(path: string, payload?: Record<string, unknown>): Promise<APIResponse | null> {
    try {
      const res = await this.request.post(path, { data: payload, failOnStatusCode: false });
      if (res.status() === 404) return null;
      return res;
    } catch {
      return null;
    }
  }

  async reset(): Promise<APIResponse | null> {
    return this.safePost('/test/reset');
  }

  async seed(payload?: Record<string, unknown>): Promise<APIResponse | null> {
    return this.safePost('/test/seed', payload);
  }

  async createTenant(payload: Record<string, unknown>): Promise<APIResponse | null> {
    return this.safePost('/test/tenants', payload);
  }

  async createUser(payload: Record<string, unknown>): Promise<APIResponse | null> {
    return this.safePost('/test/users', payload);
  }
}
