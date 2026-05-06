import { APIRequestContext } from '@playwright/test';

export class TestAdminClient {
  constructor(private request: APIRequestContext) {}

  async reset() {
    throw new Error('Test admin endpoints are not implemented in the current Go backend');
  }

  async seed(payload?: Record<string, unknown>) {
    void payload;
    throw new Error('Test admin endpoints are not implemented in the current Go backend');
  }

  async createTenant(payload: Record<string, unknown>) {
    void payload;
    throw new Error('Test admin endpoints are not implemented in the current Go backend');
  }

  async createUser(payload: Record<string, unknown>) {
    void payload;
    throw new Error('Test admin endpoints are not implemented in the current Go backend');
  }
}
