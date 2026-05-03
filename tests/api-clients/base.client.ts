import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseClient {
  constructor(protected request: APIRequestContext) {}

  protected authHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  async get(path: string, token?: string): Promise<APIResponse> {
    return this.request.get(path, {
      headers: token ? this.authHeaders(token) : undefined,
    });
  }

  async post(path: string, data?: unknown, token?: string): Promise<APIResponse> {
    return this.request.post(path, {
      data,
      headers: token ? this.authHeaders(token) : undefined,
    });
  }

  async put(path: string, data?: unknown, token?: string): Promise<APIResponse> {
    return this.request.put(path, {
      data,
      headers: token ? this.authHeaders(token) : undefined,
    });
  }

  async delete(path: string, token?: string): Promise<APIResponse> {
    return this.request.delete(path, {
      headers: token ? this.authHeaders(token) : undefined,
    });
  }
}
