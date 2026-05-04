import { APIRequestContext, APIResponse } from '@playwright/test';
import { routes } from '../config/routes';
import { LoginResponse } from '../types/api';

function extractAccessToken(body: any): string | undefined {
  return (
    body.access_token ??
    body.accessToken ??
    body.token ??
    body.data?.access_token ??
    body.data?.accessToken ??
    body.data?.token
  );
}

async function readJsonSafe(res: APIResponse): Promise<any> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export class AuthClient {
  constructor(private request: APIRequestContext) {}

  async login(email: string, password: string) {
    const payload = { email, password };

    console.log('\n--- REQUEST PAYLOAD ---');
    console.log(JSON.stringify(payload, null, 2));
    console.log('------------------------\n');

    return this.request.post(routes.auth.login, {
      data: payload,
    });
  }

  async loginAndGetToken(email: string, password: string): Promise<string> {
    const res = await this.login(email, password);
    const body = (await readJsonSafe(res)) as LoginResponse | null;

    if (!res.ok()) {
      throw new Error(
        `Login failed: ${res.status()} ${JSON.stringify(body, null, 2)}`
      );
    }

    const accessToken = extractAccessToken(body);

    if (!accessToken) {
      throw new Error(
        `Login response does not include access token: ${JSON.stringify(body, null, 2)}`
      );
    }

    return accessToken;
  }

  async register(payload: Record<string, unknown>) {
    return this.request.post(routes.auth.register, {
      data: payload,
    });
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