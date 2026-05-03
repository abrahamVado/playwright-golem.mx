import { APIRequestContext } from '@playwright/test';
import { routes } from '../config/routes';
import { LoginResponse } from '../types/api';

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async login(email: string, password: string) {
    return this.request.post(routes.auth.login, {
      data: { email, password },
    });
  }

  async loginAndGetToken(email: string, password: string): Promise<string> {
    const res = await this.login(email, password);

    if (!res.ok()) {
      throw new Error(`Login failed: ${res.status()} ${await res.text()}`);
    }

    const body = (await res.json()) as LoginResponse;

    if (!body.access_token) {
      throw new Error(`Login response does not include access_token: ${JSON.stringify(body)}`);
    }

    return body.access_token;
  }

  async register(payload: Record<string, unknown>) {
    return this.request.post(routes.auth.register, { data: payload });
  }

  async refresh(refreshToken: string) {
    return this.request.post(routes.auth.refresh, {
      data: { refresh_token: refreshToken },
    });
  }

  async logout(accessToken: string) {
    return this.request.post(routes.auth.logout, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
